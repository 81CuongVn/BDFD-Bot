module.exports = {
    name: "transfer",
    description: "transfers unb coins to this bot, this can only be used once.",
    category: "economy",
    cooldown: 60000,
    execute: async (client, message, args) => {
        //return message.channel.send("Not yet...")
        
        const data = client.functions.getData(message.author.id)
        
        if (data.transferred) return message.channel.send(`You have already transferred your balance.`)
        
        message.channel.send(`Please run \`.bal\`.`)
        
        const filter = (m) => ["356950275044671499", "292953664492929025"].includes(m.author.id) && m.embeds.length && (m.embeds[0].author || {}).name === message.author.tag && m.embeds[0].fields.length === 3 && m.embeds[0].fields[2].name.includes("Net Worth")
        
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 55000,
            errors: ["time"]
        })
        .then(async collected => {
            const m = collected.first()
            
            const msg = await message.channel.send(`Analyzing...`)
            
            const fields = m.embeds[0].fields
            
            const bal = BigInt(fields[0].value.split(">")[1].replace(/,/g, ""))
            
            const bank = BigInt(fields[1].value.split(">")[1].replace(/,/g, ""))
            
            data.username = message.author.tag
            data.money = (BigInt(data.money) + bal).toString()
            data.bank = (BigInt(data.bank) + bank).toString()
            data.transferred = true 
            
            client.db.set(`data_${message.author.id}`, data)
            
            msg.edit(`Found:\nBal: ${bal.toLocaleString()}\nBank: ${bank.toLocaleString()}\nSuccessfully transferred money.`)
        })
        .catch(err => {
            if (!err.message) message.channel.send(`Command timed out.`)
            else message.channel.send(`Something went wrong.\nMake sure you are not trying to transfer Infinity amount.`)
        })
    }
}