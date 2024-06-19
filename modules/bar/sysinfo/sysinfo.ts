import { Widget, Utils, Hyprland, Roundedges } from "../../../imports"
import { Volumebtn } from "./volume"
import Battery from "./battery"

const { RoundedAngleEnd } = Roundedges;
const { Box, Icon, Label, Button } = Widget;
const { exec, execAsync } = Utils;

//const SSRBTN = () => Button({
//	className: 'BarBTN2',
//	onClicked: () => App.toggleWindow("ScreenCaptureWin"),
//	child: Icon({icon: "image-x-generic-symbolic"})
//});

const SysInfoBox = () => Box({
	hexpand: true,
	class_name: 'sysinfo',
	spacing: 8,
		children: [
		Volumebtn(),
		Battery(),
		//SSRBTN(),
        ]
    });
    
export const SysInfo = () => Box({
	children: [
		RoundedAngleEnd("topleft", {class_name: "angleLeft"}),
		SysInfoBox(),
		RoundedAngleEnd("topright", {class_name: "angleRight"}),
	]
})
