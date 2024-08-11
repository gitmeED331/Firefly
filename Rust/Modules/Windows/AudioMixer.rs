use imports::{Widget, Utils, PopupWindow, App};
use options;
use crate::Widgets::index::AudioMixer;

use Widget::{Box, Button, Icon, Slider, Label};

let options = options::options();
let bar = options.bar;
let dashvol = options.dashvol;
let pos = dashvol.position();
let layout = Utils::derive([bar.position(), dashvol.position()], |bar, qs| {
    format!("{}-{}", bar, qs)
});

// --- Audio Mixer PopupWindow ---
fn AudioMixerWindow() -> PopupWindow {
    name: "audiomixerwindow",
    className: "audiomixerwindow",
    anchor: pos,
    transition: "crossfade",
    layer: "top",
    exclusivity: "normal",
    keymode: "on-demand",
    margins: [0, 525],
    child: Box {
        vertical: true,
        children: vec![
            AudioMixer(),
        ]
    }
};

pub fn AudioMixerPopup() {
    App::addWindow(AudioMixerWindow());
    layout.connect("changed", || {
        App::removeWindow("audiomixerwindow");
        App::addWindow(AudioMixerWindow());
    });
}