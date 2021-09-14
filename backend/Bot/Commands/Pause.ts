import { getQueue, userConnectedToVC } from '../Helpers/Bard.helpers';

export async function pause(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;

    if (!userConnectedToVC(message, voiceChannel)) return;

    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    serverQueue.setPaused(true);
    player.emit('trackPaused', serverQueue);
}
