module.exports = {
    name: "reset-money",
    description: "resets yours or someone elses money.",
    category: "economy",
    mod: true,
    execute: async (client, message, args) => {
        const member = args.length ? await client.functions.findMember(message, args.join(" ")) : message.member 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        if (!member) return message.channel.send(embed.setDescription(`Could not find any member with given query.`))
        
        const filter = m => m.author.id === message.author.id 
        
        embed.setColor("BLUE")
        
        await message.channel.send(embed.setDescription(`Are you sure that you want to reset ${member}'s money? (yes/no)`))
        
        message.channel.awaitMessages(filter, {
            max: 1,
            errors: ["time"],
            time: 30000
        })
        .then(collected => {
            const m = collected.first()
            
            if (!["yes", "y"].includes(m.content.toLowerCase())) return message.channel.send(`Command cancelled.`)
            
            embed.setColor("GREEN")
            .setDescription(`Successfully reset ${member}'s balance.`)
            
            const data = client.functions.getData(member.id)
            
            data.money = "0" 
            data.bank = "0"
            data.username = member.user.username 
            
            client.db.set(`data_${member.id}`, data)
            
            message.channel.send(embed)
        })
        .catch(err => {
           message.channel.send(`Command cancelled.`)
        })
    }
}