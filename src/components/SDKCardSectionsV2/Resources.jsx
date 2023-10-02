import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function ResourcesSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="Lit JS SDK Latest API Documentation"
        description="Lit JS SDK Latest API documentation."
        to="https://js-sdk.litprotocol.com/index.html"
      />
      <Card
        title="Lit Actions API Documentation"
        description="View the full list of functions available within the Lit Actions SDK."
        to="https://actions-docs.litprotocol.com/"
      />
    </Section>
  );
}