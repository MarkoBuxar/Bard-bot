import {
    createEmbed,
    getQueue,
    getSongEmbed,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';
import { Themes } from '../Themes/Themes';

export async function nowplaying(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;

    if (!userConnectedToVC(message, voiceChannel)) return;

    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    if (!serverQueue.playing) {
        const embed = createEmbed(
            'Not playing',
            'Nothing is currently playing'
        );
        message.channel.send({ embeds: [embed] });
        return;
    }

    // const currentTrack =
    //     serverQueue.previousTracks[serverQueue.previousTracks.length - 1];

    const currentTrack = serverQueue.nowPlaying();

    const embed = getSongEmbed(currentTrack, ':musical_note: Now playing', {
        color: Themes.default.blue,
    });

    message.channel.send({ embeds: [embed] });
}
