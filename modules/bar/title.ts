import { Widget, Hyprland, Utils } from "../../imports";
const { execAsync } = Utils;
const { Box, Button, Label } = Widget;

export const Title = () => Button({
	className: 'wintitle',
	visible:Hyprland.active.client.bind('title').transform(title => title.length > 0),
	child: Label({
		label: Hyprland.active.client.bind('title'),
		truncate: 'end',
	}),
	onSecondaryClick: () => {
		execAsync(['bash', '-c', 'hyprctl dispatch killactive', '&'])
	},
	onPrimaryClick: () => {
		 App.toggleWindow("overview")
	}
});
