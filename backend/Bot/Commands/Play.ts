import { QueryType } from 'discord-player';
import { getQueue, userConnectedToVC } from '../Helpers/Bard.helpers';
import { Queue, SongObject } from '../Types/Bard.types';

export async function play(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;
    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);
    const query = args.join(' ');

    try {
        if (!query) return player.emit('missingQuery', serverQueue);
        if (!userConnectedToVC(message, voiceChannel)) return;

        const song = await getSong(message, player, query);

        if (!song || !song.tracks.length)
            return player.emit('missingTrack', serverQueue);

        await addToQueue(message, serverQueue, song);

        if (!serverQueue.playing) playQueue(serverQueue, voiceChannel);
    } catch (err) {
        player.emit('error', serverQueue, err);
    }
}

async function addToQueue(message, queue, searchResult): Promise<void> {
    if (searchResult.playlist) {
        queue.addTracks(searchResult.tracks);
    } else {
        queue.addTrack(searchResult.tracks[0]);
    }
}

async function getSong(message, player, query): Promise<any> {
    const searchResult = await player
        .search(query, {
            requestedBy: message.author.username,
            searchEngine: QueryType.AUTO,
        })
        .catch((exp) => {});

    return searchResult;
}

async function playQueue(queue, channel) {
    if (!queue.connected) await queue.connect(channel);
    if (!queue.playing) await queue.play();
}
