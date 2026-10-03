'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const root = process.env.SYSTEMABSTURZ_TEST_ROOT || path.join(__dirname, '..');
// Kleine DOM-Attrappe für Logiktests. Kein Ersatz für Browser-/Layouttests.
class Element {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.children = []; this.events = {};
    this.nodes = new Map(); this.dataset = {}; this.attributes = {};
    this.hidden = false; this.value = ''; this.checked = false; this.style = {};
    const classes = new Set();
    this.classList = { add: (...xs) => xs.forEach(x => classes.add(x)), remove: (...xs) => xs.forEach(x => classes.delete(x)),
      contains: x => classes.has(x), toggle: (x, on) => { const yes = on === undefined ? !classes.has(x) : on; yes ? classes.add(x) : classes.delete(x); return yes; } };
  }
  set textContent(v) { this.text = String(v); this.children = []; }
  get textContent() { return (this.text || '') + this.children.map(x => x.textContent || '').join(''); }
  set innerHTML(v) { this.html = v; this.children = []; }
  get innerHTML() { return this.html || ''; }
  get firstChild() { return this.children[0] || null; }
  appendChild(e) { this.children.push(e); e.parentNode = this; return e; }
  insertBefore(e) { this.children.unshift(e); e.parentNode = this; }
  removeChild(e) { this.children = this.children.filter(x => x !== e); }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k]; }
  addEventListener(k, f) { (this.events[k] ||= []).push(f); }
  removeEventListener(k, f) { this.events[k] = (this.events[k] || []).filter(x => x !== f); }
  async fire(k, e = {}) { for (const f of this.events[k] || []) await f.call(this, e); }
  click() { return this.fire('click', { preventDefault() {} }); }
  focus() {} scrollIntoView() {} remove() { this.parentNode?.removeChild(this); }
  querySelector(s) {
    if (/^\.[a-z-]+$/.test(s)) {
      const found=this.children.find(x=>(x.className || '').split(' ').includes(s.slice(1)));
      if (found) return found;
    }
    if (s === '.vorlesen-knopf') return this.children.find(x => /vorlesen-knopf/.test(x.className)) || null;
    if (!this.nodes.has(s)) this.nodes.set(s, new Element());
    return this.nodes.get(s);
  }
  querySelectorAll() { return []; }
}
function app(extra = {}) {
  const document = new Element('document'); document.body = new Element('body'); document.documentElement = new Element('html');
  document.head = new Element('head'); document.createElement = tag => new Element(tag);
  document.createElementNS = (_, tag) => new Element(tag); document.createTextNode = text => ({ textContent: text });
  document.getElementById = id => document.querySelector('#' + id);
  const timers = new Map(); let timerId = 0;
  const storage = new Map();
  const c = { console, TextEncoder, TextDecoder, URL, URLSearchParams, AbortController, crypto: webcrypto,
    document, navigator: {}, location: { href: 'https://example.test/HackingSchule/index.html', search: '', protocol: 'https:' },
    history: { replaceState() {} }, scrollTo() {}, addEventListener() {},
    localStorage: { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) },
    fetch: async () => { throw new Error('offline in test'); },
    setTimeout: (fn, ms) => { timers.set(++timerId, { fn, ms }); return timerId; }, clearTimeout: id => timers.delete(id),
    setInterval: (fn, ms) => { timers.set(++timerId, { fn, ms, interval: true }); return timerId; }, clearInterval: id => timers.delete(id),
    ...extra };
  c.window = c; vm.createContext(c);
  for (const file of ['js/maze.js', 'js/netzwerke.js', 'js/app.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
  c.run = source => vm.runInContext(source,c); c.timers = timers; c.storage = storage;
  c.el = selector => document.querySelector(selector);
  return c;
}
module.exports = { app, Element, root, flush: () => new Promise(resolve => setImmediate(resolve)) };
