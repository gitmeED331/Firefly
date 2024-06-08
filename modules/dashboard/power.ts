import { Widget, Hyprland, Utils } from "../../imports";
import PanelButton from "../PanelButton"
import { Arrow, Menu } from "../ToggleButton";
import icons from "../../../lib/icons.js";
App.addIcons(`${App.configDir}/assets`);

const { Button, Box, Label, Revealer, Icon } = Widget

const powerProfiles = await Service.import('powerprofiles')

const PowerProfiles = () => Menu({
	name: "power-profiles",
	title: 'Power Profiles',
	content: [
		Box({
			vertical: false,
			className: "pwrprofiles",
			hpack: 'center',
			spacing: 8,
			children: [
				Button({
					className: "pwrprofilesbtn",
					child: Label({ label: "Performance"}),
					onClicked: () => powerProfiles.active_profile = 'performance',
				}),
				Button({
					className: "pwrprofilesbtn",
					child: Label({ label: "Balance"}),
					onClicked: () => powerProfiles.active_profile = 'balanced',
				}),
				Button({
					className: "pwrprofilesbtn",
					child: Label({ label: "Power Saver"}),
					onClicked: () => powerProfiles.active_profile = 'power-saver',
				}),
			]
		}),
	],
})

const PowerControls = () => Menu({
	name: "Power-Control",
	title: "Power Control",
	content: [
		Box({
			vertical: false,
			spacing: 12,
			hpack: 'center',
			className: "pwrcontrols",
			children: [
				Button({
					className: "pwrcontrolsbtn",
					child: Icon({
						icon: 'system-lock-screen'
					}),
					onClicked: () => {
						App.closeWindow('dashboard');
						Hyprland.messageAsync(`ags -b lockscreen -c ~/.config/ags/Lockscreen/lockscreen.js`);
					},
				}),
				Button({
					className: "pwrcontrolsbtn",
					child: Icon({
						icon: 'system-log-out'
					}),
					onClicked: () => {
						App.closeWindow('dashboard');
						Hyprland.messageAsync(`~/.config/hypr/scripts/hyprkill.sh >/dev/null 2>&1 &`);
					}
				}),
				Button({
					className: "pwrcontrolsbtn",
					child: Icon({
						icon: 'system-reboot'
					}),
					onClicked: () => {
						App.closeWindow('dashboard');
						Hyprland.messageAsync(`systemctl reboot`);
					},
				}),
				Button({
					className: "pwrcontrolsbtn",
					child: Icon({
						icon: 'system-shutdown'
					}),
					onClicked: () => {
						App.closeWindow('dashboard');
						Hyprland.messageAsync(`systemctl -i poweroff`);
					},
				}),
			]
		}),
	],
})

const PowerTabs = () => Box({
    className: "pwrtabs",
    vexpand: true,
    hexpand: true,
    vertical: true,
    hpack: 'center',
    children: [
		Label({ 
			label: powerProfiles.bind('active_profile'),
		}),
		Box({
			hpack: "center",
			className: "pwrmenus",
			children: [
			Box({
				child: Arrow("power-profiles"),
			}),
			Box({
				child: Arrow("Power-Control"),
			}),
		]
		}),
		PowerProfiles(),
		PowerControls(),
    ],
})

export const PowerCenter = () => Box({
	className: "pwrcenterCont",
	vexpand: false,
	hexpand: true,
	vertical: true,
	child: PowerTabs()
})
