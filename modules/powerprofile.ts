//
// ---------- Power Profiles Window --------
//
import { Widget, Hyprland, Utils, PopupWindow } from "../imports";
import icons from "../lib/icons.js";
import options from "../options";
App.addIcons(`${App.configDir}/assets`);

const { Button, Box, Label, Revealer, Icon, EventBox } = Widget;
const { pwrprof } = options;
const { powerprofile } = icons;

const powerProfiles = await Service.import('powerprofiles')
//const pos = options.pwrprof.position.bind();
const pwrproflayout = Utils.derive([pwrprof.position], (pwrprof, qs) =>
`${pwrprof}-${qs}` as const,
);

type Action = "saver" | "balance" | "performance" |"saverlight" | "balancelight" | "performancelight"

class Profiles extends Service {
	static {
		Service.register(this, {}, {
			"cmd": ["string"],
			"lightcmd": ["string"]
		})
	}

	#cmd = ""
	#lightcmd = ""

	get cmd() { return this.#cmd }
	get lightcmd() { return this.#lightcmd }

	action(action: Action) {
		[this.#cmd, this.#lightcmd] = {
			saver: [pwrprof.saver.value, pwrprof.saverlight.value],
			balance: [pwrprof.balance.value, pwrprof.balancelight.value],
			performance: [pwrprof.performance.value, pwrprof.performancelight.value],
		}[action]
	//App.closeWindow("pwrprofiles")
	}
}

const profiles = new Profiles

const SysButton = (action: Action, label: string) => Button({

	on_clicked: () => {
		profiles.action(action);
		powerProfiles.active_profile=(profiles.cmd);
		Utils.execAsync(profiles.lightcmd);
	},
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
			Label({
				useMarkup: true,
				label: powerProfiles.bind('active_profile').transform(l => l.toUpperCase())
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
							SysButton("saver", "Power Saver"),
							SysButton("balance", "Balance"),
							SysButton("performance", "Performance"),
						]
						case "box": return [
							Box(
								{vertical: false,},
								SysButton("saver", "Power Saver"),
								SysButton("balance", "Balance"),
								SysButton("performance", "Performance"),
							),
						]
					}
				}),
			})
		]
	})
})
