use imports::{App, Hyprland, Widget, Gtk};
use node_modules::fzf::Fzf;
use lib::icons;
use lib::utils;

use types::widgets::button::Button;
use types::service::hyprland::Client;

fn app_icon(app: Client) -> Widget {
    Icon {
        class_name: "app-icon",
        icon: icon(app.class),
    }
}

fn app_button(app: Client) -> Button {
    Button {
        on_clicked: || {
            Hyprland::message_async(format!("dispatch focuswindow address:{}", app.address))
                .catch(log_error);
            App::close_window("launcher");
        },
        attribute: { "app": app },
        tooltip_text: app.title,
        class_name: "app-button",
        child: Box {
            children: [
                app_icon(app),
                Box {
                    vertical: true,
                    children: [
                        Label {
                            xalign: 0,
                            max_width_chars: 28,
                            truncate: "end",
                            use_markup: true,
                            label: app.title,
                            class_name: "app-name",
                        },
                        Label {
                            xalign: 0,
                            max_width_chars: 40,
                            truncate: "end",
                            use_markup: true,
                            label: app.class,
                            class_name: "app-description",
                        }
                    ]
                }
            ]
        },
    }
    .on("focus-in-event", |self| {
        self.toggle_class_name("focused", true);
    })
    .on("focus-out-event", |self| {
        self.toggle_class_name("focused", false);
    })
}

let fzf: FzfAppButton;

fn search_apps(text: String, results: Box) {
    results.children.iter().for_each(|c| results.remove(c));
    let fzf_results = fzf.find(text);
    let context = results.get_style_context();
    let color = context.get_color(Gtk::StateFlags::NORMAL);
    let hexcolor = format!(
        "#{:02x}{:02x}{:02x}",
        (color.red * 0xff) as u8,
        (color.green * 0xff) as u8,
        (color.blue * 0xff) as u8
    );
    fzf_results.iter().for_each(|entry| {
        let class_chars = entry.item.attribute.app.class.normalize().split("");
        entry.item.child.children[1].children[1].label = class_chars
            .enumerate()
            .map(|(i, char)| {
                if entry.positions.has(i) {
                    format!("<span foreground=\"{}\">{}</span>", hexcolor, char)
                } else {
                    char.to_string()
                }
            })
            .collect::<String>();
        let title_chars = entry.item.attribute.app.title.normalize().split("");
        entry.item.child.children[1].children[0].label = title_chars
            .enumerate()
            .map(|(i, char)| {
                if entry.positions.has(class_chars.len() + i) {
                    format!("<span foreground=\"{}\">{}</span>", hexcolor, char)
                } else {
                    char.to_string()
                }
            })
            .collect::<String>();
    });
    results.children = fzf_results.iter().map(|e| e.item).collect();
}

fn search_box(launcher_state: State) -> Box {
    let results = Box {
        vertical: true,
        vexpand: true,
        class_name: "search-results",
    };
    let entry = Widget::Entry {
        class_name: "search-entry",
        placeholder_text: "search",
        primary_icon_name: icons::launcher::search,
    }
    .on("notify::text", |entry| search_apps(entry.text.unwrap_or_default(), results))
    .on("activate", || {
        if let Some(address) = results.children.get(0).map(|c| c.attribute.app.address) {
            Hyprland::message_async(format!("dispatch focuswindow address:{}", address))
                .catch(log_error);
            App::close_window("launcher");
        }
    })
    .hook(launcher_state, || {
        if launcher_state.value != "Hyprland" {
            entry.text = "-";
            entry.text = "";
            entry.grab_focus();
        }
    })
    .hook(App, |_, name, visible| {
        if name != "launcher" || !visible {
            return;
        }
        fzf?.find("").map(|e| e.item.destroy());
        fzf = Fzf::new(
            Hyprland::clients
                .filter(|client| client.title != "")
                .map(app_button),
            |item| item.attribute.app.class + item.attribute.app.title,
        );
        if launcher_state.value == "Hyprland" {
            entry.text = "-";
            entry.text = "";
            entry.grab_focus();
        }
    }, "window-toggled");
    Box {
        vertical: true,
        class_name: "launcher-search",
        children: [
            entry,
            Widget::Scrollable {
                class_name: "search-scroll",
                child: results
            }
        ]
    }
}

SearchBox;