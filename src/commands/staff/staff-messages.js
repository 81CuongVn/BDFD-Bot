module.exports = {
    name: "staff-messages",
    staff: true, 
    usages:["[member]"],
    aliases: ["sms", "smsgs", "smgs"],
    description: "view yours or someone elses messages",
    category: "staff",
    execute: async(client, message, args) => {
        const member = args.length ? await client.functions.findMember(message, args.join(" ")) : message.member
        
        if (!member) return message.channel.send(`:x: Could not find any member with given query`)
        
        if (!Object.values(client.utils.staff_roles).some(id => member.roles.cache.has(id))) return message.channel.send(`:x: ${member.user.username} is not a staff member`)
        
        const timers = client.functions.getTimers()
        
        if (!timers.staff_messages) {
            timers.staff_messages = Date.now()
            
            timers.save()
        }
        
        const data = client.functions.getStaff(member.id)
        
        const channels = data.channels(true, false)
        
        const self = member.id === message.author.id  ? "You" : "They"
        
        const embed = new client.discord.MessageEmbed()
        .setColor(member.displayHexColor)
        .setThumbnail(member.user.displayAvatarURL({
            dynamic: true,
            size: 4096
        }))
        .setAuthor(`${member.user.username}'s Messages`)
        .setDescription(`${self} have sent a total of ${data.message_count.toLocaleString()} messages`)
        .setFooter(`This is also counting deleted channels\nHas been counting since`)
        .setTimestamp(timers.staff_messages)
        
        if (channels.length) {
            const chs = channels.splice(0, 15).map(c => `[#${c.channel.name}]: ${c.count.toLocaleString()} message${c.count === 1 ? "" : "s"} (${c.percentage}%)`).join("\n")
            
            embed.addField(`Channels where ${self.toLowerCase()} have talked the most`, `\`\`\`\n${chs}${channels.length ? `\n...and ${channels.length} channel${channels.length === 1 ? "" : "s"} more` : ""}\`\`\``)
        }
        
        message.channel.send(embed)
    }
}