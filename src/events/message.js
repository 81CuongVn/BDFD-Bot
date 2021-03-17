module.exports = (client, message) => {
    client.counters.events++
    
    if (!client.functions || !client.utils ||  !client.handlers) return undefined
    
    client.handlers.reviewChecker(message) 
    
    client.handlers.commandHandler(message)
}