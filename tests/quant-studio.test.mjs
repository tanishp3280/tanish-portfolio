import assert from 'node:assert/strict';import {option,paths,backtest} from '../lib/quant.ts';
assert.ok(Math.abs(option(100,100,1,.05,.2).price-10.45058)<.0001);
const g=option(100,100,1,.05,.2),h=.001;
assert.ok(Math.abs((option(100+h,100,1,.05,.2).price-option(100-h,100,1,.05,.2).price)/(2*h)-g.delta)<.0001);
assert.deepEqual(paths(.07,.2,5),paths(.07,.2,5));assert.ok(paths(.07,.2,5).flat().every(v=>Number.isFinite(v)&&v>0));
const p=Array.from({length:120},(_,i)=>100+i),a=backtest(p,5,20,0),b=backtest(p,5,20,.01);assert.ok(a.curve.at(-1)>b.curve.at(-1));assert.equal(a.curve[19],100);assert.equal(a.trades,1);assert.equal(backtest(Array(120).fill(100),5,20,0).trades,0);console.log('Quant studio invariants passed: pricing, delta, deterministic positive paths, transaction costs, lagged entry and flat-price behavior.');
