module.exports = {
    name: "gang",
    description: "displays your gang.",
    category: "gangs",
    cooldown: 6000,
    execute: async (client, message, args) => {
        const data = client.functions.getGang(message.author.id)
        
        if (!data.owner_id) return message.channel.send(`You are not in any gang.`)
        
        const members = Object.values(data.members).map((data, y) => `**${y+1}.** ${data.username} (${data.rank[0].toUpperCase() + data.rank.slice(1)}) (joined ${client.utils.dates.parseMS(Date.now() - data.joined_at).array(true)[0]} ago)`)
        
        const pages = Math.trunc(members.length / 15) + 1 
        let page = Number(args[0]) || 1 
        if (page < 1) page = 1 
        if (page > pages)page = pages 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setTitle(data.name)
        .setDescription(data.description)
        .addField(`Members [${members.length} / ${data.max_members}]`, members.slice(page*15-15,page*15).join("\n"))
        .addField(`Pending Requests`, data.requests.length)
        .setFooter(`Page ${page} / ${pages} | Founded at `)
        .setTimestamp(data.founded_at)
        
        message.channel.send(embed)
    }
}