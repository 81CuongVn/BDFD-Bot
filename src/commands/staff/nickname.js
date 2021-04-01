module.exports = {
    name: "nickname",
    aliases: ["nick"],
    description: "Changes an user's nickname",
    args: 2,
    fields: ["user", "nick"] ,
    examples: ["@Ruben test"],
    usages: ["<user> <nick>"],
    category: "staff",
    staff: true,
    execute: async (client, message, args, command) => {
        if (message.channel.inttoken) {
            return message.channel.send(`Unusable within slash commands!`, {
                type: 3
            }, 64)
        }
        const member = await client.functions.findMember(message, args[0])
        
        if (!member) return message.channel.send(`:x: Could not find any member with given query.`)
       
        
        if (member.id !== message.author.id && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("No")
        
        const m = await member.setNickname(args[1] === "reset" ? "" : args.slice(1).join(" ")).catch(err => {
            return null 
        })
        
        if (!m) return message.channel.send(`:x: Failed to change ${member.user.username}'s nickname.`)
        
        const text = []
        
        if (message.channel.id === "671454243840065586") {
            const r = await member.roles.remove("671453937685233664").catch(err => null)
            if (!r) return message.channel.send(`:x: Failed to remove Username Change role.`)
            text.push(`The role Username Change has been removed from them.`)
        }
        
        text.push(`Successfully changed ${member.user.username}'s nickname to \`${args[1] === "reset" ? member.user.username : args.slice(1).join(" ")}\``)
        
        message.channel.send(text.join("\n"))
    }
}