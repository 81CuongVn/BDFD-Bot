module.exports = {
    name: "list-gangs",
    aliases: ["gangs", "gang-list"],
    description: "list gangs",
    cooldown:10000,
    category: "gangs",
    execute: async (client, message, args) => {
        
        let page = Number(args[0]) || 1 
        const gangs = (client.db.get("gangs") || []).sort((x, y) => {
            return (Number(client.gangs_net.get(y.owner_id)) || 0) - (Number(client.gangs_net.get(x.owner_id)) || 0)
        })
        const pages = Math.trunc(gangs.length / 5) + 1 
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
        
        let y = page * 5 - 5 + 1
        
        for (const gang of gangs.slice(page*5-5,page*5)) {
            embed.addField(`${y}. ${gang.name}`, `Owner: <@${gang.owner_id}>\nDescription: ${gang.description}\nMembers: ${Object.keys(gang.members).length} / ${gang.max_members || 50}\nFounded: ${new Date(gang.founded_at).toISOString().split("T")[0].split("-").reverse().join("-")}${client.gangs_net.has(gang.owner_id) ? `\nNetworth: <:bdfd_coin:766607515445231637>${client.gangs_net.get(gang.owner_id).shorten()}` : ""}`)
            y++
        }
        
        message.channel.send(embed)
    }
}