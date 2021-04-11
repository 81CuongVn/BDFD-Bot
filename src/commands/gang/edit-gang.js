module.exports = {
    name: "edit-gang",
    description: "edit gang name or description",
    args: 2,
    category: "gangs",
    cooldown: 15000,
    examples: ["name Creators", "description nice one gang"],
    usages: ["<name | color | thumbnail | description> <value>"],
    fields: ["name | thumbnail | description" , "value"],
    execute: async (client, message, args) => {
        const gangs = client.db.get("gangs")
        
        const index = gangs.findIndex(f => f.members[message.member.id])
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        if (index === -1) return message.channel.send(embed.setDescription(`You need to be in a gang in order to perform this command.`))
        
        const gang = gangs[index]
        
        if (!["owner", "co-owner"].includes(gang.members[message.member.id].rank)) return message.channel.send(embed.setDescription(`Only the owner or co-owners of this gang can perform these actions.`))
        
        const type = args.shift().toLowerCase()
        
        if (!["thumbnail", "color", "description", "name"].includes(type)) return message.channel.send(embed.setDescription(`Invalid \`type\` given, choose between \`description, color, thumbnail and name\`.`))
   
        const n = args.join(" ")
        
        if (n.length > 256) return message.channel.send(embed.setDescription(`The new ${type} cannot be larger than 256 characters.`))
        
        if (type === "color") {
            try {
                new client.discord.MessageEmbed().setColor(n)
            } catch (e) {
                return message.channel.send(embed.setDescription(`The color must be a valid hex or int.`))
            }
        }
        if (type === "thumbnail" && !n.startsWith("http")) return message.channel.send(embed.setDescription(`The thumbnail url must start with http.`))
        
        if (type === "name" && gangs.find(a => a.name.toLowerCase() === n.toLowerCase())) return message.channel.send(embed.setDescription(`A gang with that name already exists.`))
        
        gangs[index][type] = n 
        
        client.db.set(`gangs`, gangs)
        
        embed.setColor("GREEN")
        embed.setTitle(`${type[0].toUpperCase() + type.slice(1)} Updated!`)
        embed.setDescription(n)
        
        message.channel.send(embed)
    }
}