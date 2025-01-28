import FeedbackComponent from "@site/src/pages/feedback.md";

# WebAssembly / WASM

## Overview

:::info
WebAssembly / WASM is currently only live on the Datil-Dev network.  Please reach out to us if you'd like to use it on another network.
:::

You can run WebAssembly / WASM within a Lit Action. This is useful if you want to run something other than JavaScript within a Lit Action.

# Example

This example loads some WebAssembly code that exposes an `add` function. It then calls this function with the arguments `123` and `456`, and sets the response to the result.  How to create a bundle with your WebAssembly code is beyond the scope of this documentation, but there are many guides online.  You are free to mix JS and WASM within a single Lit Action, as you can see in the example below.

```js
const wasmCode = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02,
  0x7f, 0x7f, 0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x61,
  0x64, 0x64, 0x00, 0x00, 0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01,
  0x6a, 0x0b,
]);
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule);
const { add } = wasmInstance.exports;
const sum = add(123, 456);
Lit.Actions.setResponse({ response: JSON.stringify({ sum }) });

```

