use imports::{Utils, Notifications, GLib, Widget, App};
use types::service::notifications::Notification;
use lib::icons;

use Widget::{Box, Label, Button, Icon};

Notifications::popup_timeout = 30000;
Notifications::force_timeout = false;
Notifications::cache_actions = false;
Notifications::clear_delay = 1000;

fn time(time: i64, format: &str) -> String {
    GLib::DateTime::new_from_unix_local(time).format(format)
}

fn notification_icon(notification: &Notification) -> Box {
    if let Some(image) = notification.image {
        return Box {
            hexpand: false,
            class_name: "icon img",
            css: format!(
                r#"
                background-image: url("{}");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 5rem;
                min-height: 5rem;
            "#,
                image
            ),
        };
    }

    let mut icon = icons::fallback::notification;
    if let Some(app_icon) = notification.app_icon {
        if Utils::look_up_icon(app_icon) {
            icon = app_icon;
        }
    }

    if let Some(app_entry) = notification.app_entry {
        if Utils::look_up_icon(&app_entry) {
            icon = app_entry;
        }
    }

    Box {
        vpack: "center",
        hexpand: false,
        class_name: "notiftemIcon",
        css: r#"
            min-width: 20px;
            min-height: 20px;
        "#,
        child: Widget::Icon {
            icon,
            size: 58,
            hpack: "center",
            hexpand: true,
            vpack: "center",
            vexpand: true,
        },
    }
}

fn create_notification(notification: Notification) -> Box {
    let content = Box {
        class_name: "content",
        vpack: "center",
        hpack: "fill",
        children: vec![
            notification_icon(&notification),
            Box {
                vertical: true,
                hpack: "fill",
                children: vec![
                    Box {
                        spacing: 5,
                        vertical: false,
                        hexpand: true,
                        children: vec![
                            Label {
                                class_name: "notifItemTitle",
                                name: "nTitle",
                                xalign: 0,
                                justification: "left",
                                lines: 2,
                                max_width_chars: 35,
                                truncate: "end",
                                wrap: true,
                                use_markup: true,
                                hexpand: true,
                                vpack: "center",
                                hpack: "start",
                                label: notification.summary.trim(),
                            },
                            Label {
                                class_name: "time",
                                hpack: "end",
                                vpack: "center",
                                label: time(notification.time, "%H:%M"),
                            },
                            Button {
                                class_name: "close-button",
                                hpack: "end",
                                vpack: "center",
                                child: Icon("window-close-symbolic"),
                                on_clicked: notification.close,
                            },
                        ],
                    },
                    Label {
                        class_name: "notifItemBody",
                        hexpand: false,
                        hpack: "start",
                        use_markup: true,
                        xalign: 0,
                        justification: "left",
                        label: notification.body.trim(),
                        max_width_chars: 50,
                        lines: 3,
                        truncate: "end",
                        wrap: true,
                    },
                ],
            },
        ],
    };

    let actions_box = if !notification.actions.is_empty() {
        Widget::Revealer {
            transition: "slide_down",
            child: Widget::EventBox {
                child: Box {
                    class_name: "actions horizontal",
                    children: notification.actions.iter().map(|action| {
                        Button {
                            class_name: "action-button",
                            on_clicked: || notification.invoke(action.id),
                            hexpand: true,
                            child: Label(action.label.clone()),
                        }
                    }).collect(),
                },
            },
        }
    } else {
        None
    };

    let event_box = Widget::EventBox {
        vexpand: false,
        hexpand: true,
        hpack: "start",
        on_primary_click: notification.dismiss,
        on_hover: || {
            if let Some(actions_box) = &actions_box {
                actions_box.reveal_child = true;
            }
        },
        on_hover_lost: || {
            if let Some(actions_box) = &actions_box {
                actions_box.reveal_child = true;
            }
            notification.dismiss();
        },
        child: Box {
            vertical: true,
            children: if let Some(actions_box) = actions_box {
                vec![content, actions_box]
            } else {
                vec![content]
            },
        },
    };

    Box {
        class_name: format!("notification {}", notification.urgency),
        child: event_box,
    }
}