'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {root}=require('./hilfe.cjs');
function worker() {
  const handlers={}, deleted=[], writes=[], stored=new Map(), timers=[];
  const scope='https://example.test/HackingSchule/';
  const prefix='systemabsturz:'+scope+':';
  const cache={match:async key=>stored.get(key),put:async(key,value)=>{writes.push(key);stored.set(key,value);}};
  const c={URL, Response, console, self:{registration:{scope},location:{origin:'https://example.test'},addEventListener:(k,f)=>handlers[k]=f,clients:{claim:async()=>{}}},
    caches:{open:async()=>cache,keys:async()=>[prefix+'v29',prefix+'v30','other-app','systemabsturz:https://example.test/Other/:v29'],delete:async key=>{deleted.push(key);}},
    fetch:async()=>{throw new Error('offline');},setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout:()=>{}};
  vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),c);
  return {c,handlers,deleted,writes,stored,timers,scope,prefix};
}
function event(w,url,mode='navigate') {
  const life=[];let response;
  w.handlers.fetch({request:{url,method:'GET',mode},waitUntil:p=>life.push(p),respondWith:p=>response=p});
  return {life,get response(){return response;}};
}
function good() {return {ok:true,status:200,type:'basic',clone(){return this;}};}
test('Cache-Aktivierung löscht ausschliesslich ältere Versionen dieses Projekts', async()=>{
  const w=worker();let done;w.handlers.activate({waitUntil:p=>done=p});await done;
  assert.deepEqual(w.deleted,[w.prefix+'v29']);
});
test('Offline-Navigation mit Spielparametern verwendet die gespeicherte Seite',async()=>{
  const w=worker(), cached={body:'terminal'};w.stored.set(w.scope+'terminal.html',cached);
  const e=event(w,w.scope+'terminal.html?stufe=schwer&ende=11:00');
  assert.equal(await e.response,cached);await Promise.all(e.life);
});
test('HTTP-Fehler beim Laden einer Seite fällt auf Cache zurück',async()=>{
  const w=worker(),cached={body:'start'};w.stored.set(w.scope+'index.html',cached);w.c.fetch=async()=>({ok:false,status:503});
  assert.equal(await event(w,w.scope+'index.html').response,cached);
});
test('Hängendes Netz liefert gespeicherte Navigation nach Timeout',async()=>{
  const w=worker(),cached={body:'start'};w.stored.set(w.scope+'index.html',cached);w.c.fetch=()=>new Promise(()=>{});
  const e=event(w,w.scope+'index.html');w.timers.forEach(fn=>fn());assert.equal(await e.response,cached);
});
test('Aktualisierung speichert ohne Query-Duplikate und bleibt bis cache.put aktiv',async()=>{
  const w=worker();w.c.fetch=async()=>good();const e=event(w,w.scope+'js/app.js?v=123','cors');
  await e.response;await Promise.all(e.life);assert.deepEqual(w.writes,[w.scope+'js/app.js']);assert.equal(e.life.length,1);
});
test('Service Worker greift nicht auf Ressourcen anderer Projekte zu',()=>{
  const w=worker();assert.equal(event(w,'https://example.test/Other/index.html').response,undefined);
});
