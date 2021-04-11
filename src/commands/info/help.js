module.exports = {
    name: "help",
    description: "shows bot commands",
    category: "info",
    execute: async(client, message, args) => {
        const categories = {}
        
        for (const command of client.commands.array()) {
            const req = await client.handlers.requestHandler(message, args, command, false)
            
            if (req) {
                if (!categories[command.category]) categories[command.category] = []
                
                categories[command.category].push(`\`${client.prefix}${command.name}\``)
            }
        }
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({
            dynamic: true,
            size: 4096
        }))
        .setTitle(`${client.user.username} Command List`)
        
        Object.entries(categories).map(c => {
            embed.addField(`**__${c[0].toUpperCase()}__**`, c[1].join(", "))
        })
        
        embed.setDescription(`Want to contribute? check the [Github Repository](https://github.com/Rubenennj/BDFD-Bot/tree/main) for this bot!`)
        
        embed.addField(`News`, `- Added support for infinity value (\`+join Satan's Offspring\`).\n- You can now edit gang embed color using \`+edit-gang\`.`)
        
        message.channel.send(embed)
    }
}