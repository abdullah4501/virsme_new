import {chromium} from '@playwright/test'
import {mkdir} from 'node:fs/promises'
await mkdir('docs/qa-views',{recursive:true})
const browser=await chromium.launch({channel:'chromium',headless:true})
const page=await browser.newPage({reducedMotion:'reduce'})
for(const locale of ['en','ar'])for(const route of ['','platform','ai','book-demo'])for(const width of [375,1440]){await page.setViewportSize({width,height:width===375?900:1000});await page.goto(`http://127.0.0.1:4173/${locale}/${route}`);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`docs/qa-views/${locale}-${route||'home'}-${width}.png`})}
await browser.close()
