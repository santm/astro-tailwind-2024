import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

interface Context {
    site: any; // Adjust the type of 'site' according to its structure
    // Add more properties if necessary
}

export async function GET(context: Context) {
    const blog = await getCollection('blog');
    return rss({
        stylesheet: "/pretty-feed-v3.xsl",
        title: 'Aashiyana of Pamela Santanu',
        description: 'Rumblings on life, travel, photography, wildlife, running, baking, cooking  or anything under sun',
        site: context.site,
        items: blog.reverse().map((post) => ({
            title: post.data.title,
            author: post.data.author,
            // category:post.data.category,
            description: post.data.description,
            pubDate: post.data.pubDate,
            link: `/blog/${post.slug}/`,
        })),
        // (optional) inject custom xml
        customData: `<language>en-us</language>`,
    });
}