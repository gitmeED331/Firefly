//
// ---------- Power Profiles Window --------
//
import { Widget, Hyprland, Utils, PopupWindow } from "imports";
import icons from "lib/icons.js";
import options from "options";
import Brightness from "./service/brightness"

const { Button, Box, Label, Revealer, Icon, EventBox } = Widget;
const { pwrprof } = options;
const { powerprofile } = icons;

const powerProfiles = await Service.import('powerprofiles')
const pwrproflayout = Utils.derive([pwrprof.position], (pwrprof, qs) =>
`${pwrprof}-${qs}` as const,
);

type Action = "power-saver" | "balanced" | "performance"

class Profiles extends Service {
	static {
		Service.register(this, {}, {
			"cmd": ["string"],
			"lightcmd": ["string"],
		})
	}

	#cmd = ""
	#lightcmd = ""
	#cnamecmd = ""

	get cmd() { return this.#cmd }
	get lightcmd() { return this.#lightcmd }
	get cnamecmd() { return this.#cnamecmd }

	action(action: Action) {
		[this.#cmd, this.#lightcmd] = {
			'power-saver': [
				pwrprof.profile.powerSaver.value,
				pwrprof.light.powerSaver.value,
			],
			balanced: [
				pwrprof.profile.balanced.value,
				pwrprof.light.balanced.value,
			],
			performance: [
				pwrprof.profile.performance.value,
				pwrprof.light.performance.value,
			],
		}[action]
	//App.closeWindow("pwrprofiles")
	}

}

const profiles = new Profiles

const SysButton = (action: Action, label: string) => Button({

	onClicked: () => {
		profiles.action(action);
		powerProfiles.active_profile=(profiles.cmd);
		Utils.execAsync(profiles.lightcmd);
	},

	className: powerProfiles.bind("active_profile").as(c => c == action ? c : ""),

	child: Box({
		vertical: true,
		children: [
			Icon(icons.powerprofile[action]),
			Label({
				label,
				visible: pwrprof.labels.bind(),
			}),
		],
	}),
})

export default () => PopupWindow({
	name: "pwrprofiles",
	transition: "crossfade",
	layer: "overlay",
	anchor: options.pwrprof.position.value,
	exclusivity: 'normal',
	keymode: 'on-demand',
	margins: [0,535],
	child:
	Box({
		vertical: true,
		hpack: "center",
		vpack: "center",
		children: [
			Box({
				vertical: false,
	   			hpack: "center",
	   			vpack: "center",
				spacing: 10,
	   			children: [
		   			Label({
						useMarkup: true,
						hpack: "center",
						vpack: "center",
						label: powerProfiles.bind('active_profile').transform(l => l.toUpperCase())
					}),
					Label({
						setup: self => self.hook(Brightness, (self, screenValue) => {
							const icons = ["󰃚", "󰃛", "󰃜", "󰃝", "󰃞", "󰃟", "󰃠"];
			   				self.label =`${icons[Math.floor((Brightness.screen_value * 100) / 15)]}`;
						}, 'screen-changed'),
					}),
					Label({
						label: Brightness.bind("screen-value").as(v => `${Math.floor(v * 100)}%`)
					}),
				]
			}),
			Box<Gtk.Widget>({
				className: "pwrprofile-box",
				vertical: false,
				vexpand: false,
				hexpand: false,
				vpack: "center",
				hpack: "center",
				setup: self => self.hook(pwrprof.layout, () => {
					self.toggleClassName("box", pwrprof.layout.value === "box")
					self.toggleClassName("line", pwrprof.layout.value === "line")
				}),
				children: pwrprof.layout.bind().as(layout => {
					switch (layout) {
						case "line": return [
							SysButton("power-saver", "Saver"),
							SysButton("balanced", "Balanced"),
							SysButton("performance", "Performance"),
						]
						case "box": return [
							Box(
								{vertical: false,},
								SysButton("power-saver", "Saver"),
								SysButton("balanced", "Balanced"),
								SysButton("performance", "Performance"),
							),
						]
					}
				}),
			})
		]
	})
})
