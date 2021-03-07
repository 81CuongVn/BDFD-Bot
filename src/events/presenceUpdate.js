
module.exports = (client, oldp, newp) => {
    client.counters.events++
    client.handlers.staffPresenceTracking(oldp, newp)
}