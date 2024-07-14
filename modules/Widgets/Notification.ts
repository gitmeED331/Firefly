import { Utils, Notifications, GLib, Widget, App } from "imports";
import { type Notification } from "types/service/notifications";
import icons from "lib/icons";

const { Box, Label, Button, Icon } = Widget;

//const notifications = await Service.import("notifications");
Notifications.popupTimeout = 30000;
Notifications.forceTimeout = false;
Notifications.cacheActions = false;
Notifications.clearDelay = 1000;

const time = (time: number, format = "%H:%M") =>
  GLib.DateTime.new_from_unix_local(time).format(format);

const NotificationIcon = ({ app_entry, app_icon, image }: Notification) => {
  if (image) {
    return Box({
      hexpand: false,
      className: "icon img",
      css: `
                background-image: url("${image}");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 5rem;
                min-height: 5rem;
            `,
    });
  }

  let icon = icons.fallback.notification;
  if (Utils.lookUpIcon(app_icon)) icon = app_icon;

  if (Utils.lookUpIcon(app_entry || "")) icon = app_entry || "";

  return Box({
    vpack: "center",
    hexpand: false,
    className: "notiftemIcon",
    css: `
            min-width: 20px;
            min-height: 20px;
        `,
    child: Widget.Icon({
      icon,
      size: 58,
      hpack: "center",
      hexpand: true,
      vpack: "center",
      vexpand: true,
    }),
  });
};

export default (notification: Notification) => {
  const content = Box({
    className: "content",
    vpack: "center",
    hpack: "fill",
    children: [
      NotificationIcon(notification),
      Box({
        vertical: true,
        hpack: "fill",
        children: [
          Box({
            spacing: 5,
            vertical: false,
            hexpand: true,
            children: [
              Label({
                className: "notifItemTitle",
                name: "nTitle",
                xalign: 0,
                justification: "left",
                lines: 2,
                maxWidthChars: 35,
                truncate: "end",
                wrap: true,
                use_markup: true,
                hexpand: true,
                vpack: "center",
                hpack: "start",
                label: notification.summary.trim(),
              }),
              Label({
                className: "time",
                hpack: "end",
                vpack: "center",
                label: time(notification.time),
              }),
              Button({
                className: "close-button",
                hpack: "end",
                vpack: "center",
                child: Icon("window-close-symbolic"),
                on_clicked: notification.close,
              }),
            ],
          }),
          Label({
            className: "notifItemBody",
            hexpand: false,
            hpack: "start",
            use_markup: true,
            xalign: 0,
            justification: "left",
            label: notification.body.trim(),
            maxWidthChars: 50,
            lines: 3,
            truncate: "end",
            wrap: true,
          }),
        ],
      }),
    ],
  });

  const actionsbox =
    notification.actions.length > 0
      ? Widget.Revealer({
        transition: "slide_down",
        child: Widget.EventBox({
          child: Box({
            className: "actions horizontal",
            children: notification.actions.map((action) =>
              Button({
                className: "action-button",
                on_clicked: () => notification.invoke(action.id),
                hexpand: true,
                child: Label(action.label),
              }),
            ),
          }),
        }),
      })
      : null;

  const eventbox = Widget.EventBox({
    vexpand: false,
    hexpand: true,
    hpack: "start",
    on_primary_click: notification.dismiss,
    on_hover() {
      if (actionsbox) actionsbox.reveal_child = true;
    },
    on_hover_lost() {
      if (actionsbox) actionsbox.reveal_child = true;

      notification.dismiss();
    },
    child: Box({
      vertical: true,
      children: actionsbox ? [content, actionsbox] : [content],
    }),
  });

  return Box({
    className: `notification ${notification.urgency}`,
    child: eventbox,
  });
};
