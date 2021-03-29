module.exports = {
    name: "edit-fine-reply",
    description: "edit a command fine reply.",
    args:3,
    category: "settings",
    usages: ["<slut | rob | crime> <reply ID> <new text>"],
    fields: ["command", "ID", "text"],
    slash: false,
    mod: true,
    examples: ["rob 1 you got caught attempting to rob {user} and lost {value}!"],
    execute: async (client, message,args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const deep = guild[args[0].toLowerCase()]
        
        const n = Number(args[1])
        
        if (!deep || !deep.fine_replies) return message.channel.send(`That is not a valid command.`)
        
        const r = guild[args[0].toLowerCase()].fine_replies[n-1]
        
        if (!r) return message.channel.send(`That is not a valid fine reply ID.`)
        
        guild[args[0].toLowerCase()].fine_replies[n-1] = args.slice(2).join(" ")
        
        message.channel.send(`Successfully editted fine reply with ID \`${args[1]}\`.`)
        
        client.db.set(`guild_${message.guild.id}`, guild)
    }
}