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
        description="We are looking to support those who are building Lit-enabled apps and infrastructure."
        to="/Ecosystem/litGrants"
      />
      <Card
        title="🌐 Ambassador Program"
        description="Apply to be a Lit Ambassador."
        to="https://spark.litprotocol.com/become-a-lit-ambassador/"
      />
      <Card
        title="💻 Ecosystem RFPs"
        description="Learn about how you can contribute to Lit Protocol."
        to="https://litprotocol.notion.site/Lit-Request-for-Ecosystem-Proposals-ae3f31e7f32c413cbe0b36c2fe53378d"
      />
      <Card
        title="🧑‍💻 Request for Startups"
        description="Your invitation to build the decentralized Web with distributed cryptography."
        to="https://spark.litprotocol.com/request-for-startups/"
      />
      <Card
        title="👨‍👩‍👧‍👦 Community"
        description="Join the community through Discord, Twitter, and keep up to date with the community calendar."
        to="/Ecosystem/community"
      />
      <Card
        title="⛓️ Supported Blockchains"
        description="We currently support most EVM chains, Cosmos and Solana."
        to="/resources/supportedChains"
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
