---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";


# Discord OAuth

The `@lit-protocol/lit-auth-client` package simplifies the implementation of social login in your web applications. It provides a `LitAuthClient` class, which you can use to initialize a provider for each supported social login method.

By default, Lit's social login providers use Lit's OAuth project. If you prefer to use your own OAuth project, you can pass a callback to the `signIn()` method to modify the URL as needed.

For more information about customization options, refer to our API documentation. The [LitAuthClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_auth_client_src.LitAuthClient.html) and [DiscordProvider](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_auth_client_src.DiscordProvider.html) classes are most relevant for this guide.
## Code Example

Below is a code example demonstrating how to implement Discord OAuth in your web application. This example:

1. Connects to the Lit network.
2. Initializes the LitAuthClient and DiscordProvider.
3. Checks if the user is already authenticated with Discord.
4. If not, it calls the `signIn()` method to begin the authentication flow.
5. Authenticates the user by calling the `authenticate()` method, which returns an `AuthMethod` object.

```jsx
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, ProviderType } from "@lit-protocol/constants";
import { LitAuthClient, DiscordProvider, getProviderFromUrl } from "@lit-protocol/lit-auth-client";

export const litDiscordOAuth = async () => {
  try {
    console.log("🔄 Connecting to the Lit network...");
    const litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilDev,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    console.log("🔄 Initializing LitAuthClient and DiscordProvider...");
    const litAuthClient = new LitAuthClient({
      litRelayConfig: {
        // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
        relayApiKey: "<Your Lit Relay Server API Key>",
      },
    });
    const discordProvider = litAuthClient.initProvider<DiscordProvider>(
      ProviderType.Discord
    );
    console.log("✅ Initialized LitAuthClient and DiscordProvider");

    if (getProviderFromUrl() !== "discord") {
      console.log("🔄 Signing in with Discord...");
      discordProvider.signIn();
      console.log("✅ Signed in with Discord");
    } else {
      console.log("🔄 Discord Sign-in Valid, authenticating...")
    }

    const authMethod = await discordProvider.authenticate();
    console.log("✅ Authenticated with Discord");

    console.log("**LOGGING FOR DEBUGGING PURPOSES, DO NOT EXPOSE**", authMethod);
  } catch (error) {
    console.error("Failed to connect to Lit Network:", error);
  }
};

```

The Lit Relay Server allows you to mint [Programmable Key Pairs (PKPs)](../../../pkps/overview.md) without incurring gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

With the `AuthMethod` object, you can mint or fetch PKPs associated with the authenticated Discord account. You can find these methods in the [DiscordProvider API documentation](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_auth_client_src.DiscordProvider.html).

If you are using the Lit Relay Server, you will need to request an API key [here](https://docs.Discord.com/forms/d/e/1FAIpQLSeVraHsp1evK_9j-8LpUBiEJWFn4G5VKjOWBmHFjxFRJZJdrg/viewform).


<FeedbackComponent/>

