import { queue } from '../Bard';

export function userConnectedToVC(message, voiceChannel) {
    if (!voiceChannel) {
        message.channel.send(
            'You need to be in a voice channel to execute this command!'
        );
        return false;
    }

    //TODO: test
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        message.channel.send(
            'I need the permissions to join and speak in your voice channel!'
        );
        return false;
    }

    return true;
}

export function getQueue(message, guild) {
    const voiceChannel = message.member.voice.channel;

    if (!queue.has(guild)) {
        const queueContruct = {
            guild: guild,
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            dispatcher: null,
            songs: [],
            volume: 5,
            playing: false,
        };

        queue.set(guild, queueContruct);
    }

    let serverQueue = queue.get(guild);

    return serverQueue;
}

export function resetQueue(serverQueue) {
    serverQueue.dispatcher.destroy();
    serverQueue.voiceChannel.leave();
    queue.delete(serverQueue.guild);
    return;
}
