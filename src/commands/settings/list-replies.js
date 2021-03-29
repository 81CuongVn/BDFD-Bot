module.exports = {
    name: "list-replies",
    description: "list replies for a command.",
    args:1,
    category: "settings",
    fields: ["command", "page"],
    usages: ["<slut | work | rob | crime> [page]"],
    staff: true,
    examples: ["work"],
    slash: false,
    execute: async (client, message, args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const deep = guild[args[0].toLowerCase()]
        
        if (!deep || !deep.replies) return message.channel.send(`That is not a valid command.`)
        
        const replies = guild[args[0].toLowerCase()].replies
        
        if (!replies.length) return message.channel.send(`There are no replies listed for this command`)
        
        const list = replies.map((r, id) => {
            return `\`${id+1}\` - ${r}`
        })
        
        const pages = Math.trunc(list.length / 10) + 1 
        
        let page = Number(args[1]) || 1 
        if (page > pages) page = pages
        if (page < 1) page = 1 
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Reply list for \`${args[0][0].toUpperCase() + args[0].slice(1).toLowerCase()}\` command:`, message.guild.iconURL({
            dynamic: true
        }))
        .setDescription(`**ID - REPLY**\n` + list.slice(page*10-10,page*10).join("\n"))
        .setTimestamp()
        .setFooter(`You can edit / remove them at any time.`)
        
        message.channel.send(embed)
    }
}