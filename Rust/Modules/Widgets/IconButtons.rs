use crate::{Widget, Utils, Hyprland, Gtk, App};

//const hyprland = Service::import('hyprland').await;
let execAsync = Utils::exec;
App::addIcons(format!("{}/assets", App::configDir()));
let (Box, Icon, Button, Revealer) = Widget;

pub fn terminal_icon() -> Button {
    Button {
        className: String::from("quickaccessicon"),
        tooltip_text: String::from("Terminal"),
        child: Icon {
            icon: String::from("terminator"),
        },
        on_clicked: || {
            Hyprland::message_async(String::from("dispatch exec konsole"));
            App::close_window(String::from("dashboard"));
        },
    }
}

pub fn kontact_icon() -> Button {
    Button {
        className: String::from("quickaccessicon"),
        tooltip_text: String::from("eMail"),
        child: Icon {
            icon: String::from("kube-mail"),
        },
        on_clicked: || {
            Hyprland::message_async(String::from("dispatch exec kontact"));
            App::close_window(String::from("dashboard"));
        },
    }
}

pub fn vpn_icon(item: T) -> Button {
    Button {
        className: String::from("quickaccessicon"),
        tooltip_text: String::from("WireGuard VPN"),
        child: Icon {
            icon: String::from("preferences-system-network-vpn"),
        },
        on_clicked: || {
            Hyprland::message_async(String::from("dispatch exec wireguird"));
            App::close_window(String::from("dashboard"));
        },
    }
}

pub fn enpass() -> Button {
    Button {
        className: String::from("quickaccessicon"),
        tooltip_text: String::from("Enpass"),
        child: Icon {
            icon: String::from("enpass"),
        },
        on_clicked: || {
            Hyprland::message_async(String::from("dispatch exec enpass"));
            App::close_window(String::from("dashboard"));
        },
    }
}