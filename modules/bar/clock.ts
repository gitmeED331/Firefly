
import { Widget, Utils } from "../../imports";
import { CalendarWin } from "./calendar"
const { Box, Button } = Widget;
const { execAsync } = Utils;

export const Clock = () => Button({
    className: "clock",
    onClicked: () => App.toggleWindow("calendar"),
    setup: (self) => {
        self.poll(1000, (self) =>
            execAsync(["date", "+%a %b %d %H:%M"])
                .then((time) => (self.label = time))
                .catch(console.error),
        );
    },
});

/*
import { Widget, Utils, Gtk } from "../../imports";
//import { CalendarWin } from "./calendar";l
import { Menu } from "./ToggleButton";

const { Box, Button, Calendar, Revealer, Label } = Widget;
const { execAsync } = Utils;

export const Clock = () => Button({
	className: "clock", 
	setup: (self) => {
		self.poll(1000, (self) => execAsync(["date", "+%a %b %d %H:%M"])
			.then((time) => (self.label = time))
			.catch(console.error),
		)
	},
	onClicked: () => Widget.Menu({
		children: [ Widget.MenuItem({
			child: Calendar({
				className: "calwid",
				hexpand: false,
				vexpand: true,
				hpack: "center",
				vpack: "center",
			})
			
		}) ]
	})
})
*/
