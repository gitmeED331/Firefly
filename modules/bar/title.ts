import { Widget, Hyprland, Utils } from "../../imports";
const { execAsync } = Utils;
const { Box, Button } = Widget;

export const Title = () => Button({
	className: 'wintitle',
	visible:Hyprland.active.client.bind('title').transform(title => title.length > 0),
	label: Hyprland.active.client.bind('title').transform(title => title.length > 31 ? title.substring(0, 31) + '...' : title),
	onSecondaryClick: () => {
		execAsync(['bash', '-c', 'hyprctl dispatch killactive', '&'])
	},
	onPrimaryClick: () => {
		 App.toggleWindow("overview")
	}
});
