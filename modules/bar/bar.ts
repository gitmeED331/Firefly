import { Widget, Roundedges, App, Service } from "imports";
import options from "options";

const { RoundedAngleEnd } = Roundedges
const { Window, Box, CenterBox, Button, Icon } = Widget
const mpris = await Service.import("mpris");


// Widgets
import Workspaces from "./workspaces"
import { Title } from "./AppTitleTicker"
import { TickerBTN } from "./MediaTicker"
import { SysInfo } from "./sysinfo"
import { TrayReveal, Expandbtn } from "./tray"
import { Clock } from "./clock"

const pos = options.bar.position.bind()

const Dashbtn = () => Button({
	className: 'BarBTN',
	css: 'padding-right: 0.5rem;',
	tooltip_text: 'Dashboard',
	onClicked: () => App.toggleWindow("dashboard"),
	child: Icon({ icon: 'nix-snowflake-symbolic' }),
});

const Powerbtn = () => Button({
	className: 'BarBTN',
	css: 'padding-right: 0.5rem;',
	tooltip_text: 'Power Menu',
	child:
		Icon({
			icon: 'preferences-system-network-wakeonlan'
		}),
	onClicked: () => App.toggleWindow("sessioncontrols")
});

const Left = () => Box(
	{
		className: "barleft",
		hpack: "start",
		vpack: "center",
	},
	Workspaces(),
	RoundedAngleEnd("topright", { className: "angleRight" }),
	RoundedAngleEnd("topleft", { className: "angleLeft" }),
	Title(),
	RoundedAngleEnd("topright", { className: "angleRight" }),
);

const Center = () => Box(
	{
		className: "barcenter",
		hpack: "center",
		vpack: "center",
		hexpand: true,
	},
	RoundedAngleEnd("topleft", { className: "angleLeft" }),
	Clock(),
	RoundedAngleEnd("topright", { className: "angleRight" }),
	RoundedAngleEnd("topleft", { className: "angleLeft" }),
	Expandbtn(),
	TrayReveal(),
	RoundedAngleEnd("topright", { className: "angleRight" }),
	SysInfo(),
);

const Right = () => Box(
	{
		className: "barright",
		hpack: "end",
		vpack: "center",
		hexpand: true,
	},
	RoundedAngleEnd("topleft", { className: "angleLeft" }),
	TickerBTN(),
	RoundedAngleEnd("topright", { className: "angleRight" }),
	RoundedAngleEnd("topleft", { className: "angleLeft" }),
	Dashbtn(),
	Powerbtn(),
);

export const Bar = () => Window(
	{
		name: "bar",
		layer: 'top',
		anchor: pos.as(pos => [pos, "right", "left"]),
		exclusivity: "exclusive",
	},
	CenterBox({
		className: "bar",
		hexpand: true,
		vexpand: true,
		start_widget: Left(),
		center_widget: Center(),
		end_widget: Right(),
	}),
);
