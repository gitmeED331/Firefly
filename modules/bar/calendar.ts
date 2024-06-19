import { Widget, Gtk, PopupWindow, Utils } from "../../imports";
import options from "options"

const { Box, Label } = Widget;
const { execAsync } = Utils;
//const Calendar = Widget.subclass(Gtk.Calendar)
const { bar, datewin } = options;
const pos = datewin.position.bind();
const layout = Utils.derive([bar.position, datewin.position], (bar, qs) => 
    `${bar}-${qs}` as const,
);

const CalWidWin = () =>  PopupWindow({
    name: "calendar",
    className: "calpopwin",
    anchor: pos,
    transition: pos.as(pos => pos === "top" ? "slide_down" : "slide_up"),
    layer: "top",
    exclusivity: 'normal',
    keymode: 'on-demand',
    margins: [0,550],
    child: Box({
        className: "calendarbox",
        child: Widget.Calendar({
            showDayNames: true,
            showDetails: true,
            showHeading: true,
            showWeekNumbers: true,
            hpack: "center",
            vpack: "center",
        })
    })
});

export function Calendar() {
    App.addWindow(CalWidWin())
    layout.connect("changed", () => {
        App.removeWindow("calendar")
        App.addWindow(CalWidWin())
    })
}
