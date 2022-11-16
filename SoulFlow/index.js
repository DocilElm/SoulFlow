/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
import PogObject from "PogData";
import request from '../request/index';
import config from "./config";
import Settings from "./config";
const PREFIX = "&5[SoulFlow] ";
register("command", () => Settings.openGUI()).setName("soulflow", true).setAliases(["sf"]);
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
        ChatLib.chat("");
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aPlease Set Your Api Key By Doing /api new`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aOr By Doing /skey <key>`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aJoin Our Discord!  &b&nDiscord&r &7(Click)`)).setClickAction("open_url").setClickValue("https://discord.gg/SK9UDzquEN").chat();
        ChatLib.chat("");
    };
}).setFps(1);
register("chat", (key) => {
    data.api_key = key;
    data.save();
    ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}&aApi Key Successfully Set!`))
}).setCriteria(/Your new API key is (.+)/);
register("command", (key) => {
    data.api_key = key;
    data.save();
    ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}&aApi Key Successfully Set!`))
    ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}&aPlease Do /ct reload!`))
}).setName("skey");
register("worldLoad", () => {
    if (!data.api_key) return;
    let uuid = Player.getUUID().replace(/-/g, "")
    request(`https://api.hypixel.net/skyblock/profiles?key=${data.api_key}&uuid=${uuid}`).then(sbData => {
        sbData = JSON.parse(sbData)
        let profile = sbData.profiles.find(a => !!a.selected)
        if (!profile) {
            ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}&4Error Getting Player's Profile ID`));
            return;
        }
        data.soulflow = profile.members[uuid].soulflow
        data.save()
    }).catch(e => print(`${e}`));
});
let abc = new Gui()
register("command", () => {
    abc.open();
}).setName("soulflowdisplay");
register("dragged", (dx, dy, x, y) => {
    if (!abc.isOpen()) return
    data.x = x
    data.y = y
    data.save()
});
register("renderOverlay", () => {
    if(!config.config_display) return;
    let conf_amount = !parseInt(config.config_alert_amount) ?5000 : parseInt(config.config_alert_amount);
    soulflow = data.soulflow || 0;
    soulflow > conf_amount ?soulflow = `${PREFIX}&2${soulflow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`: soulflow = `${PREFIX}&4${soulflow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    if (abc.isOpen()) {
        const txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
    }
    if (!data.soulflow && abc.isOpen()) return
    Renderer.drawStringWithShadow(`${soulflow}`, data.x, data.y)
});
register("chat", (total) => {
    data.soulflow = parseInt(total.replace(/,/g, ''));
    data.save();
}).setCriteria(/You internalized .+⸎ Soulflow and have a total of (.+)⸎!/);