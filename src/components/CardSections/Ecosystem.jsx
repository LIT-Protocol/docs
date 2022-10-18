import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function EcosystemSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="💸 Grants"
        description="Looking to extend what you're already building with Lit? Apply for a grant!"
        to="/ecosystem/litGrants"
      />

      <Card
        title="👨‍👩‍👧‍👦 Community"
        description="Join the community through Discord, Twitter, and keep up to date with the community calendar."
        to="/ecosystem/community"
      />
      <Card
        title="⛓️ Supported Blockchains"
        description="We currently support most EVM chains, Cosmos and Solana."
        to="/support/supportedChains"
      />
    </Section>
  );
}

/** TODO: Add in this section once Tools and Integrations have their separate landing spots
 *    <Card
        title="Integrations"
        description="Integration SDKs to make building easier"
        to="/guides/integrating-with-webhooks"
      />
 */
