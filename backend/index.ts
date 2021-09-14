import config from 'config';
import { Intents } from 'discord.js';
import dotenv from 'dotenv';
import { Bard } from './Bot/Bard';

// not playing random songs
// https://github.com/Androz2091/discord-player/issues/764

dotenv.config();

const token: string | undefined = process.env.TOKEN;

if (!token) {
    throw new Error('Token not found');
}

let options = {};
options['intents'] = new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
]);

new Bard(token, config, options);
