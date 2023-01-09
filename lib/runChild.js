import {exec} from 'child_process';
import confectionery from 'confectionery';

process.on('message', (msg) => {
    if (typeof msg === 'object') {
        runChild(msg.file);
    }
    if (msg.command === 'exit') {
        process.exit(0);
    }
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function runChild(beeFile) {
    confectionery.customPrint((arg1, arg2) => { return `${beeFile.glyph} {bold {yellow ${arg1}} {dim (${beeFile.commands.length})} {gray : ${arg2}}}\n`}, beeFile.name.toLocaleUpperCase(), beeFile.description);
    for (let i = 0; i < beeFile.commands.length; i++) {
        let status = `${i+1}/${beeFile.commands.length}`
        exec(beeFile.commands[i], async (error, stdout, stderr) => {
            if (error) {
                console.log(`ERR: ${error.message}`);
                return;
            }
            if (stderr && beeFile.logSettings.stderr) {
                confectionery.customPrint((arg1, arg2, arg3) => { 
                    return `${beeFile.glyph} {bold {yellow ${arg1}} {gray ${status} >}} {italic {gray ${arg2}}} \n{bold {gray ${" ".repeat(arg1.length + status.length + 5)}>}} {red ${arg3}}`}, beeFile.name.toLocaleUpperCase(), beeFile.commands[i], stderr);
            }
            if (stdout && beeFile.logSettings.stdout) {
                confectionery.customPrint((arg1, arg2, arg3) => { 
                    return `${beeFile.glyph} {bold {yellow ${arg1}} {gray ${status} >}} {italic {gray ${arg2}}} \n{bold {gray ${" ".repeat(arg1.length + status.length + 5)}>}} {cyan ${arg3}}`}, beeFile.name.toLocaleUpperCase(), beeFile.commands[i], stdout);
            }
            if (!stderr && !stdout && beeFile.logSettings.commands) {
                confectionery.customPrint((arg1, arg2) => { 
                    return `${beeFile.glyph} {bold {yellow ${arg1}} {gray ${status} >}} {italic {gray ${arg2}}}\n`}, beeFile.name.toLocaleUpperCase(), beeFile.commands[i]);
            }
        });
        await sleep(String(beeFile.delay));
    }
    process.send({finished: true});
}