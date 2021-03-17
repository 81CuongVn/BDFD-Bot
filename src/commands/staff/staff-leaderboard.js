module.exports = {
    name: "staff-leaderboard",
    aliases: ["slb"],
    category: "staff",
    staff: true,
    description: "leaderboard of staff messages",
    execute: async (client, message, args) => {
        const m = message.channel.inttoken ? undefined : await message.channel.send("Loading...")
        
        const timers = client.functions.getTimers()
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(message.guild.iconURL({
            dynamic: true,
            size: 4096
        }))
        .setTitle(`Staff Message Leaderboard`)
        .setFooter(`Has been counting since`)
        .setTimestamp(timers.staff_messages)
        
        const content = []
        
        let y = 1 
        
        for (const d of client.db.all().filter(d => d.ID.startsWith("staff_")).map(d => {
            return {
                ID: d.ID,
                member: message.guild.members.cache.get(d.ID.split("_")[1]),
                data: JSON.parse(d.data)
            }
        }).filter(d => d.member && !d.member.user.bot && Object.values(client.utils.staff_roles).some(id => d.member.roles.cache.has(id))).sort((x, y) => y.data.message_count - x.data.message_count)) {
            content.push(`\`${y}#\` - ${d.member.displayName} [${d.member}]: ${d.data.message_count.toLocaleString()} message${d.data.message_count === 1 ? "" : "s"}`)
            y++
        }
        
        embed.setDescription(content.join("\n"))
        
        if (m) m.edit("", embed)
        else message.channel.send(embed)
    }
}