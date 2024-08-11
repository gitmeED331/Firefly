import { Widget, Utils } from "imports"
import icons, { icon } from "lib/icons";
import { BluetoothDevice } from "types/service/bluetooth";

const connectedControls = (dev: BluetoothDevice, connectedDevices: BluetoothDevice[]) => {
    if (!connectedDevices.includes(dev.address)) {
        return Widget.Box({});
    }

    return Widget.Box({
        vpack: "start",
        class_name: "bluetooth-controls",
        spacing: 10,
        children: [
            Widget.Button({
                class_name: dev.paired ? "bluetooth menu-icon-button paired" : "bluetooth menu-icon-button unpaired",
                child: Widget.Icon({
                    size: 20,
                    tooltip_text: dev.paired ? "Unpair" : "Pair",
                    class_name: "menu-icon-button-label unpair bluetooth",
                    icon: dev.paired ? icon("bluetooth-link-symbolic") : icon("bluetooth-unlink-symbolic"),
                }),
                on_primary_click: () =>
                    Utils.execAsync([
                        "bash",
                        "-c",
                        `bluetoothctl ${dev.paired ? "unpair" : "pair"} ${dev.address}`,
                    ]).catch((err) =>
                        console.error(
                            `bluetoothctl ${dev.paired ? "unpair" : "pair"} ${dev.address}`,
                            err,
                        ),
                    ),
            }),
            Widget.Button({
                class_name: "bluetooth menu-icon-button disconnect",
                child: Widget.Icon({
                    size: 20,
                    tooltip_text: dev.connected ? "Disconnect" : "Connect",
                    class_name: "menu-icon-button-label disconnect bluetooth",
                    icon: dev.connected ? icon("bluetooth-connect-symbolic") : icon("bluetooth-disconnect-symbolic"),
                }),
                on_primary_click: () => dev.setConnection(!dev.connected),
            }),
            Widget.Button({
                class_name: "bluetooth menu-icon-button untrust",
                child: Widget.Icon({
                    size: 14,
                    tooltip_text: dev.trusted ? "Untrust" : "Trust",
                    class_name: "bluetooth menu-icon-button untrust",
                    icon: dev.trusted ? icon("bluetooth-trust-symbolic") : icon("bluetooth-untrust-symbolic"),
                }),
                on_primary_click: () =>
                    Utils.execAsync([
                        "bash",
                        "-c",
                        `bluetoothctl ${dev.trusted ? "untrust" : "trust"} ${dev.address}`,
                    ]).catch((err) =>
                        console.error(
                            `bluetoothctl ${dev.trusted ? "untrust" : "trust"} ${dev.address}`,
                            err,
                        ),
                    ),
            }),
            Widget.Button({
                class_name: "bluetooth menu-icon-button delete",
                child: Widget.Icon({
                    size: 14,
                    tooltip_text: "Forget",
                    class_name: "menu-icon-button-label delete bluetooth",
                    icon: icon("circle-x-symbolic"),
                }),
                on_primary_click: () => {
                    Utils.execAsync([
                        "bash",
                        "-c",
                        `bluetoothctl remove ${dev.address}`,
                    ]).catch((err) => console.error("Bluetooth Remove", err));
                },
            }),
        ],
    });
};

export { connectedControls };
