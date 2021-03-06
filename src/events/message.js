module.exports = (client, message) => {
    if (!client.functions || !client.utils ||  !client.handlers) return undefined
    
    client.handlers.commandHandler(message)
}