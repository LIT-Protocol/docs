import FeedbackComponent from "@site/src/pages/feedback.md";

# Broadcast and Collect Within an Action

:::info
Only available on the `test` network
:::

## Overview

Broadcast and collect allows you to run an operation on each node in the Lit network, collect their responses, and aggregate those responses into a single data set shared across all of the nodes. This is useful if you'd like the ability to perform additional operations over their responses, such as calculating a median or average.

When you call this function, the responses from each node will be grouped and then returned back to each node for further processing.

# Broadcasting and Collecting a fetch response

```js
const code = `(async () => {
  const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
  const resp = await fetch(url).then((response) => response.json());
  const temp = resp.properties.periods[0].temperature;

  const temperatures = await Lit.Actions.broadcastAndCollect({
    name: "temperature",
    value: temp,
  });

  // at this point, temperatures is an array of all the values that all the nodes got
  const median = temperatures.sort()[Math.floor(temperatures.length / 2)];
  Lit.Actions.setResponse({response: median});
})();
`;

const client = new LitNodeClient({
    litNetwork: "datil-dev",
});
await client.connect();
const res = await client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
      publicKey: "<your pkp public key>",
      sigName: 'fooSig',
    }
});

console.log("response from broadcast and collecting within a lit action: ", res);
```

