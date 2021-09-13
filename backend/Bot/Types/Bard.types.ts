import { Message } from 'discord.js';

export interface MessageInfo {
    command: string;
    arguments: string[];
}

export interface Queue {
    guild: string;
    textChannel: string;
    voiceChannel: string;
    connection: any;
    dispatcher: any;
    songs: any[];
    volume: Number;
    playing: boolean;
}

export interface SongObject {
    title: string;
    url: string;
}
