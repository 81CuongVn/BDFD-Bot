module.exports = {
    name: "request",
    args: 1,
    category: "gangs",
    fields: ["gang"],
    examples: ["Creators"],
    cooldown: 10000,
    usages: ["<gang name>"],
    description: "Apply for a gang",
    info: "Note that you will not be able to apply to any gang until this gang accepts / denies your request or until you remove this request.",
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        if (data.gang) return message.channel.send(`You are in a gang already`)
        
        if (data.pending) return message.channel.send(`You have already applied for a gang.`)
        
        const gangs = client.db.get("gangs") || []
        
        const gang = gangs.find(gang => gang.name.toLowerCase() === args.join(" ").toLowerCase())
        
        if (!gang) return message.channel.send(`I could not find any gang with this name.`)
        
        if (Object.keys(gang.members).length === (gang.max_members || 50)) return message.channel.send(`This gang seems to be full.`)
        
        const index = gangs.indexOf(gang)
        
        gangs[index].requests.push({
            username: message.author.tag,
            id: message.member.id
        })
        
        data.pending = true
        data.pending_id = gang.owner_id 
        data.username = message.author.tag 
        
        client.db.set(`gangs`, gangs)
        client.db.set(`data_${message.member.id}`, data)
        
        message.channel.send(`You have successfully applied to the gang \`${gang.name.replace(/`/g, "")}\`, you can cancel this request using \`+cancel-request\`.`)
    }
}