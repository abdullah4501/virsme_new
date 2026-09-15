import type { Locale, PageName } from './types'

const headings: Record<Locale, Partial<Record<PageName, string>>> = {
  en: {
    platform: 'One environment. One business.',
    applications: 'Four modules. One business system.',
    connect: 'Communication connected to work.',
    people: 'One connected employee lifecycle.',
    work: 'Know what happens and who owns it.',
    sales: 'One connected customer lifecycle.',
    ai: 'AI that understands your business.',
    workflows: 'One process. One connected workflow.',
    implementation: 'Change systems without disruption.',
    'why-virsme': 'One business. One system.',
    pricing: 'Pricing shaped around your needs.',
    ecosystem: 'A foundation built to grow.',
    about: 'Built for the business behind the software.',
    facts: 'Official information about VirSME.',
    'book-demo': 'Show us your slow workflow.',
    resources: 'Guidance for a more connected business.',
  },
  ar: {
    platform: 'بيئة تشغيل واحدة لأعمالك.',
    applications: 'أربع وحدات. نظام أعمال واحد.',
    connect: 'تواصل مرتبط بالعمل.',
    people: 'دورة حياة موظف مترابطة.',
    work: 'اعرف ما يجب إنجازه ومن المسؤول.',
    sales: 'دورة حياة عميل مترابطة.',
    ai: 'ذكاء اصطناعي يفهم كيف تعمل منشأتك.',
    workflows: 'عملية واحدة. سير عمل مترابط.',
    implementation: 'غيّر النظام دون تعطيل التشغيل.',
    'why-virsme': 'شغّل أجزاء أكبر كنظام واحد.',
    pricing: 'تسعير يتشكل حول أعمالك.',
    ecosystem: 'أساس مصمم للنمو.',
    about: 'مصمم للأعمال التي تقف خلف البرامج.',
    facts: 'المعلومات الرسمية عن VirSME.',
    'book-demo': 'أرنا سير العمل الذي يبطئ أعمالك.',
    resources: 'إرشادات لأعمال أكثر ترابطا.',
  },
}

export const heroHeading = (page: PageName, locale: Locale, fallback: string) =>
  headings[locale][page] ?? fallback

export const heroArtwork = (page: PageName) => {
  if (['people'].includes(page)) return 'people'
  if (['work','workflows','implementation'].includes(page)) return 'operations'
  if (['sales','pricing','ecosystem'].includes(page)) return 'sales'
  if (page === 'ai') return 'ai'
  if (page === 'why-virsme') return 'platform'
  if (['connect','resources','about','book-demo'].includes(page)) return 'connect'
  return 'platform'
}
