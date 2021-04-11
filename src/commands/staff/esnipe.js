module.exports = {
    name: "esnipe",
    description: "snipes last message edited in a channel",
    category: "staff",
    staff: true,
    fields: ["channel"],
    examples: ["#main"],
    usages: ["[channel]"],
    execute: async (client, message, args) => {
        const channel = args.length ? client.functions.findChannel(message.guild.id, args.join(" ")) : message.channel 
        
        if (!channel) return message.channel.send(`:x: Could not find any channel with given query.`)
        
        const msg = client.esnipes.get(channel.id)
        
        if (!msg || !msg.member) return message.channel.send(`There is nothing to e-snipe in ${channel}`)
        
        const data = {}
        
        data.embed = msg.embeds[0] || new client.discord.MessageEmbed()
        
        if (!data.embed.color) data.embed.setColor(msg.member.displayHexColor)
        if (msg.attachments.size > 1) data.embed.attachFiles(msg.attachments.array().slice(1).map(u => u.url))
        if (!data.embed.author) data.embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL({
            dynamic: true,
            size: 4096
        }))
        if (!data.embed.footer) data.embed.setFooter(`#${channel.name} | ${msg.id}`)
        if (!data.embed.timestamp) data.embed.setTimestamp(msg.createdTimestamp)
        if (msg.content) data.embed.setDescription(`${msg.content}${data.embed.description ? `\n${data.embed.description}` : ""}`)
        if (msg.attachments.size > 0) data
        .embed.setImage(msg.attachments.first().url)
        
        message.channel.send(undefined, data)
    }
}