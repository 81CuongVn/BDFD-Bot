module.exports = {
    name: "decline",
    description: "decline a invite request",
    category: "gangs",
    args: 1,
    cooldown: 5000,
    fields: ["user"],
    examples: ["1234556880192847"],
    usages: ["<userID | user#tag | @user>"],
    execute: async (client, message, args) => {
        const gang = client.functions.getGang(message.author.id)
        
        if (!gang.owner_id) return message.channel.send(`You need to be in a gang first.`)
        
        if (!["owner", "co-owner"].includes(gang.members[message.member.id].rank)) return message.channel.send(`You need to be owner or co-owner in order to decline gang invite requests.`)
        
        const request = gang.requests.find(a => a.username === args.join(" ") || a.id === args[0].replace(/[<@!>]/g, ""))
        
        if (!request) return message.channel.send(`Could not find any request with this ID / username.`)
        
        const data = client.functions.getData(request.id)
        
        const gangs = client.db.get("gangs")
        
        const index = gangs.findIndex(g => g.owner_id === gang.owner_id)
        
        if (index !== -1) {
            gangs[index].requests = gangs[index].requests.filter(g => g.id !== request.id)
            
            client.db.set(`gangs`, gangs)
        }
        
        data.pending = false
        data.gang_id = null 
        data.pending_id = null
        data.gang = false 
        
        client.db.set(`data_${request.id}`, data)
        
        message.channel.send(`Successfully declined ${request.username}'s request.`)
    }
}