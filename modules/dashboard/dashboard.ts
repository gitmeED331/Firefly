import { Widget, Utils, PopupWindow } from "../../imports";
import { PowerIcon, TerminalIcon, KontactIcon, VPNIcon, Enpass } from "./iconButtons";
/*import { WiFi } from "./wifi.js";
import { BluetoothWidget } from "./bluetooth.js";*/
import { BrightnessSlider }  from "./brightnessSlider";
import { NotificationList } from "./notificationList";
import { PowerCenter } from "./power"
import options from "../../options";

const { Box } = Widget;
const { execAsync } = Utils;

const { dashboard } = options;
const pos = options.dashboard.position.bind();
const layout = Utils.derive([dashboard.position], (dashboard, qs) => 
		`${dashboard}-${qs}` as const,
	);

const quickAccess = Box({
	className: "quickaccess",
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
    className: "dashboard",
	anchor: pos,
	vexpand: true,
	margins: [20,0,0,0],
    transition: "slide_left",
    layer: "top",
    child: 
        Box({
			className: "dashcontainer",
            vertical:true,
            vexpand:true,
            hexpand: false,
            children: [
				Box({
					hexpand: false,
					hpack: 'center',
					child: PowerCenter(),
				}),
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
