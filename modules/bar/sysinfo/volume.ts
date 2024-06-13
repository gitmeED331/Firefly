import { Widget, Audio, Utils, PopupWindow, Mpris } from "../../../imports";
import options from "../../../options";
import { Arrow, Menu } from "../../ToggleButton";
import { dependencies, icon, sh } from "../../../lib/utils";
import icons from "../../../lib/icons.js";
import { type Stream } from "../../../types/service/audio";

const audio = await Service.import('audio');
const { Box, Button, Icon, Slider, Label } = Widget;
const { execAsync } = Utils;

const { bar, dashvol } = options;
const pos = dashvol.position.bind();
const layout = Utils.derive([bar.position, dashvol.position], (bar, qs) => 
		`${bar}-${qs}` as const,
	);

type Type = "microphone" | "speaker" | "headset"

const speakerSlider = ( type: Type = 'speaker' ) => Slider({
	className: "volumesld Slider",
    hexpand: true,
    drawValue: false,
    value: audio[type].bind('volume'),
	on_change: ({ value, dragging }) => {
        if (dragging) {
            audio[type].volume = value
            audio[type].is_muted = false
        }
    },
});

const micSlider = (type: Type = 'microphone') => Slider({
	className: "volumesld Slider",
    hexpand: true,
    drawValue: false,
    value: audio[type].bind('volume'), 
	on_change: ({ value, dragging }) => {
        if (dragging) {
            audio[type].volume = value
            audio[type].is_muted = false
        }
    },
});

const speakerIcon = (type: Type = 'speaker') => Button({
	className: "volumesldIcon",
    onClicked: () => audio.speaker.is_muted = !audio.speaker.is_muted,
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
    })
})

const micIcon = (type: Type = 'microphone') => Button({
	className: "volumesldIcon",
    onClicked: () => audio.microphone.is_muted = !audio.microphone.is_muted,
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

const SettingsButton = () => Button({
    onClicked: () => {
        if (dependencies("pavucontrol"))
            sh("pavucontrol")
    },
    hexpand: true,
    hpack: "end",
    vpack: "start",
    child: Widget.Box({
        children: [
			Icon(icons.ui.settings),
            //Widget.Label("Settings"),
        ],
    }),
})

const MixerItem = (stream: Stream) => Box(
    {
        hexpand: true, 
        className: "mixeritem",
        vertical: true,
    },
	Box(
        { vertical: false },
		Icon({
			className: "mixeritemicon",
			tooltip_text: stream.bind("description").as(n => n || ""),
			icon: stream.bind("name").as(n => {
				return Utils.lookUpIcon(n || "")
					? (n || "")
					: icons.fallback.audio
			}),
		}),
		Label({
			xalign: 0,
			className: "mixeritemlabel",
			truncate: "end",
			max_width_chars: 28,
			label: stream.bind("name").as(d => d || ""),
		}),
	),
    Slider({
		className: "mixeritemslider Slider",
		hexpand: true,
        draw_value: false,
        value: stream.bind("volume"),
        on_change: ({ value }) => stream.volume = value,
    }),
)

const SinkItem = (stream: Stream) => Button({
    hexpand: true,
    on_clicked: () => audio.speaker = stream,
    className: "sinkitem",
    child: Box({
		className: "sinkitembox",
        children: [
            Icon({
				className: "sinkitemicon",
                icon: icon(stream.icon_name || "", icons.fallback.audio),
                tooltip_text: stream.icon_name || "",
            }),
            Label({
				className: "sinkitemlabel",
				label: (stream.description || "").split(" ").slice(0, 4).join(" ")
            }),
            Icon({
                icon: icons.ui.tick,
                className: "sinkitemicon",
                hexpand: true,
                hpack: "end",
                visible: audio.speaker.bind("stream").as(s => s === stream.stream),
            }),
        ],
    }),
})

const AppMixer = () => Menu({
    name: "app-mixer",
    icon: icons.audio.mixer,
    title: "Volume Mixer",
    content: [
        Box({
            vertical: true,
            className: "volmenusitems",
            children: audio.bind("apps").as(a => a.map(MixerItem)),
        }),
        
    ],
})

const SinkSelector = () => Menu({
    name: "sink-selector",
    icon: icons.audio.type.headset,
    title: "Sink Selector",
    content: [
        Box({
            vertical: true,
            className: "volmenusitems",
            children: audio.bind("speakers").as(a => a.map(SinkItem)),
        }),
    ],
})

const VolumeSlider = () => Box({
    //className: "volSlider",
    name: "volume-slider",
    vertical: true,
    vexpand: true,
    children: [
        Box({
            children: [
                speakerIcon(), 
                speakerSlider(),
            ],
		}),
		Widget.Separator(),
		Box({
            children: [
				micIcon(),
                micSlider(),
            ],
        }),
    ],
});

const VolumeTabs = () => Box({
    className: "volSlider",
    vexpand: true,
    hexpand: true,
    vertical: true,
    children: [
		VolumeSlider(),
		Box({
			hpack: "center",
			className: "volmenus",
			children: [
			Box({
				child: Arrow("sink-selector"),
			}),
			Box({
				child: Arrow("app-mixer"),
				visible: audio.bind("apps").as(a => a.length > 0),
			}),
		]
		}),
		AppMixer(),
		SinkSelector(),
        Widget.Separator(),
        SettingsButton(),
    ],
})

const DVol = () =>  PopupWindow({
    name: "dashvol",
    className: "dashvol",
    anchor: pos,
    transition: pos.as(pos => pos === "top" ? "slide_down" : "slide_up"),
    layer: "top",
	exclusivity: 'normal',
    keymode: 'on-demand',
    margins: [0,525],
    child: 
        Box({
            vertical:true,
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
			on_scroll_up: () => audio.speaker.volume += 0.035,
			on_scroll_down: () => audio.speaker.volume -= 0.035,
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
