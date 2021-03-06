const Discord = require("discord.js")
const presences = new Discord.Collection()
module.exports = (client, oldp, newp) => {
    if (!client.utils) return undefined
    
    const member = client.guilds.cache.get("566363823137882154").members.cache.get(newp.userID)
    
    if(!member) return undefined 
    
    if (Object.values(client.utils.staff_roles).map(id => member.roles.cache.has(id))) {
        const data = client.functions.getStaff(member.id)
        
        data.presence = {
            status: newp.status,
            devices: newp.clientStatus,
            activities: newp.activities.map(a => a.name),
            since: (oldp || "").status !== newp.status && newp.status !== presences.get(member.id) ? Date.now() : data.since || Date.now()
        }
        
        if ((oldp || "").status !== newp.status && newp.status !== presences.get(member.id)) presences.set(member.id, newp.status)
        
        data.save()
    }
}