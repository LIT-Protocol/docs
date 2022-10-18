const { ALL_LIT_CHAINS } = require("lit-js-sdk");
const fs = require("fs");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

console.log("Updating chains via updateChains.js");

let md = `# Supported Blockchains\n\n`;

md +=
  "We currently support most EVM chains.\n\nDon't see a blockchain you want?  Fill out this form for EVM chains and we'll add it: https://forms.gle/YQV5R7WoRyPk32xc7\n\n";

md += Object.keys(ALL_LIT_CHAINS)
  .map((c) => `- ${c}\n`)
  .join("");

fs.writeFileSync("docs/support/supportedChains.md", md);
