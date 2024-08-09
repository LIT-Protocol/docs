---
sidebar_position: 5
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# GetLit CLI

![](https://raw.githubusercontent.com/LIT-Protocol/getlit/main/banner.png)

The GetLit CLI is a command-line tool designed to help developers manage their Lit Actions projects. The CLI provides a set of commands to create, build, test, and configure Lit Actions.

- GitHub repo: https://github.com/LIT-Protocol/getlit
- npm: https://www.npmjs.com/getlit

## Installation

```bash
npm install -g getlit

// or
yarn add global getlit
```

## Usage

To use the GetLit CLI, navigate to a directory or your existing project, and then simply run the desired command followed by any required or optional arguments. The CLI will execute the associated function and display the output accordingly.

| Command                  | Usage                               | Description                               |
| ------------------------ | ----------------------------------- | ----------------------------------------- |
| `action` \| `init` | `getlit action`                       | 🏁 Initialise a new Lit project           |
| `build`           | `getlit build`                      | 🏗  Build your Lit Actions                |
| `new` | `getlit new [<lit-action-name>]` | 📝 Create a new Lit Action                |
| `test`            | `getlit test [<lit-action-name>]`   | 🧪 Test a Lit Action                      |
| `watch`           | `getlit watch [<lit-action-name>]`  | 🔧 Simultaneously build and test a Lit Action |
| `setup`           | `getlit setup`                      | 🔑 Setup config for authSig and PKP      |
| `deploy`           | `getlit deploy`                      | 🚀 Deploy your Lit Actions      |
| `derive-pkp`           | `getlit derive-pkp --userId --projectId --format`                      | 🔑 Derive a public key from user and application IDs      |
| `search`           | `getlit search --get --format --publicKey --authMethodId --userId --appId`                      | 🔍 Search for data related to PKPs      |
| `docs` \| `doc` | `getlit docs`                       | 📖 Open the Lit Protocol documentation   |
| `help` \|  `show` | `getlit help`    | 🆘 Show the help menu                     |

### `getlit action`

This command is used to initialize a new Lit project.

```bash
getlit action
```

Initialized Lit project directory looks like:

```
├── README.md
├── getlit.json
├── globa.d.ts
├── package-lock.json
├── package.json
├── src
│   ├── README.md
│   ├── foo.action.ts
│   └── main.action.ts
├── test
│   ├── README.md
│   ├── foo.t.action.mjs
│   └── main.t.action.mjs
├── tsconfig.json
└── utils.mjs
```

In order to proceed, `src/foo.action.ts` needs to be modified as ‘NA_E’ to ‘NAME’:

```javascript
/**
 * NA_E: foo
 *
 * ⬆️ Replace "_" with "M" to pass the schema validation
 *
 */
 
const foo = () => {
  return "bar";
};
```

You can start building your own Lit Action by modifying `src/main.action.ts`, and `test/main.t.action.mjs` accordingly.

### `getlit new`

This command is used to create a new Lit Action in an existing project.

```bash
getlit new newAction
```

A new Lit Action called `newAction` and the test are automatically created in the project directory:

```
├── README.md
├── getlit.json
├── globa.d.ts
├── package-lock.json
├── package.json
├── src
│   ├── README.md
│   ├── foo.action.ts
│   ├── main.action.ts
│   └── newAction.action.ts
├── test
│   ├── README.md
│   ├── foo.t.action.mjs
│   ├── main.t.action.mjs
│   └── newAction.t.action.mjs
├── tsconfig.json
└── utils.mjs
```

### `getlit setup`

Recall that in order to build a Lit project, an [AuthSig](https://developer.litprotocol.com/v3/sdk/authentication/auth-sig) and a [PKP](https://developer.litprotocol.com/v3/sdk/wallets/intro) are needed. `setup` command is used to mint the PKP and create the AuthSig.

```bash
getlit setup
```

### `getlit build`

When the Lit Action is coded, and the PKP is created, final step is to build the project.

```bash
getlit build
```

### `getlit test`

You can test your Lit Actions by using the test command with the Lit Action to be tested specified:

```bash
getlit test foo
```

### `getlit watch`

This command executes the `build` and `test` commands simultaneously:

```bash
getlit watch
```

### `getlit deploy`

Once the Lit Action code is ready, after building it, it can be deployed using the `deploy` command:

```bash
getlit deploy
```

### `getlit search`

This command is used to get PKP-related data by providing some data like public key or IDs:

```bash
getlit search --get --format --publicKey --authMethodId --userId --appId
```

### `getlit derive-pkp`

Lit Protocol supports [derived keys](https://developer.litprotocol.com/v3/sdk/wallets/claimable-keys/intro/). Users are able to claim the key from the authentication method identifier:

```bash
getlit derive-pkp --userId --projectId --format
```
<FeedbackComponent/>
