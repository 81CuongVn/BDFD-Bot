module.exports = async (client, interaction) => {
    const data = {
        author: interaction.user,
        member: interaction.member,
        channel: interaction.channel,
        guild: interaction.guild,
        client, 
        mentions: {
            users: new client.discord.Collection(),
            channels: new client.discord.Collection(),
            roles: new client.discord.Collection()
        },
        content: "",
        embeds: []
    }
    
    const command = client.commands.get(interaction.data.name) 
    
    const args = []
    
    if (interaction.data.options && interaction.data.options.length) {
        for (const option of interaction.data.options.filter(a => a.value)) {
            args.push(option.value) 
        }
    }
    
    data.content = `${client.prefix}${command.name} ${args.join(" ")}`
    
    client.handlers.commandHandler(data)
}