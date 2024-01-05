// import { z, defineCollection } from "astro:content";

// const blogCollection = defineCollection({
//   type: "content", // v2.5.0 and later
//   schema: z.object({
//     title: z.string(),
//     pubDate: z.date(),
//     author: z.enum(["Aarush", "Pamela", "Santanu"]),
//     image: z.object({
//       src: z.string().optional(),
//       alt: z.string().optional(),
//     }),
//     description: z.string().max(160, "For best SEO results, please keep the description under 160 characters.").optional(),
//     draft: z.boolean().default(false),
//     category: z.enum(["Travel", "Poem", "Technology", "General", "Food", "Running"]),
//     tags: z.array(z.string()),
//   }),
// });
// export const collections = {
//   blog: blogCollection,
// };
import { defineCollection, z } from "astro:content";
const blogCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.enum(["Aarush", "Pamela", "Santanu"]),
    description: z.string().max(160, "For best SEO results, please keep the description under 160 characters.").optional(),
    tags: z.array(z.string()),
    category: z.enum(["Travel", "Poem", "Technology", "General", "Food", "Running"]),
    cover: image().refine((img) => img.width >= 999, {
      message: "Cover image must be at least 999 pixels wide!",
    }),
    coverAlt: z.string(),
  }),
});


export const collections = {
  blog: blogCollection,

};