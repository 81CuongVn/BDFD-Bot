module.exports = {
    name: "use-item",
    description: "use a item",
    category: "economy",
    aliases: ["use"],
    cooldown: 5000,
    args: 1,
    usages: ["<item name>"],
    examples: ["username change"],
    fields: ["item"],
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        const item = Object.keys(data.inventory).find(a => a.toLowerCase() === args.join(" ").toLowerCase())
        
        if (!item) return message.channel.send(`Could not find any item with this name.`)
        
        if (item.toLowerCase() === "chicken") return message.channel.send(`Use \`+cock-fight\` to use this item.`)
        
        if (!data.inventory[item]) return message.channel.send(`You do not have any item with this name.`)
        
        data.inventory[item]--
        
        if (!data.inventory[item]) delete data.inventory[item]
        
        client.db.set(`data_${message.member.id}`, data)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        client.functions.useItem(message, guild.shop_items.find(i => i.name === item))
        
        
    }
}