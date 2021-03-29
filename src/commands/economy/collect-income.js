module.exports = {
    name: "collect-income",
    aliases: ["collect"],
    description: "collect income roles.",
    cooldown: 10000,
    category: "economy",
    execute: async (client, message, args) => {
        const roles = await client.functions.roleIncome(message.author.id)
        
        const data = client.functions.getData(message.author.id)
        
        data.username = message.author.tag 
        
        if (!roles.allowed.length && !roles.next) return message.channel.send(`You currently have no role income to collect.`)
        
        const embed = new client.discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic:true}))
        .setTimestamp()
        
        if (!roles.allowed.length) {
            const next = client.utils.dates.parseMS(roles.next).array(true).join(" ")
            
            embed.setColor("RED")
            .setTitle(`Error`)
            embed.setDescription(`You can next collect income in ${next}.`)
            
            return message.channel.send(embed)
        }
        
        const cds = client.income_cooldowns.get(message.author.id) || new client.discord.Collection()
        
        for (const role of roles.allowed) {
            cds.set(role.id, Date.now())
            
            if (role.type === "bank") {
                if (role.isPercent) {
                    data.bank = (BigInt(data.bank) + (BigInt(data.bank) * BigInt(role.amount) / 100n)).toString()
                } else {
                    data.bank = (BigInt(data.bank) + BigInt(role.amount)).toString()
                }
            } else {
                if (role.isPercent) {
                    data.money= (BigInt(data.money) + (BigInt(data.money) * BigInt(role.amount) / 100n)).toString()
                } else {
                    data.money = (BigInt(data.money) + BigInt(role.amount)).toString()
                }
            }
        }
        
        client.db.set(`data_${message.author.id}`, data)
        
        client.income_cooldowns.set(message.author.id, cds)
        
        embed.setTitle(`Role Income Collected`)
        .setColor("GREEN")
        embed.setDescription(roles.allowed.slice(0, 15).map((r, id) => {
           return  `\`${id+1}\`.- <@&${r.id}> | ${BigInt(r.amount).toLocaleString()}${r.isPercent ? "%" : ""} (${r.type})`
        }).join("\n") + (roles.allowed.slice(15).length ? `\n...and ${roles.allowed.slice(15).length} roles more.` : ""))
        
        message.channel.send(embed)
    }
}