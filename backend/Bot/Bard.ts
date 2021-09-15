import { Client, Intents } from 'discord.js';
import { MessageInfo } from './Types/Bard.types';
import { Commands } from './Commands';
import { Player } from 'discord-player';
import { createEmbed, getSongEmbed } from './Helpers/Bard.helpers';
import { Themes } from './Themes/Themes';

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
            const message = createEmbed(
                '❌ The bot has encountered an error',
                '',
                { color: Themes.default.red }
            );
            queue.metadata.send({ embeds: [message] });
        });

        player.on('trackStart', (queue, track) => {
            const message = getSongEmbed(track, ':musical_note:  Now playing', {
                color: Themes.default.blue,
            });
            queue.metadata.send({ embeds: [message] });
        });

        player.on('trackPaused', (queue, track) => {
            const message = createEmbed(':pause_button:  Music paused', '', {
                color: Themes.default.blue,
            });
            queue.metadata.send({ embeds: [message] });
        });
        player.on('trackResumed', (queue, track) => {
            const message = createEmbed(':arrow_forward:  Music resumed', '', {
                color: Themes.default.blue,
            });
            queue.metadata.send({ embeds: [message] });
        });

        player.on('trackAdd', (queue, track) => {
            const message = getSongEmbed(
                track,
                ':white_check_mark:  Song added to queue'
            );
            queue.metadata.send({ embeds: [message] });
        });

        player.on('tracksAdd', (queue, tracks) => {
            const playlist = tracks[0].playlist;
            let duration = 0;

            for (let i in tracks) {
                const a = tracks[i].duration.split(':');
                const hh = a.length >= 3 ? a[0] : 0;
                const mm = a.length < 3 ? a[0] : a[1];
                const ss = a.length < 3 ? a[1] : a[2];

                const seconds = +hh * 60 * 60 + +mm * 60 + +ss;
                duration += seconds;
            }

            const message = createEmbed(
                playlist.title,
                ':white_check_mark:  Playlist added to queue',
                {
                    url: playlist.url,
                    thumbnail: playlist.thumbnail,
                    author: playlist.author.name.toString(),
                    fields: [
                        {
                            name: 'length',
                            value: playlist.tracks.length.toString(),
                            inline: true,
                        },
                        {
                            name: 'duration',
                            value: new Date(duration * 1000)
                                .toISOString()
                                .substr(11, 8),
                            inline: true,
                        },
                    ],
                    color: Themes.default.green,
                }
            );
            queue.metadata.send({ embeds: [message] });
        });

        player.on('botDisconnect', (queue) => {
            const message = createEmbed(
                ':headstone:  I was manually disconnected from the voice channel, clearing queue',
                '',
                {
                    color: Themes.default.red,
                }
            );
            queue.metadata.send({ embeds: [message] });
        });

        player.on('missingQuery', (queue) => {
            const message = createEmbed('❌  No song specified', '', {
                color: Themes.default.red,
            });
            queue.metadata.send({ embeds: [message] });
        });

        player.on('missingTrack', (queue) => {
            const message = createEmbed(':question:  Song not found', '', {
                color: Themes.default.red,
            });
            queue.metadata.send({ embeds: message });
        });

        player.on('channelEmpty', (queue) => {
            const message = createEmbed(
                '❌  Nobody is in the voice channel, leaving...',
                '',
                {
                    color: Themes.default.red,
                }
            );
            queue.metadata.send({ embeds: message });
        });

        player.on('queueEnd', (queue) => {
            //queue.metadata.send('✅ | Queue finished!');
        });
    }

    private handleMessage(message) {
        const msg = this.parseMessage(message);

        if (!msg) return;

        if (!(msg.command in Commands)) {
            const embed = createEmbed(
                ':question:  unknown command',
                `${this.prefix}${msg.command}`,
                { color: '#c2081a' }
            );
            message.channel.send({ embeds: [embed] });
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
