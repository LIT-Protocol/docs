import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function QuickStartSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="👩‍💻 Install the Lit JavaScript SDK"
        description="Set up the SDK within your local environment."
        to="/v3/sdk/installation"
      />
      <Card
        title="⌨️ Encrypt and Decrypt Content"
        description="Learn how to encrypt data for private storage on the open web."
        to="/v3/sdk/access-control/encryption"
      />
    </Section>
  );
}
