import { opt, mkOptions } from "./lib/option"
import { distro } from "./lib/variables"
import { icon } from "./lib/utils"
import icons from "./lib/icons"

const options = mkOptions(OPTIONS, {
    autotheme: opt(false),

	transition: opt(200),

    bar: {
		flatButtons: opt(false),
        position: opt<"top" | "bottom">("top"),
        workspaces: {
            workspaces: opt(4),
        },
        battery: {
            bar: opt<"hidden" | "regular" | "whole">("whole"),
            charging: opt("#00D787"),
            percentage: opt(true),
            blocks: opt(7),
            width: opt(50),
            low: opt(30),
        },
        systray: {
			stitem: opt(false),
            ignore: opt([ 
				'Deezer'
            ]),
            include: opt([
				'Cryptomator',
				'Keepassxc',
				'Enpass',
            ]),
        },
    },
        
  layout: {
            start: opt<Array<import("./modules/bar/bar").BarWidget>>([
                "workspaces",
                "title",
            ]),
            center: opt<Array<import("./modules/bar/bar").BarWidget>>([
                "media",
            ]),
            end: opt<Array<import("./modules/bar/bar").BarWidget>>([
                "systray",
                "sysinfo",
                "dashbtn",
            ]),
        },
        
    overview: {
        scale: opt(15),
        workspaces: opt(4),
        monochrome: opt(true),
    },

    datewin: {
        position: opt<Array<"top" | "bottom" | "left" | "right">>(["top"]),
    },
    
    playwin: {
        position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
    },
    
    dashvol: {
        position: opt<Array<"top" | "bottom" | "left" | "right">>(["top"]),
    },
    
    dashboard: {
        position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
    },
    
    notifications: {
        position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
		width: opt(440),
		blacklist: opt([
			"Synology"
		]),
    },
})

globalThis["options"] = options
export default options
