module.exports = {
    name: "list-requests",
    aliases: ["requests", "requests-list"],
    description: "list invite requests.",
    category: "gangs",
    cooldown: 5000,
    execute: async (client, message, args) => {
        const gang = client.functions.getGang(message.author.id)
        
        if (!gang.owner_id) return message.channel.send(`You need to be in a gang first.`)
        
        if (!["owner", "co-owner"].includes(gang.members[message.member.id].rank)) return message.channel.send(`You need to be owner or co-owner in order to check gang invite requests.`)
        
        const pages = Math.trunc(gang.requests.length / 15) + 1 
        let page = Number(args[0]) || 1 
        
        if (page < 1) page = 1 
        if (page > pages) page = pages 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setTimestamp()
        .setFooter(`Page ${page} / ${pages} | Use +decline <id> or +accept <id> to manage invite requests.`)
        .setDescription(gang.requests.slice(page*10-10,page*10).map((data, y) => {
            return `**${page*10-10+1+y}.** ${data.username} (\`${data.id}\`)`
        }).join("\n") || "The list is empty.")
        .setTitle(`Invite requests for ${gang.name}`)
        
        message.channel.send(embed)
    }
}