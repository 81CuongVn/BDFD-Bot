module.exports = (client, reaction, user) => {
    client.counters.events++ 
    
    if (client.staffStatus && client.staffStatus.id === reaction.message.id) client.staffStatus.handle(reaction, user)
}