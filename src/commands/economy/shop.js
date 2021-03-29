module.exports = {
    name: "shop",
    description: "shop of buyable items",
    category: "economy",
    cooldown: 5000,
    execute: async (client, message, args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const pages = Math.trunc(guild.shop_items.length / 10) + 1 
        let page = Number(args[0]) || 1 
        if (page < 1) page = 1 
        if (page > pages) page = pages 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setTimestamp()
        .setFooter(`Use +buy-item <amount> <itemName> to buy a item. ${pages === 1 ? "" : `| Page ${page} / ${pages}`}`)
        
        guild.shop_items.slice(page*10-10, page*10).map((item, id) => {
            embed.addField(`${item.name} - ${guild.economy_emoji}${BigInt(item.price).toLocaleString()}`, item.description)
        })
        
        if (!embed.fields.length) embed.setDescription(`This store is empty...`)
        
        message.channel.send(embed)
    }
}