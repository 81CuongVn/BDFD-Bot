module.exports = (client, msg) => {
    if (!msg.partial) client.snipes.set(msg.channel.id, msg)
}