/**
 * Creating a sidebar enables you to:
 create an ordered group of docs
 render a sidebar for each doc of that group
 provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
  // learningLab: [
  //   {
  //     type: 'autogenerated',
  //     dirName: 'learningLab',
  //   },
  // ],

  // ecosystem: [
  //   {
  //     type: 'autogenerated',
  //     dirName: 'Ecosystem',
  //   },
  // ],

  docs: [
    {
      type: "category",
      label: "Getting Started",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "intro/overview",
        "intro/what-is-lit-protocol",
        "intro/usecases",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      collapsible: false,
      className: "category-not-collapsible",
      items: ["concepts/pkps-as-wallet"],
    },
    {
      type: "category",
      label: "SDK Reference",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "sdk/intro",
        "sdk/feature-matrix",
        "sdk/installation",
        "sdk/migration",
            {
              type: "category",
              label: "Authentication",
              link: {
                type: "doc",
                id: "sdk/authentication/overview",
              },
              collapsed: true,
              items: [
                "sdk/authentication/auth-sig",
                {
                  type: "category",
                  label: "Session Signatures",
                  link: {
                    type: "doc",
                    id: "sdk/authentication/session-sigs/intro",
                  },
                  collapsed: true,
                  items: [
                    "sdk/authentication/session-sigs/resources-and-abilities",
                    "sdk/authentication/session-sigs/capability-objects",
                    "sdk/authentication/session-sigs/get-session-sigs",
                    "sdk/authentication/session-sigs/usage",
                    {
                      type: "category",
                      label: "Walletless Signatures",
                      link: {
                        type: "doc",
                        id: "sdk/authentication/session-sigs/auth-methods/overview",
                      },
                      collapsed: true,
                      items: [
                        "sdk/authentication/session-sigs/auth-methods/add-remove-auth-methods",
                        "sdk/authentication/session-sigs/auth-methods/social-login",
                        "sdk/authentication/session-sigs/auth-methods/web-authn",
                        "sdk/authentication/session-sigs/auth-methods/email-sms",
                      ],
                    },
                  ],
                },
                "sdk/authentication/security",
              ],
            },
            {
              type: "category",
              label: "Access Control",
              collapsible: true,
              items: [
                "sdk/access-control/intro",
                "sdk/access-control/encryption",
                "sdk/access-control/jwt-auth",
                {
                  type: "category",
                  label: "Types of Conditions",
                  collapsed: true,
                  items: [
                    "sdk/access-control/condition-types/unified-access-control-conditions",
                    "sdk/access-control/condition-types/boolean-logic",
                    "sdk/access-control/condition-types/lit-action-conditions",
                  ],
                },
                {
                  type: "category",
                  label: "EVM",
                  collapsed: true,
                  items: [
                    "sdk/access-control/evm/basic-examples",
                    "sdk/access-control/evm/custom-contract-calls",
                    "sdk/access-control/evm/poap",
                    "sdk/access-control/evm/timelock",
                    "sdk/access-control/evm/siwe",
                  ],
                },
                {
                  type: "category",
                  label: "Other Chains",
                  collapsed: true,
                  items: [
                    "sdk/access-control/other-chains/sol-rpc-conditions",
                    "sdk/access-control/other-chains/cosmos-conditions",
                  ],
                },
              ],
            },
            {
              type: "category",
              label: "Programmable Wallets",
              collapsible: true,
              items: [
                "sdk/wallets/intro",
                "sdk/wallets/auth-methods",
                "sdk/wallets/minting",
                "sdk/wallets/walletconnect",
              ],
            },
            "sdk/tests",
      ],
    },
    {
      type: "category",
      label: "Tools",
      collapsed: true,
      items: [
            "tools/access-control",
            "tools/getlit-cli",
            "tools/share-modal",
            "tools/pkpexplorer",
      ],
    },
    {
      type: "category",
      label: "Resources",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "resources/how-it-works",
        "resources/supported-chains",
        "resources/rollup",
        "resources/contracts",
        "resources/glossary",
      ],
    },
    {
      type: "category",
      label: "Support",
      collapsible: false,
      className: "category-not-collapsible",
      items: ["support/faq", "support/bug-bounty", "support/state-of-network"],
    }
  ],
};

module.exports = sidebars;
