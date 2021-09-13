import { getQueue, userConnectedToVC } from '../Helpers/Bard.helpers';

export function resume(instance, message, args) {
    const voiceChannel = message.member.voice.channel;

    if (!userConnectedToVC(message, voiceChannel)) return;

    const guild = message.guild.id;
    const serverQueue = getQueue(message, guild);

    if (!serverQueue.playing) {
        serverQueue.dispatcher.resume();
        serverQueue.playing = true;
    }
    message.channel.send('Playback resumed');
}
