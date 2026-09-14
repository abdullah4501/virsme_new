import {chromium} from '@playwright/test'
const browser=await chromium.launch({channel:'chromium',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
try{await page.goto('https://virsme.com/',{waitUntil:'networkidle',timeout:45000});await page.screenshot({path:'node_modules/.cache/virsme/reference-viewport.png'});await page.screenshot({path:'node_modules/.cache/virsme/reference-full.png',fullPage:true});console.log(await page.locator('h1,h2').allTextContents());console.log(await page.locator('img').evaluateAll(nodes=>nodes.map(n=>({alt:n.alt,url:n.src})).slice(0,20)))}finally{await browser.close()}
