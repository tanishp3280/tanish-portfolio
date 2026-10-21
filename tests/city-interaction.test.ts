import test from 'node:test';
import assert from 'node:assert/strict';
import {Group, Object3D} from 'three';
import {visibleInteraction} from '../lib/city/picking.ts';
import {cityDirector} from '../lib/city/director.ts';

test('hidden scenes cannot steal clicks from visible controls', () => {
  const hidden = new Group(), child = new Object3D(), visible = new Object3D();
  hidden.visible = false; hidden.add(child); child.userData.sequence = 'apartment';
  visible.userData.project = 0;
  assert.equal(visibleInteraction([{object: child}, {object: visible}]), visible);
});

test('a child mesh inherits its parent interaction', () => {
  const parent = new Group(), child = new Object3D(); parent.add(child);
  parent.userData.chapter = 'research';
  assert.equal(visibleInteraction([{object: child}]), parent);
});

test('playback pauses, scrubs backward, resumes, and stops consistently', () => {
  cityDirector.play('origami');
  assert.equal(cityDirector.tick(-1, false).progress, 0);
  for (let i = 0; i < 30; i++) cityDirector.tick(.05, false);
  cityDirector.pause();
  const paused = cityDirector.tick(1, false).progress;
  assert.equal(cityDirector.tick(1, false).progress, paused);
  cityDirector.seek(.02); cityDirector.pause();
  assert(cityDirector.tick(.05, false).progress > .02);
  cityDirector.stop();
  assert.equal(cityDirector.get().sequence, null);
  assert.equal(cityDirector.get().progress, 0);
});

test('reduced motion settles the sequence and UI on the same frame', () => {
  cityDirector.play('awakening');
  const frame = cityDirector.tick(.016, true);
  assert.equal(frame.progress, 1);
  assert.equal(cityDirector.get().progress, 1);
  assert.equal(cityDirector.get().playing, false);
  cityDirector.seek(.4);
  assert.equal(cityDirector.tick(.016, true).progress, .4);
  cityDirector.stop();
});

test('cinematic wheel movement is device-normalized and bounded', async () => {
  const {scrubDelta} = await import('../lib/city/scrub.ts');
  assert.equal(scrubDelta(16), scrubDelta(1, 1));
  assert.equal(scrubDelta(100000), .025);
  assert.equal(scrubDelta(-100000), -.025);
  assert.equal(scrubDelta(NaN), 0);
  assert(scrubDelta(10) > 0 && scrubDelta(10) < .025);
});
