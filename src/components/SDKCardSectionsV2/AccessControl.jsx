import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function AccessControlSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="Encrypting Static Content"
        description="Encrypt and lock static content (images, videos, music, etc) behind an on-chain condition (ex: ownership of an NFT)."
        to="/v2/sdk/explanation/encryption"
      />
      <Card
        title="Lit Actions Conditions"
        description="Learn how to use Lit Actions for Access Control"
        to="/v2/accessControl/conditionTypes/litActionConditions"
      />
      <Card
        title="Gating Access Through JWT Auth"
        description="Authorize network signatures that provide access to dynamic content."
        to="/v2/toolsAndExamples/sdkExamples/dynamicContent"
      />
    </Section>
  );
}