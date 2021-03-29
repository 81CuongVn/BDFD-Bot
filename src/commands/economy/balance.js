module.exports = {
    name: "balance",
    aliases: ["bal"],
    description: "show yours or someone elses balance",
    fields: ["user"],
    examples: ["@Ruben"],
    cooldown: 5000,
    category: "economy",
    execute: async (client, message, args) => {
        const member = args.length ? await client.functions.findMember(message, args.join(" ")) : message.member 
        
        if (!member) return message.channel.send(`Could not find any member with given query.`)

        const data = client.functions.getData(member.id)
        
        const guild = client.functions.getGuild(message.guild.id)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(member.user.tag, member.user.displayAvatarURL({
            dynamic: true
        }))
        
        .addField(`Cash:`, `${guild.economy_emoji}${BigInt(data.money).toLocaleString()}`)
        .addField(`Bank:`, `${guild.economy_emoji}${BigInt(data.bank).toLocaleString()}`)
        .addField(`Net Worth:`, `${guild.economy_emoji}${(BigInt(data.money) + BigInt(data.bank)).toLocaleString()}`)
        .setTimestamp()
        .setDescription(`View your global rank using \`+leaderboard\``)
        
        message.channel.send(embed)
    }
}