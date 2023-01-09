function queenbee(command, args) {
  if (command === 0) {
    console.log("No command provided. Please use 'queenbee help' for more information.")
    process.exit(0);
  }
  command(args);
}

export default queenbee;