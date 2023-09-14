import EventListener from '/docs/tools/event-listener.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Event Listener and Single Node Execution

## Single Execution

For some use cases (such as making an API or RPC request), it may be desired to execute a Lit Action on a *single* node, as opposed to every node in the Lit Network in parallel.

Single execution is now enabled in the SDK by passing the `targetNodeRange` parameter after your `executeJS` function (i.e. 'executeJs({ targetNodeRange: 1 })'). You can pass 1-10 to specify the number of nodes the Lit Action should be executed on. The selection process for this is random, and the client can't choose which specific node runs it.

Single execution allows you to request that a Lit Action be *ran* by a single node, but you will still need to call 100% of the nodes and collect responses from at least two-thirds of them in order to *sign* a particular output. In order to return a signed value in single execution mode, you’ll need to use a “one-to-many” node call, which is not yet supported.


<EventListener/>
