import { Gdk, Widget, Utils, App, Variable, GLib } from "imports";
import { Calendar } from "../Windows/index"

const { Button, Label } = Widget;

const time = Variable(GLib.DateTime.new_now_local(), {
  poll: [1000, () => GLib.DateTime.new_now_local()],
})

export const Clock = () =>
  Button({
    className: "clock",
    onClicked: () => App.toggleWindow("calendar"),
    child: Label({
      label: time.bind().as(c => c.format("%a %b %d %H:%M.%S")),
    }),
  });
