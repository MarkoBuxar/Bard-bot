import { getQueue, userConnectedToVC } from '../Helpers/Bard.helpers';

export function pause(instance, message, args) {
    const voiceChannel = message.member.voice.channel;

    if (!userConnectedToVC(message, voiceChannel)) return;

    const guild = message.guild.id;
    const serverQueue = getQueue(message, guild);

    if (serverQueue.playing) {
        serverQueue.dispatcher.pause();
        serverQueue.playing = false;
    }
    message.channel.send('Playback paused');
}
