#!/usr/bin/env node
import parse from "../lib/cli/parser.js";
import queenbee from "../lib/index.js";

const opt = parse(process.argv);

if (opt?.command) {
    queenbee(opt.command, opt.args);
} else {
  console.log("Invalid command provided. Please use 'queenbee help' for more information.");
  process.exit(0);
}