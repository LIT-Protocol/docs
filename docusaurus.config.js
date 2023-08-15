// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Lit Protocol",
  tagline: "Blockchain based access control for the web",
  url: "https://developer.litprotocol.com",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  organizationName: "lit-protocol", // Usually your GitHub org/user name.
  projectName: "@lit-protocol/js-sdk", // Usually your repo name.

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/LIT-Protocol/docs/tree/main",
          routeBasePath: "/",
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-XK6E9ZB77S",
          anonymizeIP: false,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Lit Protocol",
        logo: {
          alt: "Lit Protocol",
          src: "img/logo.svg",
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            docId: 'intro/overview',
            label: 'Docs',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'learningLab',
            label: 'Learning Lab',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'ecosystem',
            label: 'Ecosystem',
          },
          {
            href: "https://github.com/LIT-Protocol/js-sdk",
            position: "right",
            className: 'header-github-link',
            'aria-label': 'Lit JS SDK V2 GitHub repository',
          },
        ],
      },
      footer: {
        links: [
          {
            title: "Community",
            items: [
              // {
              //   label: "Stack Overflow",
              //   href: "https://stackoverflow.com/questions/tagged/docusaurus",
              // },
              {
                label: "Discord",
                href: "https://litgateway.com/discord",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/litprotocol",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "https://blog.litprotocol.com/",
              },
              {
                label: "GitHub",
                href: "https://github.com/LIT-Protocol/js-sdk",
              },
              {
                label: "API",
                href: "https://js-sdk.litprotocol.com/index.html",
              },
            ],
          },
          {
            title: "Contact",
            items: [
              {
                label: "Support",
                to: "/support",
              },
              // {
              //   label: "JS SDK",
              //   to: "/docs/SDK/intro",
              // },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: "LBGPAMG3FY",
        apiKey: "041874d52ec424d091674d198d792313",
        indexName: "developer-litprotocol",
      },
    }),
  scripts: [
    {
      src: "https://plausible.io/js/script.outbound-links.js",
      defer: true,
      "data-domain": "developer.litprotocol.com",
    },
    { src: "/onLoad.js" },
  ],
};

module.exports = config;
