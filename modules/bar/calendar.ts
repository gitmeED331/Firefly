import { Widget, Gtk, PopupWindow, Utils } from "../../imports";
import options from "options"

const { Box } = Widget;
const { execAsync } = Utils;

const { bar, datewin } = options;
const pos = datewin.position.bind();
const layout = Utils.derive([bar.position, datewin.position], (bar, qs) => 
		`${bar}-${qs}` as const,
	);

const DateWin = () =>  PopupWindow({
    name: "calendar",
    anchor: pos,
    margins: [25, 15],
    transition: pos.as(pos => pos === "top" ? "slide_down" : "slide_up"),
    keymode: 'on-demand',
    vpack: 'end',
    child: 
        Box({
			className: "calendarWidget",
            children: [
              Widget.Calendar({
					className: "calwid",
                    hexpand: true,
                    hpack: "center",
                })
            ]
        })
});


export function Calendar() {
    App.addWindow(DateWin())
    layout.connect("changed", () => {
        App.removeWindow("calendar")
        App.addWindow(DateWin())
    })
}
