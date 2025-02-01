import FeedbackComponent from "@site/src/pages/feedback.md";

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Fetch

## Prerequisites

- Familiarity with JavaScript
- Basic understanding of [serverless signing](../serverless-signing/quick-start.md)

## Overview
Unlike traditional smart contract ecosystems, Lit Actions can natively talk to the external world. This is useful for things like fetching data from the web, or sending API requests to other services.

The Lit Action below will get the current temperature from the [National Weather Service](https://www.weather.gov/) API, and ONLY sign a txn if the temperature is forecast to be **above 60 degrees F**. Since you can put this HTTP request and logic that uses the response directly in your Lit Action, you don't have to worry about using a 3rd party oracle to pull data in.

### How it works

The HTTP request will be sent out by all the Lit Nodes in parallel, and consensus is based on at least 2/3 of the nodes getting the same response. If less than 2/3 nodes get the same response, then the user can not collect the signature shares above the threshold and therefore cannot produce the final signature. Note that your HTTP request will be sent N times where N is the number of nodes in the Lit Network, because it's sent from every Lit Node in parallel. 

Be careful about how many requests you're making and note that this may trigger rate limiting issues on some servers.

## Example

### Lit Action code

:::note
`toSign` data is required to be in 32 byte format. 

The `ethers.utils.arrayify(ethers.utils.keccak256(...)` can be used to convert the `toSign` data to the correct format.
:::

```jsx
const litActionCode = `
const go = async () => {  
  const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
  const resp = await fetch(url).then((response) => response.json());
  const temp = resp.properties.periods[0].temperature;

  // only sign if the temperature is above 60.  if it's below 60, exit.
  if (temp < 60) {
    return;
  }
  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey , sigName });
};

go();
`;
```

### Execute Lit Action code on Lit nodes

```jsx
const runLitAction = async () => {
  const message = new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode('Hello world'))
  );

  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "datil-dev",
    debug: true,
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      toSign: message,
      publicKey:
        "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
      sigName: "sig1",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
```

## Using fetch() to write data
You can also use fetch() inside a Lit Action to write data, but you **must be careful** (because the HTTP request will be run N times where N is the number of Lit Nodes). On Datil networks, N is 10, so any fetch() request will be sent to the server 10 times.

**This is safe**, however, if the place you're writing the data to is *idempotent*. Idempotent means that applying the same operation over and over will not change the result. So for example, a SQL Insert is not idempotent, because if you run it 10 times, it will create 10 rows. On the other hand, a SQL Update is idempotent, because if you run it 10 times, it will only update the row once. So if you're using fetch() to write data, make sure the server you're writing to is idempotent.

### Lit Action code

```jsx
const runLitAction = async () => {
    if (day === "") {
      alert("Select a day first!");
      return;
    }

    const litActionCode = `
      const fetchWeatherApiResponse = async () => {
        const url = "https://api.weather.gov/gridpoints/LWX/97,71/forecast";
        let toSign;
        try {
          const response = await fetch(url).then((res) => res.json());
          const forecast = response.properties.periods[day];
          toSign = { temp: forecast.temperature + " " + forecast.temperatureUnit, shortForecast: forecast.shortForecast };
          const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
				} catch(e) {
          console.log(e);
        }
        LitActions.setResponse({ response: JSON.stringify(toSign) });
      };

      fetchWeatherApiResponse();
    `;

```

<FeedbackComponent/>
