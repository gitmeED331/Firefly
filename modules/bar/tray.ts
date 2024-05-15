import { type TrayItem } from "../../types/service/systemtray"
import PanelButton from "./PanelButton"
import options from "../../options"
import { Widget, SystemTray, Gdk } from "../../imports";
import { icon } from "../../lib/utils";
import icons from "../../lib/icons";

const systemtray = await Service.import("systemtray")
const { ignore, include, stitem } = options.bar.systray
const { Label, Revealer, Button, Box } = Widget

const SysTrayItem = (item: TrayItem) => PanelButton({
    className: "systrayitem",
    child: Widget.Icon({ icon: item.bind("icon") }),
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

export const Expandbtn = () => PanelButton ({
	className: 'expandbtn',
	hexpand: false,
	onPrimaryClick: () => { stitem.value = !stitem.value },
	child: 
		Label({
			label: ' ',
		}),
})

export const TrayReveal = () => Revealer({
    transition: "slide_right",
    clickThrough: false,
    revealChild: stitem.bind(),
    child: Widget.Box({className: "tray",})
		.bind("children", systemtray, "items", i => i
			.filter(({ id }) => !ignore.value.includes(id))
			.map(SysTrayItem)),
})

/*
export default () => Widget.Box({className: "tray",})
    .bind("children", systemtray, "items", i => i
        .filter(({ id }) => !ignore.value.includes(id))
        .map(SysTrayItem))
*/

/*
import { Widget, SystemTray, Gdk } from "../../imports";
import { icon } from "../../lib/utils";
import icons from "../../lib/icons";

const { Box, Button } = Widget;
*/

/*
 * @param {import('types/service/systemtray').TrayItem} item
 */
/*
const SysTrayItem = item => Button({
  class_name: "systrayitem",
  child: Widget.Icon({
    hpack: "center",
    icon: item.bind("icon")
  }),
  tooltip_markup: item.bind("tooltip_markup"),
  on_clicked: btn => item.menu?.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
  on_secondary_click: btn => item.menu?.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
});

const Tray = () => Box({
  className: "tray",
  attribute: {
    "items": new Map(),
  */
    /*
    * @param {import('types/widgets/box').default} box
    * @param {string} id
    */
    /*"onAdded": (box, id) => {
      const item = SystemTray.getItem(id);
      if (!item) return;
      // @ts-ignore
      if (item.menu) item.menu.class_name = "menu";
      if (box.attribute.items.has(id) || !item)
        return;
      const widget = SysTrayItem(item);
      box.attribute.items.set(id, widget);
      box.pack_start(widget, false, false, 0);
      box.show_all();
    },
    /**
    * @param {import('types/widgets/box').default} box
    * @param {string} id
    */
    
/*
    "onRemoved": (box, id) => {
      if (!box.attribute.items.has(id))
        return;
      box.attribute.items.get(id).destroy();
      box.attribute.items.delete(id);
    }
  },
})
  .hook(SystemTray, (box, id) => box.attribute.onAdded(box, id), "added")
  .hook(SystemTray, (box, id) => box.attribute.onRemoved(box, id), "removed");

export default Tray;
*/
