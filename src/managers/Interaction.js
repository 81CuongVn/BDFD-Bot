module.exports = class Interaction {
    constructor(data, client) {
        this.client = client 
        
        this._resolve(data)
    }
    
    _resolve(data) {
        
        this.id = data.id 
        
        this.type = data.type 
        
        this.version = data.version 
        
        this.token = data.token 
      
        this.channel= Object.assign(Object.create(this.client.channels.cache.get(data.channel_id)), this.client.channels.cache.get(data.channel_id))
        
        //modify built in .send 
        this.channel.send = this.send
        this.channel.intid = this.id 
        this.channel.inttoken = this.token
        
        this.guild = this.client.guilds.cache.get(data.guild_id)
        
        this.member = this.guild.members.cache.get(data.member.user.id) || new this.client.discord.GuildMember(this.guild, data.member, this.client)
        
        this.user = this.client.users.cache.get(this.member.user.id)
        
        this.data = data.data 

    }
    
    async send(content, options = {}, flagType) {
        if (options instanceof this.client.discord.MessageEmbed) options = {
            embed: options 
        }
        if (content instanceof this.client.discord.MessageEmbed) {
            options.embed = content
            content = ""
        } 
        if (options.embed) options.embed = options.embed
        
        const data = {
            embeds: options.embed ? [options.embed] : [],
            content,
            flags: flagType,
            files: options.embed && options.embed.files ? options.embed.filed : []
        }
        
        if (flagType === 64 && data.embeds.length) {
            content = [content]
            
            for (const d of Object.values(data.embeds[0]).filter(e => typeof e === "string" && e.length && e !== "rich")) {
                content.push(d) 
            }
            
            content = content.join("\n")
            data.content = content 
        }
        
        const m = options.msgType === undefined ? await this.client.api.interactions(this.intid, this.inttoken).callback.post({
            data: {
                type: options.type || 4, 
                data 
            }
        }) : await this.client.api.webhooks(this.client.user.id, this.inttoken).messages("@original").patch({
            data: data 
        })
        
        
        
        m.edit = (content, options = {}) => {
            options.msgType = "edit"
            this.send(content, options) 
        }
        
        return m 
    } 
}