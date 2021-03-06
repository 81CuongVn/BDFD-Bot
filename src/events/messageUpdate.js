module.exports = (client, oldm, newm) => {
    if (!oldm.partial) client.esnipes.set(newm.channel.id, oldm)
}