import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function CodebreakerSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="Coming soon"
        description="Build with Lit: access control, encryption, and programmatic signing."
        to=""
      />
    </Section>
  );
}
