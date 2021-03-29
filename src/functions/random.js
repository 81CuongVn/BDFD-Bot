module.exports = (client, type = "number", data = {}) => {
    const {
        min,
        max,
        player,
        fine = false,
        ratio,
        target,
        rob = false
    } = data 
    
    if (type === "number") {
        if (!fine) {
            if (rob) {
                if (!target) return undefined
                const m = BigInt(ratio)
                
                return m > BigInt(target) ? BigInt(target) : m
            }
            if (!player) {
                if (!min || !max) throw new Error("Min or max values were not provided.")
                return client.random(BigInt(max), BigInt(min))
            } else {
                const m = client.random(BigInt(max), BigInt(min))
                
                return m > BigInt(player) ? BigInt(player) : m
            }
        } else {
            if (!player) {
                if (!min || !max) return undefined
                else return client.random(BigInt(max), BigInt(min))
            } else {
                const m = client.random(BigInt(max), BigInt(min))
                return m > BigInt(player) ? BigInt(player) : m 
            }
        }
    } else {
        if (!fine) {
            if (!player) {
              return undefined  
            } else {
                if (rob) {
                    if (!target) return undefined
                    
                    const maxp = BigInt(target) / 100n * BigInt(max)
                    const minp = BigInt(target) / 100n * BigInt(min)
                    
                    return client.random(BigInt(maxp), BigInt(minp))
                } else {
                    if (!player) return undefined
                    const maxp = BigInt(player) / 100n * BigInt(max)
                    const minp = BigInt(player) / 100n * BigInt(min)
                    
                    return client.random(BigInt(maxp), BigInt(minp))
                }
            }
        } else {
            if (!player) {
                return undefined
            } else {
                if (!player) return undefined
                if (ratio) {
                    return BigInt(target) / 100n * BigInt(ratio)
                }
                    
                const maxp = BigInt(player) / 100n  * BigInt(max)
                const minp = BigInt(player)/ 100n * BigInt(min)
                    
                return client.random(BigInt(maxp), BigInt(minp))
            }
        }
    }
}