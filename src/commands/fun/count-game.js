const Discord = require("discord.js")
const players = new Discord.Collection()

module.exports = {
    name: "count-game",
    aliases: ["cg"],
    description: "Play this with someone to test your math skills",
    args: 1,
    fields: ["user"],
    category: "fun",
    examples: ["@NotRuben"],
    usages: ["<user>"],
    execute: async (client, message, args) => {
        if (message.channel.inttoken) {
            return message.channel.send("Ew no!", {
                type: 3
            }, 64)
        }
        let n = Math.floor(Math.random() * 10) + 1 
        
        const user = message.author
        const enemy = await client.functions.findMember(message, args.join(" "))
        
        if (!enemy) return message.channel.send(`No user found`)
        if (players.has(user.id) || players.has(enemy.id)) return message.channel.send(`Either you or the other user is already on a game`)
        if (enemy.user.bot || enemy.id === user.id) return message.channel.send(`Mention a different user and not a bot or yourself.`)
        
        players.set(message.author.id, true)
        players.set(enemy.id, true)
        
        async function turn(u) {
            const t = Math.floor(Math.random() * 4) + 2 
            let next = u.id === enemy.id ? user : enemy 
            const filter = m => m.author.id === u.id 
            message.channel.send(`${u} What's **${n}x${t}**? You have 15 seconds to answer.`)
            const collected = await message.channel.awaitMessages(filter, {
                max: 1,
                time: 15000,
                errors: ["time"]
            }).catch(err => null)
            if (!collected) {
                message.channel.send(`They took too long to reply`)
                return next
            } else {
                const res = Number(collected.first().content)
                if (res !== n*t) {
                    message.channel.send(`Wrong! The answer is ${n*t}!`)
                    return next 
                } else {
                    message.channel.send(`Correct!`)
                    n = Math.floor(Math.random() * ((n*2)*t))+ 1 
                }
            }
            return await turn(next)
        }
        
        winner = await turn(enemy)
        
        message.channel.send(`${winner} won the match!`)
        players.delete(message.author.id)
        players.delete(enemy.id)
        
        
    }
}