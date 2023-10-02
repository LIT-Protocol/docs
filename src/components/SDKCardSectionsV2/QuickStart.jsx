import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function QuickStartSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="Installation"
        description="How to load the Lit JS SDK."
        to="../sdk/explanation/installation"
      />
      <Card
        title="Open Source Projects"
        description="View a list of open source projects that implement the Lit JS SDK."
        to="../sdk/examples"
      />
      <Card
        title="Wallet Signatures and Authorization"
        description="Understand the required format of wallet signatures."
        to="../sdk/explanation/authentication/authSig"
      />
    </Section>
  );
}