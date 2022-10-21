/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
const File = Java.type("java.io.File");
import PogObject from "PogData";
import request from '../request/index';
const get_profile = (apikey, user_uuid) => request({url : `https://api.hypixel.net/skyblock/profiles?key=${apikey}&uuid=${user_uuid}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
const get_uuid = (username) => request({url : `https://playerdb.co/api/player/minecraft/${username}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
const get_profile_id = (user_uuid, profiles=null, apikey=null) => {
    const getRecent = (profiles) => !profiles.profiles || !profiles.profiles.length ? null : profiles.profiles.find(a => a.selected) ?? profiles[0]
    if (profiles) return getRecent(profiles)
    return get_profile(apikey, user_uuid).then(profiles => getRecent(profiles)).catch(e => print(`${e}`))
};
const hypixel_api = (apikey, user_uuid) => request({url : `https://api.hypixel.net/skyblock/profile?key=${apikey}&profile=${user_uuid}`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => JSON.parse(response)).catch(error =>{ print(error);});
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
    api_key: null
}, ".sf_data.json");
function fileExists(location) {
    var file = new File(location);
    return file.exists();
};
if (!fileExists("./config/ChatTriggers/modules/SoulFlow/.sf_data.json")) {  
    data.save();
    ChatLib.chat("")
    new TextComponent(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Please Set Your Api Key By Doing /api new`)).chat();
    new TextComponent(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Or By Doing /skey <key>`)).chat();
    new TextComponent(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Join Our Discord!  &b&nDiscord&r ${colors[15]}(Click)`)).setClickAction("open_url").setClickValue("https://discord.gg/SK9UDzquEN").chat();
    ChatLib.chat("")
};
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
let abc = new Gui()
const get_display_data = () => {
    let key = data.api_key;
    if(key === "null" || key === null) return;
    let username = Player.getName();
    let soulflow
    get_uuid(username).then(user_result => {
        let uuid = user_result.data.player.raw_id;
        get_profile_id(uuid, null, key).then(profile_result => {
            let cute_name = profile_result.profile_id;
            hypixel_api(key, cute_name).then(hypixel_result => {
                soulflow = hypixel_result.profile.members[uuid].soulflow;
                soulflow = soulflow || 0;
                soulflow > 1000 ?soulflow = `${PREFIX}&2${soulflow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`: soulflow = `${PREFIX}&4${soulflow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                register("renderOverlay", () => {
                    x = Math.round(parseInt(String(FileLib.read("./config/ChatTriggers/modules/SoulFlow/" + "x.txt")))) || 0;
                    y = Math.round(parseInt(String(FileLib.read("./config/ChatTriggers/modules/SoulFlow/" + "y.txt")))) || 0;
                    Renderer.drawString(`${soulflow}`, x, y, true)
                });
            }).catch(function(error) {
                print(error)
                return ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[1]}Error Getting Player's Data`));
             });
        }).catch(function(error) {
            print(error)
            return ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[1]}Error Getting Player's Profile ID`));
         });
    }).catch(function(error) {
        print(error)
        return ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[1]}Error Getting Player's UUID`));
     });
}
get_display_data();
register("command", () => {
    abc.open();
    ChatLib.chat(ChatLib.getCenteredText(`${PREFIX}${colors[6]}Click Anywhere In Screen To Move The Display`))
}).setName("soulflow").setAliases(["sf"]);
register("dragged", (dx, dy, x, y) => {
    if (abc.isOpen()) {
        FileLib.write("./config/ChatTriggers/modules/SoulFlow/" + "x.txt", Math.round(x));
        FileLib.write("./config/ChatTriggers/modules/SoulFlow/" + "y.txt", Math.round(y));
    }
});
register("worldLoad", () => get_display_data());