---
sidebar_position: 5
---

# GetLit CLI

![](https://raw.githubusercontent.com/LIT-Protocol/getlit/main/banner.png)

The GetLit CLI is a command-line tool designed to help developers manage their Lit Actions projects. The CLI provides a set of commands to create, build, test, and configure Lit Actions.

- GitHub repo: https://github.com/LIT-Protocol/getlit
- npm: https://www.npmjs.com/getlit

## Getting Started

```
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
| `docs` \| `doc` | `getlit docs`                       | 📖 Open the Lit Protocol documentation   |
| `help` \|  `show` | `getlit help`    | 🆘 Show the help menu                     |