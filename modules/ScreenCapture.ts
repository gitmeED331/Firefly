import { Widget, Hyprland, Utils, PopupWindow} from "imports";
import icons from "lib/icons.js";
import options from "options";
App.addIcons(`${App.configDir}/assets`);

const { Button, Box, Label, Icon, EventBox } = Widget;
const { ssrmenu } = options;
const pos = options.ssrmenu.position.bind();

type Action = "AShot" | "FShot" | "FRecord" | "ARecord"

class ScreenCaptureMenu extends Service {
	static {
		Service.register(this, {}, {
			"cmd": ["string"],
		})
	}
	#cmd = ""
	get cmd() { return this.#cmd }
	action(action: Action) {
		[this.#cmd] = {
			AShot: [ssrmenu.AShot.value],
			FShot: [ssrmenu.FShot.value],
			//WShot: [ssrmenu.WShot.value],
			ARecord: [ssrmenu.ARecord.value],
			FRecord: [ssrmenu.FRecord.value],
			//WRecord: [ssrmenu.WRecord.value],
		}[action]
		App.closeWindow("ScreenCaptureWin")
	}
}

const SCMenu = new ScreenCaptureMenu

const SysButton = (action: Action, label: string) => Button({
	on_clicked: () => SCMenu.action(action) || Utils.execAsync(SCMenu.cmd),
	child: Box({
		vertical: true,
		vpack: 'center',
		className: "ssrbtn",
		children: [
			Icon(icons.SCMenu[action]),
			Label({
				label,
		 		wrap: true,
		 		maxWidthChars: 5,
		 		 justification: 'center',
		 		vpack: 'center',
				visible: ssrmenu.labels.bind(),
			}),
		],
	}),
})

const ScreenCaptureWin = () => PopupWindow({
	name: "ScreenCaptureWin",
	transition: "crossfade",
	anchor: pos,
	layer: "overlay",
	exclusivity: 'normal',
	keymode: 'on-demand',
	child: Box<Gtk.Widget>({
		className: "ScreenCapture",
		setup: self => self.hook(ssrmenu.layout, () => {
			self.toggleClassName("box", ssrmenu.layout.value === "box")
			self.toggleClassName("line", ssrmenu.layout.value === "line")
		}),
		children: ssrmenu.layout.bind().as(layout => {
			switch (layout) {
				case "line": return [
					SysButton("AShot", "Area Shot"),
					SysButton("FShot", "Full Screen Shot"),
					//SysButton("WShot", "Window"),
					SysButton("ARecord", "Area Record"),
					SysButton("FRecord", "Full Screen Record"),
					//SysButton("WRecord", "Window"),
				]
				case "box": return [
					Box(
						{
							vertical: false,
							//className: "ssrbtn",
						},
						SysButton("AShot", "Area Shot"),
						SysButton("FShot", "Full Screen Shot"),
						//SysButton("WShot", "Window"),
						SysButton("ARecord", "Area Record"),
						SysButton("FRecord", "Full Screen Record"),
						//SysButton("WRecord", "Window"),
					),
				]
			}
		}),
	}),
})

export function ScreenCapture() {
	App.addWindow(ScreenCaptureWin())
	pwrproflayout.connect("changed", () => {
		App.removeWindow("ScreenCaptureWin")
		App.addWindow(ScreenCaptureWin())
	})
}
