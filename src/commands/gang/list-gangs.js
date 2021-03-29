module.exports = {
    name: "list-gangs",
    aliases: ["gangs", "gang-list"],
    description: "list gangs",
    cooldown:10000,
    category: "gangs",
    execute: async (client, message, args) => {
        
        let page = Number(args[0]) || 1 
        const gangs = client.db.get("gangs") || []
        const pages = Math.trunc(gangs.length / 10) + 1 
        if (page > pages) page = pages 
        else if (page < 1 ) page = 1 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`Gang List`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setFooter(`Page ${page} / ${pages} | Looking for a gang? Use +request <gang name> to apply for a gang.`)
        .setTimestamp()
        
        let y = page * 10 - 10 + 1
        
        for (const gang of gangs.slice(page*10-10,page*10)) {
            embed.addField(`${y}. ${gang.name}`, `Owner: <@${gang.owner_id}>\nDescription: ${gang.description}\nMembers: ${Object.keys(gang.members).length} / ${gang.max_members || 50}\nFounded: ${new Date(gang.founded_at).toISOString().split("T")[0].split("-").reverse().join("-")}`)
            y++
        }
        
        message.channel.send(embed)
    }
}