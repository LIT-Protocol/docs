const { ALL_LIT_CHAINS } = require("lit-js-sdk");
const fs = require("fs");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

console.log("Updating chains via updateChains.js");

let md = `# Supported Blockchains\n\n## Access Control Protocol\n\n`;

md +=
  " Our Access Control Protocol supports most EVM chains, the Cosmos ecosystem, and Solana.\n\nDon't see a blockchain you want?  Fill out this form for EVM chains and we'll add it: https://forms.gle/YQV5R7WoRyPk32xc7\n\n";

md += Object.keys(ALL_LIT_CHAINS)
  .map((c) => `- ${c}\n`)
  .join("");

md += `\n\n## Programmable Key Pairs\n\n PKPs rely on the [ECDSA](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) for digital signatures. This makes them inherently "compatible" with chains that rely on this same cryptographic primitive. This includes:\n\n- bitcoin\n
- ethereum (and many of the EVM chains you see above)\n
- binance\n
- polygon\n
- cosmos\n
- filecoin\n
- theta\n\nYou can learn more about compatible chains [here.](http://ethanfast.com/top-crypto.html)\n `;
fs.writeFileSync("docs/support/supportedChains.md", md);
