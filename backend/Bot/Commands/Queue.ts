import { getQueue, userConnectedToVC } from '../Helpers/Bard.helpers';

export async function queue(instance, message, args) {
    const voiceChannel = message.member.voice.channel;
    const player = instance.player;
    const guild = message.guild.id;
    const serverQueue = await getQueue(message, player, guild);

    try {
        if (!userConnectedToVC(message, voiceChannel)) return;

        message.channel.send('Not implemented');
    } catch (err) {
        player.emit('error', serverQueue, err);
    }
}
