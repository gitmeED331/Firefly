use imports::{Widget, Notifications, Utils, Gio, Gtk, GLib};
use lib::icons;
use crate::Notification;

use Widget::{Box, Label, Button, Icon};
use GLib::DateTime;

fn time(time: i64, format: &str) -> String {
    DateTime::new_from_unix_local(time)
        .format(format)
}

fn notification_icon(app_entry: &str, app_icon: &str, image: &str) -> Box {
    if !image.is_empty() {
        return Box {
            hexpand: false,
            vexpand: false,
            className: "icon img",
            css: format!(
                r#"
                background-image: url("{}");
                background-size: contain;
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
    if let Some(lookup_icon) = Utils::look_up_icon(app_icon) {
        icon = lookup_icon;
    }

    if let Some(lookup_icon) = Utils::look_up_icon(app_entry) {
        icon = lookup_icon;
    }

    Box {
        vpack: "center",
        hexpand: false,
        className: "notiftemIcon",
        css: r#"
            min-width: 20px;
            min-height: 20px;
        "#,
        child: Icon {
            icon,
            size: 58,
            hpack: "center",
            hexpand: true,
            vpack: "center",
            vexpand: true,
        },
    }
}

fn create_notification(n: Notification) -> Widget {
    let title = Label {
        className: "notifItemTitle",
        xalign: 0,
        justification: "left",
        hexpand: true,
        maxWidthChars: 45,
        lines: 2,
        truncate: "end",
        wrap: true,
        label: n.summary,
        use_markup: true,
        vpack: "fill",
        hpack: "fill",
    };

    let ntime = Label {
        className: "time",
        vpack: "center",
        hpack: "end",
        label: time(n.time),
    };

    let body = Label {
        className: "notifItemBody",
        hexpand: true,
        vexpand: true,
        use_markup: true,
        xalign: 0,
        justification: "left",
        lines: 3,
        maxWidthChars: 45,
        truncate: "end",
        label: n.body.trim(),
        wrap: true,
        vpack: "center",
        hpack: "fill",
    };

    let actions = Box {
        className: "actions",
        vpack: "center",
        children: n.actions.iter().map(|action| {
            Button {
                class_name: "action-button",
                on_clicked: {
                    n.invoke(action.id);
                    n.dismiss();
                },
                hexpand: true,
                child: Label(action.label),
            }
        }).collect(),
    };

    Widget::EventBox(
        {
            attribute: { id: n.id },
            onPrimaryClick: n.dismiss,
        },
        Box {
            className: format!("notification {}", n.urgency),
            vertical: false,
            vpack: "start",
            spacing: 5,
        },
        notification_icon(n.app_entry, n.app_icon, n.image),
        Box {
            vertical: true,
            className: "notifDetails",
        },
        Box {
            vertical: false,
            spacing: 5,
        },
        title,
        ntime,
        body,
        actions,
    )
}

fn create_notifs() -> Box {
    Box {
        className: "notif",
        spacing: 7,
        vertical: true,
        vexpand: true,
        vpack: "start",
        hpack: "fill",
        setup: |self| {
            self.hook(Notifications, |self| {
                self.children = Notifications::notifications().iter().map(|n| {
                    Box {
                        className: "notifItem",
                        spacing: 10,
                        vertical: true,
                        vpack: "start",
                        hpack: "fill",
                        hexpand: true,
                        children: vec![
                            Button {
                                on_clicked: || n.close(),
                                child: create_notification(n),
                            }
                        ],
                    }
                }).collect();
            });
        },
    }
}

fn create_notif_box() -> Widget {
    Widget::Scrollable {
        vscroll: 'always',
        hscroll: 'never',
        vexpand: true,
        className: 'notificationBox',
        child: create_notifs(),
    }
}

fn create_empty() -> Box {
    Box {
        class_name: "notifEmpty",
        hpack: "center",
        vpack: "center",
        vertical: true,
        children: vec![
            Label {
                label: "󱙎 ",
                vpack: "center",
                hpack: "center",
                vexpand: true,
            }
        ],
    }
}

pub fn create_notification_list() -> Box {
    Box {
        class_name: "notifpanel",
        vertical: true,
        vexpand: true,
        children: vec![
            Widget::CenterBox {
                className: "notifpanelBox",
                spacing: 20,
                start_widget: Label {
                    label: "Notifications",
                    vpack: 'end',
                },
                end_widget: Button {
                    hpack: 'center',
                    vpack: 'center',
                    on_clicked: || {
                        let list = Notifications::notifications().to_vec();
                        for (i, notification) in list.iter().enumerate() {
                            Utils::timeout(50 * i as u32, || notification.close());
                        }
                    },
                    child: Widget::Stack {
                        transition: 'crossfade',
                        transitionDuration: 150,
                        children: {
                            'empty': Icon { icon: icons::trash::empty, size: 18 },
                            'full': Icon { icon: icons::trash::full, size: 18 },
                        },
                        setup: |self| {
                            self.hook(Notifications, |self| {
                                self.shown = if Notifications::notifications().is_empty() { 'empty' } else { 'full' };
                            });
                        },
                    },
                },
            },
            Widget::Stack {
                transition: 'crossfade',
                hpack: "fill",
                transitionDuration: 150,
                children: {
                    'empty': create_empty(),
                    'list': create_notif_box(),
                },
                setup: |self| {
                    self.hook(Notifications, |self| {
                        self.shown = if Notifications::notifications().is_empty() { 'empty' } else { 'list' };
                    });
                },
            },
        ],
    }
}