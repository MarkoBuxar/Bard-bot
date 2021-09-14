import { QueryType } from 'discord-player';
import { getQueue, userConnectedToVC } from '../Helpers/Bard.helpers';
import { Queue, SongObject } from '../Types/Bard.types';

export async function play(instance, message, args) {
    try {
        const voiceChannel = message.member.voice.channel;
        const player = instance.player;

        if (!userConnectedToVC(message, voiceChannel)) return;

        const query = args.join(' ');
        const guild = message.guild.id;

        let serverQueue = await getQueue(message, player, guild);

        if (!query) return player.emit('missingQuery', serverQueue);

        const song = await getSong(message, player, query);

        if (!song || !song.tracks.length)
            return player.emit('missingTrack', serverQueue);

        await addToQueue(message, serverQueue, song);

        if (!serverQueue.playing) playQueue(serverQueue, voiceChannel);
        return;
    } catch (err) {
        console.log(err);
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
