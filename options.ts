import { opt, mkOptions } from "lib/option"
import { distro } from "lib/variables"
import { icon } from "lib/utils"
import icons from "lib/icons"

const colors = {
	"rosewater": "#f5e0dc",
	"flamingo": "#f2cdcd",
	"pink": "#f5c2e7",
	"mauve": "#cba6f7",
	"red": "#f38ba8",
	"maroon": "#eba0ac",
	"peach": "#fab387",
	"yellow": "#f9e2af",
	"green": "#a6e3a1",
	"teal": "#94e2d5",
	"sky": "#89dceb",
	"sapphire": "#74c7ec",
	"blue": "#89b4fa",
	"lavender": "#b4befe",
	"text": "#cdd6f4",
	"subtext1": "#bac2de",
	"subtext2": "#a6adc8",
	"overlay2": "#9399b2",
	"overlay1": "#7f849c",
	"overlay0": "#6c7086",
	"surface2": "#585b70",
	"surface1": "#45475a",
	"surface0": "#313244",
	"base2": "#242438",
	"base": "#1e1e2e",
	"mantle": "#181825",
	"crust": "#11111b"
};

const options = mkOptions(OPTIONS, {
	transition: opt(200),

	font: {
		size: opt(13),
		name: opt("Liberation Mono Font"),
	},

	bar: {
		flatButtons: opt(false),
		position: opt<"top" | "bottom">("top"),
		workspaces: {
			workspaces: opt(8),
		},
		battery: {
			bar: opt<"hidden" | "regular" | "whole">("regular"),
			charging: opt("#00D787"),
			percentage: opt(true),
			blocks: opt(10),
			width: opt(30),
			low: opt(30),
		},

		systray: {
			stitem: opt(false),
			ignore: opt([
			]),
		},
		network: {
			position: opt<"top" | "bottom" | "left" | "right">("top"),
			card: {
				color: opt(colors.base),
			},
			background: {
				color: opt(colors.crust),
			},
			border: {
				color: opt(colors.surface0),
			},
			label: {
				color: opt(colors.mauve),
			},
			text: opt(colors.text),
			status: {
				color: opt(colors.overlay0),
			},
			listitems: {
				passive: opt(colors.text),
				active: opt(colors.mauve)
			},
			icons: {
				passive: opt(colors.overlay2),
				active: opt(colors.mauve),
			},
			iconbuttons: {
				passive: opt(colors.text),
				active: opt(colors.mauve)
			},
		},
		bluetooth: {
			position: opt<"top" | "bottom" | "left" | "right">("top"),
			btReveal: opt(false),
			card: {
				color: opt(colors.base),
			},
			background: {
				color: opt(colors.crust),
			},
			border: {
				color: opt(colors.surface0),
			},
			label: {
				color: opt(colors.sky),
			},
			text: opt(colors.text),
			status: opt(colors.overlay0),
			switch_divider: opt(colors.surface1),
			switch: {
				enabled: opt(colors.sky),
				disabled: opt(colors.surface0),
				puck: opt(colors.overlay0)
			},
			listitems: {
				passive: opt(colors.text),
				active: opt(colors.sky)
			},
			icons: {
				passive: opt(colors.overlay2),
				active: opt(colors.sky),
			},
			iconbutton: {
				passive: opt(colors.text),
				active: opt(colors.sky)
			},
		},
	},

	launcher: {
		width: opt(0),
		margin: opt(60),
		sh: {
			max: opt(16),
		},
		apps: {
			iconSize: opt(32),
			max: opt(6),
			favorites: opt([
				[
					"vivaldi",
					"konsole",
					"pcmanfm-qt",
					"deezer-enhanced",
				],
			]),
		},
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
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
	},

	dashboard: {
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "bottom", "right"]),
		networkSettings: opt("gtk-launch nm-connection-editor"),
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
		AShot: opt("bash -c" + "exec '" + "grim -g " + '"$(slurp)"' + " ~/Pictures/Screenshots/Screenshot-area_$(date +%Y-%m-%d_%H%M-%S).png'"),
		FShot: opt("bash -c 'grim ~/Pictures/Screenshots/Screenshot-full_$(date +%Y-%m-%d_%H%M-%S).png'"),
		//WShot: opt(""),
		ARecord: opt("bash -c" + "exec '" + "wf-recorder -g " + '"$(slurp)"' + " -f ~/Pictures/Screenshots/Screenrecording-area_$(date +%Y-%m-%d_%H-%M-%S).mp4'"),
		FRecord: opt("bash -c 'exec wf-recorder -f ~/Pictures/Screenshots/Screenrecording-full_$(date +%Y-%m-%d_%H%M-%S).mp4'"),
		//WRecord: opt(""),
		layout: opt<"line" | "box">("line"),
		labels: opt(true),
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top"]),
	},

	pwrprof: {
		profile: {
			performance: opt("performance"),
			balanced: opt("balanced"),
			powerSaver: opt("power-saver"),
		},
		light: {
			performance: opt("light -S 100"),
			balanced: opt("light -S 60"),
			powerSaver: opt("light -S 30"),
		},
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
		layout: opt<"line" | "box">("line"),
		labels: opt(true),
	},

	notifications: {
		position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
		width: opt(440),
		blacklist: opt([
			"Synology",

		]),
	},
})

globalThis["options"] = options
export default options
