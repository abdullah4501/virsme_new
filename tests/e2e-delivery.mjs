import {createServer} from 'node:http'
import {spawn} from 'node:child_process'
import {chromium} from '@playwright/test'
import assert from 'node:assert/strict'
import {setTimeout as delay} from 'node:timers/promises'
const received=[]
const receiver=createServer(async(req,res)=>{let body='';for await(const chunk of req)body+=chunk;received.push(JSON.parse(body));res.writeHead(200);res.end('ok')})
await new Promise(resolve=>receiver.listen(0,'127.0.0.1',resolve))
const child=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:'4181',NODE_ENV:'development',DEMO_DELIVERY_URL:`http://127.0.0.1:${receiver.address().port}/receive`,SITE_ORIGIN:'http://127.0.0.1:4181'},stdio:['ignore','pipe','pipe'],windowsHide:true})
await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',code=>reject(new Error(`Preview exited ${code}`)))})
const browser=await chromium.launch({channel:'chromium',headless:true})
try{for(const locale of ['en','ar']){const page=await browser.newPage();await page.goto(`http://127.0.0.1:4181/${locale}/book-demo`);for(const [name,value]of Object.entries({name:'QA Example',company:'Local Test Fixture',email:'qa@example.test',country:'Test',workflow:'Employee onboarding'}))await page.locator(`[name="${name}"]`).fill(value);await page.locator('[name="employees"]').selectOption('11-50');await delay(2100);await page.locator('.form-submit').click();await page.locator('.form-success').waitFor();assert.equal(await page.locator('.form-success').evaluate(e=>e===document.activeElement),true);assert.equal(received.at(-1).language,locale);await page.close();console.log(`${locale}: browser → real local API → local webhook → focused success PASS`)}}finally{await browser.close();child.kill();receiver.close()}
