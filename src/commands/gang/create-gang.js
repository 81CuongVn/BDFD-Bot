module.exports = {
    name: "create-gang",
    description: "creates a gang",
    cooldown: 60000,
    category: "gangs",
    execute: async (client, message, args) => {
        const g = { members: {}, requests: [] }
        
        const data = client.functions.getData(message.author.id)
        
        if (data.gang) return message.channel.send(`You are already in a gang.`)
        
        if (BigInt(data.money) < 100000n) return message.channel.send(`You do not have enough money to create a gang.`)
        
        const filter = m => m.author.id === message.author.id 
        
        await message.channel.send(`How would you like to call your gang?\nYou can type \`cancel\` to cancel this operation at any time.`)
        
        let collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60e3,
            errors: ["time"]
        })
        .catch(err => null)
        
        if (!collected) return message.channel.send(`Command cancelled.`)
        
        let m = collected.first()
        
        if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
        
        if (m.content.length > 256) return message.channel.send(`Name cannot be larger than 256 characters.`)
        
        g.name = m.content 
        g.owner_id = message.author.id 
        
        const gangs = client.db.get(`gangs`) || []
        
        if (gangs.find(n => m.content.toLowerCase() === n.name.toLowerCase())) return message.channel.send(`There is a gang with this name.`)
        
        await message.channel.send(`What will be the description for your gang?\nYou can type \`cancel\` to cancel this operation at any time.`)
        
        collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 60e3,
            errors: ["time"]
        })
        .catch(err => null)
        
        if (!collected) return message.channel.send(`Command cancelled.`)
        
        m = collected.first()
        
        if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
        
        if (m.content.length > 256) return message.channel.send(`Description cannot be larger than 256 characters.`)
        
        g.description = m.content 
        g.founded_at = Date.now()
        g.members[message.author.id] = {
            username: message.author.tag,
            id: message.author.id,
            rank: "owner",
            joined_at: Date.now()
        }
        
        data.money = (BigInt(data.money) - 100000n).toString()
        data.gang = true
        data.username = message.author.tag
        data.gang_id = message.author.id 
        
        gangs.push(g)
        
        client.db.set(`data_${message.member.id}`, data)
        client.db.set(`gangs`, gangs)
        
        message.channel.send(`Successfully created gang, use \`+gang\` to view your gang.`)
    }
}