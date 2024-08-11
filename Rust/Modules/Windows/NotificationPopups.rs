import std::collections::HashMap;

use crate::Widgets::Notification;
use crate::options;
use crate::Utils::{idle, timeout};
use crate::imports::{Notifications, Service, Widget};

fn animated(id: i32, notifications: &Notifications, transition: &str) -> Widget {
    let n = notifications.get_notification(id).unwrap();
    let widget = Notification(n);

    let inner = Widget::Revealer {
        transition: "slide_up".to_string(),
        transition_duration: options::transition().value,
        child: widget,
    };

    let outer = Widget::Revealer {
        transition: "slide_down".to_string(),
        transition_duration: options::transition().value,
        child: inner,
    };

    let box = Widget::Box {
        hpack: "end".to_string(),
        child: outer,
    };

    idle(|| {
        outer.reveal_child = true;
        timeout(options::transition().value, || {
            inner.reveal_child = true;
        });
    });

    box
}

fn popup_list(notifications: &Notifications, options: &options) -> Widget {
    let mut map: HashMap<i32, Widget> = HashMap::new();
    let box = Widget::Box {
        vertical: true,
        hexpand: true,
        hpack: "fill".to_string(),
        css: options.notifications.width().bind().as(|w| format!("min-width: {}px;", w)),
    };

    fn remove(map: &mut HashMap<i32, Widget>, id: i32) {
        if let Some(w) = map.get(&id) {
            w.dismiss();
            map.remove(&id);
        }
    }

    box.hook(notifications, |_, id| {
        if let Some(id) = id {
            if map.contains_key(&id) {
                remove(&mut map, id);
            }

            if notifications.dnd {
                return;
            }

            let w = animated(id, notifications, "slide_up");
            map.insert(id, w);
            box.children = vec![w, box.children].concat();
        }
    }, "notified")
    .hook(notifications, |_, id| remove(&mut map, id), "dismissed")
    .hook(notifications, |_, id| remove(&mut map, id), "closed");

    box
}

pub fn create_notification_window(monitor: i32) -> Widget {
    Widget::Window {
        monitor,
        name: format!("notifications{}", monitor),
        anchor: options::position().bind(),
        class_name: "notifications".to_string(),
        hexpand: true,
        child: Widget::Box {
            css: "padding: 2px".to_string(),
            child: popup_list(&Notifications::import("notifications"), &options),
        },
    }
}