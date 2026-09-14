import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import {chromium} from '@playwright/test'
import {mkdir,writeFile} from 'node:fs/promises'
await mkdir('docs/lighthouse',{recursive:true})
const chrome=await chromeLauncher.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--disable-gpu','--no-first-run']})
const results=[]
try{for(const locale of ['en','ar'])for(const route of ['','platform','ai','book-demo']){const result=await lighthouse(`http://127.0.0.1:4173/${locale}/${route}`,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo'],formFactor:'mobile'});const lhr=result.lhr;await writeFile(`docs/lighthouse/${locale}-${route||'home'}.json`,result.report);const row={locale,page:route||'home',scores:Object.fromEntries(Object.entries(lhr.categories).map(([key,v])=>[key,Math.round(v.score*100)])),lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue};results.push(row);console.log(JSON.stringify(row))}}finally{await chrome.kill();await writeFile('docs/lighthouse-summary.json',JSON.stringify(results,null,2))}
