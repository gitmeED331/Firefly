import { Widget, Utils, Network, Service } from "imports"
// import { Network } from "types/service/network.js"
import { AccessPoint } from "lib/types/network.js"
import { Variable } from "types/variable.js"
import { getWifiIcon } from "../utils"
import icons, { icon } from "lib/icons"
const network = await Service.import("network")


const renderWAPs = (self: any, network: Network, staging: Variable<AccessPoint>, connecting: Variable<string>) => {
    const getIdBySsid = (ssid: string, nmcliOutput: string) => {
        const lines = nmcliOutput.trim().split("\n");
        for (const line of lines) {
            const columns = line.trim().split(/\s{2,}/);
            if (columns[0].includes(ssid)) {
                return columns[1];
            }
        }
        return null;
    };

    const WifiStatusMap = {
        unknown: "Status Unknown",
        unmanaged: "Unmanaged",
        unavailable: "Unavailable",
        disconnected: "Disconnected",
        prepare: "Preparing Connecting",
        config: "Connecting",
        need_auth: "Needs Authentication",
        ip_config: "Requesting IP",
        ip_check: "Checking Access",
        secondaries: "Waiting on Secondaries",
        activated: "Connected",
        deactivating: "Disconnecting",
        failed: "Connection Failed",
    };

    self.hook(network, () => {
        Utils.merge([staging.bind("value"), connecting.bind("value")], () => {
            // Sometimes the network service will yield a "this._device is undefined" when
            // trying to access the "access_points" property. So we must validate that
            // it's not 'undefined'
            //
            // Also this is an AGS bug that needs to be fixed
            let WAPs =
                network.wifi._device !== undefined ? network.wifi["access-points"] : [];

            const dedupeWAPs = () => {
                const dedupMap = {};
                WAPs.forEach((item: AccessPoint) => {
                    if (item.ssid !== null && !Object.hasOwnProperty.call(dedupMap, item.ssid)) {
                        dedupMap[item.ssid] = item;
                    }
                });

                return Object.keys(dedupMap).map((itm) => dedupMap[itm]);
            };

            WAPs = dedupeWAPs();

            const isInStaging = (wap: AccessPoint) => {
                if (Object.keys(staging.value).length === 0) {
                    return false;
                }

                return wap.bssid === staging.value.bssid;
            };

            const isDisconnecting = (wap: AccessPoint) => {
                if (wap.ssid === network.wifi.ssid) {
                    return network.wifi.state.toLowerCase() === "deactivating";
                }
                return false;
            };

            const filteredWAPs = WAPs.filter((ap: AccessPoint) => {
                return ap.ssid !== "Unknown" && !isInStaging(ap);
            }).sort((a: AccessPoint, b: AccessPoint) => {
                if (network.wifi.ssid === a.ssid) {
                    return -1;
                }

                if (network.wifi.ssid === b.ssid) {
                    return 1;
                }

                return b.strength - a.strength;
            });

            if (filteredWAPs.length <= 0 && Object.keys(staging.value).length === 0) {
                return (self.child = Widget.Label({
                    class_name: "waps-not-found dim",
                    expand: true,
                    hpack: "center",
                    vpack: "center",
                    label: "No Wi-Fi Networks Found",
                }));
            };

            return (self.children = filteredWAPs.map((ap: AccessPoint) => {
                return Widget.Box(
                    {
                        css: `margin-bottom: 5px;`,
                    },
                    Widget.Button({
                        class_name: "network-element-item",
                        cursor: "pointer",
                        on_primary_click: () => {
                            if (ap.bssid === connecting.value || ap.active) {
                                return;
                            }

                            connecting.value = ap.bssid || "";
                            Utils.execAsync(`nmcli device wifi connect ${ap.bssid}`)
                                .then(() => {
                                    connecting.value = "";
                                    staging.value = {} as AccessPoint;
                                })
                                .catch((err) => {
                                    if (
                                        err
                                            .toLowerCase()
                                            .includes("secrets were required, but not provided")
                                    ) {
                                        staging.value = ap;
                                    } else {
                                        Utils.notify({
                                            summary: "Network",
                                            body: err,
                                            timeout: 5000,
                                        });
                                    }
                                    connecting.value = "";
                                });
                        },
                        child: Widget.CenterBox({
                            vpack: "center",
                            hpack: "start",
                            hexpand: true,
                            spacing: 10,
                            startWidget: Widget.Label({
                                hpack: "start",
                                vpack: "start",
                                class_name: `network-icon wifi ${ap.ssid === network.wifi.ssid ? "active" : ""}`,
                                label: getWifiIcon(`${ap["iconName"]}`),
                            }),
                            centerWidget: Widget.Label({
                                vpack: "center",
                                hpack: "start",
                                class_name: `active-connection ${ap.ssid === network.wifi.ssid ? "active" : ""}`,
                                truncate: "middle",
                                wrap: true,
                                tooltip_markup:
                                    `Frequency: ${(ap.frequency / 1000).toFixed(1)}Ghz\nSpeed: ${ap.max_bitrate}Mbps`,
                                label: ap.ssid,
                            }),
                            // endWidget: Widget.Label({
                            //     hpack: "end",
                            //     vpack: "start",
                            //     className: `active-connection ${ap.ssid === network.wifi.ssid ? "active" : ""}`,
                            //     label: `${(ap.frequency / 1000).toFixed(1)}Ghz`
                            // }),
                        }),
                    }),
                    Widget.CenterBox({
                        vpack: "center",
                        hpack: "end",
                        spacing: 5,
                        startWidget: Widget.Revealer({
                            hpack: "end",
                            vpack: "start",
                            reveal_child:
                                ap.bssid === connecting.value || isDisconnecting(ap),

                            child: Widget.Spinner({
                                vpack: "start",
                                class_name: "spinner wap",
                            }),
                        }),
                        centerWidget: Widget.Revealer({
                            vpack: "start",
                            reveal_child: ap.bssid !== connecting.value && ap.active,
                            child: Widget.Button({
                                tooltip_text: "Delete/Forget Network",
                                class_name: "menu-icon-button network disconnect",
                                cursor: "pointer",
                                on_primary_click: () => {
                                    connecting.value = ap.bssid || "";
                                    Utils.execAsync("nmcli connection show --active").then(() => {
                                        Utils.execAsync("nmcli connection show --active").then(
                                            (res) => {
                                                const connectionId = getIdBySsid(ap.ssid || "", res);

                                                Utils.execAsync(
                                                    `nmcli connection delete ${connectionId} "${ap.ssid}"`,
                                                )
                                                    .then(() => (connecting.value = ""))
                                                    .catch((err) => {
                                                        connecting.value = "";
                                                        console.error(
                                                            `Error while forgetting "${ap.ssid}": ${err}`,
                                                        );
                                                    });
                                            },
                                        );
                                    });
                                },
                                child: Widget.Icon({
                                    vpack: "center",
                                    hpack: "end",
                                    className: "network-disonnect",
                                    icon: icon("circle-x-symbolic"),
                                }),
                            }),
                        }),
                        endWidget: Widget.Icon({
                            vpack: "center",
                            hpack: "start",
                            class_name: ap.encrypted === true ? "connection-unsecure" : "connection-secure",
                            icon: ap.encrypted === true ? icon("lock-open-symbolic") : icon("lock-closed-symbolic"),
                            tooltip_text: ap.encrypted === true ? "Unsecure" : "Secure",
                        }),
                    }),
                )
            }))
        })
    })
}

export { renderWAPs };
