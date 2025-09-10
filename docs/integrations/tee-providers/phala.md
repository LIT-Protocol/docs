import FeedbackComponent from "@site/src/pages/feedback.md";

# Using Lit Protocol as a secret store for a Phala TEE

## Overview

Lit Protocol can be used as a secure secret store for Phala TEE (Trusted Execution Environment) applications. This integration allows you to conditionally decrypt secrets where decryption is only permitted for verified Phala TEE instances running known-good software builds.

## How It Works

The integration leverages:
- Attestation verification from Phala TEE instances
- Lit Actions to verify TEE attestations
- Conditional decryption that only releases secrets to verified TEE instances
- Assurance that secrets are only accessible to specific, trusted TEE builds

## Example Implementation

A complete example demonstrating this workflow is available in the Lit Protocol repository:

**Repository**: [https://github.com/LIT-Protocol/tee_secrets_test](https://github.com/LIT-Protocol/tee_secrets_test)

This example shows:
- How to obtain attestations from Phala TEE
- Verification of attestations within Lit Actions using WASM-compiled verification logic
- Conditional decryption based on successful verification
- Complete workflow for securing and retrieving secrets from within a TEE environment

## Key Benefits

- **Secure Secret Management**: Secrets remain encrypted until accessed by verified TEE instances
- **Attestation-Based Access**: Only TEE instances with valid attestations can decrypt secrets
- **Build Verification**: Ensure only specific, trusted TEE builds can access sensitive data
- **Decentralized Security**: Leverage Lit Protocol's distributed network for secret storage and access control

## Getting Started

To implement this integration:

1. Clone the example repository
2. Configure your TEE verification requirements in the Lit Action
3. Deploy your secrets to Lit Protocol with appropriate access conditions
4. Run the decryption from within your Phala TEE environment

For detailed implementation steps and code examples, refer to the [example repository](https://github.com/LIT-Protocol/tee_secrets_test).

<FeedbackComponent/>
