module.exports = async (client, message, query = "") => {
    //matches user mention regex?
    if (client.utils.USER_MENTION_REGEX.test(query)) {
        return message.mentions.members.first()
    } 
    //matches user ID regex?
    else if (client.utils.USER_ID_REGEX.test(query)) {
        return await message.guild.members.fetch(query).catch(err => null)
    } //request chunks of members
    else {
        const members = await message.guild.members.fetch({
            query
        }).catch(err => null)
        
        if (!members) return null
        
        return members.first()
    }
}