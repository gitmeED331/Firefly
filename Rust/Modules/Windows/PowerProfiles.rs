//
// ---------- Power Profiles Window --------
//
use imports::{Widget, Service, Utils, PopupWindow};
use lib::icons;
use options;
use crate::service::brightness;

use std::collections::HashMap;

type Action = String;

struct Profiles {
    cmd: String,
    lightcmd: String,
}

impl Profiles {
    fn new() -> Self {
        Self {
            cmd: String::new(),
            lightcmd: String::new(),
        }
    }

    fn action(&mut self, action: &str) {
        let profiles = HashMap::new();
        profiles.insert("power-saver", [
            pwrprof.profile.powerSaver.value,
            pwrprof.light.powerSaver.value,
        ]);
        profiles.insert("balanced", [
            pwrprof.profile.balanced.value,
            pwrprof.light.balanced.value,
        ]);
        profiles.insert("performance", [
            pwrprof.profile.performance.value,
            pwrprof.light.performance.value,
        ]);

        if let Some(values) = profiles.get(action) {
            self.cmd = values[0].to_string();
            self.lightcmd = values[1].to_string();
        }
    }
}

let profiles = Profiles::new();

fn sys_button(action: &str, label: &str) -> Button {
    Button::new()
        .on_clicked(|| {
            profiles.action(action);
            powerProfiles.active_profile = profiles.cmd.clone();
            Utils::exec_async(profiles.lightcmd.clone());
        })
        .class_name(powerProfiles.bind("active_profile").as(|c| if c == action { c } else { "" }))
        .child(
            Box::new()
                .vertical(true)
                .children(vec![
                    Icon::new(icons::powerprofile(action)),
                    Label::new()
                        .label(label)
                        .visible(pwrprof.labels.bind()),
                ]),
        )
}

fn power_profiles_window() -> PopupWindow {
    PopupWindow::new()
        .name("pwrprofiles")
        .transition("crossfade")
        .layer("overlay")
        .anchor(options.pwrprof.position.value)
        .exclusivity("normal")
        .keymode("on-demand")
        .margins([0, 535])
        .child(
            Box::new()
                .vertical(true)
                .hpack("center")
                .vpack("center")
                .children(vec![
                    Box::new()
                        .vertical(false)
                        .hpack("center")
                        .vpack("center")
                        .spacing(20)
                        .children(vec![
                            Label::new()
                                .use_markup(true)
                                .hpack("center")
                                .vpack("center")
                                .label(powerProfiles.bind('active_profile').transform(|l| l.to_uppercase())),
                            Label::new()
                                .vpack("center")
                                .css("padding-bottom: 5px;")
                                .setup(|self| {
                                    self.hook(brightness::Brightness, |self, screen_value| {
                                        let icons = ["󰃚", "󰃛", "󰃜", "󰃝", "󰃞", "󰃟", "󰃠"];
                                        self.label = icons[(brightness::Brightness.screen_value * 100 / 15) as usize].to_string();
                                    }, 'screen-changed');
                                }),
                            Label::new()
                                .vpack("center")
                                .label(brightness::Brightness.bind("screen-value").as(|v| format!("{}%", (v * 100) as i32))),
                        ]),
                    Box::new()
                        .class_name("pwrprofile-box")
                        .vertical(false)
                        .vexpand(false)
                        .hexpand(false)
                        .vpack("center")
                        .hpack("center")
                        .setup(|self| {
                            self.hook(pwrprof.layout, || {
                                self.toggle_class_name("box", pwrprof.layout.value == "box");
                                self.toggle_class_name("line", pwrprof.layout.value == "line");
                            });
                        })
                        .children(vec![
                            sys_button("power-saver", "Saver"),
                            sys_button("balanced", "Balanced"),
                            sys_button("performance", "Performance"),
                        ]),
                ]),
        )
}