---
sidebar_position: 2
---

# GetLit CLI

![](https://raw.githubusercontent.com/LIT-Protocol/getlit/main/banner.png)

The GetLit CLI is a command-line tool designed to help developers manage their Lit Actions projects. The CLI provides a set of commands to create, build, test, and configure Lit Actions.

## Getting Started

```
npm install -g getlit

// or
yarn add global getlit
```

| Command                  | Usage                               | Description                               |
| ------------------------ | ----------------------------------- | ----------------------------------------- |
| `getlit init` \| `here` | `getlit init`                       | 🏁 Initialise a new Lit project           |
| `getlit build`           | `getlit build`                      | 🏗  Build your Lit Actions                |
| `getlit new` \| `action` | `getlit new [<lit-action-name>]` | 📝 Create a new Lit Action                |
| `getlit test`            | `getlit test [<lit-action-name>]`   | 🧪 Test a Lit Action                      |
| `getlit watch`           | `getlit watch [<lit-action-name>]`  | 🔧 Simultaneously build and test a Lit Action |
| `getlit setup`           | `getlit setup`                      | 🔑 Setup config for authSig and PKP      |
| `getlit docs` \| `doc` | `getlit docs`                       | 📖 Open the Lit Protocol documentation   |
| `getlit help` \|  `show` | `help`    | 🆘 Show the help menu                     |

## Usage

To use the GetLit CLI, simply run the desired command followed by any required or optional arguments. The CLI will execute the associated function and display the output accordingly.
