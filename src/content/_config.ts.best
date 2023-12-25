import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.enum(["Aarush", "Pamela", "Santanu"]),
    image: z.object({
      src: z.string().optional(),
      alt: z.string().optional(),
    }),
    description: z.string().max(160, "For best SEO results, please keep the description under 160 characters.").optional(),
    draft: z.boolean().default(false),
    category: z.enum(["Travel", "Poem", "Technology", "General", "Food", "Running"]),
    tags: z.array(z.string()),
  }),
});

// // 3. Export a single `collections` object to register your collection(s)
// export const collections = {
//   blog: blogCollection,
// };
//
// const santCollection = defineCollection({
//   schema: ({ image }) => z.object({
//     coverAlt: z.string(),
//     cover: image().refine((img) => img.width >= 1080, {
//       message: "Cover image must be at least 1080 pixels wide!",
//     }),
//   }),
// });

export const collections = {
  blog: blogCollection,
  // sant: santCollection,
};