module.exports = {
    name: "withdraw",
    aliases: ["with"],
    args: 1,
    fields: ["amount"],
    examples: ["100", "1e1", "all"],
    usages: ["<amount | all"],
    category: "economy",
    cooldown: 3500,
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        const amount = args[0].toLowerCase() === "all" ? BigInt(data.bank) : client.functions.convert(args[0])
        
        const embed = new client.discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setTimestamp()
        .setColor("RED")
        
        if ((!amount && amount !== 0n) || amount < 0n) { 
            embed.setDescription(`Invalid \`amount\` given.`)
            
            return message.channel.send(embed), message.deleteCooldown()
        }
        
        if (amount > BigInt(data.bank)) {
            embed.setDescription(`You can't withdraw more than what you have.`)
            return message.channel.send(embed), message.deleteCooldown()
        }
        
        if (!amount) return message.channel.send(embed.setDescription(`Cannot withdraw ${guild.economy_emoji}0.`)), message.deleteCooldown()
        
        data.money = (BigInt(data.money) + amount).toString()
        data.username = message.author.tag 
        data.bank = (BigInt(data.bank) - amount).toString()
        
        client.db.set(`data_${message.author.id}`, data)
        
        embed.setColor("GREEN")
        embed.setDescription(`Successfully withdrew ${guild.economy_emoji}${amount.shorten()} from your bank.`)
        
        message.channel.send(embed)
    }
}