module.exports = {
    name: "set-fine-ratio",
    description: "sets the fine chance to a command",
    category: "settings",
    mod: true,
    args: 2,
    fields: ["command", "chance"],
    usages: ["<rob | crime | slut> <chance>"],
    examples: ["rob 30", "crime 30%"],
    execute: async (client, message, args) => {
        const cmd = args.shift().toLowerCase()
        
        const percent = Number(args.shift().replace("%", ""))
        
        if (!["slut", "rob", "crime"].includes(cmd)) return message.channel.send(`That is not a valid command.`)
        
        if (isNaN(percent) || percent < 0 || percent > 100) return message.channel.send(`Please provide a valid percentage within 0 and 100.`)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        guild[cmd].fine_ratio = percent
        
        client.db.set(`guild_${message.guild.id}`, guild)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setDescription(`Successfully set the fine chance for \`${cmd}\` command to \`${percent}%\`.`)
        .setTimestamp()
        
        message.channel.send(embed)
    }
}