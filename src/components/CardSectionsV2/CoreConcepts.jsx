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
        to="/v2/accessControl/intro"
      />
      <Card
        title="📡 Programmable Key Pairs"
        description="Learn about programmable wallets that can read and write from any HTTP endpoint, blockchain, state machine, or decentralized storage system."
        to="/v2/pkp/intro"
      />
      <Card
        title="📄 Lit Actions"
        description="Get started with Lit Actions to learn how to assign automated signing logic to PKPs"
        to="/v2/litActions/intro"
      />
      <Card
        title="💳 Distributed Cloud Wallets"
        description="Learn how you can leverage PKPs to create MPC wallets with support for Web2 authentication."
        to="/v2/pkp/authHelpers/overview"
      />
      <Card
        title="🧩 Use Cases"
        description="Learn about how you can integrate Lit infrastructure within your own products."
        to="/v2/usecases"
      />
    </Section>
  );
}
