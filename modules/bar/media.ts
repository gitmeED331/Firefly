import { Widget, Utils, Mpris, Hyprland, PopupWindow } from "../../imports";
import { Muppet } from "./player";
import options from "../../options";

//const mpris = await Service.import("mpris");

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
    anchor: pos,
    margins: [25, 0],
    layer: "overlay",
    keymode: 'on-demand',
    transition: "slide_down",
    child: Box({
		vexpand: true,
		hexpand: true,
		className: "playwin",
		child: Muppet(),
	})
});

export function Playwin() {
    App.addWindow(PWin())
    layout.connect("changed", () => {
        App.removeWindow("playwin")
        App.addWindow(PWin())
    })
}

export const MediaBTN = ( ) => Box({
	child: Button({
		vpack: 'center',
		className: 'mediabtn',
		onPrimaryClick: ( ) => App.toggleWindow("playwin"),
		onSecondaryClickRelease: ( ) => { Hyprland.messageAsync('dispatch exec deezer') },
		child: Label('-').hook(Mpris, self => {
			if (Mpris.players[0]) {
				const { track_title } = Mpris.players[0];
				self.label = track_title.length > 60 ? `${track_title.substring(0, 60)}...` : track_title;
			} 
			else {
				self.label = 'Nothing is playing';
			}
		}, 'player-changed'),
	})
});
