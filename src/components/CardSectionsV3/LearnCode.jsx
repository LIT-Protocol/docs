import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function LearnCodeSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="👐 Open Source Examples"
        description="More examples to get you started."
        to=""
      />
      <Card
        title="📖 API Documentation"
        description="Discover all the functions available in the Lit SDK."
        to="https://js-sdk.litprotocol.com/"
      />
      <Card
        title="📃 Lit Actions SDK Documentation"
        description="Discover all the functions that can be used inside a Lit Action."
        to="https://actions-docs.litprotocol.com/" 
      />
      <Card
        title="🛠 Tools"
        description="Additional tools to help build with Lit."
        to="/v3/tools/access-control" 
      />
    </Section>
  );
}
