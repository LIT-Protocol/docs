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
        to="/SDK/Explanation/LitActions/helloWorld"
      />
      <Card
        title="Proofs and Signed Data"
        description="Use Lit's conditional signing capabilities to generate verifiable proofs within your app logic."
        to="/coreConcepts/LitActionsAndPKPs/actions/conditionalSigning"
      />
      <Card
        title="Fetching Off-chain Data"
        description="Use off-chain data natively without the need for a third-party oracle."
        to="/LitActionsAndPKPs/actions/usingFetch"
      />
      <Card
        title="Authentication Helpers"
        description="Explore different methods of authentication (ie. Google OAuth, WebAuthn, etc...)."
        to="/LitActionsAndPKPs/actions/authHelpers"
      />
      <Card
        title="Lit Contracts SDK (Typescript)"
        description="ContractsSDK is a bundled package that allows you to make calls to Lit smart contracts."
        to="/SDK/Explanation/LitActions/contracts"
      />
      <Card
        title="Additional Examples"
        description="View more examples on our Github."
        to="https://github.com/LIT-Protocol/js-serverless-function-test/tree/main/js-sdkTests"
      />
    </Section>
  );
}