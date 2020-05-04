#!/usr/bin/env node
const app = require('../');
const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .alias('c', 'config-file')
  .describe('c', 'Path to the json config file')
  .default('c', 'config.json')
  .alias('o', 'output')
  .describe('o', 'Path to the logs output path')
  .default('o', '.')
  .alias('s', 'server')
  .describe('s', 'Use server mode')
  .alias('l', 'logger')
  .describe('l', 'Use logger mode')
  .help('h')
  .alias('h', 'help').argv;

app({
  configFile: argv['config-file'],
  outputPath: argv['output'],
  isServerMode: argv['server'],
  isLoggerMode: argv['logger'],
});
