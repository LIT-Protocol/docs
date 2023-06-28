---
sidebar_position: 1
---

# Intro
## Ceramic Integration

We are going to build simple web application encrypting and decrypting a string using Lit's Ceramic SDK. Check out the complete project [here](https://github.com/LIT-Protocol/CeramicIntegrationExample).

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/EENmb0mPGWU"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## Why?

Ceramic is amazing but doesn't have permission on data. Everything is public. With Lit Protocol, you can specify who can decrypt and therefore read data based on on-chain conditions. This module allows you to integrate Ceramic with Lit.

For example, you are building a website for a social DAO that throws member-only events. Members are people who hold the NFT for the DAO. Using Ceramic as your database and Lit for encrypting and decrypting events information, you can specify that only DAO members can see the events. You can use Lit to encrypt the events data, then store that encrypted data in Ceramic. When you want to access that information - you can use Lit to check access control conditions (in this case, NFT ownership) and decrypt the data from Ceramic.
## Motivation

The goal of this project is to provide a decentralized fully serverless database solution with the ability to easily share private data. Ceramic is a great solution for the decentralized serverless database, but it doesn't have the ability to share private data on it's own. This module will allow you to share private data on Ceramic with the ability to specify who can decrypt the data.

## Code

You can find the NPM module with more extensive documentation here: https://github.com/LIT-Protocol/CeramicIntegration
