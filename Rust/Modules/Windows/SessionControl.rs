//
//---------------- Session Control Window -------------
//
use imports::{Widget, Utils, PopupWindow, Roundedges, Gdk, Service, App};
use lib::icons;
use options;
use lib::screensizeadjust::winheight;

use std::collections::HashMap;

type Action = String;

struct PowerMenu {
    cmd: String,
}

impl PowerMenu {
    fn new() -> Self {
        PowerMenu {
            cmd: String::new(),
        }
    }

    fn action(&self, action: &str) {
        let pwrmenu = options::pwrmenu();
        let cmd = match action {
            "lock" => pwrmenu.lock.value.clone(),
            "reboot" => pwrmenu.reboot.value.clone(),
            "logout" => pwrmenu.logout.value.clone(),
            "shutdown" => pwrmenu.shutdown.value.clone(),
            _ => String::new(),
        };
        App::close_window("sessioncontrols");
        Utils::exec_async(&cmd);
    }

    fn shutdown(&self) {
        self.action("shutdown");
    }
}

static POWER_MENU: PowerMenu = PowerMenu::new();

fn sys_button(action: &str, label: &str) -> Widget {
    let power_menu = &POWER_MENU;
    Widget::Button(Box::new(move |button| {
        button.on_clicked(Box::new(move || {
            power_menu.action(action);
        }));
        Box::new({
            let mut children = Vec::new();
            children.push(Widget::Icon(icons::powermenu(action)));
            children.push(Widget::Label {
                label: label.to_string(),
                visible: options::pwrmenu().labels.bind(),
            });
            children
        })
    })
}

fn session_controls() -> PopupWindow {
    let pwrmenu = options::pwrmenu();
    PopupWindow {
        name: "sessioncontrols".to_string(),
        class_name: "sessioncontrols".to_string(),
        anchor: ["top".to_string(), "left".to_string(), "right".to_string(), "bottom".to_string()],
        transition: "slide_up".to_string(),
        child: Box::new({
            let mut children = Vec::new();
            children.push(Roundedges::RoundedAngleEnd("bottomleft".to_string(), HashMap::new()));
            children.push(Box::new({
                let mut children = Vec::new();
                children.push(Box::new({
                    let mut children = Vec::new();
                    children.push(sys_button("lock", "Lock"));
                    children.push(sys_button("logout", "Log Out"));
                    children.push(sys_button("reboot", "Reboot"));
                    children.push(sys_button("shutdown", "Shutdown"));
                    children
                }));
                children
            }));
            children.push(Roundedges::RoundedAngleEnd("bottomright".to_string(), HashMap::new()));
            children
        }),
    }
}