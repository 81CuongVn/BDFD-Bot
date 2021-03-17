module.exports = async (client, message) => {
    //remove clutter from review channel
    if (message.channel.id ==="612071025613602837" && message.reference !== null) {
        m = await message.delete().catch(err => null)
        if (!m) return undefined 
        message.author.send(`Do not reply to other people's review in the same channel, if you need to say something to them please do so in the main chat.`).catch(err => null)
    }
}