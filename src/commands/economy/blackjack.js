module.exports = {
    name: "blackjack",
    description: "blackjack command",
    category: "economy",
    aliases: ["bj"],
    cooldown: 6000,
    usages: ["<bet | all>"],
    examples: ["all", "1e10", "100"],
    fields: ["bet"],
    args: 1,
    execute: async (client, message, args) => {
        if (!client.bjs) client.bjs = new client.discord.Collection()
        if (client.bjs.has(message.member.id)) return 
        
        const guild = client.functions.getGuild(message.guild.id)
        
        const data = client.functions.getData(message.member.id)
        
        data.username = message.author.username 
        
        const bet = args[0].toLowerCase() === "all" ? BigInt(data.money) : client.functions.convert(args[0])
        
        if (!bet || bet < 100n) return message.channel.send(`Please provide a valid bet. It has to be 100 or more.`)
        
        if (bet > BigInt(data.money)) return message.channel.send(`You cannot bet more than what you have.`)
        
        const store = {
            2: "<:418537008609099777:825847616101154846>",
            3: "<:418537012254081064:825847627215274004>",
            4: "<:4_:825849884300017664>",
            5: "<:418537017056690186:825847622111330334>",
            6: "<:6_:825850865872928768>",
            7: "<:418537027298918411:825847626234069042>",
            8: "<:418537032126824458:825847625252208691>",
            9: "<:418537033397698560:825847622924632085>",
            10: "<:418537004607864856:825847618156232764>",
            ace: "<:418538326518267924:825847630281703465>",
            queen: "<:418537044634107941:825847620038557726>",
            king: "<:K_:825850939537227797>"
        }
        
        const cards = {
            dealer: [],
            player: []
        }
        
        function getValue(array) {
            let value = 0
            
            for (const name of array) {
                if (typeof Number(name) === "number" && !isNaN(Number(name))) {
                    value += Number(name) 
                } else {
                    if (name === "ace") {
                        if (value + 10 > 21) value += 1 
                        else value += 10
                    } else value += 10
                }
            }
            
            
            return value 
        }
        
        function showCards(bj) {
            embed.fields = []
            embed.addField(`Your Cards:`, bj && cards.player.includes("ace") ? `${cards.player.map(d => store[d]).join(" ") || "<not added>"}\nValue: Blackjack` : `${cards.player.map(a => store[a]).join(" ") || "<not added>"}\nValue: ` + getValue(cards.player))
            embed.addField(`Dealer Cards:`, bj && cards.dealer.includes("ace") ? `${cards.dealer.map(d => store[d]).join(" ") || "<not added>"}\nValue: Blackjack` : `${cards.dealer.map(a => store[a]).join(" ") || "<not added>"}\nValue: ` + getValue(cards.dealer))
        }
        
        Object.keys(store).map((x, id) => Math.floor(Math.random() * 100) > 50 && cards.dealer.length < 3 && getValue(cards.dealer) < 10 ? cards.dealer.push(x) : undefined)
        
        Object.keys(store).map((x, id) => Math.floor(Math.random() * 100) > 50 && cards.player.length < 3 && getValue(cards.player) < 10 ? cards.player.push(x) : undefined)
        
        const embed = new client.discord.MessageEmbed()
        .setTimestamp()
        .setFooter(`Blackjack System (Beta)`)
        .setTitle(`Blackjack Match`)
        .setColor("BLUE")
        .setDescription(`Type \`hit\` to draw a card, \`stand\` to stand.`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        showCards(true)
        
        if (cards.dealer.includes("ace") && cards.player.includes("ace")) {
            embed.setColor("ORANGE")
            embed.setTitle(`Draw! Money pushed back.`)
            embed.setDescription("")
            message.channel.send(embed)
            return
        } else if (cards.dealer.includes("ace")) {
            embed.setColor("RED")
            embed.setTitle(`You lost! -${guild.economy_emoji}${bet.toLocaleString()}`)
            embed.setDescription("")
            data.money = (BigInt(data.money) - bet).toString()
            client.db.set(`data_${message.member.id}`, data)
            message.channel.send(embed)
            return
        } else if (cards.player.includes("ace")) {
            embed.setColor("GREEN")
            embed.setDescription("")
            embed.setTitle(`You won! +${guild.economy_emoji}${bet.toLocaleString()}`)
            data.money = (BigInt(data.money) + bet).toString()
            client.db.set(`data_${message.member.id}`, data)
            message.channel.send(embed)
            return 
        }
        
        client.bjs.set(message.member.id, true)
        
        const msg = await message.channel.send(embed)
        
        const filter = (m) => ["hit", "stand"].includes(m.content.toLowerCase()) && m.author.id === message.author.id 
        
        const collector = msg.channel.createMessageCollector(filter, {
            time: 600000
        })
        
        collector.on("collect", (m) => {
            if (m.content.toLowerCase() === "stand") {
                while (getValue(cards.dealer) < 17) {
                    let rn = Object.keys(store)[Math.floor(Math.random() * Object.keys(store).length)]
                
                    cards.dealer.push(rn)
                }
                
                const player = getValue(cards.player)
                const dealer = getValue(cards.dealer)
                
                if (dealer > 21) {
                    embed.setDescription("")
                    embed.setColor("GREEN")
                    embed.setTitle(`You won! +${guild.economy_emoji}${bet.toLocaleString()}`)
                    data.money = (BigInt(data.money) + bet).toString()
                    client.db.set(`data_${message.member.id}`, data)
                } else if (player > dealer) {
                    embed.setDescription("")
                    embed.setColor("GREEN")
                    embed.setTitle(`You won! +${guild.economy_emoji}${bet.toLocaleString()}`)
                    data.money = (BigInt(data.money) + bet).toString()
                    client.db.set(`data_${message.member.id}`, data)
                } else if (player < dealer) {
                    embed.setDescription("")
                    embed.setColor("RED")
                    embed.setTitle(`You lost! -${guild.economy_emoji}${bet.toLocaleString()}`)
                    data.money = (BigInt(data.money) - bet).toString()
                    client.db.set(`data_${message.member.id}`, data)
                } else if (player === dealer) {
                    embed.setDescription("")
                    embed.setColor("ORANGE")
                    embed.setTitle(`Blacjack: Draw! Money pushed back.`)
                } else {
                    message.channel.send(`Condition out of map`)
                }
                
                showCards()
                collector.stop()
                return msg.edit(embed)
            } else {
                let rn = Object.keys(store)[Math.floor(Math.random() * Object.keys(store).length)]
                
                cards.player.push(rn)
            }
            
            if (getValue(cards.player) === 21) {
                embed.setDescription("")
                embed.setColor("GREEN")
                embed.setTitle(`You won! +${guild.economy_emoji}${bet.toLocaleString()}`)
                data.money = (BigInt(data.money) + bet).toString()
                client.db.set(`data_${message.member.id}`, data)
                showCards()
                msg.edit(embed)
                return collector.stop()
            } else if (getValue(cards.player) > 21) {
                embed.setDescription("")
                embed.setColor("RED")
                embed.setTitle(`You lost! -${guild.economy_emoji}${bet.toLocaleString()}`)
                data.money = (BigInt(data.money) - bet).toString()
                client.db.set(`data_${message.member.id}`, data)
                showCards()
                msg.edit(embed)
                return collector.stop()
            } else {
                showCards()
                msg.edit(embed)
            }
        })
        
        collector.once("end", () => {
            client.bjs.delete(message.member.id) 
        })
    }
}