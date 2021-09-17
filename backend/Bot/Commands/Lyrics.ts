import { Lyrics } from '@discord-player/extractor';
import {
    createEmbed,
    getQueue,
    splitEmbed,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';
import { Themes } from '../Themes/Themes';

export async function lyrics(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;
    const lyricsClient = instance.lyrics;

    if (!userConnectedToVC(message, voiceChannel)) return;

    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    if (!serverQueue || !serverQueue.playing) {
        const embed = createEmbed(
            'Not playing',
            'No song is currently being played',
            { color: Themes.default.red }
        );
        return message.channel.send({ embeds: [embed] });
    }

    const song = serverQueue.nowPlaying().title;

    const lyrics = await lyricsClient.search(song);

    if (!lyrics) {
        const embed = createEmbed(
            ':question: No lyrics found for current song',
            '',
            {
                color: Themes.default.red,
            }
        );
        return message.channel.send({ embeds: [embed] });
    }

    let descArr;
    if (lyrics.lyrics.length >= 6000) {
        descArr = splitEmbed(lyrics.lyrics);
    } else {
        descArr = [lyrics.lyrics];
    }

    const embed = createEmbed(lyrics.title, descArr[0], {
        thumbnail: lyrics.image,
        author: lyrics.artist.name,
        color: Themes.default.blue,
        url: lyrics.url,
    });

    message.channel.send({ embeds: [embed] });

    if (descArr.length > 1) {
        message.channel.send({
            embeds: [
                createEmbed(lyrics.title, '...', {
                    thumbnail: lyrics.image,
                    author: lyrics.artist.name,
                    color: Themes.default.blue,
                    url: lyrics.url,
                }),
            ],
        });
    }
}
