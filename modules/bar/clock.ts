import { Widget, Utils } from "imports";
import { Calendar } from "../Windows/index"

const { Button } = Widget;
const { execAsync } = Utils;

export const Clock = () =>
  Button({
    className: "clock",
    onClicked: () => {
      if (!App.getWindow("calendar")) {
        App.addWindow(Calendar());
      } else {
        App.toggleWindow("calendar");
      }
    },
    setup: (self) => {
      self.poll(1000, (self) =>
        execAsync(["date", "+%a %b %d %H:%M"])
          .then((time) => (self.label = time))
      );
    },
  });
