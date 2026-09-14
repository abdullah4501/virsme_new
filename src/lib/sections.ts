import type {Block,PageContent} from '../content/types'
export type ContentSection={heading:string;blocks:Block[]}
export function sections(p:PageContent):ContentSection[]{const result:ContentSection[]=[];for(const b of p.blocks){if(b.kind==='heading')result.push({heading:b.text,blocks:[]});else if(result.length)result.at(-1)!.blocks.push(b)}return result}
