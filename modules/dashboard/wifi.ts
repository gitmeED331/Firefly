import { Widget, Network, Utils } from "../../imports";
const { execAsync } = Utils
const { Box } = Widget;

export const WiFi = () =>
	Widget.Button({
		onClicked: () => Network.toggleWifi(),
        onSecondaryClickRelease: () => {
            execAsync(['bash', '-c', 'nmcli d wifi', '&']);
            App.closeWindow('dashboard');
        },
        child: Box({
			className: "wifi",
			vpack: "center",
			vexpand: true,
			setup: (self) => {
				self.hook(Network, (self) => {
					if (Network.wifi.internet === "disconnected") {
						self.toggleClassName("off", true);
					} else {
						self.toggleClassName("off", false);
					}
				});
			},
			children: [
				Widget.Label({
					className: "wifiIcon",
					label: "󰤭",
					setup: (self) => {
						self.hook(Network, (self) => {
							if (Network.wifi.internet === "disconnected") {
								self.label = "󰤭";
							} else {
								self.label = "󰤨";
							}
						});
					},
				}),
				Box({
					vertical: true,
					vpack: "center",
					children: [
						Widget.Label({
							className: "wifiLabel",
							label: "Wi-Fi",
							hpack: "start",
						}),
					],
				}),
			],
		}),
	});
