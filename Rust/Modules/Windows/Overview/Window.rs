use imports::gtk::{self, prelude::*};
use imports::gdk;
use imports::hyprland;
use imports::service;

use lib::utils;
use lib::icons;

use options;

pub fn create_button(client: service::Client) -> gtk::Button {
    let overview = options::overview();

    let target = gtk::TargetEntry::new("text/plain", gtk::TargetFlags::SAME_APP, 0);
    let apps = service::import("applications");
    
    let dispatch = |args: &str| {
        hyprland::message_async(&format!("dispatch {}", args));
    };

    let button = gtk::Button::new();
    button.get_style_context().add_class("client");
    button.set_tooltip_text(&client.title);

    let icon = gtk::Image::from_icon_name(
        &icons::fallback_executable(&overview.monochrome()),
        gtk::IconSize::Button,
    );

    button.set_child(Some(&icon));

    button.connect_button_press_event(move |_, event| {
        if event.get_button() == 3 {
            dispatch(&format!("closewindow address:{}", client.address));
        }
        gtk::Inhibit(false)
    });

    button.connect_clicked(move |_| {
        dispatch(&format!("focuswindow address:{}", client.address));
        hyprland::close_window("overview");
    });

    button.connect_drag_data_get(|_, _, data| {
        data.set_text(&client.address);
    });

    button.connect_drag_begin(|_, context| {
        let surface = utils::create_surface_from_widget(&button);
        gdk::drag_set_icon_surface(context, &surface);
        button.get_style_context().add_class("hidden");
    });

    button.connect_drag_end(|_, _| {
        button.get_style_context().remove_class("hidden");
    });

    button.drag_source_set(gdk::ModifierType::BUTTON1_MASK, &[target], gdk::DragAction::COPY);

    button
}