import { Widget, Audio, Utils, PopupWindow } from "../../../imports";
import { VolumeSlider } from "./volumeSlider";
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
    anchor: pos,
    margins: [25, 15],
    keymode: 'on-demand',
    transition: "slide_down",
    layer: "overlay",
    child: 
        Box({
            vertical:true,
            hexpand:false,
            children: [
                VolumeSlider(),
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


export const Volume = () => Box({
	class_name: 'volume',
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
