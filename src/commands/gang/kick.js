module.exports = {
    name: "gang-kick",
    description: "kick a member from your gang.",
    category: "gangs",
    args: 1,
    cooldown: 5000,
    fields: ["user"],
    examples: ["1234556880192847"],
    usages: ["<userID | user#tag | @user>"],
    execute: async (client, message, args) => {
        const gang = client.functions.getGang(message.author.id)
        
        if (!gang.owner_id) return message.channel.send(`You need to be in a gang first.`)
        
        if (!["owner", "co-owner"].includes(gang.members[message.member.id].rank)) return message.channel.send(`You need to be owner or co-owner in order to kick gang members.`)
        
        const member = Object.values(gang.members).find(a => a.username === args.join(" ") || a.id === args[0].replace(/[<@!>]/g, ""))
        
        if (!member) return message.channel.send(`Could not find any gang member with this ID / username.`)
        
        if (member.id === message.member.id) return message.channel.send(`You cannot kick yourself.`)
        
        if (member.rank === "co-owner" && gang.owner_id !== message.member.id) return message.channel.send(`You cannot kick people of the same rank as yours.`)
        
        const data = client.functions.getData(member.id)
        
        const gangs = client.db.get("gangs")
        
        const index = gangs.findIndex(g => g.owner_id === gang.owner_id)
        
        if (index !== -1) {
            delete gangs[index].members[member.id]
            
            client.db.set(`gangs`, gangs)
        }
        
        data.pending = false
        data.gang_id = null 
        data.pending_id = null
        data.gang = false 
        
        client.db.set(`data_${member.id}`, data)
        
        message.channel.send(`Successfully kicked ${member.username} from the gang.`)
    }
}