module.exports = class StaffStatus {
    constructor(client) {
        client.staffStatus = this 
        
        this.client = client 
        
        this.interval = client.ms("1d")
        
        this.timeouts = new client.discord.Collection()
        
        this.build()
        
        this.start()
    }
    
    get reactions() {
        const emojis = this.client.utils.emojis
        return [emojis.online, emojis.idle, emojis.dnd, emojis.offline]
    }
    
    start() {
        Object.values(this.members).map(a => a.map(data => {
            if (data.data.activity.status === "idle") this.addTimeout(data.member.id, this.client.db.get(`staff_${data.member.id}`))
        }))
    }
    
    addTimeout(id, data) {
        let time;
        
        if (this.timeouts.has(id)) clearTimeout(this.timeouts.get(id))
        
        if (!data.activity.lastWarnAt) {
            time = this.interval
            data.activity.lastWarnAt = Date.now()
        } else {
            time = this.interval + data.activity.lastWarnAt - Date.now()
        }
        
        this.client.db.set(`staff_${id}`, data)
        
        this.timeouts.set(id, setTimeout(() => this.warn(id), time))
    }
    
    warn(id) {
        const data = this.client.functions.getStaff(id)
        
        data.activity.warnCount++
        data.activity.warned = true
        data.activity.lastWarnAt = null 
        
        data.save()
        
        if (data.activity.status === "idle") {
            this.addTimeout(id, this.client.db.get(`staff_${id}`))
            
            const user = this.client.users.cache.get(id)
            
            if (user) {
                user.send(`Hey ${user}, I'm here to notify you that you have been in idle status for ${client.utils.dates.parseMS((Date.now() - data.activity.lastWarnAt) * data.activity.warnCount).array(true).join(" ")}! You can change it in <#818200948991852606>`).catch(err => null)
            }
        }
        else {
            data.activity.warned = false
            data.activity.warnCount = 0 
            data.save()
        }
    }
    
    isStaff(member) {
        return Object.values(this.client.utils.staff_roles).some(id => member.roles.cache.has(id))
    }
    
    async build() {
        const messages = this.client.functions.getMessages()
        
        let msg = await this.client.channels.cache.get(this.client.utils.channels.statusChannelID).messages.fetch(messages.staffStatusID).catch(err => null)
        
        if (!msg) {
            msg = await this.client.channels.cache.get(this.client.utils.channels.statusChannelID).send(this.embed)
            
            for (const emoji of this.reactions) await msg.react(emoji)
        }
        
        this.message = msg 
        this.id = msg.id
        messages.staffStatusID = this.id 
        messages.save()
        this.update()
    }
    
    async update() {
        const m = await this.message.edit(this.embed)
        .catch(err => null)
        
        if (!m) {
            this.build()
            return
        }
        
        await new Promise(e => setTimeout(e, 60000))
        
        this.update()
    }
    
    get embed() {
        const { client } = this 
        
        const embed = new client.discord.MessageEmbed()
        .setTitle("Staff Activity")
        .setColor("6B81D2")
        .setThumbnail(client.guilds.cache.get("566363823137882154").iconURL({
            dynamic: true,
            size: 4096
        }))
        .setTimestamp()
        .setFooter(`Staff will appear here as soon as they're registered to the database`)
        
        //list staff members
        const list = this.members
        
        for (const [field, members] of Object.entries(list)) {
            const name = `${this.client.utils.emojis[field]} **${field === "idle" ? "Idle" : field === "dnd" ? "Do Not Disturb" : field === "online" ? "Online" : "Offline"}**`
            
            const m = members.map(d => {
                return `${d.member} \`[${d.member.user.tag}]\` (${client.utils.dates.parseMS(Date.now() - d.data.activity.since).array(true).join(" ")} ago)`
            }).join("\n") || "None"
            
            embed.addField(name, m)
        }
        
        embed.addField(`Note`, `This is updated every minute to cache new changes.`)
        
        return embed
    }
    
    get members() {
        const guild = this.client.guilds.cache.get("566363823137882154")
        
        const all = this.client.db.all().filter(d => d.ID.startsWith("staff_")).map(d => {
            return {
                member: guild.members.cache.get(d.ID.split("_")[1]),
                data: JSON.parse(d.data),
                ID: d.ID 
            }
        }).filter(a => a.member && !a.member.user.bot && this.isStaff(a.member))
        
        const statuses = {
            online: [],
            idle: [],
            dnd: [],
            offline: []
        }
        
        for (const data of all) {
            const clean = this.client.functions.getStaff(data.member.id)
            
            clean.save()
            
            statuses[clean.activity.status].push({
                data: clean,
                member: data.member
            })
        }
        
        return statuses
    }
    
    async handle(reaction, user) {
        if (!this.reactions.includes(reaction.emoji.toString())) return console.log(user.id, reaction.emoji)
        
        const member = this.client.guilds.cache.get("566363823137882154").members.cache.get(user.id)
        
        if (!member || !this.isStaff(member)) return console.log(`User ${user.tag || user.id} not cached`)
        
        if (reaction.users) await reaction.users.remove(user.id)
        
        const data = this.client.functions.getStaff(user.id)
        
        const status = reaction.emoji.name 
        
        if (status === data.activity.status) return console.log(`${user.tag} attempted to change to same status`)
        
        console.log(`New status of ${status} for ${user.tag}`)
        
        data.activity.status = status 
        data.activity.since = Date.now()
        
        data.save()
        
        
        if (status === "idle") {
            this.addTimeout(user.id, this.client.db.get(`staff_${user.id}`))
        } else {
            clearTimeout(this.timeouts.get(user.id))
        }
    }
}