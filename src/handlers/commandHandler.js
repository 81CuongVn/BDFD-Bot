module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === "dm") return undefined 
    
    client.handlers.staffMessageTracking(message)
    
    if (!client.utils.PREFIX_REGEX.test(message.content)) return undefined
    
    const prefix = message.content.match(client.utils.PREFIX_REGEX)[0]
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    
    const cmd = args.shift().toLowerCase()
    
    const command = client.commands.get(cmd) || client.commands.find(c => c.name.replace(/-/g, "") === cmd || (c.aliases && c.aliases.includes(cmd)))
        
    if (!command) return undefined
        
    client.counters.commands++
    
    try {
        const request = await client.handlers.requestHandler(message, args, command, true)
        
        if (!request) return undefined
        
        await command.execute(client, message, args, command)
    } catch (err) {
        console.log(err)
        
        client.handlers.error(err)
        
        message.channel.send(`${message.author.username}, an error occurred!\`\`\`js\n${err.message}\`\`\`Please contact our developers about this issue.`)
    }
}