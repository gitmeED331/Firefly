import { Widget, Audio, App } from "imports";

const { Box, Button } = Widget;

export function VolumeIndicator() {
	const update = (self: any) => {
		const vol = Audio.speaker.volume * 100;
		let icon = [
			[101, "overamplified"],
			[67, "high"],
			[34, "medium"],
			[1, "low"],
			[0, "muted"],
		].find(([threshold]) => Number(threshold) <= vol)?.[1];

		if (Audio.speaker.is_muted) {
			icon = "muted";
			self.tooltip_text = "Muted";
		} else {
			self.tooltip_text = `Volume ${Math.floor(vol)}%`;
		}
		self.icon = `audio-volume-${icon}-symbolic`;
		self.toggleClassName("muted", Audio.speaker.is_muted);
	};
	return Button({
		className: "volumebtn",
		child: Widget.Icon().hook(Audio.speaker, (self) => {
			update(self);
			self.hook(Audio.speaker, () => update(self));
		}),
		onPrimaryClick: () => {
			App.toggleWindow("audiomixerwindow");
		},
		onSecondaryClick: (self: any) => {
			Audio.speaker.is_muted = !Audio.speaker.is_muted;
			update(self);
		},
		on_scroll_up: (self: any) => {
			Audio.speaker.volume += 0.035;
			update(self);
		},
		on_scroll_down: (self: any) => {
			Audio.speaker.volume -= 0.035;
			update(self);
		},
	});
}
