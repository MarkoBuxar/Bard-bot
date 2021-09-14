import { queue } from '../Bard';

export function userConnectedToVC(message, voiceChannel) {
    if (!voiceChannel) {
        message.channel.send(
            '❌ |You need to be in a voice channel to execute this command!'
        );
        return false;
    }

    //TODO: test
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        message.channel.send(
            '❌ | I need the permissions to join and speak in your voice channel!'
        );
        return false;
    }

    return true;
}

export async function getQueue(message, player, guild) {
    const voiceChannel = message.member.voice.channel;

    let queue = player.getQueue(guild);

    if (!queue)
        queue = await player.createQueue(guild, { metadata: message.channel });

    return queue;
}

export function resetQueue(serverQueue) {
    serverQueue.dispatcher.destroy();
    serverQueue.voiceChannel.leave();
    queue.delete(serverQueue.guild);
    return;
}
