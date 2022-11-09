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
        to="/SDK/Explanation/encryption"
      />
      <Card
        title="Gating Access Through JWT Auth"
        description="Authorize network signatures that provide access to dynamic content."
        to="/toolsAndExamples/SDKExamples/dynamicContent"
      />
      <Card
        title="Interactive HTML NFTs"
        description="Create HTML NFTs that contain embedded HTML/JS/CSS that’s only accessible to the owner of the NFT."
        to="/toolsAndExamples/SDKExamples/HTMLNfts"
      />
    </Section>
  );
}