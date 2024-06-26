import { Utils, Widget, Hyprland } from "../../imports";
import options from "options"
import { sh, range, icon } from "lib/utils"
import icons from "lib/icons"

const { execAsync } = Utils;
const { Box, Button, Label } = Widget;
const hyprland = await Service.import("hyprland")
const { workspaces } = options.bar.workspaces

 const dispatch = (arg: string | number) => {
	sh(`hyprctl dispatch workspace ${arg}`)
}

export default (ws: number, action: Action) => {
	const workspaces = Box({
		vpack: 'center',
 		vexpand: true,
 		children: range( ws || 4 ).map(i => Button({
			attribute: i,
			child: Widget.Icon({
				icon: icons.wsicon[ 'ws'+`${i}` ]
		}),
			setup: self => self.hook(Hyprland, () => {
				self.toggleClassName("active", Hyprland.active.workspace.id === i)
				self.toggleClassName("occupied", (Hyprland.getWorkspace(i)?.windows || 0) > 0)
			}),
			cursor: "pointer",
			attribute: { index: i },

			onMiddleClick: () => App.toggleWindow("overview"),
			onClicked: () => Hyprland.messageAsync(`dispatch workspace ${i}`).catch(console.error),
			onSecondaryClick: () => Hyprland.messageAsync([`dispatch movetoworkspacesilent ${i}`]).catch(console.error),
		}))
	})
	return Box({
		name: "Workspaces",
		className: "workspaces",
		child: workspaces
	})

 }



 //------------------------------------------
 /*

 range(ws || 20).map(i => Widget.Label({
	 attribute: i,
	 vpack: "center",
	 label: `${i}`,


	 */
