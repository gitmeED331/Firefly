use imports::{Widget, Utils, PopupWindow, Gtk, App, Mpris, Variable};
use lib::screensizeadjust::winheight;
use options;
use Widgets::{WifiSelection, NetworkToggle, BluetoothToggle, BluetoothDevices, BrightnessSlider, GridCalendar};
use notificationList::NotificationList;

fn row(toggles: Vec<fn() -> Gtk::Widget>, menus: Vec<fn() -> Gtk::Widget>) -> Widget::Box {
    Widget::Box {
        vertical: true,
        children: vec![
            Widget::Box {
                homogeneous: true,
                class_name: "row horizontal",
                children: toggles.iter().map(|w| w()).collect(),
            },
            menus.iter().map(|w| w()).collect(),
        ],
    }
}

fn dashcal() -> Widget::Box {
    Widget::Box {
        class_name: "dashcal",
        name: "dashcalbox",
        hpack: "center",
        hexpand: true,
        child: GridCalendar(),
    }
}

fn dash() -> PopupWindow {
    PopupWindow {
        name: "dashboard",
        class_name: "dashboard",
        anchor: pos,
        vexpand: true,
        margins: [20, 0, 0, 0],
        transition: "slide_left",
        layer: "top",
        child: Widget::Box {
            class_name: "dashcontainer",
            vertical: true,
            vexpand: true,
            hexpand: false,
            hpack: "center",
            vpack: "center",
            css: format!("min-height: {}px;", winheight(0.97)),
            children: vec![
                row(vec![NetworkToggle, BluetoothToggle], vec![WifiSelection, BluetoothDevices]),
                BrightnessSlider(),
                NotificationList(),
                dashcal(),
            ],
        },
    }
}

pub fn dashboard() {
    App::add_window(dash());
    layout.connect("changed", || {
        App::remove_window("dashboard");
        App::add_window(dash());
    });
}