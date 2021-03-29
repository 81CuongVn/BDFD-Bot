const Discord = require("discord.js")

module.exports = async (client, userID) => {
    if (!client.income_cooldowns) client.income_cooldowns = new Discord.Collection()
    
    const guild = client.guilds.cache.get("566363823137882154") 
    
    const member = guild.members.cache.get(userID) || await guild.members.fetch(userID).catch(err => null)
    
    if (!member) return 
    
    const cds = client.income_cooldowns.get(member.id) || new Discord.Collection()
    
    const data = client.functions.getGuild("566363823137882154")
    
    const obj = {
        allowed: [],
        denied: []
    }
    
    for (const d of data.income_roles) {
        if (!guild.roles.cache.has(d.id) || !member.roles.cache.has(d.id)) continue 
        
        const cd = cds.get(d.id)
        
        if (!cd) {
            obj.allowed.push(d)
            
            continue
        }
        
        if (cd && d.cooldown - (Date.now() - cd) > 0) {
            const left = d.cooldown - (Date.now() - cd)
            
            if (!obj.next) obj.next = left 
            else if (obj.next - left > 0) obj.next = left 
            
            obj.denied.push({
                data: d,
                restart: left 
            })
        } else obj.allowed.push(d) 
    }
    
    return obj 
}