module.exports ={
    name: "coin-flip",
    aliases: ["flipcoin", "fp", "flip-coin"],
    description: "bet to heads or tails and flip the coin!",
    cooldown: 10000,
    category: "economy",
    args: 2,
    usages: ["<amount | all> <heads | tails>"],
    examples: ["1e4 heads", "all tails"],
    fields: ["amount", "heads | tails"],
    execute: async (client, message, args) => {
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        const am = args.shift().toLowerCase()
        
        const data = client.functions.getData(message.author.id)
        
        const amount = am === "all" ? BigInt(data.money) : client.functions.convert(am)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        if (!amount || amount < 100n) return message.channel.send(embed.setDescription(`You must bet a amount over ${guild.economy_emoji}100.`)), message.deleteCooldown()
        
        if (amount > BigInt(data.money)) return message.channel.send(embed.setDescription(`You cannot bet more than what you have.`)), message.deleteCooldown()
        
        const type = args.shift().toLowerCase()
        
        if (!["tails", "heads"].includes(type)) return message.channel.send(embed.setDescription(`You can only bet to either \`heads\` or \`tails\`.`)), message.deleteCooldown()
        
        const rn = ["heads", "tails", "heads", "tails", "heads", "tails"][Math.floor(Math.random() * 6)]
        
        data.username = message.author.tag 
        
        if (rn === type) {
            embed.setColor("GREEN")
            embed.setTitle("You win!")
            embed.setDescription(`${message.member} flipped a coin and got **${rn[0].toUpperCase() + rn.slice(1)}**! +${guild.economy_emoji}${amount.toLocaleString()}`)
            data.money = (BigInt(data.money) + amount).toString()
        } else {
            embed.setTitle(`You lost!`)
            embed.setDescription(`${message.member} flipped a coin and got **${rn[0].toUpperCase() + rn.slice(1)}**... -${guild.economy_emoji}${amount.toLocaleString()}`)
            data.money = (BigInt(data.money) - amount).toString()
        }
        
        client.db.set(`data_${message.member.id}`, data)
        
        message.channel.send(embed)
    }
}