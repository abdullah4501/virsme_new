import type { Locale } from "./types";
export type PreviewMode = "people" | "work" | "sales" | "connect";
type PreviewCopy = {
  caption: string;
  workspace: string;
  connected: string;
  tableTitle: string;
  columns: string[];
  control: string;
  reset: string;
  pending: string;
  complete: string;
  aiTitle: string;
  aiBody: string;
  human: string;
  context: string;
  policy: string;
  activity: string;
  modules: string[];
  modes: Record<
    PreviewMode,
    {
      title: string;
      subtitle: string;
      cards: string[];
      values: string[];
      rows: string[][];
    }
  >;
};
const en: PreviewCopy = {
  caption: "Illustrative workflow · Sample records",
  workspace: "Operating workspace",
  connected: "Connected",
  tableTitle: "Workflow records",
  columns: ["Record", "Next action", "Status"],
  control: "Preview next step",
  reset: "Replay workflow",
  pending: "Awaiting authorization",
  complete: "Next step prepared",
  aiTitle: "Business context, ready for action.",
  aiBody:
    "The next action follows the process, policy and authority structure.",
  human: "Human authorization",
  context: "Shared business context",
  policy: "SOP and policy checks",
  activity: "Workflow activity",
  modules: ["People", "Work", "Sales", "Connect"],
  modes: {
    people: {
      title: "Employee lifecycle",
      subtitle: "One employee record. A connected onboarding process.",
      cards: ["Employee record", "Policies", "Work assignments"],
      values: ["Ready", "In review", "Assigned"],
      rows: [
        ["Employee record A", "Review documents", "Ready"],
        ["Employee record B", "Confirm permissions", "Approval"],
        ["Employee record C", "Assign training", "Queued"],
      ],
    },
    work: {
      title: "Operational execution",
      subtitle: "Clear ownership from the first task to the next handoff.",
      cards: ["Responsibilities", "Work context", "Checkpoints"],
      values: ["Assigned", "Connected", "In review"],
      rows: [
        ["Delivery workflow A", "Confirm scope", "Ready"],
        ["Recurring workflow B", "Review checkpoint", "Approval"],
        ["Project workflow C", "Assign ownership", "Queued"],
      ],
    },
    sales: {
      title: "Customer lifecycle",
      subtitle: "Keep customer context connected to the work that follows.",
      cards: ["Customer record", "Opportunity", "Delivery handoff"],
      values: ["Connected", "Won", "Prepared"],
      rows: [
        ["Customer record A", "Prepare onboarding", "Ready"],
        ["Opportunity B", "Review commitments", "Approval"],
        ["Customer record C", "Assign delivery team", "Queued"],
      ],
    },
    connect: {
      title: "Communication in context",
      subtitle: "Bring the conversation and its next action together.",
      cards: ["Conversation", "Business context", "Next action"],
      values: ["Connected", "Attached", "Prepared"],
      rows: [
        ["Discussion A", "Confirm next action", "Ready"],
        ["Team update B", "Review responsibility", "Approval"],
        ["Workflow note C", "Notify the team", "Queued"],
      ],
    },
  },
};
const ar: PreviewCopy = {
  caption: "تصور لسير العمل · سجلات توضيحية",
  workspace: "بيئة التشغيل",
  connected: "مترابط",
  tableTitle: "سجلات سير العمل",
  columns: ["السجل", "الإجراء التالي", "الحالة"],
  control: "استعرض الخطوة التالية",
  reset: "أعد عرض سير العمل",
  pending: "بانتظار الموافقة",
  complete: "تم إعداد الخطوة التالية",
  aiTitle: "سياق الأعمال جاهز للإجراء.",
  aiBody: "تتبع الخطوة التالية العملية والسياسة وهيكل السلطة.",
  human: "الموافقة البشرية",
  context: "سياق أعمال مشترك",
  policy: "مراجعة الإجراءات والسياسات",
  activity: "نشاط سير العمل",
  modules: ["People", "Work", "Sales", "Connect"],
  modes: {
    people: {
      title: "دورة حياة الموظف",
      subtitle: "سجل موظف واحد. عملية انضمام مترابطة.",
      cards: ["سجل الموظف", "السياسات", "توزيع العمل"],
      values: ["جاهز", "قيد المراجعة", "تم التعيين"],
      rows: [
        ["سجل موظف أ", "مراجعة المستندات", "جاهز"],
        ["سجل موظف ب", "تأكيد الصلاحيات", "موافقة"],
        ["سجل موظف ج", "تعيين التدريب", "في الانتظار"],
      ],
    },
    work: {
      title: "التنفيذ التشغيلي",
      subtitle: "مسؤولية واضحة من أول مهمة إلى الخطوة التالية.",
      cards: ["المسؤوليات", "سياق العمل", "نقاط التحكم"],
      values: ["تم التعيين", "مترابط", "قيد المراجعة"],
      rows: [
        ["سير تنفيذ أ", "تأكيد النطاق", "جاهز"],
        ["سير عمل متكرر ب", "مراجعة نقطة التحكم", "موافقة"],
        ["سير مشروع ج", "تعيين المسؤولية", "في الانتظار"],
      ],
    },
    sales: {
      title: "دورة حياة العميل",
      subtitle: "يبقى سياق العميل مرتبطا بالعمل الذي يليه.",
      cards: ["سجل العميل", "الفرصة", "التسليم للتنفيذ"],
      values: ["مترابط", "رابحة", "تم الإعداد"],
      rows: [
        ["سجل عميل أ", "تجهيز الانضمام", "جاهز"],
        ["فرصة ب", "مراجعة الالتزامات", "موافقة"],
        ["سجل عميل ج", "تعيين فريق التنفيذ", "في الانتظار"],
      ],
    },
    connect: {
      title: "التواصل في سياقه",
      subtitle: "اربط المحادثة بالإجراء التالي.",
      cards: ["المحادثة", "سياق الأعمال", "الإجراء التالي"],
      values: ["مترابط", "مرفق", "تم الإعداد"],
      rows: [
        ["نقاش أ", "تأكيد الإجراء التالي", "جاهز"],
        ["تحديث فريق ب", "مراجعة المسؤولية", "موافقة"],
        ["ملاحظة سير عمل ج", "إشعار الفريق", "في الانتظار"],
      ],
    },
  },
};
export const previewCopy = (locale: Locale) => (locale === "ar" ? ar : en);
