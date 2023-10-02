# Event Listener

 <iframe width="640" 
         height="480" 
         src="https://www.youtube.com/embed/gcT8Bp5oepo" 
         title="Event Listener with Lit Protocol - Automate Web3 Signing" 
         frameborder="0" 
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
         allowfullscreen>
 </iframe>


The [Lit event listener](https://github.com/DIGITALAX/LitListenerSDK) allows you to create specific event-based triggers for executing Lit Actions.

The SDK is designed around the principle of conditionally pre-approved chain reactions with account abstraction. This series of actions encrypted, conditional, often on-chain, can be chained together to trigger complex strategies.

With the SDK, you'll be able to set three core condition functions: webhooks, on-chain events, and intervals.

1. Webhooks
Webhooks are automated messages sent from apps triggered by user defined behavior. The event listener SDK is designed to query (request) and monitor information from specific APIs. In a blockchain context, this might include tracking price changes of a specific cryptocurrency or updates from a decentralized app.

2. On-Chain Events
The SDK allows you to set up listeners for specific events occurring on the blockchain, like a contract being executed or a new block being added. By subscribing to these events, you're telling the SDK to keep an eye on particular occurrences within blockchain networks.

3. Intervals
Intervals within the SDK act as the timing mechanism that governs how frequently the SDK checks the webhooks and on-chain events. By setting intervals, you determine how often the SDK will check for updates in the specified webhooks or on-chain events. If you need real-time reaction, you might set a short interval, whereas a less time-sensitive circuit might have longer intervals.

## Node Code Platform
![No Code Platform image](/img/event_listener_no_code.png)
Looking to automate signing with Lit Actions, without minimal code? Check out [this platform](https://listener.irrevocable.dev/) that utilizes the event listener SDK. 


Event listener SDK brought to you by [DIGITALAX](https://github.com/DIGITALAX). Read the [documentation](https://docs.irrevocable.dev/) to learn more.
