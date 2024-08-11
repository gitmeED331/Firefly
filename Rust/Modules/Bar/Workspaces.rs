use imports::{Utils, Widget, Hyprland, Service, App};
use lib::icons;

let (exec_async, _) = Utils::exec_async;
let (Box, Button, Label, Icon) = Widget::Box, Widget::Button, Widget::Label, Widget::Icon;

let mut hyprland: Option<Hyprland> = None;
Service::import("hyprland").then(|service| {
    hyprland = Some(service);
});

let dispatch = |arg: String| {
    exec_async(format!("hyprctl dispatch workspace {}", arg));
};

pub fn create_workspace() -> Box {
    let workspaces = Box {
        vpack: "center",
        vexpand: true,
        children: (0..10).map(|i| {
            Button {
                cursor: "pointer",
                on_middle_click: || App::toggle_window("overview"),
                on_primary_click: || dispatch(i.to_string()),
                on_secondary_click: || Hyprland::message_async(vec![format!("dispatch movetoworkspacesilent {}", i)]),
                attribute: i,
                child: if let Some(icon) = icons::wsicon.get(&format!("ws{}", i)) {
                    Icon { icon: icon.clone() }
                } else {
                    Label { label: i.to_string() }
                },
                setup: |self| {
                    self.hook(Hyprland, || {
                        self.toggle_class_name("active", Hyprland::active().workspace.id == i);
                        self.toggle_class_name("occupied", (Hyprland::get_workspace(i).windows.unwrap_or(0)) > 0);
                    });
                },
            }
        }).collect(),
        setup: |self| {
            self.hook(Hyprland, || {
                self.children.iter().for_each(|btn| {
                    btn.visible = btn.attribute <= 4 || Hyprland::workspaces().iter().any(|ws| ws.id == btn.attribute);
                });
            });
        },
    };

    Box {
        name: "Workspaces",
        class_name: "workspaces",
        child: workspaces,
    }
}