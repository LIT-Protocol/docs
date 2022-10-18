import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function LearnCodeSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="🧶 Arweave / Bundlr Guide"
        description="Encrypt data using Lit and upload it to Arweave using Bundlr."
        to="/ToolsAndExamples/Integrations/bundlrxarweave"
      />
      <Card
        title="🪴 Ceramic x Lit SDK"
        description="Build a simple encryption and decryption application with Lit and Ceramic."
        to="/ToolsAndExamples/Integrations/Ceramic/intro"
      />
      <Card
        title="👐 Open Source Examples"
        description="Browse projects building with Lit."
        to="/SDK/examples"
      />
      <Card
        title="📖 API Documentation"
        description="Discover all the functions available in the SDK."
        to="https://lit-protocol.github.io/lit-js-sdk/api_docs_html/"
      />
      <Card
        title="🛠 Tools & Integrations"
        description="Additional tools and integrations to ease into building with Lit."
        to="/ToolsAndExamples/Integrations/additionalIntegrations" 
      />
    </Section>
  );
}
