import { Widget, PopupWindow } from "imports"
import { GridCalendar } from "../Widgets/index"

const { Box, Label, Button, Icon } = Widget

export default () => PopupWindow({
    name: "calendar",
    className: "calpopwin",
    anchor: ["top"],
    transition: "slide_down",
    layer: "top",
    exclusivity: "normal",
    keymode: "on-demand",
    child: Box({
        className: "calendarbox",
        child: GridCalendar(),
    }),
})