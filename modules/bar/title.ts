import { Widget, Hyprland, Utils } from "imports";
import { icon } from "lib/utils";

const { execAsync } = Utils;
const { Box, Button, Label, Icon } = Widget;

export const Title = () => Button({
	className: 'wintitle',
	visible:Hyprland.active.client.bind('title').transform(title => title.length > 0),
	child: Box({
		spacing: 5,
		children: [
			Icon({
				vpack: "center",
				icon: Hyprland.active.client.bind("class").as(icon)}),
			Label({
				vpack: "center",
				label: Hyprland.active.client.bind('title'),
				truncate: 'end',
			}),
		]
	}),
	onSecondaryClick: () => {
		execAsync(['bash', '-c', 'hyprctl dispatch killactive', '&'])
	},
	onPrimaryClick: () => {
		App.toggleWindow("overview")
	}
});
