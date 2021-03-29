module.exports = {
    name: "cancel-request",
    description: "cancels the invite request that you sent to a gang.",
    category: "gangs",
    cooldown: 10000,
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        if (!data.pending) return message.channel.send(`You have not sent any invite request.`)

        const gangs = client.db.get("gangs") || [] 
        
        const index = gangs.findIndex(d => d.owner_id === data.pending_id)
        
        if (index !== -1) {
            gangs[index].requests = gangs[index].requests.filter(d => d.id !== message.member.id)
            
            client.db.set(`gangs`, gangs)
        }
        
        data.pending = false 
        data.pending_id = null 
        
        client.db.set(`data_${message.member.id}`, data)
        
        message.channel.send(`Successfully cancelled the invite request.`)
    }
}