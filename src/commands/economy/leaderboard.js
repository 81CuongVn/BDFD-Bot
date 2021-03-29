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
        
        const r = (args[0] || "total").replace(/-/g, "")
        
        const rank = client.functions.getLeaderboardRank(message.author.id, r.replace(/-/g, "") === "cash" ? "money" : r.replace(/-/g, "") === "bank" ? "bank": undefined)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        const pages = Math.trunc(rank.array.length / 10) + 1 
        let page = Number(args[1] || args[0]) || 1 
        if (page > pages) page = pages
        if (page < 1) page = 1 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Money Leaderboard (${r})`, message.guild.iconURL({dynamic:true}))
        .setTimestamp()
        .setDescription(rank.array.slice(page*10-10, page*10).map((x, top) => {
            return `**${page*10-10+top+1}.** [${x.data.username}](https://nothing.com) - ${guild.economy_emoji}${r === "total" ? (BigInt(x.data.money) + BigInt(x.data.bank)).toLocaleString() : r === "bank" ? BigInt(x.data.bank).toLocaleString() : BigInt(x.data.money).toLocaleString()}`
        }).join("\n"))
        .setFooter(`${rank.position ? `Position on the leaderboard: ${rank.position}# | ` : ""}Page ${page} / ${pages}`)
        
       message.channel.send(embed) 
    }
}