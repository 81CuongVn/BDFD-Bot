module.exports = {
    name: "rob",
    aliases: ["steal"],
    description: "commit a robbery for money, there is a chance to get fined.",
    category: "economy",
    args: 1,
    usages: ["<user>"],
    examples: ["@Ruben"],
    fields: ["user"],
    cooldown: require("ms")("3h"),
    execute: async (client, message, args) => {
        
        const member = await client.functions.findMember(message, args.join(" "))
        
        if (!member) return message.channel.send(`Could not find any member with given query.`), message.deleteCooldown()
        
        if (member.user.id === message.member.id) return message.channel.send(`I cannot allow you do that.`), message.deleteCooldown()
        
        if (member.user.bot) return message.channel.send(`Rule 9, don't mess with bots.`), message.deleteCooldown()
        
        const data = client.functions.getData(message.author.id)
        
        const target = client.functions.getData(member.id)
        
        if (client.bjs.has(member.id)) return message.channel.send(`Unable to rob this user.`), message.deleteCooldown()
        
        if (target.gang && data.gang && target.gang_id === data.gang_id) return message.channel.send(`You cannot rob members of the same gang.`), message.deleteCooldown()
        
        if (BigInt(target.money) < 1) {
            const embed = new client.discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
            }))
            .setColor("RED")
            .setDescription(`You tried to rob ${member.user.tag} but they had no money.`)
            message.channel.send(embed)
            return
        }
        
        const money = BigInt(data.money) + BigInt(data.bank)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        let value; 
        const chance = Math.floor(Math.random() * 100)
        
        const embed = new client.discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setColor(chance < Number(guild.rob.fine_ratio) ? "RED" : "GREEN")
        if (chance < Number(guild.rob.fine_ratio)) {
            value = guild.rob.fine.type === "number" ? BigInt(guild.rob.fine.value) : BigInt(money) * BigInt(guild.rob.fine.value) / 100n 
        } else {
            if (guild.rob.min.type === "number") {
                value = client.random(BigInt(guild.rob.max.value), BigInt(guild.rob.min.value))
                if (value > BigInt(target.money)) value = BigInt(target.money)
            } else {
                value = client.random(BigInt(target.money) * BigInt(guild.rob.max.value) / 100n, BigInt(target.money) * BigInt(guild.rob.min.value) / 100n)
            }
        }
        
        if (chance >= Number(guild.rob.fine_ratio) && value === 0n) {
            value = client.random(1000n, 2500n)
        }
        
        if (chance >= Number(guild.rob.fine_ratio)) target.money =( BigInt(target.money) - value).toString()
        
        data.money = chance < Number(guild.rob.fine_ratio) ? (BigInt(data.money) - value).toString() : (BigInt(data.money) + value).toString()
        
        const reply = (guild.rob[chance < Number(guild.rob.fine_ratio) ? "fine_replies" : "replies"][Math.floor(Math.random() * guild.rob.replies.length)] || (chance < Number(guild.rob.fine_ratio) ? "{user} was caught by the police while trying to rob {target} and got sent to jail, losing {emoji}{money}." : "{user} robbed {target} and got away with {emoji}{value}.")).replace(/{user}/g, message.author.toString()).replace(/{(money|value)}/g, value.toLocaleString()).replace(/{emoji}/g, guild.economy_emoji).replace(/{target}/g, member.user.toString())
        
        embed.setDescription(reply)
        
        data.username = message.author.username
        target.username = member.user.username
        
        client.db.set(`data_${message.author.id}`, data)
        client.db.set(`data_${member.id}`, target)
        
        message.channel.send(embed)
    }
}