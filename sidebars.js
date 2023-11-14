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
        "intro/usecases"
      ],
    },
    {
      type: "category",
      label: "Concepts",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "concepts/access-control-concept",
        "concepts/aa-x-lit",
        "concepts/programmable-signing-concept",
        "concepts/pkps-as-wallet"],
    },
    {
      type: "category",
      label: "Migration to V3",
      collapsible: true,
      items: ["migration/overview", "network/feature-matrix", "migration/changes"],
    },
    {
      type: "category",
      label: "SDK Reference",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "sdk/installation",
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
              link: {
                type: "doc",
                id: "sdk/access-control/intro",
              },
              collapsible: true,
              items: [
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
              link: {
                type: "doc",
                id: "sdk/wallets/intro",
              },
              collapsible: true,
              items: [
                "sdk/wallets/auth-methods",
                "sdk/wallets/minting",
                "sdk/wallets/walletconnect",
                {
                  type: "category",
                  label: "Claimable Keys (HD Keys)",
                  link: {
                    type: "doc",
                    id: "sdk/wallets/claimable-keys/intro",
                  },
                  collapsible: true,
                  items: [
                    "sdk/wallets/claimable-keys/usage",
                  ],
                },
              ],
            },
            {
              type: "category",
              label: "Serverless Signing",
              link: {
                type: "doc",
                id: "sdk/serverless-signing/overview",
              },
              collapsible: true,
              items: [
                "sdk/serverless-signing/quick-start",
                "sdk/serverless-signing/conditional-signing",
                "sdk/serverless-signing/fetch",
                "sdk/serverless-signing/processing-validation",
                "sdk/serverless-signing/key-claiming",
                "sdk/serverless-signing/eip191",
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
            "tools/event-listener",
            "tools/pkpexplorer",
      ],
    },

    {
      type: "category",
      label: "Integrations",
      collapsed: true,
      items: [
        {
          type: "category",
          label: "Smart Contract Accounts",
          link: {
            type: "doc",
            id: "integrations/aa/overview",
          },
          collapsible: true,
          items: [
            "integrations/aa/alchemy-account-kit",
            "integrations/aa/pimlico",
          ],
        },
        {
          type: "category",
          label: "Storage",
          collapsible: true,
          items: [
            "integrations/storage/ceramic-example",
            "integrations/storage/irys",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Network",
      collapsible: false,
      className: "category-not-collapsible",
      items: ["network/state-of-network", "network/feature-matrix", "network/rollup"],
    },
    {
      type: "category",
      label: "Resources",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "resources/how-it-works",
        "resources/supported-chains",
        "resources/contracts",
        "resources/glossary",
      ],
    },
    {
      type: "category",
      label: "Support",
      collapsible: false,
      className: "category-not-collapsible",
      items: ["support/faq", "support/bug-bounty"],
    }
  ],
};

module.exports = sidebars;
