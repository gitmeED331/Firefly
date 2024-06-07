import { Widget } from "../../imports";
import PanelButton from "../PanelButton"

const { Button, Box, Label, Revealer } = Widget

const powerProfiles = await Service.import('powerprofiles')

/*export const PWRProfiles = Widget.Button({
	name: "pwrProfiles",
	className: "pwrprofiles",
	child: Widget.Label({ label: powerProfiles.bind('active_profile') }),
	onClicked: () => {
		switch (powerProfiles.active_profile) {
			case 'balanced':
				powerProfiles.active_profile = 'performance';
				break;
				powerProfiles.active_profile = 'power-saver';
				break;
			default:
				powerProfiles.active_profile = 'balanced';
				break;
		};
	},
})*/

export const PWRProfiles = () => Box({
	className: "pwrprofilescont",
	vexpand: false,
	hexpand: true,
	vertical: true,
	spacing: 10,
	children: [
		Label({ 
			label: powerProfiles.bind('active_profile'),
		}),
		Box({
			className: "pwrprofilesBox",
			hpack: "center",
			spacing: 10,
			vertical: false,
			children: [
				Button({
					className: "pwrprofiles",
					child: Label({ label: "Performance"}),
					onClicked: () => powerProfiles.active_profile = 'performance',
				}),
				Button({
					className: "pwrprofiles",
					child: Label({ label: "Balance"}),
					onClicked: () => powerProfiles.active_profile = 'balanced',
				}),
				Button({
					className: "pwrprofiles",
					child: Label({ label: "Power Saver"}),
					onClicked: () => powerProfiles.active_profile = 'power-saver',
				}),
			]
		}),
	],
})
