import { Widget, Utils, Mpris, Hyprland, PopupWindow, Roundedges } from "../../imports";
import { Muppet } from "./player";
import options from "../../options";

//const mpris = await Service.import("mpris");
const RoundedAngleEnd = Roundedges;
const { Window, Box, CenterBox, Button, Icon, Label, EventBox } = Widget;
const { execAsync } = Utils;
const player = Mpris.getPlayer();

const { bar, playwin } = options;
const pos = playwin.position.bind();
const layout = Utils.derive([bar.position, playwin.position], (bar, qs) => 
		`${bar}-${qs}` as const,
	);

const PWin = () =>  PopupWindow({
    name: "playwin",
    className: "playwin",
    anchor: pos,
    layer: "top",
    exclusivity: 'normal',
    keymode: 'on-demand',
    margins: [0,75],
    transition: pos.as(pos => pos === "top" ? "slide_down" : "slide_up"),
    child: Box({
		vexpand: true,
		hexpand: true,
		children: [
			Muppet(),
		]
	})
});

export function Playwin() {
    App.addWindow(PWin())
    layout.connect("changed", () => {
        App.removeWindow("playwin")
        App.addWindow(PWin())
    })
}

export const MediaBTN = ( ) => Button({
	className: 'mediabtn',
	vexpand: true,
	hexpand: true,
	onPrimaryClick: ( ) => App.toggleWindow("playwin"),
	onSecondaryClickRelease: ( ) => { Hyprland.messageAsync('dispatch exec deezer') },
	child: Label('-').hook(Mpris, self => {
		if (Mpris.players[0]) {
			const { track_title } = Mpris.players[0];
			self.label = track_title.length > 30 ? `${track_title.substring(0, 30)}...` : track_title;
		} 
	else {
		self.label = 'Nothing is playing';
	}
	}, 'player-changed'),
});
