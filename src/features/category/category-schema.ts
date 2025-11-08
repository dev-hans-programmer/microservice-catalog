import { z } from 'zod';

export const priceConfigurationSchema = z.object({
  priceType: z.enum(['base', 'additional'] as const, {
    error: 'priceType is required',
  }),
  availableOptions: z
    .array(z.string().min(1, 'Option cannot be empty'), {
      error: 'availableOptions is required',
    })
    .nonempty('At least one available option is required'),
});

export const categorySchema = z.object({
  name: z
    .string({
      error: 'Category name is required',
    })
    .min(1, 'Category name cannot be empty'),

  priceConfiguration: z
    .record(z.string(), priceConfigurationSchema)
    .refine((data) => Object.keys(data).length > 0, {
      message: 'priceConfiguration must contain at least one key',
    }),
});

export type CategoryInput = z.infer<typeof categorySchema>;
