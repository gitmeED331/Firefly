use imports::{Widget, Utils, Service};
use types::service::bluetooth::BluetoothDevice;
use buttons::{Menu, ArrowToggleButton};
use lib::icons;

let bluetooth = Service::import("bluetooth").await;

pub fn bluetooth_toggle() -> ArrowToggleButton {
    ArrowToggleButton {
        name: "bluetooth",
        icon: bluetooth.bind("enabled").map(|p| icons::bluetooth[if p { "enabled" } else { "disabled" }]),
        label: Utils::watch("Disabled", bluetooth, || {
            if !bluetooth.enabled {
                return "Disabled".to_string();
            }

            if bluetooth.connected_devices.len() == 1 {
                return bluetooth.connected_devices[0].alias.clone();
            }

            return format!("{} Connected", bluetooth.connected_devices.len());
        }),
        connection: [bluetooth, || bluetooth.enabled],
        deactivate: || bluetooth.enabled = false,
        activate: || bluetooth.enabled = true,
    }
}

fn device_item(device: BluetoothDevice) -> Widget {
    Widget::Box {
        spacing: 10,
        children: vec![
            Widget::Icon(format!("{}-symbolic", device.icon_name)),
            Widget::Label(device.name.clone()),
            Widget::Label {
                label: format!("{}%", device.battery_percentage),
                visible: device.bind("battery_percentage").map(|p| p > 0),
            },
            Widget::Box { hexpand: true },
            Widget::Spinner {
                active: device.bind("connecting"),
                visible: device.bind("connecting"),
            },
            Widget::Switch {
                active: device.connected,
                visible: device.bind("connecting").map(|p| !p),
                setup: |self| {
                    self.on("notify::active", || {
                        device.set_connection(self.active);
                    });
                },
            },
        ],
    }
}

pub fn bluetooth_devices() -> Menu {
    Menu {
        name: "bluetooth",
        icon: icons::bluetooth["enabled"],
        title: "Bluetooth",
        content: vec![
            Widget::Box {
                class_name: "bluetooth-devices",
                hexpand: true,
                vertical: true,
                children: bluetooth.bind("devices").map(|ds| {
                    ds.into_iter()
                        .filter(|d| d.name.is_some())
                        .map(device_item)
                        .collect()
                }),
            },
        ],
    }
}