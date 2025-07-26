import path from 'node:path';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginAlgolia } from '@rspress/plugin-algolia';
import { pluginLlms } from '@rspress/plugin-llms';
import { pluginRss } from '@rspress/plugin-rss';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { pluginGoogleAnalytics } from 'rsbuild-plugin-google-analytics';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';
//@ts-expect-error exists
import { defineConfig } from 'rspress/config';
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans';
import pluginSitemap from 'rspress-plugin-sitemap';

const siteUrl = 'https://israelprempeh.com';
const description = 'The Rsbuild-based library development tool';

export default defineConfig({
  outDir: '../../dist/packages/documentation',
  plugins: [
    pluginAlgolia(),
    pluginFontOpenSans(),
    pluginLlms(),
    pluginRss({
      siteUrl,
      feed: [
        {
          id: 'blog-rss',
          test: /^\/blog\/.+/,
          title: 'Rslib Blog',
          language: 'en',
          output: {
            type: 'rss',
            filename: 'blog-rss.xml',
          },
        }
      ],
    }),
    pluginSitemap({
      domain: siteUrl,
    }),
  ],
  root: path.join(__dirname, 'docs'),
  lang: 'en',
  title: 'Rslib',
  description:
    'Rslib is a library development tool that leverages the well-designed configurations and plugins of Rsbuild.',
  icon: 'https://assets.rspack.rs/rslib/rslib-logo-192x192.png',
  logo: 'https://assets.rspack.rs/rslib/rslib-logo-192x192.png',
  logoText: 'Rslib',
  markdown: {
    checkDeadLinks: true,
    shiki: {
      transformers: [transformerNotationHighlight(), transformerNotationDiff()],
    },
  },
  search: {
    codeBlocks: true,
  },
  route: {
    cleanUrls: true,
    // exclude document fragments from routes
    exclude: ['**/zh/shared/**', '**/en/shared/**'],
  },
  head: [
    ({ routePath }) => {
      const getOgImage = () => {
        if (routePath.endsWith('blog/introducing-rslib')) {
          return 'assets/rslib-og-image-introducing.png';
        }
        return 'rslib-og-image.png';
      };
      return `<meta property="og:image" content="https://assets.rspack.rs/rslib/${getOgImage()}">`;
    },
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rslib',
      },
      {
        icon: 'x',
        mode: 'link',
        content: 'https://twitter.com/rspack_dev',
      },
      {
        icon: 'discord',
        mode: 'link',
        content: 'https://discord.gg/XsaKEEk4mW',
      },
    ],
    locales: [
      {
        lang: 'en',
        label: 'English',
        title: 'Rslib',
        description,
        editLink: {
          docRepoBaseUrl:
            'https://github.com/web-infra-dev/rslib/tree/main/website/docs',
          text: '📝 Edit this page on GitHub',
        },
      }
    ],
  },
  builderConfig: {
    dev: {
      lazyCompilation: true,
    },
    resolve: {
      alias: {
        '@components': path.join(__dirname, '@components'),
        '@en': path.join(__dirname, 'docs/en')
      },
    },
    plugins: [
      pluginGoogleAnalytics({ id: 'G-TKDED32K0X' }),
      pluginSass(),
      pluginOpenGraph({
        title: 'Rslib',
        type: 'website',
        url: siteUrl,
        description,
        twitter: {
          site: '@rspack_dev',
          card: 'summary_large_image',
        },
      }),
    ],
  },
});
