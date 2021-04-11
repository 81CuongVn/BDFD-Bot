module.exports = {
    name: "gang-demote",
    description: "demote a member from your gang to Member.",
    category: "gangs",
    args: 1,
    cooldown: 5000,
    fields: ["user"],
    examples: ["1234556880192847"],
    usages: ["<userID | user#tag | @user>"],
    execute: async (client, message, args) => {
        const gang = client.functions.getGang(message.author.id)
        
        if (!gang.owner_id) return message.channel.send(`You need to be in a gang first.`)
        
        if (!["owner"].includes(gang.members[message.member.id].rank)) return message.channel.send(`You need to be Owner in order to demote gang members.`)
        
        const member = Object.values(gang.members).find(a => a.username === args.join(" ") || a.id === args[0].replace(/[<@!>]/g, ""))
        
        if (!member) return message.channel.send(`Could not find any gang member with this ID / username.`)
        
        if (member.id === message.member.id) return message.channel.send(`You cannot demote yourself.`)
        
        if (member.rank !== "co-owner") return message.channel.send(`You cannot demote someone that is already a Member.`)
        
        const gangs = client.db.get("gangs")
        
        const index = gangs.findIndex(g => g.owner_id === gang.owner_id)
        
        if (index !== -1) {
            gangs[index].members[member.id].rank = "member"
            
            client.db.set(`gangs`, gangs)
        }
        
        message.channel.send(`Successfully demoted ${member.username} to gang Member.`)
    }
}