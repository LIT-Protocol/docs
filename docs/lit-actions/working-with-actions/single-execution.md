---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Event Listener and Single Node Execution

## Single Execution

For some use cases (such as making an API or RPC request), it may be desired to execute a Lit Action on a *single* node, as opposed to every node in the Lit Network in parallel.

Single execution is now enabled in the SDK by passing the `targetNodeRange` parameter after your `executeJS` function (i.e. 'executeJs({ targetNodeRange: 1 })'). You can pass 1-10 to specify the number of nodes the Lit Action should be executed on. The selection process for this is random, and the client can't choose which specific node runs it.

Single execution allows you to request that a Lit Action be *ran* by a single node, but you will still need to call 100% of the nodes and collect responses from at least two-thirds of them in order to *sign* a particular output. In order to return a signed value in single execution mode, you’ll need to use a “one-to-many” node call, which is not yet supported.


## Event Listening

The Lit event listener allows you to create specific event-based triggers for executing Lit Actions. An example application is [automated portfolio rebalancing](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/) based on price movement and other pre-defined factors.

You can use this example [React app](https://event-listener.litgateway.com/) to play with the event listener and customize your own conditions. Development on the event listener is ongoing, the end goal being a versatile tool that can be used to set automations based on a variety of factors such as periodic time, webhooks, or another contract. 

It should be noted that the Event Listener is still a work in progress and more features will continue to be rolled out over time. We are hoping to get contributors to support this as an open source project, with the end goal of building a tool that people can use to set automations based on a variety of factors such as periodic time intervals, webhooks, or other contract interactions. If this sounds interesting to you, you can reach out to the team on [Discord](https://discord.com/invite/nm9aBG8z9w) or direct message us on [Lenster](https://lenster.xyz/u/litprotocol) or [Twitter](https://twitter.com/LitProtocol).

You can check the [latest progress](https://github.com/LIT-Protocol/lit-apps/tree/master/apps) of the project on our GitHub.