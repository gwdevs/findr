/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import { readCachedProjectGraph } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import path from 'node:path';

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, ver, tag, otp] = process.argv;

const devDir = path.join(`packages/${name}`, `package.json`);
const devJson = JSON.parse(readFileSync(`${devDir}`).toString());

const _ver = ver === "undefined" ? devJson.version : ver;

const _verTag = _ver.split('-')[1]?.split(/\.|\+/)[0] || 'latest';

const _tag = tag === 'undefined' ? _verTag : tag;

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
  _ver && validVersion.test(_ver),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${_ver}.`
);

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

const outputPath = project.data?.targets?.build?.options?.outputPath;
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
);



// Updating the version in "package.json" before publishing
try {
  const rootDir = path.join(`package.json`);
  const distDir = path.join(`dist/packages/${name}`,`package.json`);
  const distJson = JSON.parse(readFileSync(distDir).toString());
  const rootJson = JSON.parse(readFileSync(rootDir).toString());

    [rootJson, distJson, devJson].forEach((json) => (json.version = _ver));

  writeFileSync(rootDir, JSON.stringify(rootJson, null, 2));
  writeFileSync(distDir, JSON.stringify(distJson, null, 2));
  writeFileSync(devDir, JSON.stringify(devJson, null, 2));
} catch (e) {
  console.error(
    chalk.bold.red(`Error reading package.json file from library build output.\n`, e)
  );
}

process.chdir(outputPath);

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${_tag} --otp ${otp}`);
