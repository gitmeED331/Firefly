import { Widget, Utils } from "../../imports";
import { Calendar } from "./calendar"

const { execAsync } = Utils;

export const Clock = () => Widget.Button({
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
