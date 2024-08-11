r
use gtk::prelude::*;
use gtk::{Widget, Box as GtkBox, Button as PanelButton, Image as Icon, Revealer};
use gdk::Gravity;
use std::collections::HashSet;

#[derive(Debug)]
struct TrayItem {
    icon: String,
    tooltip_markup: String,
    menu: Option<gtk::Menu>,
}

struct Options {
    bar: BarOptions,
}

struct BarOptions {
    systray: SystrayOptions,
}

struct SystrayOptions {
    ignore: HashSet<String>,
    stitem: StItem,
}

struct StItem {
    value: bool,
}

impl StItem {
    fn toggle(&mut self) {
        self.value = !self.value;
    }
}

fn sys_tray_item(item: TrayItem) -> PanelButton {
    let button = PanelButton::new();
    button.set_class_name("systrayitem");
    button.set_child(Some(&Icon::new_from_icon_name(&item.icon, 15)));

    button.set_tooltip_text(Some(&item.tooltip_markup));

    if let Some(menu) = item.menu {
        let menu_clone = menu.clone();
        let id = menu_clone.connect_popped_up(move |_| {
            button.toggle_class_name("active");
            let menu_clone = menu_clone.clone();
            menu_clone.connect_notify_visible(move |_, _| {
                button.toggle_class_name("active", menu_clone.is_visible());
            });
        });

        button.connect_destroy(move |_| {
            menu.disconnect(id);
        });
    }

    button.connect_button_press_event(move |_, event| {
        if event.get_button() == 1 {
            if let Some(menu) = &item.menu {
                menu.popup_at_widget(&button, Gravity::South, Gravity::North, None);
            }
        }
        Inhibit(false)
    });

    button.connect_button_press_event(move |_, event| {
        if event.get_button() == 3 {
            if let Some(menu) = &item.menu {
                menu.popup_at_widget(&button, Gravity::South, Gravity::North, None);
            }
        }
        Inhibit(false)
    });

    button
}

fn expand_btn(options: &Options) -> PanelButton {
    let button = PanelButton::new();
    button.set_class_name("BarBTN");
    button.set_hexpand(false);

    button.connect_button_press_event(move |_, event| {
        if event.get_button() == 1 {
            // App.toggle_window("launcher");
        }
        Inhibit(false)
    });

    button.connect_button_press_event(move |_, event| {
        if event.get_button() == 3 {
            options.bar.systray.stitem.toggle();
        }
        Inhibit(false)
    });

    button.set_child(Some(&Icon::new_from_icon_name("hyprland-symbolic", 0)));

    button
}

fn tray_reveal(options: &Options) -> Revealer {
    let revealer = Revealer::new();
    revealer.set_transition("slide_right");
    revealer.set_click_through(false);
    // revealer.set_reveal_child(Some(&options.bar.systray.stitem.bind()));

    let box_widget = GtkBox::new(gtk::Orientation::Vertical, 0);
    box_widget.set_class_name("tray");

    // Assuming SystemTray is a struct that holds items
    // SystemTray::items().filter(|item| !options.bar.systray.ignore.contains(&item.id))
    //     .map(sys_tray_item)
    //     .for_each(|item| box_widget.append(&item));

    revealer.set_child(Some(&box_widget));

    revealer
}

