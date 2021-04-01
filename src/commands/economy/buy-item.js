module.exports = {
    name: "buy-item",
    aliases: ["buy"],
    description: "buys an item from the shop",
    category: "economy",
    args: 1,
    usages: ["<amount> <item name>"],
    examples: ["cute role", "1 cute role"],
    fields: ["amount", "item name"],
    info: "Items not including a number at the start of its name may not use amount argument unless you are buying multiple.",
    cooldown: 5000,
    execute: async (client, message, args) => {
        
        let amount = Number(args[0]) ? Number(args.shift()) : 1 
        
        if (!args.length) return message.channel.send(`No item name was given.`)
        
        const name = args.join(" ")
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        const guild = client.functions.getGuild(message.guild.id)
        
        if (amount < 1) return message.channel.send(embed.setDescription(`You cannot buy less than one item`))
        
        const items = guild.shop_items.filter(item => item.name.toLowerCase() === name.toLowerCase() || item.name.toLowerCase().startsWith(name.toLowerCase()) || item.name.toLowerCase().includes(name.toLowerCase()))
        
        let item 
        
        if (items.length === 1) {
            item = items[0]
        } else if (items.length > 1) {
            const embed = new client.discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle(`Multiple matches found`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({
                dynamic:true
            }))
            .setTimestamp()
            .setDescription(items.map((i, id) =>`\`${id+1}\`.- ${i.name}`).join("\n"))
            await message.channel.send(embed)
            
            const filter = m => m.author.id === message.author.id
            
            const collected = await message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ["time"]
            })
            .then(n => Number(n.first().content))
            .catch(err => null)
            
            item = items[collected-1]
        }
        
        if (!item) return message.channel.send(embed.setDescription(`Could not find any item with given query.`))
        
        if (item.stock !== undefined && Number(item.stock) === 0) return message.channel.send(embed.setDescription(`This item is out of stock.`))
        
        if (item)
        if (!item.usable) amount = 1 
        
        const price = BigInt(item.price) * BigInt(amount)
        
        const data = client.functions.getData(message.member.id)
        
        if (BigInt(data.money) - price < 0n) return message.channel.send(embed.setDescription(`You don't have ${guild.economy_emoji}${price.toLocaleString()} to buy ${amount === 1 ? "": amount} ${item.name}.`))
        
        if (item.stock && Number(item.stock) - amount < 0) return message.channel.send(embed.setDescription(`The stock left for this item is ${item.stock}.`))
        
        if (item.required_roles && !item.required_roles.every(id => message.member.roles.cache.has(id))) return message.channel.send(embed.setDescription(`You are missing the role(s) ${item.required_roles.filter(id => !message.member.roles.cache.has(id)).map(id => `<@&${id}>`).join(", ")} to buy this item.`))
        const ind = guild.shop_items.indexOf(item)
        
        if (typeof item.stock !== "undefined") {
            guild.shop_items[ind].stock = Number(guild.shop_items[ind].stock) - 1
            
            client.db.set(`guild_${message.guild.id}`, guild)
        }
        
        data.username = message.author.tag 
        data.money = (BigInt(data.money) - price).toString()
        
        if (item.usable) data.inventory[item.name] = data.inventory[item.name] + amount || amount
        
        
        client.db.set(`data_${message.member.id}`, data)
        
        if (!item.usable) {
            client.functions.useItem(message , item)
        } else {
            embed.setColor("GREEN")
            
            message.channel.send(embed.setDescription(`This item is now in your inventory, use it using \`+use-item <item name>\`.`))
        }
    }
}