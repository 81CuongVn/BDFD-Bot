module.exports = {
    name: "count-brackets",
    description: "count brackets in a text",
    args: 1,
    usages: ["<text>"],
    examples: ["[{}][}["],
    fields: ["text"],
    aliases: ["cb"],
    category: "util",
    execute: async (client, message, args) => {
        const m = await message.channel.send(`Analyzing...`)
        
        const code = args.join(" ")
        
        const content = []
        
        function get(text, char) {
            return text.split(char).length - 1
        }
        
        code.split("\n").map((c, line) => {
            content.push(`Line ${line+1}: [ => ${get(c, "[")} | ] => ${get(c, "]")} && { => ${get(c, "{")} | } => ${get(c, "}")}`)
        })
        
        content.push("")
        
        content.push(`Total: [ => ${get(code, "[")} | ] => ${get(code, "]")} && { => ${get(code, "{")} | } => ${get(code, "}")}`)
        
        m.edit(content.join("\n"))
    }
}