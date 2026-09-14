import type {Locale} from '../content/types'
import {Text} from '../components/Content'
import {JsonLd} from '../components/SeoMeta'
export type ApprovedArticle={title:string;description:string;author:string;published:string;modified:string;url:string;paragraphs:string[]}
export function ResourceArticle({article,locale}:{article:ApprovedArticle;locale:Locale}){return <article className="container section" lang={locale} dir={locale==='ar'?'rtl':'ltr'}><JsonLd data={{'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.description,author:{'@type':'Person',name:article.author},datePublished:article.published,dateModified:article.modified,mainEntityOfPage:article.url}}/><h1><Text>{article.title}</Text></h1><div className="article-prose">{article.paragraphs.map((text,i)=><p key={i}><Text>{text}</Text></p>)}</div></article>}
