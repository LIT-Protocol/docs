import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function LitActionsSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="Hello World"
        description="Learn how to request a signature from the Lit network in this intro example."
        to="/SDK/Explanation/litActions#hello-world"
      />
      <Card
        title="Proofs and Signed Data"
        description="Use Lit's conditional signing capabilities to generate verifiable proofs within your app logic."
        to="/SDK/Explanation/litActions#conditional-signing"
      />
      <Card
        title="Fetching Off-chain Data"
        description="Use off-chain data natively without the need for a third-party oracle."
        to="/SDK/Explanation/litActions#using-fetch"
      />
      <Card
        title="Encrypting and Decrypting Content"
        description="Introduce private data to the open web using identity-based encryption."
        to="/SDK/Explanation/litActions#encrypting-and-decrypting-messages"
      />
      <Card
        title="Wallet Signatures and Authorization"
        description="Explore different methods of auth for PKPs and Lit Actions."
        to="/SDK/Explanation/litActions#using-eip191-eth_personal_sign-to-sign-a-message-instead-of-a-transaction-or-raw-signature"
      />
      <Card
        title="Lit Contracts SDK (Typescript)"
        description="ContractsSDK is a bundled package that allows you to make calls to Lit smart contracts."
        to="/SDK/Explanation/litActions#lit-contracts-sdk-typescript"
      />
      <Card
        title="Additional Examples"
        description="View more examples on our Github."
        to="https://github.com/LIT-Protocol/js-serverless-function-test/tree/main/js-sdkTests"
      />
    </Section>
  );
}