import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Add Auth Method

Lit supports a variety of authentication methods for minting and authenticating access to PKPs. This is done through the authentication of JWT/oAuth tokens through Lit's Relay server.

The supported authentication methods can be categorized into four types: Social Auth, Stytch OTP, WebAuthn, and Custom Auth. This guide will only cover the first three types. If you are interested in creating a custom authentication method, please refer to the [Custom Auth Method](./add-custom-auth-method.md) guide.

## Installation with npm or yarn

The `@lit-protocol/lit-node-client` package provides the `LitNodeClient` class, which is used to interact with the Lit network.

The `@lit-protocol/lit-auth-client` package provides the `LitAuthClient` class, which is used to interact with the Lit Relay server. To use the `LitAuthClient`, you will need an API key for Lit's Relay server. If you do not have one, you can request one [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

The `@lit-protocol/constants` package provides the `ProviderType` enum, which is used to specify the type of authentication method.

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install @lit-protocol/lit-node-client @lit-protocol/lit-auth-client @lit-protocol/constants
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/lit-node-client @lit-protocol/lit-auth-client @lit-protocol/constants
```

</TabItem>
</Tabs>


## Social Auth

Social auth methods are methods that rely on a user's existing social account. Lit currently supports Google and Discord OAuth, creating an `AuthMethod` with the provided oAuth token. 

### Google OAuth

A complete code example can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/andrew/account-abstraction/account-abstraction/google).

<details>
<summary>Click here to see a simple function that generates an AuthMethod</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, ProviderType } from "@lit-protocol/constants";
import { LitAuthClient, GoogleProvider, getProviderFromUrl } from "@lit-protocol/lit-auth-client";

export const litGoogleOAuth = async () => {
  try {
    console.log("🔄 Connecting to the Lit network...");
    const litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilDev,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    console.log("🔄 Initializing LitAuthClient and GoogleProvider...");
    const litAuthClient = new LitAuthClient({
      litRelayConfig: {
        relayApiKey: "<Your Lit Relay Server API Key>",
      },
    });
    const googleProvider = litAuthClient.initProvider<GoogleProvider>(
      ProviderType.Google
    );
    console.log("✅ Initialized LitAuthClient and GoogleProvider");

    if (getProviderFromUrl() !== "google") {
      console.log("🔄 Signing in with Google...");
      googleProvider.signIn();
      console.log("✅ Signed in with Google");
    } else {
      console.log("🔄 Google Sign-in Valid, authenticating...")
    }

    const authMethod = await googleProvider.authenticate();
    console.log("✅ Authenticated with Google");

    console.log("**LOGGING FOR DEBUGGING PURPOSES, DO NOT EXPOSE**", authMethod);
  } catch (error) {
    console.error("Failed to connect to Lit Network:", error);
  }
};

```
</p>
</details>

### Discord OAuth

A complete code example can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/andrew/account-abstraction/account-abstraction/discord).

<details>
<summary>Click here to see a simple function that generates an AuthMethod</summary>
<p>

```ts
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
        relayApiKey: "<Your Lit Relay Server API Key>",
      },
      litNodeClient,
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
</p>
</details>

## Stytch OTP

Lit uses [Stytch](https://stytch.com/) to simplify user authentication and allow for SMS, email, WhatsApp, and TOTP authentication. The creation of an `AuthMethod` with Stytch will require you to create an account with Stytch, create a project, and retrieve the Project ID and Public Token through the [Stytch Dashboard](https://stytch.com/dashboard).

### Email OTP

A complete code example can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/andrew/account-abstraction/account-abstraction/stytch-email).

<details>
<summary>Click here to see a simple function that generates an AuthMethod</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, ProviderType } from "@lit-protocol/constants";
import { LitAuthClient, StytchOtpProvider } from "@lit-protocol/lit-auth-client";
import { StytchUIClient } from "@stytch/vanilla-js";

const STYTCH_PUBLIC_TOKEN = "<Your Stytch Public Token>";
const STYTCH_PROJECT_ID = "<Your Stytch Project ID>";

const stytchEmailAuth = async () => {
  const client = new StytchUIClient(STYTCH_PUBLIC_TOKEN);

  const emailResponse = prompt("Enter your email address");

  console.log("🔄 Requesting email OTP from Stytch...");
  const stytchResponse = await client.otps.email.loginOrCreate(emailResponse!);
  console.log("✅ Sent email OTP request to Stytch");

  const otpResponse = prompt("Enter the code sent to your email:");

  console.log("🔄 Authenticating with Stytch...");
  const authResponse = await client.otps.authenticate(
    otpResponse!,
    stytchResponse.method_id,
    {
      session_duration_minutes: 60,
    }
  );
  console.log("✅ Authenticated with Stytch");

  console.log("🔄 Connecting to the Lit network...");
  const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    debug: false,
  });

  await litNodeClient.connect();
  console.log("✅ Connected to the Lit network");

  console.log("🔄 Initializing LitAuthClient...");
  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      relayApiKey: "<Your Lit Relay Server API Key>",
    },
    litNodeClient,
  });
  console.log("✅ Initialized LitAuthClient");

  console.log("🔄 Initializing Stytch Provider...");
  const stytchProvider = litAuthClient.initProvider<StytchOtpProvider>(
    ProviderType.StytchEmailFactorOtp,
    {
      userId: authResponse.user_id,
      appId: STYTCH_PROJECT_ID!,
    }
  );
  console.log("✅ Initialized Stytch Provider");

  console.log("🔄 Authenticating with Stytch Email OTP...");
  const authMethod = await stytchProvider.authenticate({
    accessToken: authResponse.session_jwt,
  });
  console.log("✅ Authenticated with Stytch Email OTP");

  console.log("**LOGGING FOR DEBUGGING PURPOSES, DO NOT EXPOSE**", authMethod);
};
```

</p>
</details>

### SMS OTP

A complete code example can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/andrew/account-abstraction/account-abstraction/stytch-sms).

<details>
<summary>Click here to see a simple function that generates an AuthMethod</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, ProviderType } from "@lit-protocol/constants";
import { LitAuthClient, StytchOtpProvider } from "@lit-protocol/lit-auth-client";
import { StytchUIClient } from "@stytch/vanilla-js";

const STYTCH_PUBLIC_TOKEN = "<Your Stytch Public Token>";
const STYTCH_PROJECT_ID = "<Your Stytch Project ID>";

const stytchSmsAuth = async () => {
  const client = new StytchUIClient(STYTCH_PUBLIC_TOKEN);

  const phoneNumber = prompt("Enter your phone number (format: +12345678910):");

  console.log("🔄 Requesting SMS OTP from Stytch...");
  const stytchResponse = await client.otps.sms.loginOrCreate(phoneNumber!);
  console.log("✅ Sent SMS OTP request to Stytch");

  const otpResponse = prompt("Enter the code sent to your phone:");

  console.log("🔄 Authenticating with Stytch...");
  const authResponse = await client.otps.authenticate(
    otpResponse!,
    stytchResponse.method_id,
    {
      session_duration_minutes: 60,
    }
  );
  console.log("✅ Authenticated with Stytch");

  console.log("🔄 Connecting to the Lit network...");
  const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    debug: true,
  });

  await litNodeClient.connect();
  console.log("✅ Connected to the Lit network");

  console.log("🔄 Initializing LitAuthClient...");
  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      relayApiKey: "<Your Lit Relay Server API Key>",
    },
    litNodeClient,
  });
  console.log("✅ Initialized LitAuthClient");
  
  console.log("🔄 Initializing Stytch Provider...");
  const stytchProvider = litAuthClient.initProvider<StytchOtpProvider>(
    ProviderType.StytchSmsFactorOtp,
    {
      userId: authResponse.user_id,
      appId: STYTCH_PROJECT_ID!,
    }
  );
  console.log("✅ Initialized Stytch Provider");

  console.log("🔄 Authenticating with Stytch SMS OTP...");
  const authMethod = await stytchProvider.authenticate({
    accessToken: authResponse.session_jwt,
  });
  console.log("✅ Authenticated with Stytch SMS OTP");

  console.log("**LOGGING FOR DEBUGGING PURPOSES, DO NOT EXPOSE**", authMethod);
};
```

</p>
</details>

## WebAuthn

Through using the `@simplewebauthn/browser` package, you can create an `AuthMethod` with WebAuthn. This can be used to create passkeys that users can store in the browsers, on their devices, or even on a physical security key.

<details>
<summary>Click here to see a simple function that generates an AuthMethod</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, ProviderType } from "@lit-protocol/constants";
import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";

export const litWebAuthnOAuth = async () => {
  try {
    console.log("🔄 Connecting to the Lit network...");
    const litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilDev,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    console.log("🔄 Initializing LitAuthClient and WebAuthnProvider...");
    const litAuthClient = new LitAuthClient({
      litRelayConfig: {
        relayApiKey: "<Your Lit Relay Server API Key>",
      },
      litNodeClient,
    });
    const webAuthnProvider = litAuthClient.initProvider<WebAuthnProvider>(
      ProviderType.WebAuthn
    );
    console.log("✅ Initialized LitAuthClient and WebAuthnProvider");

    console.log("🔄 Acquiring passkey options...");
    const options = await webAuthnProvider.register();
    console.log("✅ Acquired passkey options");

    console.log("🔄 Creating passkey and minting PKP...");
    const txHash = await webAuthnProvider.verifyAndMintPKPThroughRelayer(options);
    console.log("✅ Created passkey and minted PKP:", txHash);

    console.log("🔄 Authenticating with passkey...");
    const authMethod = await webAuthnProvider.authenticate();
    console.log("✅ Authenticated with passkey");

    console.log("**LOGGING FOR DEBUGGING PURPOSES, DO NOT EXPOSE**", authMethod);
  } catch (error) {
    console.error("Failed to connect to Lit Network:", error);
  }
};
```

</p>
</details>

A complete code example can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/andrew/account-abstraction/account-abstraction/webauthn).

:::info
Please install `v10.0.0` of the `@simplewebauthn/browser` package. Later versions are not supported.
:::

# Learn More

If none of these authentication methods fit your needs, please check out the [Custom Auth Method](./add-custom-auth-method.md) guide.