module.exports = {
    name: "role-income",
    description: "list, add or remove income roles.",
    args: 1,
    fields: ["list | add | remove", "role | ID", "cash | bank", "amount", "interval"],
    examples: [
        "list",
        "add @smth cash 1000 30m",
        "remove 1"
    ],
    usages: [
        "<list | add | remove> <role | ID> <cash | bank> <amount(%)?> <interval>"
    ],
    category: "settings",
    execute: async (client, message, args) => {
        const option = args.shift().toLowerCase()
        
        const data = client.functions.getGuild(message.guild.id)
        
        if (option === "list") {
            const pages = Math.trunc(data.income_roles.length / 10) + 1 
            let page = Number(args[0]) || 1 
            
            if (page > pages) page = pages 
            else if (page < 1) page = 1 
            
            const embed = new client.discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(`Role Income List`, message.guild.iconURL({dynamic: true}))
            .setDescription(data.income_roles.slice(page*10-10, page*10).map((d, id) => {
                return `\`${page*10-10+id+1}\`.- <@&${d.id}> | ${BigInt(d.amount).toLocaleString()}${d.isPercent ? "%" : ""} every ${client.utils.dates.parseMS(d.cooldown).array(true).join(" ")} (${d.type})`
            }).join("\n"))
            .setTimestamp()
            embed.setFooter(`Page ${page} / ${pages}`)
            
            message.channel.send(embed)
        } else if (option === "add") {
            if (!message.member.roles.cache.has("578903414562357288")) return message.channel.send(`You cannot use this option.`)
            
            if (args.length < 4) return message.channel.send(`Not enough args were passed.`)
            
            const role = message.guild.roles.cache.get(args.shift().replace(/[<&@>]/g, ""))
            
            const type = args.shift().toLowerCase()
            
            const am = args.shift()
            
            const isPercent = am.endsWith("%")
            
            const amount = client.functions.convert(am.replace("%", ""))
            
            const every = client.ms(args.shift())
            
            if (!role) return message.channel.send(`Role does not exist.`)
            
            if (!["cash", "bank"].includes(type)) return message.channel.send(`Type is not valid.`)
            
            if (!amount) return message.channel.send(`Invalid amount given.`)
            
            if (!every) return message.channel.send(`Invalid interval given.`)
            
            if (data.income_roles.some(i => i.id === role.id)) return message.channel.send(`Role was already assigned.`)
            
            data.income_roles.push({
                id: role.id,
                cooldown: every,
                isPercent, 
                type,
                amount: amount.toString()
            })
            
            client.db.set(`guild_${message.guild.id}`, data)
            
            message.channel.send(`Successfully created income role.`)
        } else {
            if (!message.member.roles.cache.has("578903414562357288")) return message.channel.send(`You cannot use this option.`)
            
            if (!data.income_roles.some((_, id) => id+1 === Number(args[0]))) return message.channel.send(`That is not a valid income role id.`)
            
            data.income_roles = data.income_roles.filter((_, id) => id+1 !== Number(args[0]))
            
            client.db.set(`guild_${message.guild.id}`, data)
            
            message.channel.send(`Successfully removed income role with ID \`${args[0]}\`.`)
        }
    }
}