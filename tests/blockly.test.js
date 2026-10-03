'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {app,root}=require('./hilfe.cjs');
function block(type,inputs={},next=null) {
  const b={type:'antiv_'+type,id:type,isEnabled:()=>true,getInputTargetBlock:k=>inputs[k]||null,getNextBlock:()=>next};
  b.getDescendants=()=>[b,...Object.values(inputs).flatMap(x=>x.getDescendants()),...(next?next.getDescendants():[])];return b;
}
function setup(st='mittel',program) {
  const c=app();c.st=st;c.run('Maze.setzeStufe(st)');
  for(const m of ['zuruecksetzen','setzeRoboter','zahlEingesammelt','animiereMauer','animiereInfiziert','animiereZiel']) c.run('Maze.'+m+'=function(){}');
  let source=fs.readFileSync(path.join(root,'js/blocks.js'),'utf8');
  // Nur im Test werden die internen Start-/Schritt-Funktionen zugänglich.
  source=source.replace('  return { init: init, stoppe: stoppe,', `  globalThis.harness = {
    setup: function(w,r) { ws=w; rueckrufe=r; zustand=Maze.neu(); },
    bereit: bereiteVor, schritt: einSchritt, reset: zuruecksetzen,
    status: function(){return modus;}, zustand: function(){return zustand;}
  };
  return { init: init, stoppe: stoppe,`);
  vm.runInContext(source,c);
  const start=block('start',{},program),all=start.getDescendants();
  let locked=false;const results=[];
  const callbacks={gesperrt:()=>locked,ton:()=>{},zielErreicht:async(s,i)=>{results.push({s,i});return {ok:true,text:'ok'};}};
  c.harness.setup({getBlocksByType:()=>[start],getAllBlocks:()=>all,highlightBlock(){}},callbacks);
  return {c,results,lock:()=>locked=true};
}
function solution(st) {
  const vor=()=>block('vor'), rechts=next=>block('rechts',{},next), links=()=>block('links');
  const safe=side=> st==='schwer' ? block('und',{A:block(side+'_frei'),B:block('nicht',{A:block(side+'_infiziert')})}) : block(side+'_frei');
  const body=st==='leicht' ? block('falls_sonst',{BEDINGUNG:block('vorne_frei'),DANN:vor(),SONST:rechts()}) :
    block('falls_sonst',{BEDINGUNG:safe('rechts'),DANN:rechts(vor()),SONST:block('falls_sonst',{BEDINGUNG:safe('vorne'),DANN:vor(),SONST:links()})});
  return block('wiederhole',{TUE:body});
}
function finish(w) {
  assert.equal(w.c.harness.bereit(),true);
  for(let n=0;n<350;n++) if(w.c.harness.schritt()<0)return;
  assert.fail('Interpreter beendet den Durchlauf nicht');
}
for(const st of ['leicht','mittel','schwer']) test('Interpreter führt Musterprogramm '+st+' innerhalb des Limits aus',async()=>{
  const w=setup(st,solution(st));finish(w);
  for(const t of [...w.c.timers.values()]) await t.fn();
  assert.equal(w.results.length,1);assert.equal(Array.from(w.results[0].s).join(','),'3,8,5');
  assert.equal(w.results[0].i.bloecke,{leicht:5,mittel:9,schwer:15}[st]);
});
test('Reset verwirft bereits geplante Zielauswertung',async()=>{
  const w=setup('leicht',solution('leicht'));finish(w);const old=[...w.c.timers.values()];w.c.harness.reset();
  for(const t of old) await t.fn();assert.equal(w.results.length,0);
});
test('Zeitablauf/Stop verwirft bereits geplante Zielauswertung',async()=>{
  const w=setup('leicht',solution('leicht'));finish(w);const old=[...w.c.timers.values()];w.lock();w.c.run('Algorithmen.stoppe()');
  for(const t of old) await t.fn();assert.equal(w.results.length,0);
});
test('Endlosschleife wird begrenzt',()=>{
  const w=setup('mittel',block('wiederhole',{TUE:block('links')}));finish(w);
  assert.equal(w.c.harness.status(),'fertig');assert.match(w.c.document.getElementById('algo-meldung').textContent,/Endlosschleife/);
});
test('Programm ohne Schleife darf nicht starten',()=>{
  assert.equal(setup('mittel',block('vor')).c.harness.bereit(),false);
});
