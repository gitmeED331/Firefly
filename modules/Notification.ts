import { type Notification } from "../types/service/notifications"
import icons from "../lib/icons"
import { Utils, Notifications, GLib, Widget } from "../imports"

const {Box, Label} = Widget

const notifications = await Service.import("notifications")
notifications.popupTimeout = 30000;
notifications.forceTimeout = false;
notifications.cacheActions = false;
notifications.clearDelay = 100;

const time = (time: number, format = "%H:%M") => GLib.DateTime
    .new_from_unix_local(time)
    .format(format)

const NotificationIcon = ({ app_entry, app_icon, image }: Notification) => {
    if (image) {
        return Box({
            vpack: "start",
            hexpand: false,
            className: "icon img",
            css: `
                background-image: url("${image}");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 78px;
                min-height: 78px;
            `,
        })
    }

    let icon = icons.fallback.notification
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

    if (Utils.lookUpIcon(app_entry || ""))
        icon = app_entry || ""

    return Box({
        vpack: "start",
        hexpand: false,
        className: "notiftemIcon",
        css: `
            min-width: 78px;
            min-height: 78px;
        `,
        child: Widget.Icon({
            icon,
            size: 58,
            hpack: "center", hexpand: true,
            vpack: "center", vexpand: true,
        }),
    })
}

export default (notification: Notification) => {
    const content = Box({
        className: "content",
        children: [
            NotificationIcon(notification),
            Box({
                hexpand: true,
                vertical: true,
                children: [
                    Box({
                        children: [
                            Label({
                                className: "notifItemTitle",
                                name: "nTitle",
                                xalign: 0,
                                justification: "left",
                                hexpand: true,
                                max_width_chars: 24,
                                truncate: "end",
                                wrap: true,
                                label: notification.summary.trim(),
                                use_markup: true,
                            }),
                            Label({
                                className: "time",
                                vpack: "start",
                                label: time(notification.time),
                            }),
                            Widget.Button({
                                className: "close-button",
                                vpack: "start",
                                child: Widget.Icon("window-close-symbolic"),
                                on_clicked: notification.close,
                            }),
                        ],
                    }),
                    Label({
                        className: "notifItemBody",
                        hexpand: true,
                        use_markup: true,
                        xalign: 0,
                        justification: "left",
                        label: notification.body.trim(),
                        max_width_chars: 24,
                        wrap: true,
                    }),
                ],
            }),
        ],
    })

    const actionsbox = notification.actions.length > 0 ? Widget.Revealer({
        transition: "slide_down",
        child: Widget.EventBox({
            child: Box({
                className: "actions horizontal",
                children: notification.actions.map(action => Widget.Button({
                    className: "action-button",
                    on_clicked: () => notification.invoke(action.id),
                    hexpand: true,
                    child: Label(action.label),
                })),
            }),
        }),
    }) : null

    const eventbox = Widget.EventBox({
        vexpand: false,
        on_primary_click: notification.dismiss,
        on_hover() {
            if (actionsbox)
                actionsbox.reveal_child = true
        },
        on_hover_lost() {
            if (actionsbox)
                actionsbox.reveal_child = true

            notification.dismiss()
        },
        child: Box({
            vertical: true,
            children: actionsbox ? [content, actionsbox] : [content],
        }),
    })

    return Box({
        className: `notification ${notification.urgency}`,
        child: eventbox,
    })
}
