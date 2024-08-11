import { App, Widget, Utils, Bluetooth, Variable, Gdk, Service } from "imports"
import icons, { icon } from "lib/icons"
import options from "options"
const bluetooth = await Service.import('bluetooth')

const { Button, Box, Label, Icon } = Widget

const { btReveal } = options.bar.bluetooth

const Bluetooth = () => {
    const btIcon = Icon({
        size: 15,
        icon: bluetooth.bind("enabled").as((v) => v ? icon("network-bluetooth-activated-symbolic") : icons.bluetooth.disabled),
        class_name: "bluetooth barbutton-icon",
    });

    const btText = Widget.Revealer({
        transition: "slide_right",
        click_through: true,
        reveal_child: btReveal.bind(),
        child: Label({
            class_name: "bluetooth barbutton-label",
            label: Utils.merge([
                bluetooth.bind("enabled"),
                bluetooth.bind("connected_devices"),
            ],
                (btEnabled, btDevices) => {
                    return btEnabled && btDevices.length ? ` (${btDevices.length})`
                        : btEnabled ? "On" : "Off"
                }),
        })
    })

    return Box({
        className: "bluetooth barbutton-content",
        hpack: "center",
        vpack: "center",
        children: bluetooth.bind("enabled").as((showLabel) => showLabel ? [btIcon, btText] : [btIcon]),
        visible: true,
    })
}

const BluetoothButton = () => Button({
    class_name: "bluetooth barbutton",
    //icon: icons.bluetooth.enabled,
    hpack: "center",
    vpack: "center",
    child: Bluetooth(),
    on_primary_click: (clicked: any, event: Gdk.Event) => {
        App.toggleWindow("bluetoothmenu");
    },
    onSecondaryClick: () => {
        btReveal.value = !btReveal.value
        console.log(`BT text is visible: ${btReveal.value}`)
    }
})

export default BluetoothButton