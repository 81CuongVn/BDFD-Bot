module.exports = {
    name: "settings",
    description: "display current settings for rob, slut, work and crime",
    category: "settings",
    slash: false,
    execute: async (client, message, args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Server Command Settings` , message.guild.iconURL({
            dynamic: true
        }))
        .setTimestamp()
        .setFooter(`You can change these at any time.`)
        for (const cmd of ["Slut", "Rob", "Work", "Crime"]) {
            const data = guild[cmd.toLowerCase().replace(/ +/g, "_")]
            
            if (!data) continue
            
            const channels = data.disabled_channels && data.disabled_channels.length ? data.disabled_channels.map(c => client.channels.cache.get(c)).filter(e => e) : []
            
            embed.addField(`\`${cmd}\` Settings:`, `${data.fine_ratio ? `Fine Ratio: \`${data.fine_ratio}%\`\nFine: \`${data.fine.value}${data.fine.type === "number" ? "" : "%"}\`\n` : ""}Min: \`${data.min.value}${data.min.type === "number" ? "" : "%"}\`\nMax: \`${data.max.value}${data.max.type === "number" ? "" : "%"}\`\nDisabled Channels: ${channels.map(a => a.toString()).join(", ") || "none"}`)
        }
        
        const cf = guild.cock_fight 
        
        embed.addField(`Cock Fight`, `Start: \`${cf.start}%\`\nMax: \`${cf.max}%\`\nIncrement: \`${cf.ratio}%\``)
        
        message.channel.send(embed)
    }
}