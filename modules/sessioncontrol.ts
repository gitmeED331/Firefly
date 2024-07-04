//
//---------------- Session Control Window -------------
//
import { Widget, Utils, PopupWindow, Roundedges, Gdk } from "imports"
import icons from "lib/icons.js"
import options from "options"

const { RoundedAngleEnd } = Roundedges
const { Button, Box, Label, Revealer, Icon, EventBox } = Widget
const { pwrmenu } = options

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
		vpack: "center",
		hpack: "center",
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

const verticalMargin = () => {
	const screenHeight = Gdk.Screen.get_default().get_height(); // Get screen height
	const verticalMargin = screenHeight * .765; // Adjust the percentage as needed
	return verticalMargin;
}

export default () => PopupWindow({
	name: "sessioncontrols",
	className: "sessioncontrols",
	anchor: ["top", "left", "right", "bottom"],
	transition: "slide_up",
	child: Box({
		className: "sessioncontrols-firstbox",
		hpack: "center",
		vpack: "end",
		vexpand: true,
		css: `margin-top: ${verticalMargin()}px;`,
		//css: `margin-top: 62rem;`,
		setup: self => self.hook(pwrmenu.layout, () => {
			self.toggleClassName("box", pwrmenu.layout.value === "box")
			self.toggleClassName("line", pwrmenu.layout.value === "line")
		}),
		children: [
			RoundedAngleEnd("bottomleft", {class_name: "angleLarge"}),
			
			Box({
				vpack: "end",
				className: "sessioncontrols-box",
				hpack: "center",
				hexpand: false,
				vexpand: false,
				spacing: 30,
				children:[
					SysButton("lock", "Lock"),
					SysButton("logout", "Log Out"),
					SysButton("reboot", "Reboot"),
					SysButton("shutdown", "Shutdown"),
				]
			}),

			RoundedAngleEnd("bottomright", {class_name: "angleLarge"}),
		]
	}),
})
