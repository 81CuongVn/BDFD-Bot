module.exports = {
    name: "set-max-payout",
    description: "sets the maximum payout to a command",
    category: "settings",
    mod: true,
    args: 2,
    fields: ["command", "amount"],
    usages: ["<crime | slut | work> <amount(%)>"],
    info: "If you change the amount to percentage (or reverse), the min payout will also be changed.\nThe percentage affects your money in bank.",
    examples: ["crime 1000", "crime 5%"],
    execute: async (client, message, args) => {
        const cmd = args.shift().toLowerCase()
        
        const am = args.shift()
        
        const type = am.endsWith("%") ? "percentage" : "number"
        
        const amount = client.functions.convert(am.replace("%", ""))
        
        if (!["slut", "work", "crime"].includes(cmd)) return message.channel.send(`That is not a valid command.`)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        if (!amount || amount < 1n || amount <= BigInt(guild[cmd].min.value)) return message.channel.send(`Please provide a valid amount.`)
        
        
        guild[cmd].max.value = amount.toString()
        guild[cmd].min.type = type
        guild[cmd].max.type = type
        
        client.db.set(`guild_${message.guild.id}`, guild)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setDescription(`Successfully set the maximum payout for \`${cmd}\` command to \`${amount.toLocaleString()}${type === "percentage" ? "%" : ""}\`.`)
        .setTimestamp()
        
        message.channel.send(embed)
    }
}