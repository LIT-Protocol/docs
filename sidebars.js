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

  docs: [
    {
      type: "category",
      label: "Getting Started",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "intro/overview",
        "intro/whatIsLitProtocol",
        "intro/usecases",
        "intro/rollup",
      ],
    },
    {
      type: "category",
      label: "Access Control",
      collapsed: true,
      items: [
        "accessControl/intro",
        {
          type: "category",
          label: "Types of Conditions",
          collapsed: true,
          items: [
            "accessControl/conditionTypes/unifiedAccessControlConditions",
            "accessControl/conditionTypes/booleanLogic",
            "accessControl/conditionTypes/updateableConditions",
            "accessControl/conditionTypes/litActionConditions",
          ],
        },
        {
          type: "category",
          label: "EVM",
          collapsed: true,
          items: [
            "accessControl/EVM/basicExamples",
            "accessControl/EVM/customContractCalls",
            "accessControl/EVM/poap",
            "accessControl/EVM/timelock",
            "accessControl/EVM/siwe",
          ],
        },
        {
          type: "category",
          label: "Other Chains",
          collapsed: true,
          items: [
            "accessControl/otherChains/solRpcConditions",
            "accessControl/otherChains/cosmosConditions",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Programmable Key Pairs",
      collapsed: true,
      items: [
        "pkp/intro",
        "pkp/minting",
        "pkp/authHelpers",
        {
          type: "category",
          label: "Distributed Cloud Wallets",
          collapsed: true,
          items: [
            "pkp/wallets/intro",
            "pkp/wallets/sendingTxs",
            "pkp/wallets/examples",
          ],
        },
        "pkp/toolsAndExamples",
      ],
    },
    {
      type: "category",
      label: "Lit Actions",
      collapsed: true,
      items: [
        "LitActions/intro",
        "LitActions/getlitCli",
        "LitActions/helloWorld",
        "LitActions/usingPKPsAndActions",
        "LitActions/bestPractices",
        {
          type: "category",
          label: "Working With Lit Actions",
          collapsed: true,
          items: [
            "LitActions/workingWithActions/conditionalSigning",
            "LitActions/workingWithActions/usingFetch",
            "LitActions/workingWithActions/singleExecution",
            "LitActions/workingWithActions/signingTx",
            "LitActions/workingWithActions/permissions",
            "LitActions/workingWithActions/logAndReturn",
          ],
        },
        {
          type: "category",
          label: "More Examples",
          collapsed: true,
          items: [
            "LitActions/additionalExamples/generatingSessionKey",
            "LitActions/additionalExamples/usingEIP",
          ],
        },
      ],
    },

    {
      type: "category",
      label: "SDK Reference",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "SDK/intro",
        "SDK/Explanation/installation",
        "SDK/Explanation/migration",
        {
          type: "category",
          label: "Working with the SDK",
          collapsed: true,
          items: [
            "SDK/Explanation/encryption",
            {
              type: "category",
              label: "Authentication",
              link: {
                type: "doc",
                id: "SDK/Explanation/authentication/overview",
              },
              collapsed: true,
              items: [
                "SDK/Explanation/authentication/authSig",
                "SDK/Explanation/authentication/sessionSigs",
                // 'SDK/Explanation/authentication/methods',
              ],
            },
            "SDK/Explanation/tests",
          ],
        },
        {
          type: "category",
          label: "Tools & Integrations",
          collapsed: true,
          items: [
            {
              type: "category",
              label: "Tools",
              collapsed: true,
              items: [
                "ToolsAndExamples/Tools/accessControl",
                "ToolsAndExamples/Tools/shareModal",
                "ToolsAndExamples/Tools/jwtverify",
                "ToolsAndExamples/Tools/pkpexplorer",
              ],
            },
            {
              type: "category",
              label: "Integrations",
              collapsed: true,
              items: [
                {
                  type: "category",
                  label: "Ceramic Integration",
                  collapsed: true,
                  items: [
                    "ToolsAndExamples/Integrations/Ceramic/intro",
                    "ToolsAndExamples/Integrations/Ceramic/installation",
                  ],
                },
                "ToolsAndExamples/Integrations/bundlrxarweave",
                "ToolsAndExamples/Integrations/additionalIntegrations",
              ],
            },
            {
              type: "category",
              label: "Additional Examples",
              collapsed: true,
              items: [
                {
                  type: "category",
                  label: "Encrypting and Decrypting On-chain Metadata",
                  collapsed: true,
                  items: [
                    "ToolsAndExamples/SDKExamples/OnchainMetadata/introduction",
                    "ToolsAndExamples/SDKExamples/OnchainMetadata/setup",
                    "ToolsAndExamples/SDKExamples/OnchainMetadata/encryptDecrypt",
                    "ToolsAndExamples/SDKExamples/OnchainMetadata/smartContract",
                    "ToolsAndExamples/SDKExamples/OnchainMetadata/frontend",
                    "ToolsAndExamples/SDKExamples/OnchainMetadata/polygonMumbai",
                  ],
                },
                "ToolsAndExamples/SDKExamples/dynamicContent",
                "ToolsAndExamples/SDKExamples/signedChainData",
              ],
            },
          ],
        },
        "SDK/examples",
      ],
    },
    {
      type: "category",
      label: "Resources",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "resources/howItWorks",
        "resources/supportedChains",
        "resources/contracts",
        "resources/glossary",
      ],
    },
    {
      type: "category",
      label: "Ecosystem",
      collapsible: false,
      className: "category-not-collapsible",
      items: [
        "Ecosystem/litGrants",
        "Ecosystem/community",
        "Ecosystem/projects",
      ],
    },
    {
      type: "category",
      label: "Support",
      collapsible: false,
      className: "category-not-collapsible",
      items: ["Support/faq", "Support/bugBounty", "Support/stateOfNetwork"],
    },
  ],
};

module.exports = sidebars;
