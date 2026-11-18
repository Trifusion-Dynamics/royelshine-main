import { z } from "zod";

export const enquirySchema = z.object({
  customerName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(8, { message: "Please enter a valid contact phone number." })
    .max(20, { message: "Phone number is too long." }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters long." })
    .max(2000, { message: "Message must not exceed 2000 characters." }),
  preferredMethod: z
    .enum(["WHATSAPP", "PHONE", "EMAIL"])
    .default("WHATSAPP"),
  productId: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
  honeypot: z.string().max(0).optional(), // anti-spam field: must be empty
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
