#!/usr/bin/env -S npx tsx
import cliProgram from '../src/commands/index.js'

// Parse command line arguments
cliProgram.parse();

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  cliProgram.outputHelp();
}