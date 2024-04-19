import { Widget, Utils } from "../../imports";
import Gio from "gi://Gio";
import Brightness from "./brightness";
const { monitorFile, readFile, exec } = Utils
const { Box } = Widget;

const Slider = () =>
	Widget.Slider({
		className: "sldSlider",
		drawValue: false,
		on_change: self => Brightness.screen_value = self.value,
		value: Brightness.bind('screen-value').as(n => n > 1 ? 1 : n),
	});
	
const Icon = () =>
	Widget.Label({
		className: "sldIcon",
		setup: self => self.hook(Brightness, (self, screenValue) => {
        const icons = ["󰃚", "󰃛", "󰃜", "󰃝", "󰃞", "󰃟", "󰃠"];
        self.label =`${icons[Math.floor((Brightness.screen_value * 100) / 15)]}`;
    }, 'screen-changed'),
	});

export const BrightnessSlider = () =>
	Box({
		className: "Slider",
		vertical: true,
		children: [
			Widget.Label({
				className: "sldLabel",
				label: "Brightness",
				hpack: "start",
			}),
			Box({
				children: [Icon(), Slider()],
			}),
		],
	});
