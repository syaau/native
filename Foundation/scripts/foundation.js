#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const reactNativeDir = path.resolve(root, 'node_modules', 'react-native');
const cli = path.resolve(reactNativeDir, 'local-cli', 'cli.js');

// Extract the parameter to pass directly to 'react-native' cli
const args = [cli].concat(process.argv.slice(2));

spawn('node', args, {
  cwd: root,
  env: {
    ...process.env,
    FOUNDATION_PROJECT: process.cwd(),
  },
  stdio: 'inherit',
});

// cmd.stdout.on('data', (data) => {
//   process.stdout.write(data);
//   /// console.log(data.toString());
// });

// cmd.stderr.on('data', (data) => {
//   process.stderr.write(data);
//   // console.log(data.toString());
// });
