module.exports = {
    name: "set-cock-fight",
    description: "sets cock fight chances",
    mod: true,
    category: "settings",
    args: 2,
    fields: ["increment | start | max", "amount"],
    usages: ["<increment | start| max> <amount>"],
    examples: ["increment 1", "start 60%"],
    execute: async (client, message, args) => {
        const type = args.shift().toLowerCase()
        
        if (!["increment", "start", "max"].includes(type)) return message.channel.send(`Provide a valid type between \`increment, start or max\`.`)
        
        const amount = Number(args.shift().replace("%", ""))
        
        if (type !== "increment" && (!amount || amount < 1 || amount > 100)) return message.channel.send(`Supply a valid amount between 1 and 100%.`)
        
        if (type === "increment" && (!amount || amount < 0 || amount> 10)) return message.channel.send(`Supply a valid amount between 0 and 10%.`)
                
        const guild = client.functions.getGuild(message.guild.id)
        
        guild.cock_fight[type.replace("increment", "ratio")] = amount 
        client.db.set(`guild_${message.guild.id}`, guild)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true 
        }))
        .setTimestamp()
        .setDescription(`Successfully changed \`${type}\` to \`${amount}%\`.`)
        
        message.channel.send(embed)
    }
}