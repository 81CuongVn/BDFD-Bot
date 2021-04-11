module.exports = {
    name: "user-info",
    aliases: ["ui", "user"],
    description: "show your or someone elses data",
    category: "info",
    staff: true,
    execute: async (client, message, args) => {
        let query = args.length ? await client.functions.findMember(message, args[0]) : message.member
        
        if (!query) query = await client.functions.findUser(args[0])
        
        if (!query) return message.channel.send(`Could not find any user with given query.`)
        
        const user = query.user || query 
        
        const member = await message.guild.members.fetch(user.id).catch(err => null)
        
        const presence = user.presence 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`${user.username}'s Info${user.bot ? " (BOT)" : user.id === message.guild.ownerID ? " (SERVER OWNER)" : ""}`)
        .addField(`ID`, user.id) 
        .addField(`User`, user.tag)
        .setThumbnail(user.displayAvatarURL({
            dynamic: true,
            size: 4096
        }))
        if (member) embed.addField(`Presence`, `Status: ${presence.status}\nDevices: ${Object.keys(presence.clientStatus || {}).join(" | ") || "none"}\nActivities: ${presence.activities.filter(a => a.type !== "CUSTOM_STATUS").map(c => c.name).join(" | ") || "none"}`)
        if (user.flags) {
            const badges = user.flags.toArray().filter(b => b !== "VERIFIED_DEVELOPER")
            
            const status = member ? member.presence.activities.find(status => status.type === "CUSTOM_STATUS") : null 
            
            if (status) {
                const cstatus = []
                if (status.emoji) cstatus.push("Emoji: " + status.emoji.toString())
                if (status.state) cstatus.push("Details: " + status.state)
                cstatus.push(`Set: ${client.utils.dates.parseMS(Date.now() - status.createdTimestamp).array().slice(0, 2).join(" and ")} ago`)
                embed.addField(`Custom Status`, cstatus.join("\n"))
            }
            
            if (user.displayAvatarURL({dynamic:true}).includes(".gif") || (status && status.emoji && status.emoji.id)) {
                badges.push(`NITRO_CLASSIC`)
            }
            
            if (member && member.premiumSinceTimestamp) badges.push(`NITRO_BOOST`)
            
            embed.addField(`Badges`, badges.map(badge => badge.split("_").map(word => word[0] + word.slice(1).toLowerCase()).join(" ")).join(" | "))
        }
        embed.addField(`Joined Discord`, `${user.createdAt.toISOString().split("T")[0].split("-").reverse().join("-")} at ${user.createdAt.toISOString().split("T")[1].split(".")[0]} (${client.utils.dates.parseMS(Date.now() - user.createdTimestamp).array().slice(0, 2).join(" and ")} ago)`)
        
        if (member && member.premiumSinceTimestamp) {
            embed.addField(`Started Boosting`, `${member.premiumSince.toISOString().split("T")[0].split("-").reverse().join("-")} at ${member.premiumSince.toISOString().split("T")[1].split(".")[0]} (${client.utils.dates.parseMS(Date.now() - member.premiumSinceTimestamp).array().slice(0, 2).join(" and ")} ago)`)
        }
        
        if (user.lastMessage) {
            const m = user.lastMessage
            const sent = client.utils.dates.parseMS(Date.now() - m.createdTimestamp).array().slice(0, 2).join(" and ")
            
            if (m.channel && m.channel.permissionsFor(message.author.id).has("VIEW_CHANNEL")) embed.addField(`Last Message`, `ID: ${m.id}\nContent: ${m.content.slice(0, 512)}\nChannel: ${m.channel}\nSent: ${sent ? sent + " ago" : "just now"}`)
        }
        
        if (member) {
            if (member.nickname) embed.addField(`Nickname`, member.nickname)
            
            embed.setColor(member.displayHexColor)
            .addField(`Joined Server`, `${member.joinedAt.toISOString().split("T")[0].split("-").reverse().join("-")} at ${member.joinedAt.toISOString().split("T")[1].split(".")[0]} (${client.utils.dates.parseMS(Date.now() - member.joinedTimestamp).array().slice(0, 2).join(" and ")} ago)`)
            .addField(`Roles [${member.roles.cache.size - 1}]`, member.roles.cache.size - 1 > 45 ? "Too many roles." : member.roles.cache.filter(r => r.id !== message.guild.id).sort((x, y) => y.position - x.position).map(a => a.toString()).join(" | ") || "none")
            .addField(`Highest Role`, member.roles.highest.toString())
            
            
            const valid = ["ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_ROLES", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MANAGE_GUILD", "MANAGE_NICKNAMES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS", "VIEW_GUILD_INSIGHTS", "BAN_MEMBERS", "KICK_MEMBERS", "MUTE_MEMBERS", "MOVE_MEMBERS", "DEAFEN_MEMBERS"]
            
            const perms = member.permissions.toArray().filter(a => valid.includes(a))
            
            if (perms) embed.addField(`Permissions`, perms.length === 0 ? "none" : perms.includes("ADMINISTRATOR") ? "Administrator (all perms)" : perms.map(p => p.split("_").map(perm => perm[0] + perm.slice(1).toLowerCase()).join(" ")).join(" | "))
        }
        
        embed.setFooter(`ID: ${user.id}`)
        
        message.channel.send(embed)
    }
}