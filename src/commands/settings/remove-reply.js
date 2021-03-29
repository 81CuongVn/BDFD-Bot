module.exports = {
    name: "remove-reply",
    description: "remove a command reply.",
    args:2,
    category: "settings",
    usages: ["<slut | work | rob | crime> <reply ID>"],
    fields: ["command", "ID"],
    slash: false,
    mod: true,
    examples: ["work 1"],
    execute: async (client, message,args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const deep = guild[args[0].toLowerCase()]
        
        const n = Number(args[1])
        
        if (!deep || !deep.replies) return message.channel.send(`That is not a valid command.`)
        
        const r = guild[args[0].toLowerCase()].replies[n-1]
        
        if (!r) return message.channel.send(`That is not a valid reply ID.`)
        
        guild[args[0].toLowerCase()].replies = guild[args[0].toLowerCase()].replies.filter((_, id) => id !== n-1)
        
        message.channel.send(`Successfully removed reply with ID \`${args[1]}\`.`)
        
        client.db.set(`guild_${message.guild.id}`, guild)
    }
}