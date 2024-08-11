import { Widget, App, Utils, PopupWindow } from "imports";
import { Ethernet } from "./ethernet/index.js";
import { Wifi } from "./wifi/index.js";

const { Box } = Widget;

export default () => PopupWindow({
  name: "networkmenu",
  transition: "crossfade",
  layer: "top",
  anchor: ["top"],
  vexpand: true,
  margins: [0, 0, 0, 0],
  exclusivity: 'normal',
  child: Box({
    className: "network menu-container",
    child: Box({
      vertical: true,
      hexpand: true,
      children: [Ethernet(), Wifi()],
    }),
  }),
})
