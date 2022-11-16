import {
    @Vigilant,
    @SwitchProperty,
    @ButtonProperty,
    @TextProperty,
    Color 
} from 'Vigilance';

@Vigilant("SoulFlow", "§5SoulFlow §fSettings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    constructor() {
        this.initialize(this);
        this.addDependency("Low SF Color", "Display")
    }
    @SwitchProperty({
        name: "Display",
        description: "Display Soulflow Amount",
        category: "General",
        subcategory: "General"
    })
    config_display = true
    @TextProperty({
        name: "Low SF Color",
        description: "Changes SoulFlow Amount Color To §4Red§r When Lower To This Amount",
        category: "General",
        subcategory: "General",
        placeholder: "5000"
    })
    config_alert_amount = "";
    @ButtonProperty({
        name: "Display Location",
        description: "Changes The Display Location",
        category: "General",
        subcategory: "General",
        placeholder: "Change"
    })
    action() {
        ChatLib.command("soulflowdisplay", true);
    }
}

export default new Settings();