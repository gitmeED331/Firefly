use imports::Widget;
use crate::service::brightness;

fn b_slider() -> Widget {
    Slider {
        class_name: "brightsld Slider",
        draw_value: false,
        on_change: |self| brightness::screen_value = self.value,
        value: brightness::bind("screen-value").map(|n| if n > 1 { 1 } else { n }),
    }
}

fn icon() -> Widget {
    Label {
        class_name: "brightsldIcon",
        setup: |self| {
            self.hook(brightness, |self, screen_value| {
                let icons = ["󰃚", "󰃛", "󰃜", "󰃝", "󰃞", "󰃟", "󰃠"];
                self.label = format!("{}", icons[((brightness::screen_value * 100) / 15) as usize]);
            }, "screen-changed");
        },
    }
}

pub fn brightness_slider() -> Widget {
    Box {
        class_name: "brightSlider",
        vertical: true,
        hpack: "center",
        vpack: "center",
        children: vec![
            Label {
                class_name: "brightsldLabel",
                label: "Brightness",
                hpack: "center",
            },
            Box {
                hpack: "center",
                vpack: "center",
                children: vec![
                    icon(),
                    b_slider(),
                ],
            },
        ],
    }
}