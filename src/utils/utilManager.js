module.exports = (client) => {
    client.utils = {
        CHANNEL_ID_REGEX: /^(\d{17,19})$/,
        CHANNEL_MENTION_REGEX: /^<#(\d{17,19})>$/,
        CHANNEL_LINK_REGEX: /https?:\/\/discord(app)?\.com\/channels\/(\d{17,19})\/(\d{17,19})\/(\d{17,19})/,
        USER_ID_REGEX: /^(\d{17,19})$/,
        USER_MENTION_REGEX: /^<@!?(\d{17,19})>$/,
        dates: require("dbd.js-utils"),
        variables: require("./variables"),
        PREFIX_REGEX: new RegExp(`^(<@!?${client.user.id}>|${ "\\" + client.prefix}|${client.user.username})`, "i"),
        channels: require("./channels"),
        staff_roles: {
            support: '568155071997542410',
            staff: '659789148806447134',
            moderator: '566364651986747392',
            'lead staff': '578903414562357288',
            'trial moderator': '772037534259478528',
        },
        emojis: {
            left: "◀️",
            no_perms: "<a:dootFire:817461315600908288>",
            right: "▶️",
            mark: "❌",
            check: "✅",
            online: "<:online:818199420104343582>",
            idle: "<:idle:818199378748506182>",
            dnd: "<:dnd:818199339288756225>",
            offline: "<:offline:818199477600387122>"
        }
    }
}