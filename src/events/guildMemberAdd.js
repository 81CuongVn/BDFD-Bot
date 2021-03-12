module.exports = (client, member) => {
    client.counters.events++ 
    client.handlers.newMember(member)
}