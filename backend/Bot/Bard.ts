import Discord from 'discord.js';
import { MessageInfo } from './Types/Bard.types';
import { Commands } from './Commands';

export let queue = new Map();

export class Bard {
    client: any;
    config: any;
    prefix: string;
    _instance: Bard;

    constructor(token: string, config: any) {
        this._instance = this;

        this.config = config;
        this.prefix = config.get('prefix');

        this.client = new Discord.Client();
        this.client.login(process.env.TOKEN);

        this.registerListeners(this.client);
    }

    private registerListeners(client) {
        client.once('ready', () => {
            console.log('Bot ready!');
        });

        client.once('reconnecting', () => {
            console.log('Bot Reconnecting...');
        });

        client.once('disconnect', () => {
            console.log('Bot Disconnected!');
        });

        client.on('message', async (message) => {
            this.handleMessage(message);
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
