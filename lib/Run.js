import fs from 'fs';
import path from 'path';
import {fork} from 'child_process';
import confectionery from 'confectionery';

let stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
const workerPath = path.join(process.cwd(), "workerbees");
let fileStore = [];
let finishedCommands = false;
let forkedBee = null;

function instantiateBee(beeFile) {
    finishedCommands = false;
    forkedBee = fork('./lib/runChild.js');
    forkedBee.send({ file: beeFile });
}


export default async function runCommand(args) {
    let beeName = String(args[0]);
    const beePath = path.join(workerPath, "bee_" + beeName + ".json");

    if (!validateInput(args, beePath)) {
        process.exit(0);
    }

    const beeFile = JSON.parse(fs.readFileSync(beePath, 'utf8'));
    fileStore = beeFile;
    validateBeeFile(beeFile)

    instantiateBee(beeFile)

        forkedBee.on('message', (msg) => {
            if (msg.finished !== true) {
                console.log("Something went wrong; exiting.")
                process.exit(1);
            }

            if (beeFile.enableControls) {
                confectionery.customPrint(() => { return `${beeFile.glyph} {bold {yellow ${beeFile.name.toLocaleUpperCase()}} {green ✓ Finished} {gray Control this bee with the buttons listed below.}}\n{bold {gray x}} {dim Exit}\n{bold {gray r}} {dim Restart}\n`});
                finishedCommands = true;
            } else {
                confectionery.customPrint(() => { return `${beeFile.glyph} {bold {yellow ${beeFile.name.toLocaleUpperCase()}} {green ✓ Finished} {gray Control panel disabled for bee, exiting.}}\n`});
                forkedBee.send({command: 'exit'});
                process.exit(0);
            }
    });

    stdin.on('data', function(key) {
        if ( key === '\u0003' ) {
            forkedBee.send({command: 'exit'});
            process.exit(0);
        }
        if (key.indexOf('x') == 0)
        {
            forkedBee.send({command: 'exit'});
            process.exit(0);
        }
        if (key.indexOf('r') == 0 && finishedCommands === true)
        {
            instantiateBee(fileStore);
        }
    });
}

function validateInput(args, beePath) {
    // Quit if no bee name is provided
    if (args.length === 0) {
        console.log("No worker bee name provided. Please use 'queenbee run <bee name>' to wake your worker bee.");
        return false;
    }
    // Quit if requested bee does not exist
    if (!fs.existsSync(beePath)) {
        console.log("Worker bee does not exist. Please use 'queenbee init <bee name>' to initialize a new worker bee.");
        return false;
    }
    // Quit if too many arguments are provided
    if (args.length > 1) {
        console.log("Too many arguments provided. Please use 'queenbee run <bee name>' to wake your worker bee.");
        return false;
    }
    return true;
}

function validateBeeFile(beeFile) {
    if (beeFile?.commands === undefined) {
        console.log("No commands found in bee file. Please add commands to your bee file.");
        process.exit(0);
    } else {
        if (beeFile?.commands?.length === 0) {
            console.log("No commands found in bee file. Please add commands to your bee file.");
            process.exit(0);
        }
    }
        stopIfUndefined(beeFile, "name");
        stopIfUndefined(beeFile, "description");
        stopIfUndefined(beeFile, "glyph");
        stopIfUndefined(beeFile, "delay");
        stopIfUndefined(beeFile, "enableControls");
        stopIfUndefined(beeFile, "logSettings");
        stopIfUndefined(beeFile.logSettings, "commands");
        stopIfUndefined(beeFile.logSettings, "stdout");
        stopIfUndefined(beeFile.logSettings, "stderr");
}

function stopIfUndefined(beeFile, property) {
    if (beeFile[property] === undefined) {
        console.log("No " + property + " found in bee file. Please add a " + property + " to your bee file.");
        process.exit(0);
    }
}