import { z } from "zod";
const required = z.string().trim().min(1, "required").max(200, "length");
export const demoSchema = z.object({
  name: required,
  company: required,
  email: z.string().trim().min(1, "required").email("email").max(254, "length"),
  phone: z.string().trim().max(80, "length"),
  country: required,
  employees: z.enum(["1-10", "11-50", "51-200", "201-500", "501+"], {
    error: "number",
  }),
  workflow: z.string().trim().min(1, "required").max(3000, "length"),
  tools: z.string().trim().max(1000, "length"),
  language: z.enum(["en", "ar"]),
  meetingTime: z.string().trim().max(200, "length"),
  website: z.string().max(200).default(""),
  startedAt: z.number().finite(),
});
export type DemoInput = z.infer<typeof demoSchema>;
