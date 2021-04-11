module.exports = {
    name: "blacklist",
    description: "blacklist a user from using economy commands.",
    category: "staff",
    mod: true,
    args: 1,
    usages: ["<user> [duration]"],
    examples: ["@Ruben 3d"],
    fields: ["user", "duration"],
    execute: async (client, message, args) => {
        const member = await client.functions.findMember(message, args[0])
        
        if (!member) return message.channel.send(`Could not find the user to blacklist.`)
        
        const time = args[1] ? client.ms(args[1]) : null 
        
        if (args[1] && !time) return message.channel.send(`Invalid duration given`)
        
        if (member.id === message.author.id || member.user.bot) return message.channel.send(`No`)
        
        const data = client.functions.getData(member.id)
        
        if (data.blacklisted) return message.channel.send(`This user is already blacklisted`)
        
        data.blacklisted = true 
        
        if (time) {
            data.blacklisted_at = Date.now()
            data.blacklist_duration = time 
        }
        
        client.db.set(`data_${member.id}`, data)
        
        client.blacklist.set(member.id, time ? {
            since: Date.now(),
            duration: time 
        } : true)
        
        message.channel.send(`${member.user.tag} has been blacklisted.`)
    }
}