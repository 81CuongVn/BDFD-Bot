module.exports = {
    name: "add-money",
    description: "add money to someone balance or bank",
    args: 3,
    mod: true,
    category: "economy",
    usages: ["<cash | bank> <money> <member>"],
    examples: ["cash 1e5 Holly"],
    fields: ["cash | bank", "amount", "member"],
    cooldown: 5000,
    execute: async (client, message, args) => {
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        const type = args.shift()
        
        const amount = client.functions.convert(args.shift())
        
        const member = await client.functions.findMember(message, args.join(" "))
        
        if (member && member.id !== client.owners[0] && member.roles.cache.has("659789148806447134")) return message.channel.send(`No cheating.`)
        
        if (!["cash", "bank"].includes(type.toLowerCase())) return message.channel.send(embed.setDescription(`That is not a valid money type.`))
        
        if (!amount || amount < 1n || amount.toString().length  > 300) return message.channel.send(embed.setDescription(`Invalid amount given.`))
        
        if (!member) return message.channel.send(embed.setDescription(`Could not find any member with given query.`))
        
        const guild = client.functions.getGuild(message.guild.id)
        
        const data = client.functions.getData(member.id)
        
        data.username = member.user.username 
        if (type.toLowerCase() === "cash") {
            data.money = (BigInt(data.money) + amount).toString()
        } else {
            data.bank = (BigInt(data.bank) + amount).toString()
        }
        
        client.db.set(`data_${member.id}`, data)
        
        embed.setColor("GREEN")
        .setDescription(`Successfully added ${guild.economy_emoji}${amount.toLocaleString()} to ${member}.`)
        
        message.channel.send(embed)
    }
}