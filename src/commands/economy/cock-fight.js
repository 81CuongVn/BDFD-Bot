module.exports ={
    name: "cock-fight",
    aliases: ["cf"],
    description: "put your chicken into battle",
    cooldown: 10000,
    args: 1,
    category: "economy",
    fields: ["bet"],
    usages: ["<bet>"],
    examples: ["500", "5e3"],
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setTimestamp()
        
        const amount = args[0].toLowerCase() === "all" ? BigInt(data.money) : client.functions.convert(args[0])
        
        if (!amount || amount < 1n) return message.channel.send(embed.setDescription(`Invalid \`amount\` given.`)), message.deleteCooldown()
        
        if (amount > BigInt(data.money)) return message.channel.send(embed.setDescription(`You cannot bet more than what you have.`)), message.deleteCooldown()
        
        if (!data.inventory.Chicken) return message.channel.send(embed.setDescription(`You do not have any chicken to fight with.`)), message.deleteCooldown()
        
        const guild = client.functions.getGuild(message.guild.id)
        
        let chance = data.cf || guild.cock_fight.start 
        
        const r = Math.floor(Math.random() * 100)
        
        data.username = message.author.tag 
        
        if (chance > r) {
            embed.setColor("GREEN")
            data.money = (BigInt(data.money) + amount).toString()
            data.cf = chance + Number(guild.cock_fight.ratio) 
            if (data.cf > Number(guild.cock_fight.max)) data.cf = Number(guild.cock_fight.max)
            
            embed.setDescription(`Your chicken won the fight! +${guild.economy_emoji}${amount.toLocaleString()}`)
            
            client.db.set(`data_${message.member.id}`, data)
            embed.setFooter(`Your chicken is now stronger! Winning chance: ${data.cf}%`)
        } else {
            
            data.inventory.Chicken--
            if (!data.inventory.Chicken) delete data.inventory.Chicken
            data.cf = null 
            embed.setDescription(`💀 Your chicken died...`)
            data.money = (BigInt(data.money) - amount).toString()
            client.db.set(`data_${message.member.id}`, data)
        }
        
        message.channel.send(embed)
    }
}