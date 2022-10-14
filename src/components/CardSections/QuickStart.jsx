import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function QuickStartSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="👩‍💻 Installing the Lit JavaScript SDK"
        description="Set up the SDK within your local environment"
        to="/SDK/installation"
      />
      <Card
        title="⌨️ Encrypt and Decrypt a String"
        description="Create your first Lit enabled application"
        to="/ToolsAndExamples/SDKExamples/EncryptAndDecrypt/setup"
      />
      <Card
        title="📁 Encrypt and Decrypt a File"
        description="Check out this Replit project to learn how to encrypt and decrypt a file using Lit"
        to="https://replit.com/@lit/Encrypt-and-Decrypt-a-File#encrypt_and_decrypt_file/src/App.js"
      />
    </Section>
  );
}
