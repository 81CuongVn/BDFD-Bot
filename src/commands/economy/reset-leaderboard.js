module.exports = {
    name: "reset-economy",
    mod: true,
    category: "settings",
    description: "resets all the money",
    execute: async (client, message, args) => {
        if (message.member.id !== "739591551155437654") return 
        
        const filter = m => m.author.id === message.author.id 
        
        const all = client.db.all().filter(data => data.ID.startsWith("data_"))
        
        const m = await message.channel.send(`This will reset the money of ${all.length.toLocaleString()} users, type \`yes\` to confirm or \`cancel\` to cancel this operation.`)
        
        m.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"]
        })
        .then(async collected => {
            const msg = collected.first()
            
            if (!["y", "yes"].some(i => msg.content.toLowerCase() === i)) return message.channel.send(`Command cancelled.`)
            await m.edit(`Resetting everyone's balance, this might take a while.`)
            
            const start = Date.now()
            
            for (const d of all) {
                await new Promise(e => setTimeout(e, 100))
                client.db.delete(d.ID)
            }
            
            const embed = new client.discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
            .setTitle(`Money Reset Completed!`)
            .setDescription(`Users: ${all.length.toLocaleString()}\nDuration: ${client.utils.dates.parseMS(Date.now() - start).array(true).join(" ")}`)
            
            message.channel.send(embed)
        })
        .catch(err => {
            if (err.message) {
                message.channel.send(`Something went wrong while resetting everyone's money.`)
            } else {
                message.channel.send(`Command cancelled.`)
            }
        })
    }
}