import { Widget, Utils, Hyprland } from "../../../imports"
//import{ NetWidget, WifiBTN } from "./network.js"
//import{ BluetoothWidget } from "./bluetooth.js"
import{ Volume, Dashvol } from "./volume"
import{ BatteryWidget } from "./battery"
import { Notification } from "./notification"

const { Box } = Widget;
const { exec, execAsync } = Utils;

export const SysInfo = () => Box({
	hexpand: true,
    class_name: 'sysinfo',
	spacing: 8,
		children: [
		//BluetoothWidget(),
		Volume(),
		BatteryWidget(),
		//WifiBTN(),
		Notification(),
        ]
    });
