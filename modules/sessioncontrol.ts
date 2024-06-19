//
//---------------- Session Control Window -------------
//
import { Widget, Hyprland, Utils, PopupWindow} from "../imports";
import icons from "../lib/icons.js";
import options from "../options";
App.addIcons(`${App.configDir}/assets`);

const { Button, Box, Label, Revealer, Icon, EventBox } = Widget;
const { pwrmenu } = options;

type Action = "lock" | "reboot" | "logout" | "shutdown"

class PowerMenu extends Service {
	static {
		Service.register(this, {}, {
			"cmd": ["string"],
		})
	}
	#cmd = ""
	get cmd() { return this.#cmd }
	action(action: Action) {
		[this.#cmd] = {
			lock: [pwrmenu.lock.value],
			reboot: [pwrmenu.reboot.value],
			logout: [pwrmenu.logout.value],
			shutdown: [pwrmenu.shutdown.value],
		}[action]
		App.closeWindow("sessioncontrols")
	}
	readonly shutdown = () => {
		this.action("shutdown")
	}
}

const powermenu = new PowerMenu

const SysButton = (action: Action, label: string) => Button({
	on_clicked: () => powermenu.action(action) || Utils.execAsync(powermenu.cmd),
	child: Box({
		vertical: true,
		className: "sessioncontrol-btn",
		children: [
			Icon(icons.powermenu[action]),
			Label({
				label,
				visible: pwrmenu.labels.bind(),
			}),
		],
	}),
})

export default () => PopupWindow({
	name: "sessioncontrols",
	className: "sessioncontrols",
	transition: "crossfade",
	child: Box<Gtk.Widget>({
		className: "sessioncontrols-box",
		vexpand: false,
		hexpand: false,
		vpack: "center",
		hpack: "center",
		setup: self => self.hook(pwrmenu.layout, () => {
			self.toggleClassName("box", pwrmenu.layout.value === "box")
			self.toggleClassName("line", pwrmenu.layout.value === "line")
		}),
		children: pwrmenu.layout.bind().as(layout => {
			switch (layout) {
				case "line": return [
					SysButton("lock", "Lock"),
					SysButton("logout", "Log Out"),
					SysButton("reboot", "Reboot"),
					SysButton("shutdown", "Shutdown"),
				]
				case "box": return [
					Box(
						{
							vertical: false,
							className: "sessioncontrols-btn",
						},
						SysButton("lock", "Lock"),
						SysButton("logout", "Log Out"),
						SysButton("reboot", "Reboot"),
						SysButton("shutdown", "Shutdown"),
					),
				]
			}
		}),
	}),
})
