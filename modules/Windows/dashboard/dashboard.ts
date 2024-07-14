import { Widget, Utils, PopupWindow, Gtk, App } from "imports"
import { winheight } from "lib/screensizeadjust"
import options from "options"

// --- imported widgets ---
import {
    WifiSelection,
    NetworkToggle,
    BluetoothToggle,
    BluetoothDevices,
    BrightnessSlider,
    GridCalendar,
} from "../../Widgets"
import { NotificationList } from "./notificationList"

const { Box } = Widget
const { dashboard } = options
const pos = options.dashboard.position.bind()
const layout = Utils.derive([dashboard.position], (dashboard, qs) =>
    `${dashboard}-${qs}` as const,
)

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

const dashcal = () => Box({
    className: "dashcal",
    name: "dashcalbox",
    hpack: "center",
    hexpand: true,
    child: GridCalendar(),
})

const Dash = () => PopupWindow({
    name: "dashboard",
    className: "dashboard",
    anchor: pos,
    vexpand: true,
    margins: [20, 0, 0, 0],
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
            css: `min-height: ${winheight(0.97)}px;`,
            children: [
                Row(
                    [NetworkToggle, BluetoothToggle],
                    [WifiSelection, BluetoothDevices],
                ),
                BrightnessSlider(),
                NotificationList(),
                dashcal(),

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
