import Network from "resource:///com/github/Aylur/ags/service/network.js";
import { Widget, Audio, Utils } from "../../../imports.";
import PopupWindow from "../../../utils/popupWindow";
import icons from "../icons/index.js";
import Gtk from "gi://Gtk?version=3.0";

const { Box, Button } = Widget;
const { execAsync } = Utils;

export const NetWidget = () => PopupWindow({
    name: "netwidget",
    anchor: ["top", "right"],
    margins: [12, 12, 15],
    transition: "slide_down",
    transitionDuration: 150,
    child: 
        Box({
            vertical:true,
            children: [
                WifiList(),
            ]
        })
});

const ap = Network;
const Expander = Widget.subclass(Gtk.Expander);

export const WifiBTN = () => Button({
		class_name: "wifibtn",
		on_primary_click: () => { App.toggleWindow("netwidget") },
		tooltip_text: JSON.stringify(ap, null, 2),
		child:  Widget.Icon({
				icon: Network.wifi.bind('icon_name'),
				}),
  });
  
const WifiGroup = (expander, aps) => {
const strongest = aps.sort((a, b) => b.strength - a.strength);

  if(!expander) {
    expander = Expander({
      class_name: "wifi-group",
      label_widget: Widget.Box({
        spacing: 8,
        children: [
          Widget.Icon({icon: strongest[0].iconName}),
          Widget.Label({label: strongest[0].ssid}),
        ]
      })
    })
      .hook(Network, self => {
        self.toggleClassName("connected", Network.wifi.ssid === aps[0].ssid);
      });
  }

  const group = Widget.Box({
    class_name: "wifi-group-list",
    vertical: true,
    children: strongest.map(WifiBTN)
  });
  expander.child = group;

  return expander;
};

export const WifiList = () => Widget.Box({
	className: 'wifilist',
  vertical: true,
  spacing: 5,
  attribute: {
    networks: new Map()
  }
}).hook(Network, box => {
  const aps = Network.wifi.access_points.sort((a, b) => b.strength - a.strength);
  const apGroups = Object.values(aps.reduce((acc, ap) => {
    if(!acc[ap.ssid]) acc[ap.ssid] = [];
    acc[ap.ssid].push(ap);
    return acc;
  }, {}));
  const networkMap = new Map();
  apGroups.forEach(group => {
    networkMap.set(group[0].ssid,
      WifiGroup(box.attribute.networks.get(group[0].ssid), group));
  });
  box.attribute.networks = networkMap;
  box.children = Array.from(networkMap.values());
});

export default WifiList;
