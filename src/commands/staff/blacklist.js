module.exports = {
    name: "blacklist",
    description: "blacklist a user from using economy commands.",
    category: "staff",
    mod: true,
    args: 1,
    usages: ["<user>"],
    examples: ["@Ruben"],
    fields: ["user"],
    execute: async (client, message, args) => {
        const member = await client.functions.findMember(message, args.join(" "))
        
        if (!member) return message.channel.send(`Could not find the user to blacklist.`)
        
        if (member.id === message.author.id || member.user.bot) return message.channel.send(`No`)
        
        const data = client.functions.getData(member.id)
        
        if (data.blacklisted) return message.channel.send(`This user is already blacklisted`)
        
        data.blacklisted = true 
        
        client.db.set(`data_${member.id}`, data)
        
        client.blacklist.set(member.id, true)
        
        message.channel.send(`${member.user.tag} has been blacklisted.`)
    }
}