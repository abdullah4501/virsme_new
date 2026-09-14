import type {Locale} from '../content/types'
import {CopyBlocks,Text} from '../components/Content'
import type {Block} from '../content/types'
// Unregistered template. Populate only with verified, approved material.
export function SecurityPage({locale,title,blocks}:{locale:Locale;title:string;blocks:Block[]}){return <article className="container section" lang={locale} dir={locale==='ar'?'rtl':'ltr'}><h1><Text>{title}</Text></h1><CopyBlocks blocks={blocks}/></article>}
