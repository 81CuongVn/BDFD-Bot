module.exports.staff = {
    messages: {},
    message_count: 0,
    lastMessage: {
        id: null,
        content: null,
        channel: {
            id: null,
            name: null
        },
        createdTimestamp: null
    },
    presence: {
        status: null,
        activities: [],
        devices: null,
        since: null
    }, 
    activity: {
        status: "online", 
        since: null, 
        lastWarnAt: null, 
        warned: false, 
        warnCount: 0
    }
}

module.exports.giveaway = {
    
}

module.exports.messages = {
    staffStatusID: null
}

module.exports.timers = {
    staff_messages: null
}