import {
    createEmbed,
    getQueue,
    songPlaying,
    splitEmbed,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';
import axios from 'axios';
import { Themes } from '../Themes/Themes';

export async function lyrics(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;
    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    try {
        if (!userConnectedToVC(message, voiceChannel)) return;
        if (!songPlaying(message, serverQueue)) return;

        // todo: isolate song
        const song = serverQueue.nowPlaying();

        const songLyrics = (
            await axios.get(
                encodeURI(
                    `https://some-random-api.ml/lyrics/?title=${song.title}`
                )
            )
        ).data;

        const lyricsArr = splitEmbed(songLyrics.lyrics);

        let embed = createEmbed(songLyrics.title, lyricsArr[0], {
            url: songLyrics.links.genius,
            thumbnail: songLyrics.thumbnail.genius,
            author: songLyrics.author,
        });

        message.channel.send({ embeds: [embed] });

        // code
    } catch (err: any) {
        if (err.response.status === 404) {
            return message.channel.send({
                embeds: [
                    createEmbed(
                        'Not found',
                        "Couldn't find lyrics for this song",
                        { color: Themes.default.red }
                    ),
                ],
            });
        }

        player.emit('error', serverQueue, err);
    }
}
