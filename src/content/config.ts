import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.enum(["Aarush", "Pamela", "Santanu"]),
    image: z.object({
      src: z.string().optional(),
      alt: z.string().optional(),
    }),
    description: z
      .string()
      .max(
        160,
        "For best SEO results, please keep the description under 160 characters."
      ).optional(),
    draft: z.boolean().default(false),
    category: z.enum(["Travel", "Poem", "Technology", "General", "Food"]),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
