import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function ResourcesSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="API Documentation"
        description="Production branch SDK API documentation."
        to="https://lit-protocol.github.io/lit-js-sdk/api_docs_html/"
      />
      <Card
        title="Programmable Key Pair API Documentation"
        description="Serrano branch API docs. View the full list of functions available."
        to="https://serrano-sdk-docs.litprotocol.com/#welcome"
      />
      <Card
        title="Lit Actions API Documentation"
        description="View the full list of functions available within the Lit Actions SDK."
        to="https://actions-docs.litprotocol.com/"
      />
    </Section>
  );
}