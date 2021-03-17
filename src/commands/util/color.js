const canvas = require("canvas")

module.exports = {
    name: "color",
    description: "return hex color in image",
    category: "util",
    args: 1,
    fields: ["hex"],
    examples: ["ff0000"],
    usages: ["<hex> <hex> ..."],
    staff: true,
    execute: async (client, message, args) => {
        let rr = false
        if (args[args.length -1] === "true") {
            args.pop()
            rr = true 
        }
        if (message.channel.inttoken) {
            return message.channel.send(`Unusable within slash commands!`, {
                type: 3
            }, 64)
        }
        
        const rrs = [
            '1️⃣', '2️⃣', '3️⃣',
            '4️⃣', '5️⃣', '6️⃣',
            '7️⃣', '8️⃣', '9️⃣'
        ]
        
        const embed = new client.discord.MessageEmbed()
        
        
        for (const arg of args) {
        const c = await canvas.createCanvas(100, 100)
        
        const ctx = c.getContext("2d")
        
        ctx.fillStyle = args.includes("#") ? arg : "#" + arg
        
        ctx.fillRect(0, 0, 100, 100)
        
        const attachment = new client.discord.MessageAttachment(c.toBuffer(), arg + ".png")
        
        embed.attachFiles(attachment)
        }
        
        const m = await message.channel.send(undefined, {
            files: embed.files
        }).catch(err => null)
        if (!m) return message.channel.send(`Something went wrong here`)
        else if (rr) {
            for (const a in embed.files) {
                m.react(rrs[a])
            }
        }
    }
}