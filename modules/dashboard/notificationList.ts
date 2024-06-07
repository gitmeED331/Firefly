import { Widget, Notifications, Utils, Gio, Gtk } from "../../imports";

const { Box, Label, Button } = Widget;

function NotificationIcon({ app_entry, app_icon, image }) {
    if (image) {
        return Box({
            css: `background-image: url("${image}");`
                + "background-size: contain;"
                + "background-repeat: no-repeat;"
                + "background-position: center;",
        })
    }

    let icon = "dialog-information-symbolic"
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

    if (app_entry && Utils.lookUpIcon(app_entry))
        icon = app_entry

    return Box({
        child: Widget.Icon(icon),
    })
}

function Notification(n) {
    const icon = Box({
        vpack: "start",
        className: "notiftemIcon",
        child: NotificationIcon(n),
    })

    const title = Label({
        className: "notifItemTitle",
        xalign: 0,
        justification: "left",
        hexpand: true,
        max_width_chars: 24,
        truncate: "end",
        wrap: true,
        label: n.summary,
        use_markup: true,
    })

    const body = Label({
        className: "notifItemBody",
        hexpand: true,
        use_markup: true,
        xalign: 0,
        justification: "left",
        max_width_chars: 24,
        label: n.body.trim(),
        wrap: true,
    })

    const actions = Box({
        className: "actions",
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
            on_primary_click: n.dismiss,
        },
        Box(
            {
                className: `notification ${n.urgency}`,
                vertical: true,
            },
            Box([
                icon,
                Box(
                    { vertical: true },
                    title,
                    body,
                ),
            ]),
            actions,
        ),
    )
}

const Notifs = Box({
    className: "notif",
    spacing: 7,
    vertical: true,
    vexpand: true,
    setup: (self) => {
        self.hook(Notifications, (self) => {
            self.children = Notifications.notifications.map(n => Box({
                className: "notifItem",
                spacing: 20,
                vertical: true,
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
  spacing: 20,
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
