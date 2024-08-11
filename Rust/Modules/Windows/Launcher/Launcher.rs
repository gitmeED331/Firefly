use imports::{App, Widget, Utils};
use crate::search::SearchBox;
use lib::roundedCorner::RoundedCorner;
use crate::categories::Categories;
use crate::hyprlands::HyprlandBox;
use crate::stackState::StackState;
use lib::icons;
use lib::screensizeadjust::winwidth;

use Widget::{Box, Button, Label, Icon};
use Utils::{timeout, exec};

let LauncherState = StackState::new("Search");

/**
 * @param {string} item
 */
fn StackSwitcherButton(item: String) -> Button {
    Button {
        class_name: "launcher-switcher-button",
        tooltip_text: item,
        child: Icon(icons::launcher.get(&item.to_lowercase()).unwrap_or(&"image-missing".to_string())),
        on_clicked: || LauncherState.value = item,
    }.hook(LauncherState, |button| {
        button.toggle_class_name("focused", LauncherState.value == item);
        let focused_id = LauncherState.items.iter().position(|&x| x == LauncherState.value).unwrap();
        button.toggle_class_name("before-focused", LauncherState.items.get(focused_id - 1) == Some(&item));
        button.toggle_class_name("after-focused", LauncherState.items.get(focused_id + 1) == Some(&item));
    })
}

/**
 * @param {bool} start
 */
fn StackSwitcherPadding(start: bool) -> Box {
    Box {
        class_name: "launcher-switcher-button",
        vexpand: true,
        children: vec![Icon()],
    }.hook(LauncherState, |box| {
        let focused_id = LauncherState.items.iter().position(|&x| x == LauncherState.value).unwrap();
        box.toggle_class_name("before-focused", start && focused_id == 0);
        box.toggle_class_name("after-focused", !start && focused_id == LauncherState.items.len() - 1);
    })
}

/**
 * @param {Vec<String>} items
 */
fn StackSwitcher(items: Vec<String>) -> Box {
    Box {
        vertical: true,
        class_name: "launcher-switcher",
        children: vec![
            StackSwitcherPadding(true),
            items.iter().map(|i| StackSwitcherButton(i)).collect(),
            StackSwitcherPadding(false),
        ].concat(),
    }
}

fn LauncherStack() -> Widget {
    let children = {
        "Search".to_string(): SearchBox(LauncherState),
        Categories(),
        "Hyprland".to_string(): HyprlandBox(LauncherState),
    };
    let stack = Widget::Stack {
        visible_child_name: LauncherState.bind(),
        transition: "over_right".to_string(),
        class_name: "launcher".to_string(),
        css: format!("min-width: {}px", winwidth(0.25)),

        children,
    };
    stack
}

fn toggle(value: String) {
    let current = LauncherState.value.clone();
    if current == value && App::get_window("launcher").visible {
        App::close_window("launcher");
    } else {
        App::open_window("launcher");
        LauncherState.value = value;
    }
}

fn toggleLauncher() {
    toggle("Search".to_string());
}

fn toggleHyprlandSwitcher() {
    toggle("Hyprland".to_string());
}

/**
 * @param {i32} value
 */
fn default() -> Widget {
    let stack = LauncherStack();
    LauncherState.items = stack.children.keys().map(|x| x.to_string()).collect();
    let stack_switcher = StackSwitcher(stack.children.keys().map(|x| x.to_string()).collect());
    let window = Widget::Window {
        keymode: "on-demand".to_string(),
        visible: false,
        anchor: ["left".to_string(), "top".to_string(), "bottom".to_string()],
        name: "launcher".to_string(),
        class_name: "launcher-window".to_string(),
        child: Box {
            css: "padding-right: 2px".to_string(),
            children: vec![
                Widget::Revealer {
                    reveal_child: false,
                    transition: "crossfade".to_string(),
                    transition_duration: 350,
                    child: stack_switcher,
                }.hook(App, |revealer, name, visible| {
                    if name == "launcher" {
                        if visible {
                            revealer.reveal_child = visible;
                        } else {
                            timeout(100, || revealer.reveal_child = visible);
                        }
                    }
                }),
                Box {
                    children: vec![
                        Widget::Overlay {
                            child: Box {
                                children: vec![
                                    Widget::Revealer {
                                        reveal_child: false,
                                        child: stack,
                                        transition_duration: 350,
                                        transition: "crossfade".to_string(),
                                    }.hook(App, |revealer, name, visible| {
                                        if name == "launcher" {
                                            if visible {
                                                timeout(100, || revealer.reveal_child = visible);
                                            } else {
                                                revealer.reveal_child = visible;
                                            }
                                        }
                                    }),
                                    Box { css: "min-width: 1rem".to_string() },
                                ],
                            },
                            overlays: [
                                RoundedCorner("topleft".to_string(), { class_name: "corner".to_string() }),
                                RoundedCorner("bottomleft".to_string(), { class_name: "corner".to_string() }),
                            ],
                        },
                    ],
                },
            ],
        },
    };
    let mods = ["MOD1".to_string(), "MOD2".to_string()];
    window.keybind("Escape".to_string(), || App::close_window("launcher"));
    window.keybind(mods, "Tab".to_string(), || LauncherState.next());
    for i in 0..10 {
        window.keybind(mods, i.to_string(), || LauncherState.set_index(i));
        window.keybind(mods, format!("KP_{}", i), || LauncherState.set_index(i));
    }
    window
}