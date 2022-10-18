---
sidebar_position: 2
---

# Installation

Create a new yarn project:

```
yarn init
```

Add the Lit Ceramic SDK package:

```
yarn add lit-ceramic-sdk
```

## Import the SDK

Within your main Typescript file (in the example, `app.ts`)
```
import { Integration } from 'lit-ceramic-sdk'
```

Create a new Integration that runs upon startup and is accessible where you intend to do encryptAndWrite or readAndDecrypt operations. Pass your Ceramic RPC URL and the chain you wish to use: 
```
let litCeramicIntegration = new Integration("https://ceramic-clay.3boxlabs.com", "ethereum")
```

## Instantiating the Lit Client

Start the Lit Client when the DOM is loaded, or early on in the lifecycle: 
```
litCeramicIntegration.startLitClient(window)
```

##

# Encrypting

First the string will need to be encrypted using the Lit Ceramic SDK.

Set access control conditions, in this example the access is for any wallet that holds a minimum of 0.000001 ETH.

```
  const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: 'ethereum',
      method: 'eth_getBalance',
      parameters: [':userAddress', 'latest'],
      returnValueTest: {
        comparator: '>=',
        value: '1000000000000',  // 0.000001 ETH
      },
    },
  ]
  ```

```
const stringToEncrypt = 'This is what we want to encrypt on Lit and then store on ceramic'
const response = litCeramicIntegration
   .encryptAndWrite(stringToEncrypt, accessControlConditions)
   .then((streamID) => console.log(streamID))
```

This uses an example streamID and prints the secret value to the console.

Save the streamID, you'll need it to decrypt the message.

##

# Decrypting

In order to decrypt the string, pass in the streamID saved from the earlier encrypting step.

```
    const response = litCeramicIntegration.readAndDecrypt(streamID).then(
      (value) =>
        console.log(value)
    )
```

In the example code, the decryption element is update and displays the decrypted message. 

```
  (document.getElementById('decryption').innerText = value)
```
