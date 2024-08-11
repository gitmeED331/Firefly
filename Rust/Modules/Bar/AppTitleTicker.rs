use imports::{Widget, Hyprland, Utils};
use lib::utils::icon;
use std::process::Command;

pub struct Title;

impl Title {
    pub fn create() -> Widget {
        let exec_async = Utils::exec_async;
        let button = Widget::Button {
            class_name: "wintitle".to_string(),
            visible: Hyprland::active().client().bind("title").transform(|title| title.len() > 0),
            child: Widget::Box {
                spacing: 5,
                children: vec![
                    Widget::Icon {
                        vpack: "center".to_string(),
                        icon: Hyprland::active().client().bind("class").as_(icon()),
                    },
                    Widget::Label {
                        vpack: "center".to_string(),
                        label: Hyprland::active().client().bind("title"),
                        truncate: "end".to_string(),
                    },
                ],
            },
            on_secondary_click: Box::new(|| {
                let _ = Command::new("bash")
                    .arg("-c")
                    .arg("hyprctl dispatch killactive")
                    .spawn();
            }),
            on_primary_click: Box::new(|| {
                App::toggle_window("overview");
            }),
        };
        button
    }
}

