import { Widget, Utils, Mpris, Hyprland } from "../../imports";
import options from "../../options";
const { Window, Box, CenterBox, Button, Icon, Label, Slider } = Widget;
const mpris = await Service.import("mpris");

// Widgets
import { Workspaces } from "./workspaces";
import { Title } from "./title";
import { MediaBTN } from "./media";
import { SysInfo } from	"./sysinfo/sysinfo";
import Tray from "./tray";
import { Clock } from "./clock";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";

const pos = options.bar.position.bind();

const Dashbtn = ( ) => Button({
			class_name: 'dashbtn',
			onClicked: ( ) => App.toggleWindow("dashboard"),
			child: Icon({ icon: 'alienarena'}),
		});

const Left = ()	=> Box({
	hpack:	"start",
	children: [ Workspaces(), Title(), ],
});
const Center = () => Box({
	hpack:	"center",
	vexpand: true,
	children: [ MediaBTN(), ],
});
const Right	= () =>	Box({
	hpack:	"end",
	children: [
		Tray(),
		SysInfo(),
		Clock(),
		Dashbtn(),
	],
});

export const Bar = () => Window({
	name: "bar",
	layer:	'top',
	anchor: pos.as(pos => [pos, "right", "left"]),
	exclusivity: "exclusive",
	child: CenterBox({
		className: "bar",
		hexpand: true,
		start_widget: Left(),
		center_widget: Center(),
		end_widget: Right(),
	}),
});
