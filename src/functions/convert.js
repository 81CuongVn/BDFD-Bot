module.exports = (client, arg) => {
    if (arg.includes("e")) {
        const regex = arg.match(/e(\d+)$/)
        
        if (!regex) return null
        else {
            const n = arg.split("e")[0]
            const e = arg.split("e")[1]
            if (Number(n) > 3000) return undefined
            if (!Number(n)) return undefined
            return BigInt(n + ("0".repeat(Number(e))))
        }
    } else {
        if (!Number(arg)) return undefined
        return BigInt(arg)
    }
}