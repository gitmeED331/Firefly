use imports::{Widget, PopupWindow, Utils, Gtk, App, GLib};
use options;
use crate::Widgets::GridCalendar;

fn Calendar() {
    let bar = options::bar.position();
    let datewin = options::datewin.position();
    let pos = datewin;
    let layout = Utils::derive(
        [bar, datewin],
        |bar, qs| format!("{}-{}", bar, qs),
    );

    let CalWidWin = || {
        PopupWindow {
            name: "calendar",
            className: "calpopwin",
            anchor: ["top"],
            transition: pos.map(|pos| if pos == "top" { "slide_down" } else { "slide_up" }),
            layer: "top",
            exclusivity: "normal",
            keymode: "on-demand",
            child: Box {
                className: "calendarbox",
                child: GridCalendar(),
            },
        }
    };

    App::addWindow(CalWidWin());
    layout.connect("changed", || {
        App::removeWindow("calendar");
        App::addWindow(CalWidWin());
    });
}