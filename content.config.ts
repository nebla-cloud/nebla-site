import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({ title: z.string(), description: z.string() })
    }),
    // content/docs/NN.slug.md: the number sets the sidebar order and is dropped from the URL.
    docs: defineCollection({
      type: 'page',
      source: 'docs/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        group: z.enum(['Get started', 'Use Nebla', 'Reference'])
      })
    })
  }
})
