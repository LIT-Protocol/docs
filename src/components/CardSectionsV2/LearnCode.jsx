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
        to="/v2/toolsAndExamples/Integrations/bundlrxarweave"
      />
      <Card
        title="🪴 Ceramic x Lit SDK"
        description="Build a simple encryption and decryption application with Lit and Ceramic."
        to="/v2/toolsAndExamples/Integrations/Ceramic/intro"
      />
      <Card
        title="👐 Open Source Examples"
        description="More examples to get you started."
        to="/v2/sdk/examples"
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
        to="/v2/toolsAndExamples/tools/accessControl" 
      />
    </Section>
  );
}
