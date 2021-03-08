module.exports = {
    name: "track-status",
    description: "By enabling this your presence status will be tracked to change your staff status in the list",
    category: "staff",
    staff: true,
    execute: async (client, message, args) => {
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(`By enabling this, your presence status will be tracked to change your staff status in <#818200948991852606>, appearing invisible will set you to offline.\nType \`yes\` to enable it or \`no\` to disable it.`)
        .setFooter(`This is still in beta and might not work as expected`)
        
        const filter = (m) => m.author.id === message.author.id 
        
        const m = await message.channel.send(embed)
        
        const collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000
        }).catch(err => null)
        
        if (!collected) m.delete()
        else {
            const choice = collected.first().content.toLowerCase()
            
            if (!["yes", "no"].includes(choice)) return message.channel.send(`:x: Invalid answer given, command canceled.`)
            
            const data = client.functions.getStaff(message.author.id)
            
            if (choice === "yes") {
                data.activity.track = true
            } else {
                data.activity.track = false
            }
            
            data.save()
            
            message.channel.send(choice === "yes" ? "Your status will now be tracked." : "Your status is no longer being tracked.")
        }
    }
}