/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
const File = Java.type("java.io.File");
import PogObject from "PogData";
import request from '../request/index';
const PREFIX = "&5[SoulFlow] ";
const colors = {
    1: '§4', // Dark Red
    2: '§c', // Red
    3: '§6', // Gold
    4: '§e', // Yellow
    5: '§2', // Dark Green
    6: '§a', // Light Green
    7: '§b', // Aqua
    8: '§3', // Dark Aqua
    9: '§1', // Dark Blue
    10: '§9', // Blue
    11: '§d', // Light Purple
    12: '§5', // Dark Purple
    13: '§0', // Black
    14: '§8', // Dark Gray
    15: '§7', // Gray
    16: '§f' // White
}
let data = new PogObject("SoulFlow", {
    "api_key": null,
    "x": 0,
    "y": 0,
    "soulflow": 0,
    "first_time": true
}, ".sf_data.json");
register("step", () => {
    if (data.first_time) { 
        data.first_time = false; 
        data.save();
        ChatLib.chat("")
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Please Set Your Api Key By Doing /api new`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Or By Doing /skey <key>`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Join Our Discord!  &b&nDiscord&r ${colors[15]}(Click)`)).setClickAction("open_url").setClickValue("https://discord.gg/SK9UDzquEN").chat();
        ChatLib.chat("")
    };
}).setFps(1);
register("chat", (key) => {
    data.api_key = key;
    data.save();
    ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Api Key Successfully Set!`))
}).setCriteria(/Your new API key is (.+)/);
register("command", (key) => {
    data.api_key = key;
    data.save();
    ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Api Key Successfully Set!`))
    ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Please Do /ct reload!`))
}).setName("skey");
register("worldLoad", () => {
    if (!data.apiKey) return
    let uuid = Player.getUUID().replace(/-/g, "")
    request(`https://api.hypixel.net/skyblock/profiles?key=${data.apiKey}&uuid=${uuid}`).then(sbData => {
        sbData = JSON.parse(sbData)
        let profile = sbData.profiles.find(a => !!a.selected)
        if (!profile) return ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[1]}Error Getting Player's Profile ID`));
        data.soulflow = profile.members[uuid].soulflow
        data.save()
    }).catch(e => null)
});
let abc = new Gui()
register("command", () => {
    abc.open();
}).setName("soulflow").setAliases(["sf"]);
register("dragged", (dx, dy, x, y) => {
    if (!abc.isOpen()) return
    data.x = x
    data.y = y
    data.save()
});
register("renderOverlay", () => {
    soulflow = data.soulflow || 0;
    soulflow > 1000 ?soulflow = `${PREFIX}&2${soulflow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`: soulflow = `${PREFIX}&4${soulflow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    if (abc.isOpen()) {
        const txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        Renderer.drawStringWithShadow(`${soulflow}`, data.x, data.y)
    }
    if (!data.soulflow && abc.isOpen()) return
    Renderer.drawStringWithShadow(`${soulflow}`, data.x, data.y)
});