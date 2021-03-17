module.exports = {
    name: "drop",
    description: "First person to react wins the item",
    args: 2,
    usages: ["<channel> <title>"],
    examples: ["#general depression"],
    fields: ["channel", "title"],
    mod: true,
    category: "giveaway",
    execute: async (client, message, args) => {
        const channel = client.functions.findChannel(message.guild.id, args.shift())
        
        if (!channel) return message.channel.send(`:x: Could not find amy channel with given query.`)
        
        const title = args.join(" ")
        
        const embed = new client.discord.MessageEmbed()
        .setThumbnail(message.guild.iconURL({
            dynamic: true,
            size: 4096
        }))
        .setColor("6B81D2")
        .setTitle(title)
        .setAuthor(`🎉 DROP 🎉`)
        .setDescription(`Winner appears here`)
        .setFooter(`First to react wins the item!`)
        
        const m = await channel.send(embed).catch(err => null)
        
        if (!m) return message.channel.send(`:x: Failed to send drop`)
        
        if (m.channel.id !== message.channel.id) message.channel.send(`Drop sent`)
        
        await m.react("<:bdfd_coin:766607515445231637>")
        
        const start = Date.now()
        
        const filter = (r) => r.emoji.toString() === "<:bdfd_coin:766607515445231637>" && client.user.id !== message.author.id
        
        const collected = await m.awaitReactions(filter, {
            max: 1,
            time: 60000
        }).catch(err => null)
        
        if (!collected || !collected.first() || !collected.first().users) return m.delete().catch(err => null)
        
        else {
            const user = collected.first().users.cache.array()[1]
            
            const taken = Date.now() -start
            
            embed.setDescription(`${user} won the drop`)
            embed.setFooter(`They took ${taken}ms to react`)
            m.edit(embed)
            m.reactions.cache.first().remove().catch(err => null)
            m.channel.send(`Congratulations ${user}! You won **${title}**`)
        }
    }
}