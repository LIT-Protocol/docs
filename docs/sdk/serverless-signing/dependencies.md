import FeedbackComponent from "@site/src/pages/feedback.md";

# Dependencies in Lit Actions

We preload some dependencies for you: 

* Ethers v5.7 is loaded and available via the global `ethers` object
* The jsonwebtoken library located here https://www.npmjs.com/package/jsonwebtoken is loaded and available via the global `jwt` object

:::note
You cannot use `require` or `import` to load other dependencies in Lit Actions except for pre-loaded dependencies like `ethers` and `jsonwebtoken`. If you need to use other dependencies, you can bundle them and upload the bundle as a single Lit Action file. 

Moreover, there is 5mb size limit on a Lit Action file. 
:::

## Adding your own dependencies

To add your own dependencies, you'll have to use a bundler, and provide the bundle as your Lit Action.  There's an example of how to do this using esbuild here, but you could use any bundler: https://github.com/LIT-Protocol/js-serverless-function-test/tree/main/bundleTests/siwe

## Built in functions

We provide a number of functions in the Lit.Actions.* namespace, to do things like call a contract or check an access control condition.  The API docs for this are located here: https://actions-docs.litprotocol.com/
<FeedbackComponent/>
