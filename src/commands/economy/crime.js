module.exports = {
    name: "crime",
    description: "commit a crime for money, there is a chance to get fined.",
    category: "economy",
    cooldown: 600000,
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        const money = BigInt(data.money) + BigInt(data.bank)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        let value; 
        const chance = Math.floor(Math.random() * 100)
        
        const embed = new client.discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setColor(chance < Number(guild.crime.fine_ratio) ? "RED" : "GREEN")
        if (chance < Number(guild.crime.fine_ratio)) {
            value = guild.crime.fine.type === "number" ? BigInt(guild.crime.fine.value) : BigInt(money) * BigInt(guild.crime.fine.value) / 100n 
        } else {
            if (guild.crime.min.type === "number") {
                value = client.random(BigInt(guild.crime.max.value), BigInt(guild.crime.min.value))
            } else {
                value = client.random(BigInt(money) * BigInt(guild.crime.max.value) / 100n, BigInt(money) * BigInt(guild.crime.min.value) / 100n)
            }
        }
        
        if (chance >= Number(guild.crime.fine_ratio) && value === 0n) {
            value = client.random(1000n, 2500n)
        }
        
        data.money = chance < Number(guild.crime.fine_ratio) ? (BigInt(data.money) - value).toString() : (BigInt(data.money) + value).toString()
        
        const reply = (guild.crime[chance < Number(guild.crime.fine_ratio) ? "fine_replies" : "replies"][Math.floor(Math.random() * guild.crime.replies.length)] || (chance < Number(guild.crime.fine_ratio) ? "{user} was caught by the police while trying to rob a bank and got sent to jail, losing {emoji}{money}." : "{user} robbed a bank and got away with {emoji}{value}.")).replace(/{user}/g, message.author.toString()).replace(/{(money|value)}/g, value.toLocaleString()).replace(/{emoji}/g, guild.economy_emoji)
        
        embed.setDescription(reply)
        
        data.username = message.author.username
        
        client.db.set(`data_${message.author.id}`, data)
        
        message.channel.send(embed)
    }
}