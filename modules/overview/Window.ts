import { type Client } from "types/service/hyprland";
import { createSurfaceFromWidget, icon } from "lib/utils";
import options from "options";
import icons from "lib/icons";
import { Widget, Gtk, Gdk, Hyprland } from "imports";

const { overview } = options

const TARGET = [Gtk.TargetEntry.new("text/plain", Gtk.TargetFlags.SAME_APP, 0)]
const apps = await Service.import("applications")
const dispatch = (args: string) => Hyprland.messageAsync(`dispatch ${args}`)

export default ({ address, size: [w, h], class: c, title }: Client) => Widget.Button({
    className: "client",
    attribute: { address },
    tooltip_text: `${title}`,
    child: Widget.Icon({
        css: options.overview.scale.bind().as(v => `
            min-width: ${(v / 100) * w}px;
            min-height: ${(v / 100) * h}px;
        `),
        icon: overview.monochrome.bind().as(m => {
            const app = apps.list.find(app => app.match(c))
            if (!app)
                return icons.fallback.executable + (m ? "-symbolic" : "")


            return icon(
                app.icon_name + (m ? "-symbolic" : ""),
                icons.fallback.executable + (m ? "-symbolic" : ""),
            )
        }),
    }),
    on_secondary_click: () => dispatch(`closewindow address:${address}`),
    on_clicked: () => {
        dispatch(`focuswindow address:${address}`)
        App.closeWindow("overview")
    },
    setup: btn => btn
        .on("drag-data-get", (_w, _c, data) => data.set_text(address, address.length))
        .on("drag-begin", (_, context) => {
            Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(btn))
            btn.toggleClassName("hidden", true)
        })
        .on("drag-end", () => btn.toggleClassName("hidden", false))
        .drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY),
})

