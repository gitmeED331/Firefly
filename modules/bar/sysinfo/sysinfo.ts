import { Widget, Utils, Hyprland, Roundedges } from "../../../imports"
import { Volumebtn } from "./volume"
import Battery from "./battery"

const { RoundedAngleEnd } = Roundedges;
const { Box } = Widget;
const { exec, execAsync } = Utils;

const SysInfoBox = () => Box({
	hexpand: true,
	class_name: 'sysinfo',
	spacing: 8,
		children: [
		Volumebtn(),
		Battery(),
        ]
    });
    
export const SysInfo = () => Box({
	children: [
		RoundedAngleEnd("topleft", {class_name: "angleLeft"}),
		SysInfoBox(),
		RoundedAngleEnd("topright", {class_name: "angleRight"}),
	]
})
