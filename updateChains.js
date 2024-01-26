const { ALL_LIT_CHAINS } = require("@lit-protocol/constants");
const fs = require("fs");

console.log("Updating chains via updateChains.js");

let md = `# Supported Blockchains\n`;

md +=
  "Don't see a blockchain you want?  Fill out this form for EVM chains and we'll add it: https://forms.gle/YQV5R7WoRyPk32xc7\n\n";

md +=
  "## Access Control Protocol\n Our Access Control Protocol supports most EVM chains, the Cosmos ecosystem, and Solana.\n\n";

md +=
  "## Programmable Key Pairs\n PKPs rely on the [ECDSA](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) for digital signatures. This makes them inherently \"compatible\" with chains that rely on this same cryptographic primitive.\n\n";

md +=
  "You can learn more about compatible chains [here.](http://ethanfast.com/top-crypto.html)\n\n";

md +=
  "## Cayenne (Access Control & PKP)\n\n";

md += Object.keys(ALL_LIT_CHAINS)
  .sort()
  .map((c) => `- ${c}\n\n`)
  .join("");

fs.writeFileSync("docs/resources/supported-chains.md", md);
