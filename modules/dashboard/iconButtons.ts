import { Widget, Utils, Hyprland, Gtk } from "../../imports";

//const hyprland = await Service.import('hyprland');
const { execAsync } = Utils;
App.addIcons(`${App.configDir}/assets`);
const { Box, Icon, Button, Revealer } = Widget;

export const PowerIcon = () => Button({
	className: 'quickaccessicon',
	child: 
		Icon({
			icon: 'preferences-system-network-wakeonlan'
		}),
	onClicked: () => {
		App.closeWindow('dashboard');
		Hyprland.messageAsync(`dispatch exec nwg-bar`);
	},
})

export const TerminalIcon = () => Widget.Button({
	className: 'quickaccessicon',
	child: 
		Widget.Icon({
			icon: 'terminator'
		}),
	onClicked: () => {
		Hyprland.messageAsync(`dispatch exec konsole`);
		App.closeWindow('dashboard');
	},
})

export const KontactIcon = () => Widget.Button({
	className: 'quickaccessicon',
	child:
		Widget.Icon({
			icon: 'kube-mail'
		}),
	onClicked: () => {
		Hyprland.messageAsync(`dispatch exec kontact`);
		App.closeWindow('dashboard');
	},
})

export const VPNIcon = item => Widget.Button({
	className: 'quickaccessicon',
	child: 
		Widget.Icon({
			icon: 'preferences-system-network-vpn'
		}),
	onClicked: () => {
		Hyprland.messageAsync(`dispatch exec wireguird`);
		App.closeWindow('dashboard');
	},
})

export const Enpass = () => Widget.Button({
	className: 'quickaccessicon',
	child: 
		Widget.Icon({
			icon: 'enpass'
		}),
	onClicked: () => {
		Hyprland.messageAsync(`dispatch exec enpass`);
		App.closeWindow('dashboard');
	},
})
