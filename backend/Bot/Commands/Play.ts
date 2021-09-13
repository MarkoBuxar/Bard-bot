import ytdl from 'ytdl-core';
import {
    getQueue,
    resetQueue,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';
import { Queue, SongObject } from '../Types/Bard.types';
import { resume } from './Resume';

export async function play(instance, message, args) {
    try {
        const voiceChannel = message.member.voice.channel;

        if (!userConnectedToVC(message, voiceChannel)) return;

        const songName = args.join(' ');

        const guild = message.guild.id;
        let serverQueue = getQueue(message, guild);

        if (!songName) {
            if (serverQueue.dispatcher && !serverQueue.playing) {
                resume(instance, message, serverQueue);
            } else {
                message.channel.send('You need to type in a song dumbass');
            }
            return;
        }

        const song = await getSong(songName);

        await addToQueue(serverQueue, song);

        if (serverQueue.dispatcher || serverQueue.playing) return;

        var connection = await voiceChannel.join();
        serverQueue.connection = connection;

        playSong(serverQueue, song);
    } catch (err) {
        console.log(err);
    }
}

async function addToQueue(serverQueue, song): Promise<Queue> {
    serverQueue.songs.push(song);
    serverQueue.textChannel.send(
        `\`${song.title}\` **has been added to the queue!**`
    );
    return serverQueue;
}

async function getSong(songName): Promise<SongObject> {
    const songInfo = await ytdl.getInfo(songName);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    return song;
}

function playSong(serverQueue, song) {
    if (!song) {
        return resetQueue(serverQueue);
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            serverQueue.songs.shift();
            playSong(serverQueue, serverQueue.songs[0]);
        })
        .on('error', (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.dispatcher = dispatcher;
    serverQueue.playing = true;
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
