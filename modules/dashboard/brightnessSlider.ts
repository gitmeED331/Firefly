import { Widget, Utils, Gio } from "imports";
import Brightness from "../service/brightness";

const { monitorFile, readFile, exec } = Utils
const { Box, Slider, Label } = Widget;

const BSlider = () =>
	Slider({
		className: "brightsld Slider",
		drawValue: false,
		on_change: self => Brightness.screen_value = self.value,
		value: Brightness.bind('screen-value').as(n => n > 1 ? 1 : n),
	});
	
const Icon = () =>
	Label({
		className: "brightsldIcon",
		setup: self => self.hook(Brightness, (self, screenValue) => {
        const icons = ["󰃚", "󰃛", "󰃜", "󰃝", "󰃞", "󰃟", "󰃠"];
        self.label =`${icons[Math.floor((Brightness.screen_value * 100) / 15)]}`;
    }, 'screen-changed'),
	});

export const BrightnessSlider = () =>
	Box({
		className: "brightSlider",
		vertical: true,
		hpack: "center",
		vpack: "center",
		children: [
			Label({
				className: "brightsldLabel",
				label: "Brightness",
				hpack: "center",
			}),
			Box({
				hpack: "center",
				vpack: "center",
				children: [
					Icon(),
					BSlider(),
				]
			}),

		],
	});
