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
        to="https://github.com/LIT-Protocol/awesome/blob/main/README.md"
      />
      <Card
        title="📖 SDK API Documentation"
        description="Discover all the functions available in the Lit SDK."
        to="https://v6-api-doc-lit-js-sdk.vercel.app/"
      />
      <Card
        title="📃 Lit Actions SDK Documentation"
        description="Discover all the functions that can be used inside a Lit Action."
        to="https://actions-docs.litprotocol.com/" 
      />
      <Card
        title="📄 V2 Docs"
        description="For accessing the Lit V2 docs (deprecated)."
        to="https://developer.litprotocol.com/api-reference/v2-sdk" 
      />
      <Card
        title="🛠 Tools"
        description="Additional tools to help build with Lit."
        to="/v3/tools/access-control" 
      />
    </Section>
  );
}
