import FeedbackComponent from "@site/src/pages/feedback.md";

# Custom Auth Methods

If you would like further customization over your PKP auth methods, or want to add a new one not yet supported by Lit, you can do auth yourself with a Lit Action, using the auth helpers we provide (see below). In this scenario, after you give your Lit Action permission to use the PKP, the typical flow is to burn the PKP NFT or send it to itself. It is important to note, if you do decide to burn the PKP, you will be unable to add additional auth methods in the future. 

Your custom auth will basically look like a bunch of if statements inside a Lit Action.

## How does authentication differ from authorization?

For custom auth, you may implement your own Authentication or Authorization, or both.  

Authentication refers to confirming a users identity.  This generally involves resolving some kind of auth material (an JWT, auth token, etc).  You can use any of Lit's built in Auth Methods, and we will handle the Authentication step for you, so that you only have to implement Authorization.  See the "Custom Authentication" section below for more info.

Authorization refers to confirming that a user is allowed to use a PKP.  Specifically, it's checking the permissions of a PKP and making sure that the user that was Authenticated is also authorized to use a PKP.  

Note: Currently, a [Session Signature](../../../../sdk/authentication/session-sigs/intro.md), is **always required** to communicate with the Lit nodes and make a request to the network. It doesn't matter if you are decrypting a piece of data or calling a Lit Action, a Session Sig will always be required.

The flow for using an auth method already supported by lit, with custom Authorization, is as follows:

1. Present a PKP public key and an auth token from an authorized auth method (like a Google OAuth JWT), as well as a session public key for a local key-pair that is generated and stored locally.
2. The PKP is used to sign a SIWE signature which authorizes the session key-pair going forward.
3. The Lit SDK will use the session key to sign future requests. So instead of signing the session key-pair with a wallet, you can sign it using the PKP by communicating with the Lit nodes and presenting proof that you are authorized.

## Authentication Helpers

Inside of your Lit Actions, there is an object called `Lit.Auth` that will be pre-populated with the resolved Auth Methods, and a few other items.  If you're using an Auth Method already supported by Lit, then Lit can handle the Authentication for you. For example, if you pass a Google Oauth Token, then the Lit Nodes will resolve the Oauth Token into a user ID and application ID and those will be available to you in `Lit.Auth`. `Lit.Auth` has the following members:

- actionIpfsIds: An array of IPFS IDs that are being called by this Lit Action. This will typically only have a single item, but if you call multiple Lit Actions from inside your Lit Action, they will all be included here. For example, if you have two Lit Actions, A, and B, and A calls B, then the first item in the array will be A and the last item will be B. Therefore, the last item in the array is always the IPFS ID of the Lit Action that is currently running.
- authSigAddress: A verified wallet address, if one was passed in. This is the address that was used to sign the AuthSig.
- authMethodContexts: An array of auth method contexts. Each entry will contain the following items: `userId`, `appId`, and `authMethodType`. A list of AuthMethodTypes can be found [here](./overview.md) in the docs.

Important to note on Authentication Helpers: authorization is not included. This means that a user can present a Google oAuth JWT as an auth method to be resolved and validated by your Lit Action. The Action will then stick the result inside the Lit.Auth object. In this case, the result would be the users verified google account info like their user id, email address, and more.

## Example: Setting Authentication Context with Lit Actions

This example shows how to check different auth methods for a PKP using a Lit Action.  It sends in a auth token from Google, and Lit resolves this for you and puts it into the Lit.Auth object.  This example returns this Lit.Auth object as a response so you can inpsect it and learn it's schema.

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})
};

go();
`;

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    authMethods: [
      // {
      //   // discord oauth
      //   accessToken: "M1Y1WnYnavzmSaZ6p1LBLsNFn2iiu0",
      //   authMethodType: 4,
      // },
      // {
      //   // google oauth
      //   accessToken:
      //     "ya29.a0Aa4xrXMCyLStBQzLhC8il8YRPXIkEEgno9nB4PKvjCi6oIu-uIjeIoyfQoR99TcZf0IUMPfJfjRIJyIXtLk_kXLa5BmdUyJcJGP8SB4-UjlebOILidfItC8KR1sQR9LSFX55cw3_GTa5IqCOCTXME38z5ZMZaCgYKATASARASFQEjDvL9HinQH3Mk1UclCD011YbLfQ0163",
      //   authMethodType: 5,
      // },
      // {
      // email / sms
      //   accessToken: "eyJhbGciOiJzZWNwMjU2azEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJMSVQtUHJvdG9jb2wiLCJzdWIiOiJMSVQtT1RQIiwiaWF0IjoxNjgzMjIzNjIyMDg5LCJleHAiOjE2ODMyMjU0MjIwODksIm9yZ0lkIjoiTElUIiwicm9sZSI6InVzZXIiLCJleHRyYURhdGEiOiIrMTIwMTQwNzIwNzN8MjAyMy0wNS0wNFQxODowNzowMi4wODkxODgrMDA6MDAifQ.eyJyIjoiOTRiOWE1ODkyODFlYzdlYmZlZTdjOGRjMjU0YTk1NGY5NjY1N2IzZmRkNmFlMWIwZThmMmY1OWIxMWYwNTU1YSIsInMiOiI0NWNlNTA0YTBkZjFlZWFkMWYxMGIyYTQ1MjU4ZjlhOTI5ZTY5ODYzYjIzNDdlZGViMmRkODMxM2Y4NDVhNDA1In0"
      //   authMethodType: 7,
      // }
      {
        // google oauth JWT
        accessToken:
          "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3Y2MwZWY0YzcxODFjZjRjMGRjZWY3YjYwYWUyOGNjOTAyMmM3NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5OTYwNTQyNzMzNjA1NjgxMzIiLCJlbWFpbCI6ImdldmVuc3RlZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlVYV1Z1eEJsdGswcEhKclllOEFXTUEiLCJpYXQiOjE2NjcxNjgyMTUsImV4cCI6MTY2NzE3MTgxNX0.ejZu5bADJ6cUsovV7otHAafy0mqWZBAtN860jvBdVe38XUi0v-eB5WWBPMD5zXcJxbXFvaPWCX8nTaE6S24cNNHJw0hq15irjRZeg9D2i7ToitR1LZSQ3rPCDQZPX4xYn7G-FH7C1DQ-7NEDMmr9ge4B6Qs4pT5Mj8ESVlA29yZjKCfk-zL7F5b6W0EOIA6G9rj6-3HgtazkHfIGHAtfBz4dqHjC4HJncHJzqIm9Y8eSBBnN-ZhYUr3cWxGCuFIw3yrGccv5_khfhbbk6TqdSeMO9YNWN3otiVB8Nwu2sb9VsllFoHIE0uGSzVZVbJgSK1GsGbJZe76ubLuObI5YFw",
        authMethodType: 6,
      },
    ],
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: ethers.utils.arrayify(
        ethers.utils.keccak256([
          72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
        ])
      ),
      publicKey:
        "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
      sigName: "sig1",
    },
  });
  console.log("results: ", JSON.stringify(results.response, null, 2));
};

runLitAction();
```

## Custom Authentication

Inside your Lit Action, you need to confirm your users identity.  For example, if you were implementing Roblox authentication, which uses Oauth 2.0, you would get an access token from the Roblox API.  You would then send this to your Lit Action, which would send it to the Roblox servers, which would validate it and send back the validated user info like their Roblox User ID.  At this point, you can perform Authorization to check that the user is allowed to use the PKP they want to use.

## Custom Authorization

Inside your Lit Action, you need to confirm that your user has permissions to use a given PKP with their authenticated identity.

If you decide to use your own auth, you can still use the PKPPermissions contract to define your method(s) of choice, or deploy your own access control contract.  You could also use any centralized database or other blockchain as the "database" to store the permissions for the PKP.  Your permissions database must be accessible via fetch() or must live on-chain in one of the chains supported by Lit.

If you use the deployed Lit PKPPermissions contract, then it is important to pick a unique authMethodType that isn't used by anyone else, ever. Since it can be a uint256, you should do something like `sha256("some unique or random string")` to pick a unique authMethodType number. You can find the current methods being used [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/lit-node/PKPPermissions.sol). If this is the route you choose, you could check the PKPPermissions contract in your Lit Action using [this function](https://actions-docs.litprotocol.com/#getpermittedauthmethods).


## Steps to implement both custom authentication and authorization

1. Get your user's identity material.  For example, if you were implementing Roblox Oauth, this would be your user's Roblox user id.  
2. Get your user a PKP.  You can use the open source Lit relayer for this, which is documented [here](../../minting/via-contracts#minting-pkps-using-the-lit-relayer).  You can use our hosted relayer or run your own.  You will supply the identity material (like their Roblox user id, for example) when minting the PKP.  You should hash the identity material before sending it to the relayer, to provide some privacy for your users and prevent people from checking the chain to find your users.  Minting a PKP with the relayer will atomically mint a new PKP and create an entry in the PKPPermissions contract to authorize that user to use that PKP.
3. Write a Lit Action for your custom authentication and authorization, which is documented further below.

### Writing a Lit Action for custom authentication and authorization

In your Lit action, you first need to authenticate your user and resolve their identity material.  For example, if you were implementing Roblox Oauth 2.0 auth, you would be taking their Roblox Access Token and sending it to the Roblox servers, which would validate it and return the user's Roblox user id.

You can do this using fetch() inside your Lit Action to talk to the Roblox servers.

Next, you need to authorize your user and that they are permitted to use the PKP they want to use.  You can do this however you want, including using a centralized database available via fetch().  If you choose to use our PKPPermissions contract as documented above, you will be able to use the `Lit.Actions.getPermittedAuthMethods()` function to get all the permitted auth methods for the PKP.  This is documented [here](https://actions-docs.litprotocol.com/#getpermittedauthmethods).  

At this point, you should check the array returned by `getPermittedAuthMethods()` to see if your user's identity material (for example, a Roblox user id) is present.  Remember - you should have hashed their user id when you minted the PKP, so you should hash it here too before comparing it to the elements in the `getPermittedAuthMethods()` array.  

If you find a match in the array, then you know the user is permitted to use the PKP, and you can proceed with signing or whatever else you want to do.
<FeedbackComponent/>
