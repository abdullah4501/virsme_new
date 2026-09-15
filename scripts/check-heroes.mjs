import { chromium } from '@playwright/test'
const pages=['platform','applications','applications/connect','applications/people','applications/work','applications/sales','ai','workflows','implementation','why-virsme','pricing','ecosystem','about','facts','book-demo','resources']
const browser=await chromium.launch({headless:true})
let failed=false
try {
  const tab=await browser.newPage()
  await tab.goto('http://127.0.0.1:4173/')
  await tab.waitForURL('**/en/')
  await tab.waitForSelector('#initial-loader',{state:'detached',timeout:4000})
  if(!await tab.locator('#root main').count()){failed=true;console.error('App did not render after loader dismissal')}
  for(const locale of ['en','ar']) for(const width of [390,1440]) for(const route of pages) {
    await tab.setViewportSize({width,height:900})
    await tab.goto(`http://127.0.0.1:4173/${locale}/${route}`)
    await tab.evaluate(()=>document.fonts.ready)
    const result=await tab.evaluate(()=>{
      const hero=document.querySelector('.page-hero'), h=document.querySelector('.page-hero h1'), root=document.documentElement
      const style=getComputedStyle(h), lines=Math.round(h.getBoundingClientRect().height/Number.parseFloat(style.lineHeight))
      const image=getComputedStyle(hero,'::before').backgroundImage
      const loader=document.querySelector('#initial-loader')
      const loaderVisible=!!loader&&!loader.classList.contains('initial-loader-hidden')
      return {lines,image:image.includes('.png'),loaderVisible,overflow:root.scrollWidth>root.clientWidth+1}
    })
    if(result.lines>2||!result.image||result.loaderVisible||result.overflow){failed=true;console.error(locale,width,route,result)}
  }
  for(const locale of ['en','ar']) {
    await tab.goto(`http://127.0.0.1:4173/${locale}/resources`)
    const resources=await tab.evaluate(()=>({paragraph:!!document.querySelector('.page-resources .page-intro')?.textContent?.trim(),button:!!document.querySelector('.page-resources .hero-buttons a')?.textContent?.trim()}))
    if(!resources.paragraph||!resources.button){failed=true;console.error(locale,'resources hero content',resources)}
  }
} finally {await browser.close()}
if(failed)process.exitCode=1
else console.log('Loader clears, the app renders, and all 64 subpage hero checks use PNG backgrounds; Resources content also passes.')
