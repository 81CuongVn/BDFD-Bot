
module.exports = {
    name: "staff-list",
    description: "list of staff members",
    category: "staff",
    staff: true,
    slash: false, 
    execute: async (client, message, args) => {
        const m = await message.channel.send(`Loading...`)
        
        const data = client.db.all().filter(a => a.ID.startsWith("staff_")).map(data => {
            return {
                data: JSON.parse(data.data),
                ID: data.ID,
                member: message.guild.members.cache.get(data.ID.split("_")[1])
            }
        }).filter(m => m.member && !m.member.user.bot && Object.values(client.utils.staff_roles).some(id => m.member.roles.cache.has(id)))
        
        let current = 0 
        
        function display() {
            const embed = new client.discord.MessageEmbed()
            
            const { member } = data[current]
            const d = data[current].data
            
            const presences = [
                `Status: ${client.utils.emojis[d.presence.status] || "?"} ${d.presence.status}`,
                d.presence.since ? `Since: ${client.ms(Date.now() - d.presence.since, {long:true})} ago` : undefined,
                d.presence.devices && Object.keys(d.presence.devices).length ? `Devices: ${Object.keys(d.presence.devices).join(", ")}` : undefined,
                d.presence.activities.length ? `Activities: ${d.presence.activities.join(", ")}` : undefined
            ]
            
            const msg = [
                d.lastMessage.id ? `ID: ${d.lastMessage.id}`: undefined,
                d.lastMessage.content ? `Content: \`${d.lastMessage.content.replace(/`/g, "").slice(0, 900)}\`` : undefined,
                d.lastMessage.channel.id ? `Channel: <#${d.lastMessage.channel.id}>` : undefined,
                d.lastMessage.id ? `Sent at: ${client.ms(Date.now() - d.lastMessage.createdTimestamp, {long:true})} ago` : undefined
            ].filter(a => a)
            
            embed.setFooter(`Page ${current + 1} / ${data.length}`)
            embed.setAuthor(`Staff Members List`)
            embed.setColor(member.displayHexColor)
            embed.setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                size: 4096
            }))
            .setTitle(`Information for Staff: ${member.user.tag}`)
            .addField(`Highest Role`, `${member.roles.highest.toString()}`)
            .addField(`Message Count`, `${d.message_count.toLocaleString()}`)
            .addField(`Presence`, presences.filter(a => a).join("\n"))
            if (msg.length) embed.addField(`Last Message`, msg.join("\n"))
            
            m.edit("", embed)
        }
        
        function back() {
            current--
            if (!data[current]) current = data.length - 1
        }
        
        function next() {
            current++
            if (!data[current]) current = 0
        }
        
        const emotes = [client.utils.emojis.left, client.utils.emojis.mark, client.utils.emojis.right]
        
        for (const emote of emotes) {
            await m.react(emote).catch(err => message.channel.send(err.message))
        }
        
        const filter = (r, u) => {
            return emotes.includes(r.emoji.name) && u.id === message.author.id
        }
        
        display()
        
        const collector = m.createReactionCollector(filter, {
            time: 120000
        })
        
        collector.on("collect", (r) => {
            const move = {
                "❌": () => collector.stop(),
                "◀️": () => back(),
                "▶️": () => next()
            }
            
            r.users.remove(message.author.id).catch(err => null)
            
            move[r.emoji.name]()
            
            display()
        })
        
        collector.on("end", () => {
            m.delete()
        })
    }
}