module.exports = {
    name: "start",
    mod: true,
    description: "Starts a giveaway easily",
    category: "giveaway",
    execute: async (client, message, args) => {
        const data = {}
        
        data.guildID = message.guild.id 
        
        let current = 1
        
        const opts = {
            1: async (error) => {
                const filter = (m) => m.author.id === message.author.id
                
                const m = await message.channel.send(`${error || ""}\nWhat are you giving away?\nMax title length is 200.\nYou can cancel this setup by typing \`cancel\`.\nExample: \`A White Shirt\``)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000
                }).catch(err => null)
                
                if (!collected || !collected.size) {
                    m.edit(`No response has been given in time.`)
                    return null
                } else {
                    const msg = collected.first() 
                    
                    if (msg.content.toLowerCase() === "cancel") {
                        return message.channel.send(`Successfully canceled the giveaway setup.`)
                    } else
                    if (msg.content.length > 200) {
                        return await opts[current](`The title length is too long, please write a shorter one.`)
                    } else {
                        current++
                        data.title = msg.content
                        opts[current]()
                    }
                }
            },
            2: async (error) => {
                const filter = (m) => m.author.id === message.author.id
                
                const m = await message.channel.send(`${error || ""}\nWhere will this giveaway be hosted in?\nMention the channel, or type either its ID or name.\nYou can cancel this setup by typing \`cancel\`.\nExample: \`#giveaways\``)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000
                }).catch(err => null)
                
                if (!collected || !collected.size) {
                    m.edit(`No response has been given in time.`)
                    return null
                } else {
                    const msg = collected.first() 
                    
                    const channel = client.functions.findChannel(message.guild.id, msg.content)
                    
                    if (msg.content.toLowerCase() === "cancel") {
                        return message.channel.send(`Successfully canceled the giveaway setup.`)
                    } else
                    if (!channel || channel.type !== "text") {
                        return await opts[current](`I could not find any channel with given query.`)
                    } else {
                        current++
                        data.channelID = channel.id
                        opts[current]()
                    }
                }
            },
            3: async (error) => {
                const filter = (m) => m.author.id === message.author.id
                
                const m = await message.channel.send(`${error || ""}\nHow many winners should this giveaway have?\nType a valid number between 1 to 20.\nYou can cancel this setup by typing \`cancel\`.\nExample: \`2w\``)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000
                }).catch(err => null)
                
                if (!collected || !collected.size) {
                    m.edit(`No response has been given in time.`)
                    return null
                } else {
                    const msg = collected.first() 
                    
                    const number = Number(msg.content.replace(/w/g, ""))
                    
                    if (msg.content.toLowerCase() === "cancel") {
                        return message.channel.send(`Successfully canceled the giveaway setup.`)
                    } else
                    if (!number || number < 1 || number > 20) {
                        return await opts[current](`The amount of winners given did not match the conditions.`)
                    } else {
                        current++
                        data.winners = number
                        opts[current]()
                    }
                }
            },
            4: async (error) => {
                const filter = (m) => m.author.id === message.author.id
                
                const m = await message.channel.send(`${error || ""}\nHow long should this giveaway last for?\nAny duration above 10 seconds is valid.\nYou can cancel this setup by typing \`cancel\`.\nExample: \`5m\``)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000
                }).catch(err => null)
                
                if (!collected || !collected.size) {
                    m.edit(`No response has been given in time.`)
                    return null
                } else {
                    const msg = collected.first() 
                    
                    const ms = client.utils.dates.parseToMS(msg.content)
                    
                    if (msg.content.toLowerCase() === "cancel") {
                        return message.channel.send(`Successfully canceled the giveaway setup.`)
                    } else
                    if (!ms || ms < 10000) {
                        return await opts[current](`The duration given did not match the conditions.`)
                    } else {
                        current++
                        data.duration = ms
                        opts["done"]()
                    }
                }
            },
            done: async () => {
                data.ended = false
                data.startedAt = Date.now()
                data.userID = message.author.id 
                data.endsAt = Date.now() + data.duration
                data.removeCache = data.endsAt + client.ms("7d")
                
                const giveaway = client.managers.Giveaway(data)
                
                const m = await giveaway.start()
                
                if (!m) return message.channel.send(`Failed to start the giveaway.`)
                
                data.id = m.id
                
                if (data.channelID !== message.channel.id) message.channel.send(`Successfully created a giveaway in <#${data.channelID}>!`)
                
                client.db.set(`giveaway_${m.id}`, data)
            }
        }
        
        //start options
        await opts[1]()
    }
}