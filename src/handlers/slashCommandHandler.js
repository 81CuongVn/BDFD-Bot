module.exports = async (client) => {
    //return true 
    for (const command of client.commands.filter(c => c.slash !== false).array()) {
        const options = []
        
        if (command.fields) for (const i in command.fields) {
            let isRequired = true
            const field = command.fields[i]
            if (!command.args || i > command.args) {
                isRequired = false
            }
            options.push({
                name: field,
                description: client.utils.slashOptions[field] || "none provided",
                type: 3,
                required: isRequired
            })
        }
        
        const slash = await client.api.applications(client.user.id).guilds("566363823137882154").commands.post({
            data: {
                name: command.name,
                description: command.description || "none",
                options
            }
        }).catch(err => err.message)
        
        console.log(typeof slash === "object" ? `Slash ${slash.name} created/updated!` : `Failed to create slash command ${command.name}: ${slash}`)
    }
}