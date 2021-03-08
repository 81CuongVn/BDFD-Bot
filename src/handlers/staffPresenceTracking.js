const Discord = require("discord.js")
module.exports = async (client, oldp, newp) => {
    const { presences } = client 
    if (!client.utils) return undefined
    
    const member = client.guilds.cache.get("566363823137882154").members.cache.get(newp.userID)
    
    if(!member) return undefined 
    
    if (Object.values(client.utils.staff_roles).map(id => member.roles.cache.has(id))) {
        if (!presences.has(member.id)) return presences.set(member.id, newp.status)
        
        let data = client.functions.getStaff(member.id)
        
        data.presence = {
            status: newp.status,
            devices: newp.clientStatus,
            activities: newp.activities.map(a => a.name),
            since: (oldp || "").status !== newp.status && newp.status !== presences.get(member.id) ? Date.now() : data.presence.since || Date.now()
        }
        
        if ((oldp || "").status !== newp.status && newp.status !== presences.get(member.id)) {
            presences.set(member.id, newp.status)
            
            if (data.activity.track) {
                await client.staffStatus.handle({
                    emoji: {
                        toString: () => client.staffStatus.reactions.find(e => e.includes(newp.status)),
                        name: newp.status
                    }
                }, member.user)
                
                data = client.functions.getStaff(member.id)
            }
        }
        
        data.save()
    }
}