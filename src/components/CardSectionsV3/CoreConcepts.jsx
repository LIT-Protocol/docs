import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function CoreConceptsSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="🔐 Access Control & Encryption"
        description="Learn about setting on-chain conditions to manage access to your private data."
        to="/docs/sdk/access-control/intro"
      />
      <Card
        title="🔑 User Wallets"
        description="Deploy programmable user wallets that makes user onboarding seamless and secure."
        to="/docs/user-wallets/overview"
      />
      <Card
        title="🖋️ Serverless Signing"
        description="Build powerful serverless functions that can read and write from any HTTP endpoint, blockchain, state machine, or decentralized storage system."
        to="/docs/sdk/serverless-signing/overview"
      />
    </Section>
  );
}
