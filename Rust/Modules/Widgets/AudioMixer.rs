use imports::{Widget, Audio, Utils, PopupWindow, App};
use options;
use lib::{dependencies, icon, sh};
use lib::icons;
use types::service::audio::Stream;

use buttons::ToggleButton::{Arrow, Menu};

const {Box, Button, Icon, Slider, Label} = Widget;

const {bar, dashvol} = options;
const pos = dashvol.position;
const layout = Utils::derive([bar.position, dashvol.position], |bar, qs| {
    format!("{}-{}", bar, qs)
});

type Type = "microphone" | "speaker" | "headset";

fn speaker_icon(type: Type) -> Button {
    Button {
        className: "volumesldIcon",
        onClicked: || Audio[type].is_muted = !Audio[type].is_muted,
        child: Widget::Icon().hook(Audio[type], |self| {
            let vol = Audio[type].volume * 150;
            let icon = [
                (101, "overamplified"),
                (67, "high"),
                (34, "medium"),
                (1, "low"),
                (0, "muted"),
            ].iter().find_map(|&(threshold, name)| if threshold <= vol { Some(name) } else { None });
            if let Some(icon_name) = icon {
                if Audio[type].is_muted {
                    self.tooltip_text = "Muted";
                    self.icon = format!("audio-volume-{}-symbolic", icon_name);
                    self.toggleClassName("muted", Audio[type].is_muted);
                } else {
                    self.tooltip_text = format!("Volume {}%", vol.floor());
                }
            }
        })
    }
}

fn speaker_slider(type: Type) -> Slider {
    Slider {
        className: "volumesld Slider",
        hexpand: true,
        drawValue: false,
        value: Audio[type].bind("volume"),
        on_change: |value, dragging| {
            if dragging {
                Audio[type].volume = value;
                Audio[type].is_muted = false;
            }
        },
    }
}

fn mic_icon(type: Type) -> Button {
    Button {
        className: "volumesldIcon",
        onClicked: || Audio[type].is_muted = !Audio[type].is_muted,
        child: Widget::Icon().hook(Audio[type], |self| {
            let vol = Audio[type].volume * 100;
            let icon = [
                (67, "high"),
                (34, "medium"),
                (1, "low"),
                (0, "muted"),
            ].iter().find_map(|&(threshold, name)| if threshold <= vol { Some(name) } else { None });
            if let Some(icon_name) = icon {
                if Audio[type].is_muted {
                    self.tooltip_text = "Muted";
                    self.icon = format!("microphone-sensitivity-{}-symbolic", icon_name);
                    self.toggleClassName("muted", Audio[type].is_muted);
                } else {
                    self.tooltip_text = format!("Microphone {}%", vol.floor());
                }
            }
        })
    }
}

fn mic_slider(type: Type) -> Slider {
    Slider {
        className: "volumesld Slider",
        hexpand: true,
        drawValue: false,
        value: Audio[type].bind("volume"),
        on_change: |value, dragging| {
            if dragging {
                Audio[type].volume = value;
                Audio[type].is_muted = false;
            }
        },
    }
}

fn settings_button() -> Button {
    Button {
        onClicked: || {
            if dependencies("pavucontrol") {
                sh("pavucontrol");
            }
        },
        hexpand: true,
        hpack: "end",
        vpack: "start",
        child: Widget::Box {
            children: vec![
                Icon(icons::ui::settings),
            ],
        },
    }
}

fn mixer_item(stream: Stream) -> Box {
    fn mixer_label(stream: Stream) -> Box {
        Box {
            spacing: 2.5,
            vertical: false,
            vpack: "center",
            children: vec![
                Icon {
                    vpack: "start",
                    className: "mixeritemicon",
                    tooltip_text: stream.bind("description").as(|n| n.unwrap_or_default()),
                    icon: stream.bind("name").as(|n| {
                        if let Some(icon_name) = Utils::look_up_icon(n.unwrap_or_default()) {
                            n.unwrap_or_default()
                        } else {
                            icons::fallback::audio
                        }
                    }),
                },
                Label {
                    vpack: "center",
                    xalign: 0,
                    className: "mixeritemlabel",
                    truncate: "end",
                    max_width_chars: 28,
                    label: stream.bind("name").as(|d| d.unwrap_or_default()),
                },
            ],
            setup: |self| {
                if let Some(id) = stream.id {
                    if let Some(audio) = Audio.get(id) {
                        self.toggleClassName("muted", audio.is_muted);
                    }
                }
            },
        }
    }

    fn mixer_slider(stream: Stream) -> Slider {
        Slider {
            className: "mixeritemslider Slider",
            hexpand: true,
            draw_value: false,
            value: stream.bind("volume"),
            on_change: |value| stream.volume = value,
        }
    }

    Box {
        hexpand: true,
        className: "mixeritem",
        vpack: "center",
        vertical: true,
        children: vec![
            mixer_label(stream),
            mixer_slider(stream),
        ],
    }
}

fn sink_item(stream: Stream) -> Button {
    Button {
        hexpand: true,
        on_clicked: || Audio.speaker = stream,
        className: "sinkitem",
        child: Box {
            className: "sinkitembox",
            children: vec![
                Icon {
                    className: "sinkitemicon",
                    icon: icon(stream.icon_name.unwrap_or_default(), icons::fallback::audio),
                    tooltip_text: stream.icon_name.unwrap_or_default(),
                },
                Label {
                    className: "sinkitemlabel",
                    label: stream.description.unwrap_or_default().split(" ").take(4).collect::<String>(),
                },
                Icon {
                    icon: icons::ui::tick,
                    className: "sinkitemicon",
                    hexpand: true,
                    hpack: "end",
                    visible: Audio.speaker.bind("stream").as(|s| s == stream.stream),
                },
            ],
        },
    }
}

fn app_mixer() -> Menu {
    Menu {
        name: "app-mixer",
        icon: icons::audio::mixer,
        title: "Volume Mixer",
        content: vec![
            Box {
                vertical: true,
                className: "volmenusitems",
                children: Audio.bind("apps").as(|a| a.iter().map(|&app| mixer_item(app)).collect()),
            },
        ],
    }
}

fn sink_selector() -> Menu {
    Menu {
        name: "sink-selector",
        icon: icons::audio::type::headset,
        title: "Sink Selector",
        content: vec![
            Box {
                vertical: true,
                className: "volmenusitems",
                children: Audio.bind("speakers").as(|a| a.iter().map(|&speaker| sink_item(speaker)).collect()),
            },
        ],
    }
}

fn volume_slider() -> Box {
    Box {
        name: "volume-slider",
        vertical: true,
        vexpand: true,
        children: vec![
            Box {
                children: vec![
                    speaker_icon("speaker"),
                    speaker_slider("speaker"),
                ],
            },
            Widget::Separator(),
            Box {
                children: vec![
                    mic_icon("microphone"),
                    mic_slider("microphone"),
                ],
            },
        ],
    }
}

fn audio_mixer() -> Box {
    Box {
        className: "audiomixer",
        vexpand: true,
        hexpand: true,
        vertical: true,
        children: vec![
            volume_slider(),
            Box {
                hpack: "center",
                className: "volmenus",
                children: vec![
                    Box {
                        child: Arrow("sink-selector"),
                    },
                    Box {
                        child: Arrow("app-mixer"),
                        visible: Audio.bind("apps").as(|a| a.len() > 0),
                    },
                ],
            },
            app_mixer(),
            sink_selector(),
            Widget::Separator(),
            settings_button(),
        ],
    }
}