module.exports = {
    name: "accept",
    description: "accept a invite request",
    category: "gangs",
    args: 1,
    cooldown: 5000,
    fields: ["userID"],
    examples: ["1234556880192847"],
    usages: ["<userID>"],
    execute: async (client, message, args) => {
        const gang = client.functions.getGang(message.author.id)
        
        if (!gang.owner_id) return message.channel.send(`You need to be in a gang first.`)
        
        if (!["owner", "co-owner"].includes(gang.members[message.member.id].rank)) return message.channel.send(`You need to be owner or co-owner in order to accept gang invite requests.`)
        
        if (Object.keys(gang.members).length === (gang.max_members||50)) return message.channel.send(`Your gang seems to be full.`)
        
        const request = gang.requests.find(a => a.username === args.join(" ") || a.id === args[0])
        
        if (!request) return message.channel.send(`Could not find any request with this ID / username.`)
        
        const data = client.functions.getData(request.id)
        
        const gangs = client.db.get("gangs")
        
        const index = gangs.findIndex(g => g.owner_id === gang.owner_id)
        
        if (index !== -1) {
            gangs[index].requests = gangs[index].requests.filter(g => g.id !== request.id)
            
            gangs[index].members[request.id] = {
                id: request.id,
                username: data.username || request.username,
                joined_at: Date.now(),
                rank: "member"
            }
            
            client.db.set(`gangs`, gangs)
        }
        
        data.pending = false 
        data.gang_id = gang.owner_id 
        data.pending_id = null 
        data.gang = true 
        
        client.db.set(`data_${request.id}`, data)
        
        message.channel.send(`Successfully accepted ${request.username} in the gang!`)
    }
}