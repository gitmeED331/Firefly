import { Widget, Utils, Battery, Service, App } from "imports";
const { Box } = Widget;

import icons from "lib/icons"
import options from "options"
import PanelButton from "../buttons/PanelButton"

const powerProfiles = await Service.import('powerprofiles')
const { bar, percentage, blocks, width, low } = options.bar.battery

const Indicator = () => Widget.Icon({
	setup: self => self.hook(Battery, () => {
		self.icon = Battery.charging || Battery.charged
			? icons.battery.charging
			: Battery.icon_name
	}),
})

const PercentLabel = () => Widget.Revealer({
	transition: "slide_right",
	click_through: true,
	reveal_child: percentage.bind(),
	child: Widget.Label({
		label: Battery.bind("percent").as(p => `${p}%`),
	}),
})

const LevelBar = () => {
	const level = Widget.LevelBar({
		className: "batlvlbar",
		bar_mode: "continuous",
		max_value: blocks.bind(),
		visible: bar.bind().as(b => b !== "hidden"),
		value: Battery.bind("percent").as(p => (p / 100) * blocks.value),
	})
	const update = () => {
		level.value = (Battery.percent / 100) * blocks.value
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
					Battery.bind("charging"),
					Battery.bind("charged"),
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
	visible: Battery.bind("available"),
	tooltipText: powerProfiles.bind('active_profile'),

	child: Widget.Box({
		expand: true,
		visible: Battery.bind("available"),
		child: bar.bind().as(b => b === "whole" ? WholeButton() : Regular()),
	}),
	setup: self => self
		.hook(bar, w => w.toggleClassName("bar-hidden", bar.value === "hidden"))
		.hook(Battery, w => {
			w.toggleClassName("charging", Battery.charging || Battery.charged)
			w.toggleClassName("low", Battery.percent < low.value)
		}),
})
