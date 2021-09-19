import {
    getQueue,
    songPlaying,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';

export async function resume(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;
    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    try {
        if (!userConnectedToVC(message, voiceChannel)) return;
        if (!songPlaying(message, serverQueue)) return;

        if (serverQueue.connection.paused) {
            serverQueue.setPaused(false);
            player.emit('trackResumed', serverQueue);
        }
    } catch (err) {
        player.emit('error', serverQueue, err);
    }
}
