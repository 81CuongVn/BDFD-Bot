module.exports = {
    name: "unblacklist",
    description: "unblacklist a user from using economy commands.",
    category: "staff",
    mod: true,
    args: 1,
    usages: ["<user>"],
    examples: ["@Ruben"],
    fields: ["user"],
    execute: async (client, message, args) => {
        const member = await client.functions.findMember(message, args.join(" "))
        
        if (!member) return message.channel.send(`Could not find the user to unblacklist.`)
        
        if (member.id === message.author.id || member.user.bot) return message.channel.send(`No`)
        
        const data = client.functions.getData(member.id)
        
        if (!data.blacklisted) return message.channel.send(`This user is not blacklisted`)
        
        data.blacklisted_at = null 
        data.blacklist_duration = null 
        data.blacklisted = false
        
        client.db.set(`data_${member.id}`, data)
        
        client.blacklist.delete(member.id) 
        
        message.channel.send(`${member.user.tag} has been unblacklisted.`)
    }
}