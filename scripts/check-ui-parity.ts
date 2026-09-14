import assert from 'node:assert/strict'
import {ui} from '../src/content/ui.ts'
import {previewCopy} from '../src/content/previews.ts'
function shape(value:unknown):unknown {if(Array.isArray(value))return value.map(shape);if(value!==null&&typeof value==='object')return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,shape(v)]));return typeof value}
assert.deepEqual(shape(ui('en')),shape(ui('ar')),'UI locale keys and list lengths must match')
assert.deepEqual(shape(previewCopy('en')),shape(previewCopy('ar')),'Dashboard locale keys and list lengths must match')
console.log('UI and dashboard keys match in both locales.')
