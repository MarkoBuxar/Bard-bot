import { MessageEmbed } from 'discord.js';
import { queue } from '../Bard';
import { Themes } from '../Themes/Themes';

export function userConnectedToVC(message, voiceChannel) {
    if (!voiceChannel) {
        const embed = createEmbed(
            '❌ You need to be in a voice channel to execute this command',
            '',
            { color: Themes.default.red }
        );

        message.channel.send({ embeds: [embed] });
        return false;
    }

    //TODO: test
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        const embed = createEmbed(
            '❌ I need the permissions to join and speak in your voice channel',
            '',
            { color: Themes.default.red }
        );

        message.channel.send({ embeds: [embed] });
        return false;
    }

    return true;
}

export function songPlaying(message, serverQueue) {
    if (!serverQueue || !serverQueue.playing) {
        const embed = createEmbed(
            'Not playing',
            'No song is currently being played',
            { color: Themes.default.red }
        );
        message.channel.send({ embeds: [embed] });
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
    if (serverQueue.dispatcher) {
        serverQueue.dispatcher.destroy();
    }
    serverQueue.voiceChannel.leave();
    queue.delete(serverQueue.guild);
    return;
}

export function createEmbed(title, description, options: any = {}) {
    let embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();

    if ('color' in options) {
        embed.setColor(options.color);
    }

    if ('url' in options) {
        embed.setURL(options.url);
    }
    if ('author' in options) {
        embed.setAuthor(options.author);
    }
    if ('thumbnail' in options) {
        embed.setThumbnail(options.thumbnail);
    }

    if ('fields' in options) {
        embed.addFields(options.fields);
    }

    if ('image' in options) {
        embed.setImage(options.image);
    }

    if ('footer' in options) {
        embed.setFooter(options.footer);
    }

    return embed;
}

export function getSongEmbed(track, description, options: any = {}) {
    let opt = {
        url: track.url,
        thumbnail: track.thumbnail,
        author: track.author,
        fields: [
            { name: 'duration', value: track.duration, inline: true },
            {
                name: 'views',
                value: track.views.toString(),
                inline: true,
            },
        ],
        color: Themes.default.green,
    };

    if ('color' in options) {
        opt.color = options.color;
    }

    const message = createEmbed(track.title, description, opt);

    return message;
}

export function splitEmbed(description) {
    var len = 3000;
    var curr = len;
    var prev = 0;

    let output: string[] = [];

    while (description[curr]) {
        if (description[curr++] == ' ' || description[curr++] == '\n') {
            output.push(description.substring(prev, curr) + '...');
            prev = curr;
            curr += len;
        }
    }
    output.push(description.substr(prev));

    var last = output[output.length - 1];

    last = last.substring(0, last.length - 3);
    return output;
}
