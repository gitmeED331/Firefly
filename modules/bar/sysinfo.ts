import { Widget, Roundedges } from "imports"
import { VolumeIndicator, Battery } from "../Widgets/index"
import NetworkButton from "./Network"
import BluetoothButton from "./Bluetooth"

const { RoundedAngleEnd } = Roundedges;
const { Box, Button } = Widget;

const SysInfoBox = () => Box({
	hexpand: true,
	class_name: 'sysinfo',
	spacing: 8,
	children: [
		VolumeIndicator(),
		BluetoothButton(),
		NetworkButton(),
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
