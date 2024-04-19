import { Utils, Widget, Hyprland } from "../../imports";
const { execAsync } = Utils;
const { Box } = Widget;

export const Workspaces = () => Box({
	className: "workspaces",
	child: Box({
		vpack: 'center',
		vexpand: true,
		children: Array.from({ length: 4 }, (_, i) => i + 1).map((i) =>
			Widget.Button({
				child: Widget.Label({label:`${i}`}),
				cursor: "pointer",
				attribute: { index: i },
				onMiddleClick: () => App.toggleWindow("overview"),
				onClicked: () =>
					Hyprland.messageAsync(`dispatch workspace ${i}`).catch(console.error),
				onSecondaryClick: () =>
					Hyprland.messageAsync([`dispatch movetoworkspacesilent ${i}`]).catch(console.error),
			}).hook(Hyprland.active.workspace, (button) => { button.toggleClassName("focused", Hyprland.active.workspace.id === i);
			}))
	})
});
