module.exports = (client, oldm, newm) => {
    client.counters.events++
    if (!oldm.partial) client.esnipes.set(newm.channel.id, oldm)
}