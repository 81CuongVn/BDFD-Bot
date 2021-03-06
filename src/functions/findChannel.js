module.exports = (client, guildID, query = "") => {
    //channel manager 
    const channels = client.guilds.cache.get(guildID).channels.cache 
    
    //matches mention regex?
    if (client.utils.CHANNEL_MENTION_REGEX.test(query)) {
        return channels.get(query.match(client.utils.CHANNEL_MENTION_REGEX)[1])
    } //matches channel ID regex?
    else if (client.utils.CHANNEL_ID_REGEX.test(query)) {
        return channels.get(query)
    } //query
    else {
        return channels.find(c => 
            c.name === query.toLowerCase().replace(/ +/g, "-")
        )
    }
}