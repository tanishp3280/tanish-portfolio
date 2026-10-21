import test from 'node:test';
import assert from 'node:assert/strict';
import {CityQuality} from '../lib/city/quality.ts';
import {Chess} from 'chess.js';
import {PaperFlock} from '../lib/city/flock.ts';
import {WaterField} from '../lib/city/water.ts';

test('quality ignores a single slow frame and tab-resume gaps',()=>{
  const quality=new CityQuality();quality.sample(.1);quality.sample(10);
  assert.equal(quality.tier,2);
});
test('sustained slow rendering lowers detail, recovery requires sustained headroom',()=>{
  const quality=new CityQuality();
  for(let i=0;i<130;i++)quality.sample(1/30);
  assert.equal(quality.tier,1);
  for(let i=0;i<120;i++)quality.sample(1/60);
  assert.equal(quality.tier,1);
  for(let i=0;i<700;i++)quality.sample(1/60);
  assert.equal(quality.tier,2);
});
test('mobile quality never exceeds its ceiling',()=>{
  const quality=new CityQuality(1);
  for(let i=0;i<2000;i++)quality.sample(1/60);
  assert.equal(quality.tier,1);
});
test('teaching fork has both advertised legal captures',()=>{
  const game=new Chess('4k3/8/3q1r2/8/4N3/8/8/4K3 w - - 0 1');
  const captures=game.moves({square:'e4',verbose:true}).filter(m=>m.captured).map(m=>m.to);
  assert(captures.includes('d6'));assert(captures.includes('f6'));
});
test('open-file teaching capture gives check',()=>{
  const game=new Chess('4k3/8/8/8/8/8/4r3/4R1K1 w - - 0 1');
  game.move({from:'e1',to:'e2'});assert(game.isCheck());
});
test('flock seeking is deterministic forward and backward',()=>{
  const flock=new PaperFlock(40);
  const before=flock.at(1).map(b=>({...b}));flock.at(3);
  assert.deepEqual(flock.at(1),before);
  assert.deepEqual(flock.at(2),new PaperFlock(40).at(2));
  assert(flock.at(2).every(b=>Object.values(b).every(Number.isFinite)));
});
test('pond waves remain bounded, propagate, and settle',()=>{
  const pond=new WaterField();pond.disturb(0,0);pond.disturb(.3,.2);
  for(let i=0;i<60;i++)pond.update(1/60);
  assert(pond.values.some(v=>Math.abs(v)>.0001));
  assert(pond.values.every(v=>Number.isFinite(v)&&Math.abs(v)<1));
  for(let i=0;i<1800;i++)pond.update(1/60);
  assert.equal(pond.active,false);
});
