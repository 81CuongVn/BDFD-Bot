module.exports = async (client, query = "", message) => {
    //matches user mention regex?
    if (client.utils.USER_MENTION_REGEX.test(query)) {
        return await client.users.fetch(query.match(client.utils.USER_MENTION_REGEX)[1]).catch(err => null)
    }
    else if (client.utils.USER_ID_REGEX.test(query)) {
        return await client.users.fetch(query).catch(err => null)
    } //query
    else {
        if (message) {
            const member = await client.functions.findMember(message, query)
            
            return member ? member.user : null
        }
    }
}