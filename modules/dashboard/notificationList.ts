import { Widget, Notifications, Utils, Gio, Gtk, GLib } from "../../imports";
import icons from "../../lib/icons"
import Notification from "./Notification"

const { Box, Label, Button, Icon } = Widget;

const time = (time: number, format = "%H:%M") => GLib.DateTime
.new_from_unix_local(time)
.format(format)

const NotificationIcon = ({ app_entry, app_icon, image }: Notification) => {
    if (image) {
        return Box({
            hexpand: false,
            vexpand: false,
            className: "icon img",
            css: `
            background-image: url("${image}");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            min-width: 5rem;
            min-height: 5rem;
            `,
        })
    }

    let icon = icons.fallback.notification
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

        if (Utils.lookUpIcon(app_entry || ""))
            icon = app_entry || ""

            return Box({
                vpack: "center",
                hexpand: false,
                className: "notiftemIcon",
                css: `
                min-width: 20px;
                min-height: 20px;
                `,
                child: Icon({
                    icon,
                    size: 58,
                    hpack: "center", hexpand: true,
                    vpack: "center", vexpand: true,
                }),
            })
}

function Notification(n) {
    const title = Label({
        className: "notifItemTitle",
        xalign: 0,
        justification: "left",
        hexpand: true,
        maxWidthChars: 30,
        lines: 2,
        truncate: "end",
        wrap: true,
        label: n.summary,
        use_markup: true,
        vpack: "center",
        hpack: "start"
    })

    const time = (time: number, format = "%H:%M") => GLib.DateTime
        .new_from_unix_local(time)
        .format(format)
    const ntime = Label({
        className: "time",
        vpack: "center",
        hpack: "end",
        label: time(n.time),
    })

    const body = Label({
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
    })

    const actions = Box({
        className: "actions",
        vpack: "center",
        children: n.actions.map(({ id, label }) => Button({
            class_name: "action-button",
            on_clicked: () => {
                n.invoke(id)
                n.dismiss()
            },
            hexpand: true,
            child: Label(label),
        })),
    })

    return Widget.EventBox(
        {
            attribute: { id: n.id },
            onPrimaryClick: n.dismiss,
        },
        Box(
            {
            className: `notification ${n.urgency}`,
            vertical: false,
            vpack: "start",
            spacing: 5,
            },
            NotificationIcon(n),
            Box(
                { vertical: true, className:"notifDetails" },
                Box(
                    {vertical: false, spacing: 5,},
                    title,
                    ntime,
                ),
                body,
                actions,
            ),
        ),
    )
}

const Notifs = Box({
    className: "notif",
    spacing: 7,
    vertical: true,
    vexpand: true,
    vpack: "start",
    setup: (self) => {
        self.hook(Notifications, (self) => {
            self.children = Notifications.notifications.map(n => Box({
                className: "notifItem",
                spacing: 10,
                vertical: true,
                vpack: "start",
                children: [
                    Button({
                        on_clicked: () => {
                            n.close()
                        },
                        child: Notification(n),
                    })
                ]
            }))
        })
    }
})


const NotifBox = Widget.Scrollable({
    vscroll: 'always',
    hscroll: 'never',
    vexpand: true,
    className: 'notificationBox',
    child: Notifs,
})

const Empty = Box({
    class_name: "notifEmpty",
    hpack: "center",
    vpack: "center",
    vertical: true,
    children: [
        Widget.Label({
            label: `󱙎 `,
            vpack: "center",
            vexpand: true,
        })
    ]
})

export const NotificationList = () => Box({
    class_name: "notifpanel",
    spacing: 20,
    vertical: true,
    vexpand: true,
    children: [
        Widget.CenterBox({
            className: 'notifpanelBox',
            start_widget: Label({
                className: "notifpanelBoxTitle",
                label: "Notifications",
                vpack: 'end',
                hpack: 'end',
            }),
            end_widget: Button({
                label: "  ",
                hpack: 'center',
                vpack: 'end',
                className: "notifpanelBoxIcon",
                on_clicked: () => {
                    const list = Array.from(Notifications.notifications);
                    for (let i = 0; i < list.length; i++) {
                        Utils.timeout(50 * i, () => list[i]?.close());
                    }
                }
            })
        }),
        Widget.Stack({
            transition: 'crossfade',
            transitionDuration: 150,
            children: {
                'empty': Empty,
                'list': NotifBox
            },
            setup: (self) => {
                self.hook(Notifications, (self) => {
                    self.shown = (Notifications.notifications.length == 0 ? 'empty' : 'list')
                })
            }
        }),
    ],
})
