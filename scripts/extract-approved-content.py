"""One-time local import. Source PDF remains outside the website and deployment."""
import sys, json, re
from pathlib import Path
sys.path.insert(0, str(Path('node_modules/.pdf-tools').resolve()))
import pymupdf

source = sys.argv[1]
doc = pymupdf.open(source)
names = ['home','platform','applications','connect','people','work','sales','ai','workflows','implementation','why-virsme','pricing','ecosystem','about','facts','book-demo','resources']
pages = {}
current = None
english = False
for page in doc:
    for block in page.get_text('dict')['blocks']:
        spans = [s for line in block.get('lines',[]) for s in line['spans']]
        if not spans: continue
        size = max(s['size'] for s in spans)
        if size < 8: continue
        text = re.sub(r'\s+', ' ', ' '.join(s['text'] for s in spans)).strip()
        m = re.match(r'PAGE (\d+):',text)
        if m:
            current = names[int(m[1])-1]
            pages[current] = {'title':'','description':'','eyebrow':'','hero':'','intro':'','blocks':[]}
            english = False
            continue
        if not current: continue
        data = pages[current]
        if text.startswith('9. Arabic localisation'): current=None; continue
        if text.startswith('SEO title:'): data['title']=text.removeprefix('SEO title:').strip(); continue
        if text.startswith('Meta description:'): data['description']=text.removeprefix('Meta description:').strip(); continue
        if text=='English audience-facing copy': english=True; continue
        if text=='Arabic audience-facing copy': english=False; continue
        if not english: continue
        if text.startswith('Eyebrow:'): data['eyebrow']=text.removeprefix('Eyebrow:').strip();continue
        if size>=17: data['hero']=text;continue
        if not data['intro'] and data['hero'] and size<10: data['intro']=text;continue
        if text.startswith('Trust line:'): kind='trust';text=text.removeprefix('Trust line:').strip()
        elif '\uf0b7' in text:
            data['blocks'].append({'kind':'list','text':'','items':[t.strip() for t in text.split('\uf0b7') if t.strip()]});continue
        elif text=='CTA': continue
        elif size==9.5 and data['blocks'] and data['blocks'][-1]['text']=='Messaging line': kind='message';data['blocks'].pop()
        elif size==9.5: kind='cta'
        elif size>=10: kind='heading'
        else: kind='text'
        data['blocks'].append({'kind':kind,'text':text,'items':[]})
for name,data in pages.items():
    folder=Path('src/content')/name
    folder.mkdir(parents=True,exist_ok=True)
    (folder/'en.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Imported',len(pages),'English page namespaces.')
