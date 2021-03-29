module.exports = {
    name: "add-fine-reply",
    description: "add a fine reply to a command.",
    args:2,
    category: "settings",
    usages: ["<slut | rob | crime> <reply text>"],
    slash: false,
    fields: ["command", "text"],
    info: "You can use {value} to output the money that the user lost.",
    mod: true,
    examples: ["rob You attempted to rob {user} and lost {value}!"],
    execute: async (client, message,args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const deep = guild[args[0].toLowerCase()]
        
        if (!deep || !deep.fine_replies) return message.channel.send(`That is not a valid command.`)
        
        guild[args[0].toLowerCase()].fine_replies.push(args.slice(1).join(" "))
        
        message.channel.send(`Successfully added a fine reply text to \`${args[0]}\`.`)
        
        client.db.set(`guild_${message.guild.id}`, guild)
    }
}