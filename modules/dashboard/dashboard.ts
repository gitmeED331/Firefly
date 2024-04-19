import { Widget, Utils, PopupWindow } from "../../imports";
import { PowerIcon, TerminalIcon, KontactIcon, VPNIcon, Enpass } from "./iconButtons";
/*import { WiFi } from "./wifi.js";
import { BluetoothWidget } from "./bluetooth.js";*/
import { BrightnessSlider }  from "./brightnessSlider.js";
import { NotificationList } from "./notificationList.js";
import options from "../../options";

const { Box } = Widget;
const { execAsync } = Utils;

const { bar, dashboard } = options;
const pos = dashboard.position.bind();
const layout = Utils.derive([bar.position, dashboard.position], (bar, qs) => 
		`${bar}-${qs}` as const,
	);

const quickAccess = Box({
	vertical: true,
	hexpand: false,
	hpack: 'center',
	children: [
		Box({
			vertical: false,
			hexpand: true,
			hpack: 'center',
			children: [
			PowerIcon(),
			]
		}),
		Box({
			vertical: false,
			hexpand: true,
			hpack: 'center',
			children: [
				Enpass(),
				KontactIcon(),
				VPNIcon(),
				TerminalIcon(),
			]
		}),
    ]
});
	
 const Dash = () =>  PopupWindow({
    name: "dashboard",
	anchor: pos,
	margins: [25, 15],
    transition: "slide_left",
    layer: "overlay",
    child: 
        Box({
            vertical:true,
            vexpand:true,
            children: [
                Box({
                    className: "quicktoggles",
                    vertical: true,
                    vexpand: false,
                    children: [
                        quickAccess,
                        /*Box({
                            className: "buttons",
                            children: [
                               WiFi(),
                                BluetoothWidget(),
                            ]
                        }),*/
                    ]   
                }),
				BrightnessSlider(),
                NotificationList(),
            ]
        })
});

export function Dashboard() {
    App.addWindow(Dash())
    layout.connect("changed", () => {
        App.removeWindow("dashboard")
        App.addWindow(Dash())
    })
}
