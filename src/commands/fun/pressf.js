const Discord = require("discord.js")
const rs = new Discord.Collection()

module.exports = {
    name: "press-f",
    description: "press f to pay respects",
    cooldown: 10000,
    category: "fun",
    execute: async (client, message, args) => {
        if (rs.has(message.channel.id)) return message.channel.send(`:x: Wait until current collector ends.`), message.deleteCooldown()
        
        message.delete().catch(err => null)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`Press F to pay respects`)
        if (args.length) embed.setTitle(args.join(" ").slice(0, 500))
        
        rs.set(message.channel.id, true)
        
        const m = await message.channel.send(embed)
        
        m.react("🇫")
        
        const collector = m.createReactionCollector((r) => r.emoji.name === "🇫", {
            time: 30000
        })
        
        const users = new Discord.Collection()
        
        users.set(client.user.id, true)
        
        collector.on("collect", (r, u) => {
            if (users.has(u.id)) return undefined
            else users.set(u.id, true)
            message.channel.send(`${u} has paid their respects.`)
        })
        
        collector.on("end",() => {
            message.channel.send(`${users.size-1} users have paid their repects.`)
            rs.delete(message.channel.id)
        })
    }
}