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
        description="Learn about setting on-chain conditions to control who can access content"
        to="/AccessControlConditions/intro"
      />
      <Card
        title="📡 Programmable Key Pairs"
        description="Learn about programmable wallets that can read and write from any HTTP endpoint, blockchain, state machine, or decentralized storage system"
        to="/LitActionsAndPKPs/whatAreLitActionsAndPKPs"
      />
      <Card
        title="🏃‍♂️ Lit Actions"
        description="Learn about Javascript functions that utilize the threshold cryptography that power Lit"
        to="/LitActionsAndPKPs/whatAreLitActionsAndPKPs#what-are-lit-actions"
      />
    </Section>
  );
}
