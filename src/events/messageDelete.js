module.exports = (client, msg) => {
    client.counters.events++
    if (!msg.partial) client.snipes.set(msg.channel.id, msg)
}