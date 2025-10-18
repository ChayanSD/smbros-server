import {z} from 'zod';

const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
});

export type CategoryData = z.infer<typeof categorySchema>['body'];

export {categorySchema};