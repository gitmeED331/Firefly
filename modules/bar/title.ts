import { Widget, Hyprland, Utils } from "imports";
import { icon } from "lib/utils";
//import icons from "../../lib/icons";
//App.addIcons(`${App.configDir}/assets`);

const { execAsync } = Utils;
const { Box, Button, Label, Icon } = Widget;

export const Title = () => Button({
	className: 'wintitle',
	visible:Hyprland.active.client.bind('title').transform(title => title.length > 0),
	child: Box({
		spacing: 5,
		children: [
			Icon({ icon: Hyprland.active.client.bind("class").as(icon)}),
			Label({
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
