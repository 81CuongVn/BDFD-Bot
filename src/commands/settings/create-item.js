module.exports = {
    name: "create-item",
    description: "creates an item.",
    mod: true,
    category: "settings",
    execute: async (client, message, args) => {
        
        const data = {}
        
        let curr = 1 
        
        const filter = m => m.author.id === message.author.id 
        
        const opts = {
            1: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat will be the name for the item?\nYou can type \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                const name = m.content 
                
                if (name.length > 128) return opts[curr](`The item name cannot be larger than 128 characters.`)
                
                curr++ 
                
                data.name = name 
                
                opts[curr]()
            },
            
            2: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat will be the description for the item?\nYou can type \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                const desc = m.content 
                
                if (desc.length > 256) return opts[curr](`The item description cannot be larger than 256 characters.`)
                
                curr++ 
                
                data.description = desc 
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            3: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat will be the price for the item?\nYou can type \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                const price = client.functions.convert(m.content)
                
                if (!price || price < 1n) return opts[curr](`The item price must be a valid number and cost more than 0.`)
                
                curr++ 
                
                data.price = price.toString() 
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            4: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat role or roles must the user have in order to buy this item? Separate them by spaces.\nYou can type \`skip\` to skip this step or \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                if (true && m.content.toLowerCase() === "skip") {
                                curr++ 
              
                                if (!opts[curr]) return opts["last"]()
                
                                return opts[curr]()
                }
                
                const roles = m.content.split(" ").map(r => message.guild.roles.cache.get(r.trim().replace(/[<>@&]/g, "")))
                
                if (roles.includes(undefined)) return opts[curr](`Provided roles are not valid or one of them does not exist.`)
                
                curr++ 
                
                data.required_roles = roles.map(r => r.id)
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            5: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat role or roles will the user obtain after buying this item? Separate them by spaces.\nYou can type \`skip\` to skip this step or \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                if (true && m.content.toLowerCase() === "skip") {
                                curr++ 
              
                                if (!opts[curr]) return opts["last"]()
                
                                return opts[curr]()
                }
                
                const roles = m.content.split(" ").map(r => message.guild.roles.cache.get(r.trim().replace(/[<>@&]/g, "")))
                
                if (roles.includes(undefined)) return opts[curr](`Provided roles are not valid or one of them does not exist.`)
                
                curr++ 
                
                data.new_roles = roles.map(r => r.id)
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            6: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat role or roles will be removed from the user after buying this item? Separate them by spaces.\nYou can type \`skip\` to skip this step or \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                if (true && m.content.toLowerCase() === "skip") {
                                curr++ 
              
                                if (!opts[curr]) return opts["last"]()
                
                                return opts[curr]()
                }
                
                const roles = m.content.split(" ").map(r => message.guild.roles.cache.get(r.trim().replace(/[<>@&]/g, "")))
                
                if (roles.includes(undefined)) return opts[curr](`Provided roles are not valid or one of them does not exist.`)
                
                curr++ 
                
                data.removed_roles = roles.map(r => r.id)
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            7: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat will be the stock for this item?\nYou can type \`skip\` to skip this step or  \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                if (true && m.content.toLowerCase() === "skip") {
                                curr++ 
              
                                if (!opts[curr]) return opts["last"]()
                
                                return opts[curr]()
                }
                
                
                const stock = client.functions.convert(m.content)
                
                if (!stock || stock < 1n) return opts[curr](`The item stock must be a valid number and above 0.`)
                
                curr++ 
                
                data.stock = stock.toString() 
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            8: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWhat will be the message that I have to say whenever a user buys this item?\nYou can type \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                const reply = m.content 
                
                if (reply.length > 512) return opts[curr](`The item reply message cannot be larger than 512 characters.`)
                
                curr++ 
                
                data.reply = reply 
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            9: async (error = "") => {
                const msg = await message.channel.send(`${error}\nWill this item be stackable? This means if the item should be viewable in the inventory and available to be used.\nRespond with \`yes\` or \`no\`.\nYou can type \`cancel\` to stop this setup.`)
                
                const collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60e3,
                    errors: ["time"]
                })
                .catch(err => null)
                
                if (!collected) return measage.channel.send(`Command cancelled.`)
                const m = collected.first() 
                
                if (m.content.toLowerCase() === "cancel") return message.channel.send(`Command cancelled.`)
                
                const reply = m.content.toLowerCase()
                
                if (!["yes", "no"].includes(reply)) return opts[curr](`The item reply message cannot be larger than 512 characters.`)
                
                curr++ 
                
                data.usable = reply === "yes"
                
                if (!opts[curr]) return opts["last"]()
                
                opts[curr]()
            },
            
            last: () => {
                const guild = client.functions.getGuild(message.guild.id)
                
                guild.shop_items.push(data)
                
                client.db.set(`guild_${message.guild.id}`, guild)
                
                message.channel.send(`Successfully created the item.`)
            }
        }
        
        await opts[curr]()
        
    }
}