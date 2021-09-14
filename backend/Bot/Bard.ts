import { Client, Intents } from 'discord.js';
import { MessageInfo } from './Types/Bard.types';
import { Commands } from './Commands';
import { Player } from 'discord-player';

export let queue = new Map();

export class Bard {
    client: any;
    player: any;
    config: any;
    prefix: string;
    _instance: Bard;

    constructor(token: string, config: any, options: any) {
        this._instance = this;

        this.config = config;
        this.prefix = config.get('prefix');

        this.client = new Client(options);
        this.client.login(process.env.TOKEN);

        this.player = new Player(this.client);

        this.registerListeners(this.client, this.player);
    }

    private registerListeners(client, player) {
        client.once('ready', () => {
            console.log('Bot ready!');
        });

        client.once('reconnecting', () => {
            console.log('Bot Reconnecting...');
        });

        client.once('disconnect', () => {
            console.log('Bot Disconnected!');
        });

        client.on('messageCreate', async (message) => {
            this.handleMessage(message);
        });

        player.on('connectionError', (queue, error) => {
            console.log(
                `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
            );
        });

        player.on('error', (queue, error) => {
            console.log(error);
            queue.metadata.send('❌ | The bot has encountered an error');
        });

        player.on('trackStart', (queue, track) => {
            queue.metadata.send(
                `🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
            );
        });

        player.on('trackPaused', (queue, track) => {
            queue.metadata.send(`🎶 Music paused!`);
        });
        player.on('trackResume', (queue, track) => {
            queue.metadata.send(`🎶 Music resumed!`);
        });

        player.on('trackAdd', (queue, track) => {
            queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
        });

        player.on('botDisconnect', (queue) => {
            queue.metadata.send(
                '❌ | I was manually disconnected from the voice channel, clearing queue!'
            );
        });

        player.on('missingQuery', (queue) => {
            queue.metadata.send('❌ | No song specified');
        });

        player.on('missingTrack', (queue) => {
            queue.metadata.send('❌ | Song not found');
        });

        player.on('channelEmpty', (queue) => {
            queue.metadata.send(
                '❌ | Nobody is in the voice channel, leaving...'
            );
        });

        player.on('queueEnd', (queue) => {
            queue.metadata.send('✅ | Queue finished!');
        });
    }

    private handleMessage(message) {
        const msg = this.parseMessage(message);

        if (!msg) return;

        if (!(msg.command in Commands)) {
            message.channel.send(
                `**Unknown command:** ${this.prefix}${msg.command}`
            );
            return;
        }

        Commands[msg.command](this._instance, message, msg.arguments);
    }

    private parseMessage(message): MessageInfo | undefined {
        let text = message.content;

        if (message.author.bot) return;
        if (!text.startsWith(this.prefix)) return;

        text = text.replace(this.prefix, '');
        let textContent = text.split(' ');
        const cmd = textContent[0];
        const args = textContent.splice(1);

        var messageObj = {
            command: cmd,
            arguments: args,
        };

        return messageObj;
    }
}
