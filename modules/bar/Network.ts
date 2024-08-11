import { Gdk, Gtk, Widget, Utils, Service, App } from "imports";
import icons from "lib/icons";
import options from "options";
const network = await Service.import("network");

const { Button, Box, Label, Icon } = Widget;

const Network = () => {
    const wifiIndicator = [
        Icon({
            size: 16,
            className: "network-wifi",
            icon: network.wifi.bind("icon_name"),
        }),
        Box({
            children: Utils.merge(
                [network.bind("wifi")],
                (wifi, showLabel) => {
                    if (!showLabel) {
                        return [];
                    }
                    return [
                        Label({
                            className: "network-barlabel-wifi",
                            label: wifi.ssid ? `${wifi.ssid.substring(0, 7)}` : "--",
                        }),
                    ]
                },
            )
        })
    ];

    const wiredIndicator = [
        Icon({
            className: "network-baricon-wired",
            icon: network.wired.bind("icon_name"),
        }),
        Box({
            children: Utils.merge(
                [network.bind("wired")],
                (_, showLabel) => {
                    if (!showLabel) {
                        return [];
                    }
                    return [
                        Widget.Label({
                            className: "network-barlabel-wired",
                            label: "Wired",
                        }),
                    ]
                },
            )
        })
    ];

    return Box({
        hpack: "center",
        vpack: "center",
        className: "network-barbox",
        children: network.bind("primary")
            .as((w) => (w === "wired" ? wiredIndicator : wifiIndicator)),
        visible: true,
    })
};

const NetworkButton = () => Button({
    className: "network barbutton",
    hpack: "center",
    vpack: "center",
    child: Network(),
    on_primary_click: (clicked: any, event: Gdk.Event) => {
        App.toggleWindow("networkmenu");
    },
})

export default NetworkButton