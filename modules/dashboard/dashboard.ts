import { Widget, Utils, PopupWindow } from "imports";
// import { TerminalIcon, KontactIcon, VPNIcon, Enpass } from "./iconButtons";
import { WifiSelection, NetworkToggle } from "./Network";
import { BluetoothToggle, BluetoothDevices } from "./Bluetooth";
import { BrightnessSlider }  from "./brightnessSlider";
import { NotificationList } from "./notificationList";
import options from "options";


const { Box } = Widget;
const { execAsync } = Utils;

const { dashboard } = options;
const pos = options.dashboard.position.bind();
const layout = Utils.derive([dashboard.position], (dashboard, qs) => 
		`${dashboard}-${qs}` as const,
	);

const Row = (
    toggles: Array<() => Gtk.Widget> = [],
             menus: Array<() => Gtk.Widget> = [],
) => Widget.Box({
    vertical: true,
    children: [
        Widget.Box({
            homogeneous: true,
            class_name: "row horizontal",
            children: toggles.map(w => w()),
        }),
        ...menus.map(w => w()),
    ],
})

// const quickAccess = Box({
// 	className: "quickaccess",
// 	vertical: true,
// 	hexpand: false,
// 	hpack: 'center',
// 	children: [
// 		Box({
// 			vertical: false,
// 			hexpand: true,
// 			hpack: 'center',
// 			children: [
// 				Enpass(),
// 				KontactIcon(),
// 				VPNIcon(),
// 				TerminalIcon(),
// 			]
// 		}),
//     ]
// });
	
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
            vertical: true,
            vexpand: true,
            hexpand: false,
            hpack: "center",
            vpack: "center",
            children: [
                // Box({
                //     className: "quicktoggles",
                //     vertical: true,
                //     vexpand: false,
                //     children: [
                //         quickAccess,
                //     ]
                // }),
                Row(
                    [NetworkToggle, BluetoothToggle],
                    [WifiSelection, BluetoothDevices],
                ),
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
