import { z } from 'zod';

const safeJsonParse = (value: string): unknown => JSON.parse(value) as unknown;

// Accepts MongoDB ObjectId strings (24 hex chars)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = () =>
  z
    .string({ error: 'Category Id is required' })
    .regex(objectIdRegex, 'Invalid ObjectId for category id');

// timestamps: accept Date or ISO string -> normalize to Date
const dateFromString = z.preprocess((arg: unknown) => {
  if (typeof arg === 'string') return new Date(arg);
  if (arg instanceof Date) return arg;
  return undefined;
}, z.date());

export const priceConfigurationItemSchema = z.object({
  priceType: z.enum(['base', 'additional'], { error: 'priceType is required' }),
  availableOptions: z.record(z.string(), z.union([z.string(), z.number()])),
});

// A record keyed by variant/option name (e.g. "default", "extra_cheese")
export const priceConfigurationSchema = z.record(
  z.string(),
  priceConfigurationItemSchema,
);

export const attributeSchema = z.object({
  name: z.string({ error: 'attribute name is required' }).min(1),
  value: z.union([z.string(), z.number(), z.boolean()], {
    error: 'Can be of type string|number|boolean',
  }),
});

export const productCreateSchema = z.object({
  name: z
    .string({
      error: 'Product name is required',
    })
    .min(1, 'Product name cannot be empty'),
  description: z
    .string({ error: 'Product description is required' })
    .min(1, 'Product description cannot be empty'),
  categoryId: objectId(),
  image: z.string().optional(),
  priceConfiguration: z
    .union([
      z.string(),
      priceConfigurationSchema.refine((data) => Object.keys(data).length > 0, {
        error: 'priceConfiguration must contain at least one key',
      }),
    ])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = safeJsonParse(val);
        // Let Zod handle the error
        return priceConfigurationSchema.parse(parsed);
      }
      return val;
    }),
  attributes: z
    .union([
      z.string(),
      z
        .array(attributeSchema, { error: 'attributes is required' })
        .nonempty('At least one option is requird for attributes'),
    ])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = safeJsonParse(val);
        // FIXED: must validate as ARRAY, not a single object
        return z.array(attributeSchema).min(1).parse(parsed);
      }
      return val;
    }),
  tenantId: z.string({ error: 'tenant id is required' }).min(1),
  isPublished: z.coerce.boolean(),
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
