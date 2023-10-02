# Lit Protocol Developer Docs 📚

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## 💻 Setup

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

<br/>

## ✨ Workflow

When adding new content or re-organizing existing content, please be sure to update the following:

1. Sidebar file - `sidebars.js`
2. Redirects file - `netlify.toml`

### Updating the sidebar

To create a top-level, **noncollapsible** category like `Getting Started`, add the following to the `docs` array:

```js
docs: [
  // ...
  {
    type: 'category',
    label: 'Tea Drinks',
    collapsible: false,
    className: 'category-not-collapsible',
    items: [
      // Add the IDs of your new category's pages here
      'tea-drinks/intro',
    ],
  }
]
```

To add a subcategory, add the category object to the `items` array:

```js
docs: [
  // ...
  {
    type: 'category',
    label: 'Tea Drinks',
    collapsible: false,
    className: 'category-not-collapsible',
    items: [
      'tea-drinks/intro',
      // Add your new subcategory here
      {
        type: 'category',
        label: 'Hot Drinks',
        collapsed: true,
        items: [
          // Add the IDs of your new subcategory's pages here
          'tea-drinks/hot-drinks/intro',
        ],
      },
    ],
  }
]
```

To create a top-level, *collapsible* category like `Access Control`, add the following to the `docs` array:

```js
docs: [
  // ...
  {
    type: 'category',
    label: 'Coffee Drinks',
    collapsed: true,
    items: [
      // Add the IDs of your new category's pages here
      'coffee-drinks/intro',
    ],
  }
]
```

### Setting redirects

If you are changing the path of a page, you will need to add a redirect to the `netlify.toml` file. For example, if you are changing the path of `docs/tea-drinks/intro.md` to `docs/tea-drinks/tea-drinks-intro.md`, you will need to add the following to the `netlify.toml` file:

```toml
[[redirects]]
  from = "/docs/tea-drinks/intro"
  to = "/docs/tea-drinks/tea-drinks-intro"
  status = 301
  force = false
```