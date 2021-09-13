import {
    getQueue,
    resetQueue,
    userConnectedToVC,
} from '../Helpers/Bard.helpers';

export function stop(instance, message, args) {
    const voiceChannel = message.member.voice.channel;

    if (!userConnectedToVC(message, voiceChannel)) return;

    const guild = message.guild.id;
    const serverQueue = getQueue(message, guild);

    if (serverQueue.playing || serverQueue.dispatcher) {
        resetQueue(serverQueue);
    }
    message.channel.send('Playback stopped');
}
