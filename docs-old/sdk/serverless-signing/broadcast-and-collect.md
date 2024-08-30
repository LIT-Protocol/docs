import FeedbackComponent from "@site/src/pages/feedback.md";

# Broadcast and Collect Within an Action

## Overview

The `broadcastAndCollect` function let's you run an operation on every node in the Lit network, collect their responses, and aggregate them into a single data set. This is useful if you'd like to perform additional operations over their responses, such as calculating a median or average.

When you call this function, the responses from each node will be grouped together before being returned back to each node for further processing.

# Broadcasting and Collecting a fetch response

The following Lit Action uses `broadcastAndCollect` to fetch the forecast using the weather.gov API before combining the responses from each Lit node into a single array. 

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

