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
        description="Learn about setting on-chain conditions to control who can access your content."
        to="/coreConcepts/accessControl/intro"
      />
      <Card
        title="📡 Programmable Key Pairs"
        description="Learn about programmable wallets that can read and write from any HTTP endpoint, blockchain, state machine, or decentralized storage system."
        to="/coreConcepts/LitActionsAndPKPs/PKPs"
      />
      <Card
        title="🏃‍♂️ Lit Actions"
        description="Learn about Javascript functions that utilize the threshold cryptography that powers Lit."
        to="/coreConcepts/LitActionsAndPKPs/litActions"
      />
    </Section>
  );
}
