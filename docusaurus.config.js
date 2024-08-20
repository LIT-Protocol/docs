// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Lit Protocol',
  tagline:
    'Blockchain based access control and programmatic signing for the web',
  url: 'https://developer.litprotocol.com',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'brand/favicon.ico',
  organizationName: 'lit-protocol', // Usually your GitHub org/user name.
  projectName: '@lit-protocol/js-sdk', // Usually your repo name.
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: true,
          // lastVersion: "2.0",
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/LIT-Protocol/docs/tree/main',
          routeBasePath: '/',
          disableVersioning: true,
          // versions: {
          //   '2.0': {
          //     badge: true,
          //     label: 'v2.x.x',
          //     path: 'v2',
          //     banner: 'none',
          //   },
          //   current: {
          //     badge: true,
          //     label: 'v3.x.x',
          //     path: 'v3',
          //     banner: 'none',
          //   },
          // },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-XK6E9ZB77S',
          anonymizeIP: false,
        },
      }),
    ],
  ],

  plugins: [
    [
      'content-docs',
      {
        id: 'learningLab',
        path: 'learningLab',
        routeBasePath: 'learningLab',
        sidebarPath: require.resolve('./sidebars-learning-lab.js'),
      },
    ],
    [
      'content-docs',
      {
        id: 'Ecosystem',
        path: 'Ecosystem',
        routeBasePath: 'Ecosystem',
        sidebarPath: require.resolve('./sidebars-ecosystem.js'),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // re-purpose for next version
      // announcementBar: {
      //   id: "SDK V3 Beta",
      //   content:
      //     "Lit JS SDK V3 is now available in beta. Check out <a target='_self' href='/v3/'>v3.x.x</a> of the docs to learn more.",
      //   backgroundColor: "#ff844e",
      //   textColor: "#fffff",
      //   isCloseable: true,
      // },
      image: 'brand/docs-twitter.png',
      navbar: {
        title: 'Lit Protocol',
        logo: {
          alt: 'Lit Protocol',
          src: 'brand/lit-logo-black.svg',
          srcDark: 'brand/lit-logo-white.svg',
          href: 'https://developer.litprotocol.com/',
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            docId: 'intro/overview',
            label: 'Docs',
          },
          {
            to: 'ecosystem/lit-grants',
            position: 'left',
            label: 'Ecosystem',
          },
          // {
          //   type: 'docsVersionDropdown',
          //   position: 'right',
          // },
          {
            href: 'https://github.com/LIT-Protocol/js-sdk',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'Lit JS SDK GitHub repository',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Community',
            items: [
              // {
              //   label: "Stack Overflow",
              //   href: "https://stackoverflow.com/questions/tagged/docusaurus",
              // },
              {
                label: 'Discord',
                href: 'https://litgateway.com/discord',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/litprotocol',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://spark.litprotocol.com/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/LIT-Protocol/js-sdk',
              },
              {
                label: 'API',
                href: 'https://v6-api-doc-lit-js-sdk.vercel.app/',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Terms of Service',
                href: 'https://www.litprotocol.com/legal/terms-of-service',
              },
              {
                label: 'Privacy Policy',
                href: 'https://www.litprotocol.com/legal/privacy-policy',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'Support',
                to: '/support/intro',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'LBGPAMG3FY',
        apiKey: '041874d52ec424d091674d198d792313',
        indexName: 'developer-litprotocol',
      },
    }),
  scripts: [
    {
      src: 'https://plausible.io/js/script.outbound-links.js',
      defer: true,
      'data-domain': 'developer.litprotocol.com',
    },
    { src: '/onLoad.js' },
  ],
};

module.exports = config;
