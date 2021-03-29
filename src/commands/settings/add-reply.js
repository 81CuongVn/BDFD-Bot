module.exports = {
    name: "add-reply",
    description: "add a reply to a command.",
    args:2,
    category: "settings",
    usages: ["<slut | work | crime> <reply text>"],
    slash: false,
    fields: ["command", "text"],
    info: "You can use {value} to output the money that the user got.",
    mod: true,
    examples: ["work You worked hard enough and got {value}!"],
    execute: async (client, message,args) => {
        const guild = client.functions.getGuild(message.guild.id)
        
        const deep = guild[args[0].toLowerCase()]
        
        if (!deep || !deep.replies) return message.channel.send(`That is not a valid command.`)
        
        guild[args[0].toLowerCase()].replies.push(args.slice(1).join(" "))
        
        message.channel.send(`Successfully added a reply text to \`${args[0]}\`.`)
        
        client.db.set(`guild_${message.guild.id}`, guild)
    }
}