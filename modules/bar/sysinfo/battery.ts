import { Widget, Utils, Battery } from "imports";
const { Box } = Widget;

import icons from "lib/icons"
import options from "options"
import PanelButton from "../../buttons/PanelButton"

const powerProfiles = await Service.import('powerprofiles')
const battery = await Service.import("battery")
const { bar, percentage, blocks, width, low } = options.bar.battery

const Indicator = () => Widget.Icon({
	setup: self => self.hook(battery, () => {
		self.icon = battery.charging || battery.charged
			? icons.battery.charging
			: battery.icon_name
	}),
})

const PercentLabel = () => Widget.Revealer({
	transition: "slide_right",
	click_through: true,
	reveal_child: percentage.bind(),
	child: Widget.Label({
		label: battery.bind("percent").as(p => `${p}%`),
	}),
})

const LevelBar = () => {
	const level = Widget.LevelBar({
		className: "batlvlbar",
		bar_mode: "discreet",
		max_value: blocks.bind(),
		visible: bar.bind().as(b => b !== "hidden"),
		value: battery.bind("percent").as(p => (p / 100) * blocks.value),
	})
	const update = () => {
		level.value = (battery.percent / 100) * blocks.value
		level.css = `block { min-width: ${width.value / blocks.value}pt; }`
	}
	return level
		.hook(width, update)
		.hook(blocks, update)
		.hook(bar, () => {
			level.vpack = bar.value === "whole" ? "fill" : "center"
			level.hpack = bar.value === "whole" ? "fill" : "center"
		})
}

const WholeButton = () => Widget.Overlay({
	vexpand: true,
	child: LevelBar(),
	className: "whole",
	passThrough: true,
	overlay: Widget.Box({
		hpack: "center",
		children: [
			Widget.Icon({
				icon: icons.battery.charging,
				visible: Utils.merge([
					battery.bind("charging"),
					battery.bind("charged"),
				], (ing, ed) => ing || ed),
			}),
			Widget.Box({
				hpack: "center",
				vpack: "center",
				child: PercentLabel(),
			}),
		],
	}),
})

const Regular = () => Box({
	className: "regular",
	children: [
		Indicator(),
		PercentLabel(),
		LevelBar(),
	],
})

export default () => PanelButton({
	className: "battery",
	hexpand: false,
	onSecondaryClick: () => { percentage.value = !percentage.value },
	onPrimaryClick: () => App.toggleWindow("pwrprofiles"),
	visible: battery.bind("available"),
	tooltipText: powerProfiles.bind('active_profile'),

	child: Widget.Box({
		expand: true,
		visible: battery.bind("available"),
		child: bar.bind().as(b => b === "whole" ? WholeButton() : Regular()),
	}),
	setup: self => self
		.hook(bar, w => w.toggleClassName("bar-hidden", bar.value === "hidden"))
		.hook(battery, w => {
			w.toggleClassName("charging", battery.charging || battery.charged)
			w.toggleClassName("low", battery.percent < low.value)
		}),
})
