import { z } from "zod";
import { isDate } from "./utils";

export const receiptSchema = z.object({
  datetime: z.string().refine(isDate),
  paymentId: z.string(),
  cost: z.string(),
  company: z.string(),
  subscriptionName: z.string(),
  paymentMethod: z.string(),
});

export const existingSubscriptionSchema = z.object({
  name: z.string(),
  cost: z.string(),
  subscriptionId: z.string(),
  isActive: z.boolean(),
  imageSource: z.string(),
  renewDate: z.string().refine(isDate),
});
