import { Widget, Roundedges } from "imports"
import { VolumeIndicator, Battery } from "../Widgets/index"

const { RoundedAngleEnd } = Roundedges;
const { Box } = Widget;

const SysInfoBox = () => Box({
	hexpand: true,
	class_name: 'sysinfo',
	spacing: 8,
	children: [
		VolumeIndicator(),
		Battery(),
	]
});

export const SysInfo = () => Box({
	children: [
		RoundedAngleEnd("topleft", { class_name: "angleLeft" }),
		SysInfoBox(),
		RoundedAngleEnd("topright", { class_name: "angleRight" }),
	]
})
