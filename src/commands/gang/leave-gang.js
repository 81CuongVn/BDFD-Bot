module.exports = {
    name: "leave-gang",
    description: "leaves the gang you are currently in",
    category: "gangs",
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        if (!data.gang_id) return message.channel.send(`You have not joined to any gang yet.`)
        
        if (data.gang_id === message.member.id) {
            message.channel.send(`Leaving as gang owner is currently not supported.`)
        } else {
            const gangs = client.db.get("gangs") || []
            
            const index = gangs.findIndex(g => g.owner_id === data.gang_id)
            
            const gang = gangs[index]
            
            delete gang.members[message.member.id]
            
            data.gang_id = null 
            data.gang = false
            
            gangs[index] = gang 
            
            client.db.set(`gangs`, gangs)
            
            client.db.set(`data_${message.member.id}`, data)
            
            message.channel.send(`You have successfully left the gang \`${gang.name.replace(/`/g, "")}\`.`)
        }
    }
}