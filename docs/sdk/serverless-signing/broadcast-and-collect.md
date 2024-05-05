import FeedbackComponent from "@site/src/pages/feedback.md";

# Broadcast and Collect Within an Action

## Overview

Within a Lit action, you may wish to run a specific operation on all nodes within the network and collect the responses for processing as a set of data from within the node's trusted execution enviorment (TEE). This is helpful if you wish to perform operations over the data as a set. Where all values are grouped and returned to every other node from within the lit action context.

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
    litNetwork: 'cayenne',
});
await client.connect();
const res = client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
      publicKey: "<your pkp public key>",
      sigName: 'fooSig',
    }
});

console.log("response from broadcast and collecting within a lit action: ", res);
```

