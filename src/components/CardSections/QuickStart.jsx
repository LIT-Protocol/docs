import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function QuickStartSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="👩‍💻 Installing the Lit JavaScript SDK"
        description="Set up the SDK within your local environment."
        to="/SDK/Explanation/installation"
      />
      <Card
        title="👋 Hello World"
        description="Create your first Lit-enabled application using Lit Actions."
        to="/SDK/Explanation/litActions#hello-world"
      />
      <Card
        title="📁 Encrypting On-Chain Metadata (Polygon)"
        description="Encrypt on-chain meta-data (an NFT description) using the Lit SDK."
        to="/toolsAndExamples/SDKExamples/onchainMetadata/introduction"
      />
    </Section>
  );
}
