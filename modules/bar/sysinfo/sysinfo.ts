import { Widget, Utils, Hyprland, Roundedges } from "../../../imports"
//import{ NetWidget, WifiBTN } from "./network.js"
//import{ BluetoothWidget } from "./bluetooth.js"
import{ Volume, Dashvol } from "./volume"
import{ BatteryWidget } from "./battery"
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
		Volume(),
		BatteryWidget(),
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
