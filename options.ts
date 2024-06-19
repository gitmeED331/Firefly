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
			blocks: opt(10),
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
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "left"]),
	},
	
	playwin: {
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
	},
	
	dashvol: {
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top","right"]),
	},
	
	dashboard: {
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
	},
	
	pwrmenu: {
		lock: opt("bash -c 'exec ags -b lockscreen -c ~/.config/ags/Lockscreen/lockscreen.js'"),
		reboot: opt("systemctl reboot"),
		logout: opt("bash -c 'exec  ~/.config/hypr/scripts/hyprkill.sh >/dev/null 2>&1 &'"),
		shutdown: opt("systemctl -i poweroff"),
		layout: opt<"line" | "box">("line"),
		labels: opt(true),
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right", "left", "bottom"]),
	},

	ssrmenu: {
		AShot: opt("bash -c"+"exec '"+"grim -g "+'"$(slurp)"'+" ~/Pictures/Screenshots/Screenshot-area_$(date +%Y-%m-%d_%H%M-%S).png'"),
		FShot: opt("bash -c 'grim ~/Pictures/Screenshots/Screenshot-full_$(date +%Y-%m-%d_%H%M-%S).png'"),
		//WShot: opt(""),
		ARecord: opt("bash -c"+"exec '"+"wf-recorder -g "+'"$(slurp)"'+" -f ~/Pictures/Screenshots/Screenrecording-area_$(date +%Y-%m-%d_%H-%M-%S).mp4'"),
		FRecord: opt("bash -c 'exec wf-recorder -f ~/Pictures/Screenshots/Screenrecording-full_$(date +%Y-%m-%d_%H%M-%S).mp4'"),
		//WRecord: opt(""),
		layout: opt<"line" | "box">("line"),
		labels: opt(true),
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top"]),
	},

	pwrprof: {
		performancelight: opt("light -S 100"),
		performance: opt("performance"),
		balancelight: opt("light -S 60"),
		balance: opt("balanced"),
		saverlight: opt("light -S 30"),
		saver: opt("power-saver"),
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
		layout: opt<"line" | "box">("line"),
		labels: opt(true),
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
