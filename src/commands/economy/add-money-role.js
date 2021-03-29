module.exports = {
    name: "add-money-role",
    mod: true,
    category: "economy",
    description: "add money to every user with a specific role",
    cooldown: 10000,
    usages: ["<role> <cash | bank> <amount>"],
    fields: ["role", "cash | bank", "amount"],
    args: 3,
    examples: ["@Moderator bank 10000"],
    execute: async (client, message, args) => {
        const role = message.guild.roles.cache.get(args.shift().replace(/[<@&>]/g, ""))
        
        if (!role) return message.channel.send(`Could not find any role with given query.`)
        
        const type = args.shift().toLowerCase()
        
        if (!["cash", "bank"].includes(type)) return message.channel.send(`Invalid type given.`)
        
        const amount = client.functions.convert(args.shift())
        
        if (!amount || amount < 1n) return message.channel.send(`Invalid amount given, make sure it is not under 1.`)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        const m = await message.channel.send(`Requesting members...`)
        
        const members = (await message.guild.members.fetch()).filter(m => m.roles.cache.has(role.id))
        
        m.edit(`This will add ${guild.economy_emoji}${amount.toLocaleString()} to ${members.size} members, confirm with \`yes\` or \`cancel\` to cancel this action.`)
        
        const filter = m => m.author.id === message.author.id 
        
        m.channel.awaitMessages(filter, {
            max: 1,
            time: 60e3,
            errors: ["time"]
        })
        .then(async collected => {
            const m = collected.first()
            
            if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
            else if (!["y", "yes"].some(d => m.content.toLowerCase() === d)) return message.channel.send(`Command cancelled.`)
            else {
                await message.channel.send(`Processing request... This might take a while.`)
                
                const start = Date.now()
                
                for (const member of members.array()) {
                    await new Promise(e => setTimeout(e, 200))
                    const data = client.functions.getData(member.id)
                    data.username = member.user.tag 
                    if (type === "bank") {
                        data.bank = (BigInt(data.bank) + amount).toString()
                    } else {
                        data.money = (BigInt(data.money) + amount).toString()
                    }
                    
                    client.db.set(`data_${member.id}`, data)
                }
                
                const embed = new client.discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.author.tag, message.author.displayAvatarURL({
                    dynamic: true
                }))
                .setTimestamp()
                .setTitle(`Role Money Given!`)
                .setDescription(`Role: ${role}\nMembers: ${members.size.toLocaleString()}\nAmount: ${guild.economy_emoji}${amount.toLocaleString()}\nDuration: ${client.utils.dates.parseMS(Date.now() - start).array(true).join(" ")}`)
                
                message.channel.send(embed)
            }
        })
        .catch(err => {
            if (err.message) {
                message.channel.send(`Something went wrong while adding money.`)
            } else messsage.channel.send(`Command cancelled.`)
        })
    }
}