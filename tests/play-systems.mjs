import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import {Chess} from 'chess.js';
async function load(path){const code=ts.transpileModule(await readFile(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))}
const {solveEquation}=await load('lib/play/math.ts');
assert.equal(solveEquation('2x + 3 = 11').answer,'x = 4');
assert.equal(solveEquation('x^2 - 5x + 6 = 0').answer,'x = 3 or 2');
assert.equal(solveEquation('x + 1 = x + 2').answer,'No solution.');
assert.equal(solveEquation('2x = 2x').answer,'Every real x works.');
assert.equal(solveEquation('x^2 + 1 = 0').answer,'No real roots.');
assert.equal(solveEquation('alert(1)'),null);
const {chooseBotMove}=await load('lib/play/chess.ts');
const g=new Chess();g.move('e4');const fen=g.fen(),move=chooseBotMove(g,2);assert(move);assert.equal(g.fen(),fen);assert.doesNotThrow(()=>g.move(move));assert.equal(g.turn(),'w');
const mate=new Chess('8/8/8/8/8/5kq1/8/7K b - - 0 1');const best=chooseBotMove(mate,2);assert(best);mate.move(best);assert(mate.isCheckmate());
const castle=new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');assert(castle.moves().includes('O-O'));assert(castle.moves().includes('O-O-O'));
const {launchShot,stepShot}=await load('lib/play/basketball.ts');
function shot(power,aim){const s=launchShot(power,aim);for(let i=0;i<240&&!s.finished;i++)stepShot(s,1/60);return s.scored}
assert(shot(65,0));assert(!shot(65,25));assert(!shot(30,0));
console.log('PASS: equation solving, invalid inputs, legal bot response, mate selection, castling, scoring and missed shots.');
