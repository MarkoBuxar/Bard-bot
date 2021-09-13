import fs from "fs";
import Path from "path";

const commandsDir = Path.join(__dirname, "Commands");

let Commands =  {};


const commandFiles = fs.readdirSync(commandsDir).filter(file => {
    return file.endsWith('.ts') || file.endsWith('.js');
});

commandFiles.forEach(async (file) => {
    const im = await import(Path.join(commandsDir, file));
    for (const key in im) {
        Commands[key] = im[key];
    };
});


export {Commands};