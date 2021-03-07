module.exports = (client) => {
    const data = client.deep({...client.utils.variables.messages}, (client.db.get(`messages`) || {}))
    
    data.save = () => {
        const obj = {}
        
        Object.keys(client.utils.variables.messages).map(key => obj[key] = data[key])
        
        client.db.set(`messages`, obj)
        return data
    }
    
    return data
}