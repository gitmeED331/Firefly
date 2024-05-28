import { Widget, Utils, Hyprland, Roundedges } from "../../../imports"
//import{ WifiBTN } from "./network"
//import{ BluetoothWidget } from "./bluetooth"
import { Volumebtn } from "./volume"
import Battery from "./battery"
//import { Notification } from "./notification"

const { RoundedAngleEnd } = Roundedges;
const { Box } = Widget;
const { exec, execAsync } = Utils;

const SysInfoBox = () => Box({
	hexpand: true,
    class_name: 'sysinfo',
	spacing: 8,
		children: [
		//BluetoothWidget(),
		Volumebtn(),
		Battery(),
		//WifiBTN(),
		//Notification(),
        ]
    });
    
export const SysInfo = () => Box({
	children: [
		RoundedAngleEnd("topleft", {class_name: "angleLeft"}),
		SysInfoBox(),
		RoundedAngleEnd("topright", {class_name: "angleRight"}),
	]
})
