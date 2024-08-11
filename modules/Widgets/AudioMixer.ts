import { Widget, Audio, Utils } from "imports";
import options from "options";
import { Arrow, Menu } from "../buttons/ToggleButton";
import { dependencies, sh } from "lib/utils";
import icons, { icon } from "lib/icons.js";
import { type Stream } from "types/service/audio";

const { Box, Button, Icon, Slider, Label } = Widget;

const { bar, dashvol } = options;
const pos = dashvol.position.bind();
const layout = Utils.derive(
	[bar.position, dashvol.position],
	(bar, qs) => `${bar}-${qs}` as const,
);

type Type = "microphone" | "speaker" | "headset";

const speakerIcon = (type: Type = "speaker") =>
	Button({
		className: "volumesldIcon",
		onClicked: () => (Audio[type].is_muted = !Audio[type].is_muted),
		child: Widget.Icon().hook(Audio[type], (self) => {
			const vol = Audio[type].volume * 150;
			let icon = [
				[101, "overamplified"],
				[67, "high"],
				[34, "medium"],
				[1, "low"],
				[0, "muted"],
			].find(([threshold]) => threshold <= vol)?.[1];
			if (Audio[type].is_muted) {
				icon = "muted";
				self.tooltip_text = "Muted";
			} else {
				self.tooltip_text = `Volume ${Math.floor(vol)}%`;
			}
			self.icon = `audio-volume-${icon}-symbolic`;
			self.toggleClassName("muted", Audio[type].is_muted);
		}),
	});
const speakerSlider = (type: Type = "speaker") =>
	Slider({
		className: "volumesld Slider",
		hexpand: true,
		drawValue: false,
		value: Audio[type].bind("volume"),
		on_change: ({ value, dragging }) => {
			if (dragging) {
				Audio[type].volume = value;
				Audio[type].is_muted = false;
			}
		},
	});

const micIcon = (type: Type = "microphone") =>
	Button({
		className: "volumesldIcon",
		onClicked: () => (Audio[type].is_muted = !Audio[type].is_muted),
		child: Widget.Icon().hook(Audio[type], (self) => {
			const vol = Audio[type].volume * 100;
			let icon = [
				[67, "high"],
				[34, "medium"],
				[1, "low"],
				[0, "muted"],
			].find(([threshold]) => threshold <= vol)?.[1];
			if (Audio[type].is_muted) {
				icon = "muted";
				self.tooltip_text = "Muted";
			} else {
				self.tooltip_text = `Volume ${Math.floor(vol)}%`;
			}
			self.icon = `microphone-sensitivity-${icon}-symbolic`;
			self.toggleClassName("muted", Audio[type].is_muted);
			self.tooltip_text = `Microphone ${Math.floor(vol)}%`;
		}),
	});
const micSlider = (type: Type = "microphone") =>
	Slider({
		className: "volumesld Slider",
		hexpand: true,
		drawValue: false,
		value: Audio[type].bind("volume"),
		on_change: ({ value, dragging }) => {
			if (dragging) {
				Audio[type].volume = value;
				Audio[type].is_muted = false;
			}
		},
	});

const SettingsButton = () =>
	Button({
		onClicked: () => {
			if (dependencies("pavucontrol")) sh("pavucontrol");
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
	});

function MixerItem(stream: Stream) {
	function mixerLabel() {
		return Box({
			spacing: 2.5,
			vertical: false,
			vpack: "center",
			children: [
				Icon({
					vpack: "start",
					className: "mixeritemicon",
					tooltip_text: stream.bind("description").as((n) => n || ""),
					icon: stream.bind("name").as((n) => {
						return Utils.lookUpIcon(n || "") ? n || "" : icons.fallback.audio;
					}),
				}),

				Label({
					vpack: "center",
					xalign: 0,
					className: "mixeritemlabel",
					truncate: "end",
					max_width_chars: 28,
					label: stream.bind("name").as((d) => d || ""),
				}),
			],

			setup: (self) => {
				if (stream.id && Audio[stream.id]) {
					self.toggleClassName("muted", Audio[stream.id].is_muted);
				}
			},
		});
	}

	function mixerSlider() {
		return Slider({
			className: "mixeritemslider Slider",
			hexpand: true,
			draw_value: false,
			value: stream.bind("volume"),
			on_change: ({ value }) => (stream.volume = value),
		});
	}

	return Box({
		hexpand: true,
		className: "mixeritem",
		vpack: "center",
		vertical: true,
		children: [mixerLabel(), mixerSlider()],
	});
}

const SinkItem = (stream: Stream) =>
	Button({
		hexpand: true,
		on_clicked: () => (Audio.speaker = stream),
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
					label: (stream.description || "").split(" ").slice(0, 4).join(" "),
				}),
				Icon({
					icon: icons.ui.tick,
					className: "sinkitemicon",
					hexpand: true,
					hpack: "end",
					visible: Audio.speaker.bind("stream").as((s) => s === stream.stream),
				}),
			],
		}),
	});

const AppMixer = () =>
	Menu({
		name: "app-mixer",
		icon: icons.audio.mixer,
		title: "Volume Mixer",
		content: [
			Box({
				vertical: true,
				className: "volmenusitems",
				children: Audio.bind("apps").as((a) => a.map(MixerItem)),
			}),
		],
	});

const SinkSelector = () =>
	Menu({
		name: "sink-selector",
		icon: icons.audio.type.headset,
		title: "Sink Selector",
		content: [
			Box({
				vertical: true,
				className: "volmenusitems",
				children: Audio.bind("speakers").as((a) => a.map(SinkItem)),
			}),
		],
	});

const VolumeSlider = () =>
	Box({
		//className: "volSlider",
		name: "volume-slider",
		vertical: true,
		vexpand: true,
		children: [
			Box({
				children: [speakerIcon(), speakerSlider()],
			}),
			Widget.Separator(),
			Box({
				children: [micIcon(), micSlider()],
			}),
		],
	});

const AudioMixer = () =>
	Box({
		className: "audiomixer",
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
						visible: Audio.bind("apps").as((a) => a.length > 0),
					}),
				],
			}),
			AppMixer(),
			SinkSelector(),
			Widget.Separator(),
			SettingsButton(),
		],
	});

export default AudioMixer;
