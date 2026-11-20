import { site } from '~/data/site'

export function usePageSeo(title: string, description: string) {
  const route = useRoute()
  const url = site.url + (route.path === '/' ? '/' : route.path.replace(/\/$/, ''))
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: `${site.url}/og.png`,
    ogUrl: url,
    ogType: 'website',
    twitterCard: 'summary_large_image'
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
