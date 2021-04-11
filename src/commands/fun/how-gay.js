module.exports = {
    name: "how-gay",
    description: "How gay are you or someone else",
    category: "fun",
    cooldown: 5000,
    execute: async (client, message, args) => {
        const member = args.length ? await client.functions.findMember(message, args.join(" ")) : message.member 
        
        if (!member) return message.channel.send(`Could not find any member with this query.`)
        
        const times = []
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`Gayness Calculator`, member.user.displayAvatarURL({
            dynamic: true
        }))
        .setDescription(`Calculating...`)
        
        .setTimestamp()
        .setFooter(`Made in 5m`)
        
        const m = await message.channel.send(embed)
        
        while (Math.floor(Math.random() * 100) > 50 || !times.length) {
            if (times.length > 50) break
            times.push(Math.floor(Math.random() * 100))
        }
        
        embed.setDescription(`${member} is ${(times.length ? times.reduce((x, y) => x + y, 0) / times.length : 0).toFixed(0)}% gay!`)
        
        m.edit(embed)
    }
}