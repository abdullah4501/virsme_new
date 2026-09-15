import {chromium} from '@playwright/test'
const browser=await chromium.launch({headless:true,args:['--disable-features=OverlayScrollbar']})
let failures=0
try {
  const page=await browser.newPage()
  for(const locale of ['en','ar']) for(const width of [320,375,768,1024,1280,1440,1600]) {
    await page.setViewportSize({width,height:900})
    await page.goto(`http://127.0.0.1:5173/${locale}/`)
    await page.evaluate(()=>document.documentElement.style.scrollbarGutter='stable')
    await page.evaluate(()=>document.fonts.ready)
    await page.waitForTimeout(100)
    const result=await page.evaluate(()=>({viewport:document.documentElement.getBoundingClientRect().width,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,heroBackground:getComputedStyle(document.querySelector('.home-hero-surface')||document.querySelector('.home-hero'),'::before').width}))
    const overflow=result.scroll>result.viewport+1
    if(overflow)failures++
    console.log(JSON.stringify({locale,width,overflow,...result}))
    if(locale==='en'&&width===1440)await page.locator('.workflow-section').screenshot({path:'docs/qa-workflow.png'})
  }
} finally {await browser.close()}
process.exitCode=failures?1:0
