import fs from 'fs';
import path from 'path';
import helpCommand from '../Help.js';
import initCommand from '../Init.js';
import runCommand from '../Run.js';

function parse(args) {
  if (typeof args === 'string') {
    args = args.split(' ');
  }

  args = args.slice(2);

  if (args.length === 0) {
    return undefined;
  }

  const command = args[0];
  if (command === 'help') {
    return {command: helpCommand, args: args.slice(1)};
  } else if (command === 'init') {
    return {command: initCommand, args: args.slice(1)};
  } else if (command === 'run') {
    return {command: runCommand, args: args.slice(1)};
  } else {
    return {command: undefined, args: args.slice(1)};
  }

  // if (command in commands) {
  //   return {command: commands[command](args.slice(1)), args: args.slice(1)};
  // }

}

export default parse;