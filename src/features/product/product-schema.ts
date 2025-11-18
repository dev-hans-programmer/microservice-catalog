import { z } from 'zod';

// Accepts MongoDB ObjectId strings (24 hex chars)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = () => z.string().regex(objectIdRegex, 'Invalid ObjectId');

// timestamps: accept Date or ISO string -> normalize to Date
const dateFromString = z.preprocess((arg: unknown) => {
  if (typeof arg === 'string') return new Date(arg);
  if (arg instanceof Date) return arg;
  return undefined;
}, z.date());

export const priceOptionsSchema = z.object({
  small: z.number(),
  medium: z.number(),
  large: z.number(),
});

export const priceConfigurationItemSchema = z.object({
  priceType: z.enum(['base', 'additional']),
  availableOptions: priceOptionsSchema,
});

// A record keyed by variant/option name (e.g. "default", "extra_cheese")
export const priceConfigurationSchema = z.record(
  z.string(),
  priceConfigurationItemSchema,
);

export const attributeSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const productCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: objectId(),
  image: z.string().min(1), // keep simple; change to .url() if images must be full URLs
  priceConfiguration: priceConfigurationSchema,
  attributes: z.array(attributeSchema).optional(),
  tenantId: z.string().min(1),
  isPublished: z.boolean().optional(),
});

export const productResponseSchema = productCreateSchema.extend({
  _id: objectId(),
  createdAt: dateFromString,
  updatedAt: dateFromString,
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;

export default {
  productCreateSchema,
  productResponseSchema,
};
