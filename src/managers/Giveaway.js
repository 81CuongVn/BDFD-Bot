module.exports = class Giveaway {
    constructor(client, data) {
        this.client = client 
        
        this.data = data
    }
    
    async fetch() {
        if (this.message) {
            return console.log(`Giveaway ${this.data.id} already fetched`)
        }
        else {
            this.message = await this.client.channels.cache.get(this.data.channelID).messages.fetch(this.data.id).catch(err => null)
            
            if (this.message) {
                console.log(`Successfully fetched ${this.message.id}`)
                this.client.giveaways.set(this.message.id, this)
            } else {
                return console.log(`Failed to fetch giveaway ${this.data.id}`)
            }
        }
    }
    
    async update() {
        if (!this.message) {
            await this.fetch()
        }
        
        let time = Math.floor(Math.random() * 180000) + 180000
        
        if (this.data.endsAt - (Date.now() + time) < 1) time = this.data.endsAt - Date.now()
        
        await new Promise(e => setTimeout(e, time))
        
        if (this.data.ended) return false 
        
        if (this.data.endsAt - Date.now() < 1) {
            return this.end()
        }
        
        await this.message.edit(this.embed)
        
        return this.update()
    }
    
    get embed() {
        const { data, client } = this 
        
        const outputs = [
            `**Hoster**: <@${this.data.userID}>`,
            `**Time Remaining**: ${client.utils.dates.parseMS(data.endsAt - Date.now()).array(true).join(" ")}`,
            "",
            "React with <:bdfd_coin:766607515445231637> to enter the giveaway"
        ]
        
        const embed = new client.discord.MessageEmbed()
        .setColor("6B81D2")
        .setAuthor("🎉 BDFD GIVEAWAY 🎉", undefined, "https://play.google.com/store/apps/details?id=com.jakubtomana.discordbotdesinger")
        .setTitle(data.title)
        .setFooter(`${data.winners} Winner${data.winners === 1 ?"" : "s"} | Ends at `)
        .setTimestamp(data.endsAt)
        .setURL(this.message ? this.message.url : "https://discord.gg/bot")
        .setThumbnail(client.guilds.cache.get(this.data.guildID).iconURL({
            dynamic: true,
            size: 4096
        }))
        .setDescription(outputs.join("\n"))
        
        return embed
    }
    
    async fetchReactions(after) {
        if (!this.message) {
            await this.fetch()
        }
        
        return await this.message.reactions.cache.get("766607515445231637").users.fetch({
            after
        })
    }
    
    async fetchAllReactions() {
        const collection = new this.client.discord.Collection()
        
        if (!this.message) {
            await this.fetch()
        }
        
        const rr = this.message.reactions.cache.get("766607515445231637")
        
        if (rr.users.cache.size >= rr.count) {
            return rr.users.cache.filter(u => !u.bot && this.message.guild.members.cache.has(u.id))
        }
        
        const users = await this.fetchReactions()
        
        users.map(u => {
            if (!u.bot && this.message.guild.members.cache.has(u.id)) {
                collection.set(u.id, u)
            }
        })
        
        let lastID = users.last().id 
        
        while(true) {
            const users = await this.fetchReactions(lastID)
            
            if (!users.size) return collection
            else {
                users.map(u => {
                    if (!u.bot && this.message.guild.members.cache.has(u.id)) {
                        collection.set(u.id, u)
                    }
                })
                
                lastID = users.last().id
            }
        }
    }
    
    async end(reroll = false) {
        const embed = this.embed 
        
        embed.author.name = `🎉 BDFD GIVEAWAY (ENDED) 🎉`
        
        let w = reroll ? 1 : this.data.winners 
        
        const users = await this.fetchAllReactions()
        
        const winners = []
        
        while(w > 0) {
            const u = users.random()
            if (u) users.delete(u.id)
            if (u) winners.push(u)
            w--
        }
        
        const outputs = [
            `**Hoster**: <@${this.data.userID}>`,
            `**Winners**: ${winners.length ? winners.map(u => u.toString()).join(", ") : "No one"}`,
            "",
            `DM the hoster to claim your prize!`
        ]
        
        embed.setDescription(outputs.join("\n"))
        
        this.message.edit(embed) 
        
        if (reroll) {
            if (!winners.length) {
                this.message.channel.send(`There are no new winners for **${this.data.title}**.\n${this.message.url}`)
            } else {
                this.message.channel.send(`The new winner${winners.length === 1 ? "" : "s"} for **${this.data.title}** ${winners.length === 1 ? "is" : "are"} ${winners.map(u => u.toString()).join(", ")}!\n${this.message.url}`)
            }
        } else {
            this.data.ended = true
            this.client.giveaways.get(this.message.id).data.ended = true
            this.client.db.set(`giveaway_${this.message.id}`, this.data)
            
            if (!winners.length) {
                this.message.channel.send(`There are no winners for **${this.data.title}**.\n${this.message.url}`)
            } else {
                this.message.channel.send(`The winner${winners.length === 1 ? "" : "s"} for **${this.data.title}** ${winners.length === 1 ? "is" : "are"} ${winners.map(u => u.toString()).join(", ")}!\n${this.message.url}`)
            }
        }
    }
    
    async start() {
        if (this.data.id) {
            await this.fetch()
            
            if (!this.message) return false
            
            this.client.giveaways.set(this.message.id, this)
            
            this.update()
            
            return true
        }
        
        const m = await this.client.channels.cache.get(this.data.channelID).send(this.embed).catch(err => null)
        
        if (!m) return false
        else this.message = m 
        
        this.message.react("<:bdfd_coin:766607515445231637>")
        
        this.client.giveaways.set(m.id, this)
        
        this.data.id = m.id 
        
        this.update()
        
        return m 
    }
}