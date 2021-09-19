import {
    getQueue,
    resetQueue,
    songPlaying,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';

export async function stop(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;
    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    try {
        if (!userConnectedToVC(message, voiceChannel)) return;
        if (!songPlaying(message, serverQueue)) return;

        serverQueue.stop();
    } catch (err) {
        player.emit('error', serverQueue, err);
    }
}
