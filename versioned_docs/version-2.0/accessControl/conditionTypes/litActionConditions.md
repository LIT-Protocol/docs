---
sidebar_position: 4
---

# Lit Action Conditions

You can create a Lit Action Condition to grant access whenever a given Lit Action returns true. Lit Actions are JS code that can be executed on the Lit Protocol network. You can use Lit Actions to create custom access control conditions.

:::note

**Serrano Testnet Only**

This feature currently only works on the Serrano Testnet. Be sure to install the latest version of the Lit JS SDK V2, and connect to the Serrano Testnet.

:::

## Lit Action must return true

Suppose you wanted to make a Lit Action that returns true if the forecast temperature is below 40 degrees. You could use this to create a document that can only be decrypted when it's cold out.

This would be your Lit Action code, and is where you choose your conditions. You can talk to any API here:

```js
const go = async (maxTemp) => {
  const url = "https://api.weather.gov/gridpoints/LWX/97,71/forecast";
  try {
    const response = await fetch(url).then((res) => res.json());
    const nearestForecast = response.properties.periods[0];
    const temp = nearestForecast.temperature;
    return temp < parseInt(maxTemp);
  } catch (e) {
    console.log(e);
  }
  return false;
};
```

Save the above code to IPFS.

In this example, the Lit Action is on IPFS with the CID "QmcgbVu2sJSPpTeFhBd174FnmYmoVYvUFJeDkS7eYtwoFY". The below condition will run the `go()` function of the Lit Action, and check if the return value is true. It will pass a parameter of 40 to the `go()` function. Note that all parameters must be strings so you must use `parseInt()` to convert the string to a number to check it against the forecast temperature.

```js
var accessControlConditions = [
  {
    contractAddress: "ipfs://QmcgbVu2sJSPpTeFhBd174FnmYmoVYvUFJeDkS7eYtwoFY",
    standardContractType: "LitAction",
    chain: "ethereum",
    method: "go",
    parameters: ["40"],
    returnValueTest: {
      comparator: "=",
      value: "true",
    },
  },
];
```

You can see a full working example of this here: https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/decrypt.js
