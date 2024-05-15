import { Widget, Audio, Utils, PopupWindow } from "../../../imports";
import { VolumeTabs, AppMixer, SinkSelector, VolumeSlider } from "./volumeSlider";
import options from "../../../options";

const audio = await Service.import('audio');
const { Box, Button } = Widget;
const { execAsync } = Utils;

const { bar, dashvol } = options;
const pos = dashvol.position.bind();
const layout = Utils.derive([bar.position, dashvol.position], (bar, qs) => 
		`${bar}-${qs}` as const,
	);

const DVol = () =>  PopupWindow({
    name: "dashvol",
    className: "dashvol",
    anchor: pos,
    transition: pos.as(pos => pos === "top" ? "slide_down" : "slide_up"),
    layer: "top",
    child: 
        Box({
            vertical:true,
            hpack: "center",
            vpack: "start",
            children: [
				VolumeTabs(),
			]
        })
});

export function Dashvol() {
    App.addWindow(DVol())
    layout.connect("changed", () => {
        App.removeWindow("dashvol")
        App.addWindow(DVol())
    })
}


export const Volumebtn = () => Box({
	className: 'volumebtn',
	child:
		Button({
			onPrimaryClick: () => { App.toggleWindow("dashvol")},
			onSecondaryClick: () => { audio.speaker.is_muted = !audio.speaker.is_muted },
			child:
				Widget.Icon().hook(audio.speaker, self => {
					const vol = audio.speaker.volume * 150;
					const icon = [
						[101, 'overamplified'],
						[67, 'high'],
						[34, 'medium'],
						[1, 'low'],
						[0, 'muted'],
					].find(([threshold]) => threshold <= vol)?.[1];
					self.icon = `audio-volume-${icon}-symbolic`;
					self.tooltip_text = `Volume ${Math.floor(vol)}%`;
		}),
	}),
});
