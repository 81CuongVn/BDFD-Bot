module.exports = {
    name: "set-fine-payout",
    description: "sets the fine payout to a command",
    category: "settings",
    mod: true,
    args: 2,
    fields: ["command", "amount"],
    usages: ["<crime | slut | rob> <amount(%)>"],
    examples: ["crime 20%", "crime 5000"],
    execute: async (client, message, args) => {
        const cmd = args.shift().toLowerCase()
        
        const am = args.shift()
        
        const type = am.endsWith("%") ? "percentage" : "number"
        
        const amount = client.functions.convert(am.replace("%", ""))
        
        if (!["slut", "work", "crime"].includes(cmd)) return message.channel.send(`That is not a valid command.`)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        if (!amount || amount < 1n) return message.channel.send(`Please provide a valid amount.`)
        
        if (!guild[cmd].fine) return message.channel.send(`Internal error.`)
        
        if (typeof guild[cmd].fine !== "object") guild[cmd].fine = {}
        
        guild[cmd].fine.type = type 
        guild[cmd].fine.value = amount.toString()
        
        client.db.set(`guild_${message.guild.id}`, guild)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setDescription(`Successfully set the fine payout for \`${cmd}\` command to \`${amount.toLocaleString()}${type === "percentage" ? "%" : ""}\`.`)
        .setTimestamp()
        
        message.channel.send(embed)
    }
}