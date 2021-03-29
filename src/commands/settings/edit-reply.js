module.exports = {
    name: "edit-reply",
    description: "edit a command reply.",
    args:3,
    category: "settings",
    usages: ["<slut | work | rob | crime> <reply ID> <new text>"],
    fields: ["command", "ID", "text"],
    slash: false,
    mod: true,
    examples: ["work 1 you dont work hard and got {value}!"],
    execute: async (client, message,args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const deep = guild[args[0].toLowerCase()]
        
        const n = Number(args[1])
        
        if (!deep || !deep.replies) return message.channel.send(`That is not a valid command.`)
        
        const r = guild[args[0].toLowerCase()].replies[n-1]
        
        if (!r) return message.channel.send(`That is not a valid reply ID.`)
        
        guild[args[0].toLowerCase()].replies[n-1] = args.slice(2).join(" ")
        
        message.channel.send(`Successfully editted reply with ID \`${args[1]}\`.`)
        
        client.db.set(`guild_${message.guild.id}`, guild)
    }
}