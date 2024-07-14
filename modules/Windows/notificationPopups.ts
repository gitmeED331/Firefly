import { Notification } from "../Widgets/index"
import options from "options"
import { Utils, Notifications, Widget, Service } from "imports"

const notifications = await Service.import("notifications")
const { transition } = options
const { position } = options.notifications
const { timeout, idle } = Utils
const { Box, Label } = Widget

function Animated(id: number) {
    const n = notifications.getNotification(id)!
    const widget = Notification(n)

    const inner = Widget.Revealer({
        transition: "slide_up",
        transition_duration: transition.value,
        child: widget,
    })

    const outer = Widget.Revealer({
        transition: "slide_down",
        transition_duration: transition.value,
        child: inner,
    })

    const box = Box({
        hpack: "end",
        child: outer,
    })

    idle(() => {
        outer.reveal_child = true
        timeout(transition.value, () => {
            inner.reveal_child = true
        })
    })

    return Object.assign(box, {
        dismiss() {
            inner.reveal_child = false
            timeout(transition.value, () => {
                outer.reveal_child = false
                timeout(300, () => {
                    box.destroy()
                })
            })
        },
    })
}

function PopupList() {
    const map: Map<number, ReturnType<typeof Animated>> = new Map
    const box = Box({
        vertical: true,
        hexpand: true,
        hpack: "fill",
        css: options.notifications.width.bind().as(w => `min-width: ${w}px;`),
    })

    function remove(_: unknown, id: number) {
        map.get(id)?.dismiss()
        map.delete(id)
    }

    return box
        .hook(notifications, (_, id: number) => {
            if (id !== undefined) {
                if (map.has(id))
                    remove(null, id)

                if (notifications.dnd)
                    return

                const w = Animated(id)
                map.set(id, w)
                box.children = [w, ...box.children]
            }
        }, "notified")
        .hook(notifications, remove, "dismissed")
        .hook(notifications, remove, "closed")
}

export default (monitor: number) => Widget.Window({
    monitor,
    name: `notifications${monitor}`,
    anchor: position.bind(),
    className: "notifications",
    hexpand: true,
    child: Box({
        css: "padding: 2px",
        child: PopupList(),
    }),
})
