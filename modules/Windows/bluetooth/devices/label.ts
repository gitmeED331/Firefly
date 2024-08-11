import { Widget, Utils, Variable } from "imports";
import { Bluetooth } from "types/service/bluetooth";
import { icon } from "lib/icons";

const label = (bluetooth: Bluetooth) => {
    const searchInProgress = Variable(false);
    const startRotation = () => {
        searchInProgress.value = true;
        setTimeout(() => {
            searchInProgress.value = false;
        }, 10 * 1000);
    };
    return Widget.Box({
        class_name: "bluetooth menu-label-container",
        hpack: "fill",
        vpack: "start",
        children: [
            Widget.Label({
                class_name: "bluetooth menu-label",
                vpack: "center",
                hpack: "start",
                label: "Bluetooth",
            }),
            Widget.Box({
                class_name: "controls-container",
                vpack: "start",
                spacing: 10,
                children: [
                    Widget.ToggleButton({
                        class_name: "bluetooth menu-switch",
                        hexpand: true,
                        hpack: "end",
                        onToggled: () => {
                            searchInProgress.value = false;
                            bluetooth.enabled = !bluetooth.enabled;
                        },
                        child: Widget.Icon({
                            size: 15,
                            icon: bluetooth.bind("enabled").as((v) => icon(bluetooth.enabled === true ? "network-bluetooth-activated-symbolic" : "bluetooth-disabled-symbolic")),
                            class_name: bluetooth.bind("enabled").as((c) => bluetooth.enabled ? 'toggle-enabled' : 'toggle-disabled')
                        }),
                    }),
                    Widget.Button({
                        vpack: "center",
                        class_name: "menu-icon-button search",
                        on_primary_click: () => {
                            startRotation();
                            Utils.execAsync([
                                "bash",
                                "-c",
                                "bluetoothctl --timeout 120 scan on",
                            ]).catch((err) => {
                                searchInProgress.value = false;
                                console.error("bluetoothctl --timeout 120 scan on", err);
                            });
                        },
                        child: Widget.Icon({
                            class_name: searchInProgress
                                .bind("value")
                                .as((v) => (v ? "spinning" : "")),
                            icon: "view-refresh-symbolic",
                        }),
                    }),
                ],
            }),
        ],
    });

};


export { label };
