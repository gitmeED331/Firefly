import { Widget, PopupWindow, Utils, Gtk, App, GLib } from "imports"
import options from "options"
import { GridCalendar } from "../Widgets/index"

const { Box, Label, Button, Icon } = Widget
const { execAsync } = Utils
const { bar, datewin } = options
const pos = datewin.position.bind()
const layout = Utils.derive(
  [bar.position, datewin.position],
  (bar, qs) => `${bar}-${qs}` as const,
)

const CalWidWin = () =>
  PopupWindow({
    name: "calendar",
    className: "calpopwin",
    anchor: ["top"],
    transition: pos.as((pos) => (pos === "top" ? "slide_down" : "slide_up")),
    layer: "top",
    exclusivity: "normal",
    keymode: "on-demand",
    child: Box({
      className: "calendarbox",
      child: GridCalendar(),
    }),
  })

export function Calendar() {
  App.addWindow(CalWidWin());
  layout.connect("changed", () => {
    App.removeWindow("calendar");
    App.addWindow(CalWidWin());
  });
}
