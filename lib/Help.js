import confectionery from 'confectionery';

export default function helpCommand(args) {
    confectionery.customPrint(() => { return `🐝 {bold {yellow QUEENBEE} {dim by enbytedev}} 
{gray The following are commands and usage.}
{bold {gray help}} {dim - {bold queenbee help} - Show this menu.}
{bold {gray init}} {dim - {bold queenbee init <bee name>} - Initialize a new worker bee.}
{bold {gray run}} {dim - {bold queenbee run <bee name>} - Start a worker bee.}\n`});
}