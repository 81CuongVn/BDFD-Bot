module.exports = {
    name: "delete-item",
    description: "deletes an item from the shop by using item name.",
    category: "settings",
    mod: true,
    args: 1,
    usages: ["<item name>"],
    examples: ["cute role"],
    fields: ["item"],
    execute: async (client, message, args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const items = guild.shop_items.filter(i => i.name.toLowerCase().includes(args.join(" ").toLowerCase()))
        
        if (!items.length) return message.channel.send(`Could not find any item with given query.`)
        else if (items.length === 1) {
            const item = items[0]
            
            guild.shop_items = guild.shop_items.filter(i => i.name !== item.name)
            
            client.db.set(`guild_${message.guild.id}`, guild)
            
            message.channel.send(`Successfully removed item ${item.name}.`)
        } else {
            const embed = new client.discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
            .setTitle(`Multiple matches found`)
            .setDescription(items.map((x, i) => `\`${i+1}\`.- ${i.name}`).join("\n"))
            
            const filter = m => m.author.id === message.author.id 
            
            const m = await message.channel.send(embed)
            
            m.channel.awaitMessages(filter, {
                max: 1,
                errors: ["time"],
                time: 60000
            })
            .then(collected => {
                const n = Number(collected.first().content)
                
                if (!items[n-1]) return message.channel.send(`Command cancelled.`)
                
                const item = items[n-1]
                
                guild.shop_items = guild.shop_items.filter(i => i.name !== item.name)
            
                client.db.set(`guild_${message.guild.id}`, guild)
            
                message.channel.send(`Successfully removed item ${item.name}.`)
            })
            .catch(err => {
                message.channel.send(`Command cancelled.`)
            })
        }
    }
}