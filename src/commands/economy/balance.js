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
        
        if (member.id === "739591551155437654") embed.setTitle(`One of the nerd devs`)
        
        if (member.id === "325663449680052227") embed.setTitle(`<a:hollyDance:827660857085394954> Satan Is Real <a:hollyDance:827660857085394954>`)
        
        embed.addField(`Cash:`, `${guild.economy_emoji}${BigInt(data.money).shorten()}`)
        .addField(`Bank:`, `${guild.economy_emoji}${BigInt(data.bank).shorten()}`)
        .addField(`Net Worth:`, `${guild.economy_emoji}${(BigInt(data.money) + BigInt(data.bank)).shorten()}`)
        .setTimestamp()
        .setDescription(`View your global rank using \`+leaderboard\``)
        
        message.channel.send(embed)
    }
}