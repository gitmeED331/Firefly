use lib::utils::range;
use imports::{Hyprland, PopupWindow};
use options;
use Widget;

use crate::Workspace;

fn Overview(ws: i32) -> Box {
    Box {
        className: "ovhorizontal",
        children: if ws > 0 {
            range(ws).map(Workspace).collect()
        } else {
            Hyprland.workspaces
                .iter()
                .map(|ws| Workspace(ws.id))
                .collect::<Vec<_>>()
                .sort_by(|a, b| a.attribute.id.cmp(&b.attribute.id))
        },
        setup: Box::setup(|w| {
            if ws > 0 {
                return;
            }

            w.hook(Hyprland, |w, id: Option<String>| {
                if let Some(id) = id {
                    w.children.retain(|ch| ch.attribute.id != id.parse().unwrap());
                }
            }, "workspace-removed");

            w.hook(Hyprland, |w, id: Option<String>| {
                if let Some(id) = id {
                    w.children = w.children.iter()
                        .chain(std::iter::once(Workspace(id.parse().unwrap())))
                        .collect::<Vec<_>>()
                        .sort_by(|a, b| a.attribute.id.cmp(&b.attribute.id));
                }
            }, "workspace-added");
        }),
    }
}

fn main() {
    PopupWindow {
        name: "overview",
        layout: "center",
        child: options::overview::workspaces.bind().as_ref(Overview),
    };
}