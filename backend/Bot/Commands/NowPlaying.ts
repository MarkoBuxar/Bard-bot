import {
    createEmbed,
    getQueue,
    getSongEmbed,
    songPlaying,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';
import { Themes } from '../Themes/Themes';

export async function nowplaying(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;
    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    try {
        if (!userConnectedToVC(message, voiceChannel)) return;
        if (!songPlaying(message, serverQueue)) return;

        const currentTrack = serverQueue.nowPlaying();

        const embed = getSongEmbed(currentTrack, ':musical_note: Now playing', {
            color: Themes.default.blue,
        });

        message.channel.send({ embeds: [embed] });
    } catch (err) {
        player.emit('error', serverQueue, err);
    }
}
