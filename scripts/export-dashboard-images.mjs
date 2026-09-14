import {chromium} from '@playwright/test'
import sharp from 'sharp'
import {mkdir} from 'node:fs/promises'
await mkdir('public/images',{recursive:true})
const browser=await chromium.launch({channel:'chromium',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
for(const mode of ['people','work','sales','connect']){await page.goto(`http://127.0.0.1:4173/en/applications/${mode}`);await page.evaluate(()=>document.fonts.ready);const buffer=await page.locator('.dashboard-window').screenshot();await sharp(buffer).resize({width:900}).webp({quality:88}).toFile(`public/images/${mode}-concept.webp`)}
await browser.close()
