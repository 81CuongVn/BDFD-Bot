module.exports = {
    name: "remove-fine-reply",
    description: "remove a command fine reply.",
    args:2,
    category: "settings",
    usages: ["<slut | rob | crime> <reply ID>"],
    fields: ["command", "ID"],
    slash: false,
    mod: true,
    examples: ["rob 1"],
    execute: async (client, message,args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const deep = guild[args[0].toLowerCase()]
        
        const n = Number(args[1])
        
        if (!deep || !deep.fine_replies) return message.channel.send(`That is not a valid command.`)
        
        const r = guild[args[0].toLowerCase()].fine_replies[n-1]
        
        if (!r) return message.channel.send(`That is not a valid fine reply ID.`)
        
        guild[args[0].toLowerCase()].replies = guild[args[0].toLowerCase()].fine_replies.filter((_, id) => id !== n-1)
        
        message.channel.send(`Successfully removed fine reply with ID \`${args[1]}\`.`)
        
        client.db.set(`guild_${message.guild.id}`, guild)
    }
}