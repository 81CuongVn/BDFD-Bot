module.exports = async (client, message, item) => {
    if (item.removed_roles) {
        await message.member.roles.remove(item.removed_roles).catch(err => null)
    }
    
    if (item.new_roles) {
        await message.member.roles.add(item.new_roles).catch(err => null)
    }
    
    if (item.reply) message.channel.send(item.reply)
    
    return true
}