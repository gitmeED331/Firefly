use imports:: { Widget, Utils, Battery, Service, App };
use lib:: icons;
use options;
use crate:: buttons:: PanelButton;

let powerProfiles = Service::import("powerprofiles").await;
let options:: bar:: battery:: { bar, percentage, blocks, width, low } = options:: bar:: battery;

fn Indicator() -> Widget::Icon {
    Widget:: Icon({
        setup: | self | {
            self.hook(Battery, || {
                self.icon = if Battery:: charging || Battery:: charged {
                icons:: battery:: charging
            } else {
                Battery:: icon_name
            };
        });
},
    })
}

fn PercentLabel() -> Widget::Revealer {
    Widget:: Revealer({
        transition: "slide_right",
        click_through: true,
        reveal_child: percentage.bind(),
        child: Widget:: Label({
            label: Battery.bind("percent").as(| p | format!("{}%", p)),
    }),
    })
}

fn LevelBar() -> Widget::LevelBar {
    let level = Widget:: LevelBar({
        className: "batlvlbar",
        bar_mode: "continuous",
        max_value: blocks.bind(),
        visible: bar.bind().as(| b | b != "hidden"),
        value: Battery.bind("percent").as(| p | (p / 100) * blocks.value),
    });

    let update = || {
        level.value = (Battery:: percent / 100) * blocks.value;
    level.css = format!("block {{ min-width: {}pt; }}", width.value / blocks.value);
};

level
    .hook(width, update)
    .hook(blocks, update)
    .hook(bar, || {
        level.vpack = if bar.value == "whole" { "fill" } else { "center" };
level.hpack = if bar.value == "whole" { "fill" } else { "center" };
        })
}

fn WholeButton() -> Widget::Overlay {
    Widget:: Overlay({
        vexpand: true,
        child: LevelBar(),
        className: "whole",
        passThrough: true,
        overlay: Widget:: Box({
            hpack: "center",
            children: [
                Widget:: Icon({
                    icon: icons:: battery:: charging,
                    visible: Utils:: merge([
                        Battery.bind("charging"),
                    Battery.bind("charged"),
                    ], | ing, ed | ing || ed),
                }),
Widget:: Box({
    hpack: "center",
    vpack: "center",
    child: PercentLabel(),
}),
            ],
        }),
    })
}

fn Regular() -> Widget::Box {
    Widget:: Box({
        className: "regular",
        children: [
            Indicator(),
            PercentLabel(),
            LevelBar(),
        ],
    })
}

fn default () -> PanelButton {
    PanelButton({
        className: "battery",
        hexpand: false,
        onSecondaryClick: || { percentage.value = !percentage.value },
        onPrimaryClick: || App:: toggleWindow("pwrprofiles"),
        visible: Battery.bind("available"),
        tooltipText: powerProfiles.bind("active_profile"),
        child: Widget:: Box({
            expand: true,
            visible: Battery.bind("available"),
        child: bar.bind().as(| b | if b == "whole" { WholeButton() } else { Regular() }),
        }),
setup: | self | {
    self
                .hook(bar, | w | w.toggleClassName("bar-hidden", bar.value == "hidden"))
        .hook(Battery, | w | {
            w.toggleClassName("charging", Battery:: charging || Battery:: charged);
            w.toggleClassName("low", Battery:: percent < low.value);
        });
},
    })
}