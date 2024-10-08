import { type TrayItem } from "types/service/systemtray"
import PanelButton from "../buttons/PanelButton"
import options from "options"
import { Widget, SystemTray, Gdk, App } from "imports"
import { icon } from "lib/icons"

const { ignore, stitem } = options.bar.systray
const { Revealer, Icon } = Widget

type alwaysShow = "KeepassXC" | "ente_auth" | "org.cryptomator.Cryptomator"

const SysTrayItem = (item: TrayItem) => PanelButton({
    className: "systrayitem",
    child: Icon({ size: 15, icon: item.bind("icon") }),
    tooltipMarkup: item.bind("tooltip_markup"),
    setup: self => {
        const { menu } = item
        if (!menu)
            return

        const id = menu.connect("popped-up", () => {
            self.toggleClassName("active")
            menu.connect("notify::visible", () => {
                self.toggleClassName("active", menu.visible)
            })
            menu.disconnect(id!)
        })

        self.connect("destroy", () => menu.disconnect(id))
    },

    onPrimaryClick: btn => item.menu?.popup_at_widget(
        btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),

    onSecondaryClick: btn => item.menu?.popup_at_widget(
        btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
})

export const Expandbtn = () => PanelButton({
    className: 'BarBTN',
    hexpand: false,
    onPrimaryClick: () => App.toggleWindow("launcher"),
    onSecondaryClick: () => { stitem.value = !stitem.value },
    child:
        Icon({
            icon: 'hyprland-symbolic'
        }),
})

export const TrayReveal = () => Revealer({
    transition: "slide_right",
    clickThrough: false,
    revealChild: stitem.bind(),
    child: Widget.Box({ className: "tray", })
        .bind("children", SystemTray, "items", i => i
            .filter(({ id }) => !ignore.value.includes(id))
            .map(SysTrayItem)),
})
