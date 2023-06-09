// global styles shared across the entire site
import * as React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'

import * as Fathom from 'fathom-client'
import { Analytics } from '@vercel/analytics/react'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
import posthog from 'posthog-js'
// this might be better for dark mode
import 'prismjs/themes/prism-tomorrow.css'
// used for code syntax highlighting (optional)
// import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import 'styles/global.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
// import 'styles/prism-theme.css'
import 'styles/zcustom.scss'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

import * as gtag from '../lib/gtag'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  React.useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `
          }}
        />
      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
