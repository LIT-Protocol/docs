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
        to="/coreConcepts/accessControl/intro"
      />
      <Card
        title="📡 PKPs and Lit Actions"
        description="Learn about programmable wallets that can read and write from any HTTP endpoint, blockchain, state machine, or decentralized storage system."
        to="/coreConcepts/LitActionsAndPKPs/intro"
      />
      <Card
        title="🧩 Use Cases"
        description="Learn about how you can integrate Lit infrastructure within your own products."
        to="/coreConcepts/usecases"
      />
    </Section>
  );
}
