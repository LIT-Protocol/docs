import fs from 'fs';

const args = process.argv.slice(2);

function redLog(msg, noDash = false) {
  if (noDash) {
    console.log('\x1b[31m%s\x1b[0m', `- ${msg}`);
  } else {
    console.log('\x1b[31m%s\x1b[0m', msg);
  }
}

function greenLog(msg, noDash = false) {
  if (noDash) {
    console.log('\x1b[32m%s\x1b[0m', `- ${msg}`);
  } else {
    console.log('\x1b[32m%s\x1b[0m', msg);
  }
}

function usageLog({ usage, options }) {
  const optionsStr = options.map(option => {
    return `    <${option.name}>  ${option.description}`;
  });

  greenLog(`
  Usage: ${usage} [options]
  
  Options:
  
    ${optionsStr}
    
      `);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

try {
  Array.prototype.asyncForEach = async function (callback) {
    for (let index = 0; index < this.length; index++) {
      await callback(this[index], index, this);
    }
  };
} catch (e) {
  // swallow
}

// create map of options
const commandMaps = [
  {
    cmd: 'pull',
    usage: 'yarn tools pull',
    description: 'pull the changes based on repo.config.js',
    fn: pullFunc,
  },
];

function getCmd() {
  let cmd;
  let errMsg = `\n❌ Command "${args[0]}" not found.\n`;

  function printAllCommands() {
    greenLog('All available commands: \n');
    commandMaps.forEach(cm => {
      greenLog(`  ${cm.cmd} - ${cm.description}`);
    });
    greenLog(``);
  }
  try {
    cmd = commandMaps.find(cm => cm.cmd === args[0]);
  } catch (e) {
    redLog(errMsg);
    printAllCommands();
    process.exit();
  }

  if (!cmd) {
    redLog(errMsg);
    printAllCommands();
    process.exit();
  }

  return cmd;
}

async function getReposConfig() {
  const fileName = 'repos.config.json';

  let reposConfig;
  try {
    reposConfig = JSON.parse(await fs.promises.readFile(fileName, 'utf8'));
  } catch (e) {
    redLog(`❌ Failed to read ${fileName}. Error: ${e}`);
    process.exit();
  }

  if (reposConfig.length <= 0) {
    redLog(`❌ No repos found in ${fileName}.`);
    process.exit();
  }

  await reposConfig.asyncForEach(repo => {
    if (!repo.copyFrom) {
      redLog(`❌ copyFrom is missing for ${JSON.stringify(repo)}.`);
      process.exit();
    }

    if (!repo.pasteTo) {
      redLog(`❌ pasteTo is missing for ${JSON.stringify(repo)}.`);
      process.exit();
    }

    if (!repo.sidebarPosition) {
      redLog(`❌ sidebarPosition is missing for ${JSON.stringify(repo)}.`);
      process.exit();
    }
  });

  return reposConfig;
}

async function fetchCopyFrom(url) {
  let res;

  try {
    res = await fetch(url).then(res => res.text());
  } catch (e) {
    redLog(`❌ ${e} - Failed to fetch ${url}. => Continue...`);
  }

  return res;
}

async function writePasteTo(path, content) {
  greenLog(`📝 Writing to ${path}`);

  let res = false;
  try {
    await fs.promises.writeFile(path, content);
    res = true;
  } catch (e) {
    redLog(`❌ ${e} - Failed to write to ${path}. => Continue...`);
  }

  return res;
}

function getHeader(sidebarPosition) {
  return `---
sidebar_position: ${sidebarPosition}
---
\n`;
}

async function pullFunc() {
  greenLog('🚀 Pulling changes...');

  const reposConfig = await getReposConfig();

  reposConfig.asyncForEach(async repo => {
    const content = await fetchCopyFrom(repo.copyFrom);

    if (content) {
      const contentHeader = getHeader(repo.sidebarPosition);
      const newContent = contentHeader + content;

      await writePasteTo(process.cwd() + repo.pasteTo, newContent);
    }
  });
}

// -- start script
async function setup() {
  // find the cmd based on the first argument
  const cmd = getCmd();
  try {
    cmd.fn();
  } catch (e) {
    redLog(`❌ Failed to run function ${cmd.cmd}. Error: ${e}`);
    process.exit();
  }
}

setup();
