import { Widget, PopupWindow } from "imports";
import { Devices } from "./devices/index.js";

export default () => PopupWindow({
  name: "bluetoothmenu",
  transition: "crossfade",
  layer: "top",
  anchor: ["top"],
  vexpand: true,
  margins: [0, 0, 0, 0],
  exclusivity: 'normal',
  child: Widget.Box({
    class_name: "bluetooth menu-container",
    hpack: "fill",
    hexpand: true,
    child: Widget.Box({
      vertical: true,
      hpack: "fill",
      hexpand: true,
      class_name: "bluetooth menu-items-container",
      child: Devices(),
    }),
  }),
});