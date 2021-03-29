module.exports = {
    name: "pay",
    description: "pays someone a specific amount of money.",
    category: "economy",
    args: 2,
    examples: ["@Ruben all", "123456789012345678 6e10"],
    usages: ["<member> <amount | all>"],
    fields: ["member", "amount"],
    cooldown: 5000,
    execute: async (client, message, args) => {
        const am = args.pop()
        
        const member = await client.functions.findMember(message, args.join(" "))
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        if (!member) return message.channel.send(embed.setDescription(`Could not find any member with given query.`))
        
        if (member.id == message.author.id) return message.channel.send(embed.setDescription(`You cannot pay yourself.`))
        
        if (member.user.bot) return message.channel.send(embed.setDescription(`You can't pay a bot.`))
        
        const data = client.functions.getData(message.member.id)
        
        const amount = am.toLowerCase() === "all" ? BigInt(data.money) : client.functions.convert(am) 
        
        if (!amount && amount !== 0n) return message.channel.send(embed.setDescription(`Invalid \`amount\` given.`))
        
        if (amount < 1n) return message.channel.send(embed.setDescription(`You cannot pay 0 or less.`))
        
        const guild = client.functions.getGuild(message.guild.id)
        
        if (amount > BigInt(data.money)) return message.channel.send(embed.setDescription(`You do not have ${guild.economy_emoji}${amount.toLocaleString()} in your wallet.`))
        
        const target = client.functions.getData(member.id)
        
        data.money = (BigInt(data.money) - amount).toString()
        target.money = (BigInt(target.money) + amount).toString()
        data.username = message.author.tag 
        target.username = member.user.username 
        
        client.db.set(`data_${member.id}`, target)
        
        client.db.set(`data_${message.author.id}`, data)
        
        embed.setColor("GREEN")
        embed.setDescription(`You have successfully payed ${guild.economy_emoji}${amount.toLocaleString()} to ${member}`)
        
        message.channel.send(embed)
    }
}