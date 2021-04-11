module.exports = {
    name: "gang",
    description: "displays your gang.",
    category: "gangs",
    cooldown: 6000,
    execute: async (client, message, args) => {
        const data = client.functions.getGang(message.author.id)
        
        if (!data.owner_id) return message.channel.send(`You are not in any gang.`)
        
        await client.api.channels(message.channel.id).typing.post()
        
        let networth = 0n 
        
        const members = Object.values(data.members).map((data, y) => {
            const d  = client.functions.getData(data.id)
            networth += (BigInt(d.money) + BigInt(d.bank))
            
            return`**${y+1}.** [${data.username}](https://botdesignerdiscord.com) (${data.rank[0].toUpperCase() + data.rank.slice(1)}) (joined ${client.utils.dates.parseMS(Date.now() - data.joined_at).array(true)[0]} ago)`
            
        })
        
        const pages = Math.trunc(members.length / 10) + 1 
        let page = Number(args[0]) || 1 
        if (page < 1) page = 1 
        if (page > pages)page = pages 
        
        const embed = new client.discord.MessageEmbed()
        .setColor(data.color || "YELLOW")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setTitle(data.name)
        .setDescription(data.description)
        .addField(`Members [${members.length} / ${data.max_members}]`, members.slice(page*10-10,page*10).join("\n"))
        .addField(`Pending Requests`, data.requests.length)
        .addField(`Total Net Worth`, `<:bdfd_coin:766607515445231637>${networth.shorten()}`)
        .setFooter(`Page ${page} / ${pages} | Founded at `)
        .setTimestamp(data.founded_at)
        
        if (data.owner_id === client.owners[0]) embed.setImage("https://cdn.discordapp.com/icons/566363823137882154/a_768c471c4436b4c8ef6ebf2a60e9908a.gif?size=128")
        
        if (data.thumbnail) {
            try {
                embed.setThumbnail(data.thumbnail)
            } catch (e) {
                
            }
        }
        
        message.channel.send(embed)
        
        client.gangs_net.set(data.owner_id, networth)
    }
}