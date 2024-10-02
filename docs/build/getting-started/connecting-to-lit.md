# Connecting to Lit

## The LitNodeClient

The `LitNodeClient` is the main class for connecting your session to the Lit network. After initializing a `LitNodeClient` instance, you can use the `connect()` method to connect to the Lit network

Connection to the Lit network is required for much of Lit's functionality. This includes:

- Private decryption
- Decentralized computing
- Programmable Key Pairs (PKPs)

When initializing a `LitNodeClient` instance, you must provide a `LitNetwork` instance.

```tsx
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNetwork } from '@lit-protocol/constants';

const litNodeClient = new LitNodeClient({
litNetwork: LitNetwork.DatilDev,
debug: false
});

await litNodeClient.connect();
```

### The LitNetwork Constant
The `LitNetwork` constant contains the past and current Lit networks. Imported from the `@lit-protocol/constants` package, the `LitNetwork` constant can be used to help initialize a `LitNodeClient` instance. The `LitNetwork` constant is an enum, the current networks on the enumcan be found [here](https://v6-api-doc-lit-js-sdk.vercel.app/enums/constants_src.LitNetwork.html).

### LitNodeClient Flags
You have the option to pass flags to the `LitNodeClient` instance. These flags are used to configure the Lit network connection. You can find a complete list of flags at the [LitNodeClient Config](https://v6-api-doc-lit-js-sdk.vercel.app/interfaces/types_src.LitNodeClientConfig.html), but this example will show you the most common flags, `debug` and `storageProvider`.

#### Debug
The `debug` flag is used to enable or disable debug logging. When enabled, debug logs will be written to the console. This flag will only provide debug logs when executing in a Node.js environment. In a browser environment, the `debug` flag will be ignored.

#### StorageProvider
The `storageProvider` flag is used to configure the storage provider used by the Lit network. When provided, the session keypair will be stored in the provided storage. 

If not provided, a new session keypair will be generated each time the `LitNodeClient` is initialized.

When in a browser environment, the `storageProvider` flag will be ignored. The session keypair will be stored in the browser's local storage. TO clear the cached session keypair, you can use the `disconnectWeb3()` function.

### Disconnecting from the Lit Network
To disconnect from the Lit network, you can use the `disconnect()` method. This detaches Lit's listeners for contract changes and the network polling state.

### Additional Support
If running into any issues, providing the Lit team with your request ID can help us resolve the issue faster. 

In a Node.js environment, the request ID will be logged to the console when an error occurs. If this is not the case, you can enable debug logging by passing the `debug` flag to the `LitNodeClient` instance, and the request ID will be logged to the console.

In a browser environment, the request ID will be logged to the console when an error occurs. If this is not the case, finding the error in the `Network` tab of your browser's developer tools and scrolling to the bottom of the page will show the request ID.

### API Reference

To learn more about `LitNodeClient` properties and methods, visiting the [API Reference Docs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/core_src.LitCore.html).


### Code Example

A short code example of connecting to the Lit network with a `LitNodeClient` instance can be found inside of our developer guides repo [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/starter-guides). There is both a Node.js and a browser example.