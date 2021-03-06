module.exports = (client, message) => {
    if (Object.values(client.utils.staff_roles).some(id => message.member.roles.cache.has(id))) {
        const data = client.functions.getStaff(message.author.id)
        
        data.messages[message.channel.id] = {
            name: message.channel.name,
            amount: (data.messages[message.channel.id] || "").amount + 1 || 1
        }
        
        data.message_count = data.message_count + 1 || 1 
        
        data.lastMessage = {
            id: message.id,
            content: message.content,
            channel: {
                id: message.channel.id,
                name: message.channel.name
            },
            createdTimestamp: message.createdTimestamp
        }
        
        data.presence = {
            since: data.since && data.presence.status !== emssage.author.presence.status ? Date.now() : data.since || Date.now(),
            status: message.author.presence.status,
            devices: message.author.presence.clientStatus,
            activities: message.author.presence.activities.map(a => a.name)
        }
        
        data.save()
    }
}