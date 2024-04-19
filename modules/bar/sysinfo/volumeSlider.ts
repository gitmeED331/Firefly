import { Widget, Audio } from "../../../imports";
const { Box, Button, Slider } = Widget;
const { execAsync } = Utils;
const audio = await Service.import('audio');

/** @param {'speaker' | 'microphone'} type */
const speakerSlider = ( type = "speaker" ) => Slider({
	className: "sldSlider",
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => audio[type].volume = value,
    value: audio[type].bind('volume').as(n => n > 1 ? 1 : n)
});

const micSlider = (type = 'microphone') => Slider({
	className: "sldSlider",
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => audio[type].volume = value,
    value: audio[type].bind('volume').as(n => n > 1 ? 1 : n),
    setup: (self) => {
      self.hook(
			Audio,
			(self) => {
				if (!Audio[type]) return;
				self.value = Audio[type].volume;
			}
		)
    },
});

const speakerIcon = () => Button({
	className: "sldIcon",
    on_clicked: () => audio.speaker.is_muted = !audio.speaker.is_muted,
    child: Widget.Icon().hook(audio.speaker, self => {
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
});

const micIcon = () => Button({
	className: "sldIcon",
    on_clicked: () => audio.microphone.is_muted = !audio.microphone.is_muted,
    child: Widget.Icon().hook(audio.microphone, self => {
        const vol = audio.microphone.volume * 100;
        const icon = [
            [67, 'high'],
            [34, 'medium'],
            [1, 'low'],
            [0, 'muted'],
        ].find(([threshold]) => threshold <= vol)?.[1];
        self.icon = `microphone-sensitivity-${icon}-symbolic`;
        self.tooltip_text = `Microphone ${Math.floor(vol)}%`;
    }),
});


export const VolumeSlider = () => Box({
    className: "Slider",
    vertical: true,
    children: [
        Widget.Label({
            className: "sldLabel",
            label: "Speaker",
            hpack: "center",
        }),
        Box({
            children: [
                speakerIcon(), 
                speakerSlider(),
            ],
		}),
		Widget.Label({
            className: "sldLabel",
            label: "Microphone",
            hpack: "center",
        }),
		Box({
            children: [
				micIcon(),
                micSlider(),
            ],
        }),
    ],
});
