module.exports = {
    name: "slut",
    description: "Idk whay to say",
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
        .setColor(chance < Number(guild.slut.fine_ratio) ? "RED" : "GREEN")
        if (chance < Number(guild.slut.fine_ratio)) {
            value = guild.slut.fine.type === "number" ? BigInt(guild.slut.fine.value) : BigInt(money) * BigInt(guild.slut.fine.value) / 100n 
        } else {
            if (guild.slut.min.type === "number") {
                value = client.random(BigInt(guild.slut.max.value), BigInt(guild.slut.min.value))
            } else {
                value = client.random(BigInt(money) * BigInt(guild.slut.max.value) / 100n, BigInt(money) * BigInt(guild.slut.min.value) / 100n)
            }
        }
        
        if (chance >= Number(guild.slut.fine_ratio) && value === 0n) {
            value = client.random(1000n, 2500n)
        }
        
        data.money = chance < Number(guild.slut.fine_ratio) ? (BigInt(data.money) - value).toString() : (BigInt(data.money) + value).toString()
        
        const reply = (guild.slut[chance < Number(guild.slut.fine_ratio) ? "fine_replies" : "replies"][Math.floor(Math.random() * guild.slut.replies.length)] || (chance < Number(guild.slut.fine_ratio) ? "{user} was caught by the police while trying to whip it out and got ent to jail, losing {emoji}{money}." : "{user} whiped it out and got {emoji}{value}.")).replace(/{user}/g, message.author.toString()).replace(/{(money|value)}/g, value.toLocaleString()).replace(/{emoji}/g, guild.economy_emoji)
        
        embed.setDescription(reply)
        
        data.username = message.author.username
        
        client.db.set(`data_${message.author.id}`, data)
        
        message.channel.send(embed)
    }
}