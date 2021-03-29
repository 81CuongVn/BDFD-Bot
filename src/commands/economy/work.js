module.exports = {
    name: "work",
    cooldown: 600000,
    category: "economy",
    description: "work and get money",
    execute: async (client, message, args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const data = client.functions.getData(message.author.id)
        
        const work = guild.work 
        
        let value 
        
        if (work.min.type === "number") {
            value = client.random(BigInt(work.max.value), BigInt(work.min.value))
        } else {
            value = client.random(BigInt(data.bank) * BigInt(work.max.value) / 100n, BigInt(data.bank) * BigInt(work.min.value) / 100n)
        }
        
        if (value === 0n && work.min.type === "percentage") {
            value = client.random(1500n, 250n)
        }
        
        const reply = (work.replies[Math.floor(Math.random() * work.replies.length)] || `{user} worked for some hours and got {emoji}{value} money.`).replace(/{user}/g, message.author.toString()).replace(/{(money|value)}/g, value.toLocaleString()).replace(/{emoji}/g, guild.economy_emoji)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic:true}))
        .setTimestamp()
        .setDescription(reply)
        
        data.username = message.author.tag
        data.money = (BigInt(data.money) + value).toString()
        
        client.db.set(`data_${message.author.id}`, data)
        
        message.channel.send(embed)
    }
}