module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    description: "leaderboard of users with most money, bank or total.",
    fields: ["type"],
    examples: ["cash", "bank", "total"],
    usages: ["[type]"],
    category: "economy",
    cooldown: 10000,
    execute: async (client, message, args) => {
        
        client.api.channels(message.channel.id).typing.post()
        
        const r = ((!Number(args[0]) ? args[0] : args[1]) || "total").replace(/-/g, "")
        
        if (!Number(r) && !["total", "cash", "bank"].includes(r)) return message.channel.send(`Invalid leaderboard type given.`)
        
        const rank = client.functions.getLeaderboardRank(message.author.id, r.replace(/-/g, "") === "cash" ? "money" : r.replace(/-/g, "") === "bank" ? "bank": undefined)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        const pages = Math.trunc(rank.array.length / 10) + 1 
        let page = Number(args[1] || args[0]) || 1 
        if (page > pages) page = pages
        if (page < 1) page = 1 
        
        let position = "unranked"
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Money Leaderboard (${r})`, message.guild.iconURL({dynamic:true}))
        .setTimestamp()
        .setDescription(rank.array.map((x, top) => {
            if (x.user_id === message.member.id) position = top + 1 
            
            let show = top >= page * 10 - 10 && top <= page * 10 
            
            return `**${top+1}.** [${x.data.username}](https://botdesignerdiscord.com) - ${guild.economy_emoji}${r === "total" ? (BigInt(x.data.money) + BigInt(x.data.bank)).shorten(show) : r === "bank" ? BigInt(x.data.bank).shorten(show) : BigInt(x.data.money).shorten(show)}${x.data.blacklisted ? ` (${x.data.blacklist_duration ? "Temp-Banned" : "Banned"})` : ""}`
        }).slice(page*10-10, page*10).join("\n"))
        .setFooter(`${position !== "unranked" ? `Position on the leaderboard: ${position}# | ` : ""}Page ${page} / ${pages}`)
        
       message.channel.send(embed) 
    }
}