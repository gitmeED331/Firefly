use imports::{App, Applications, Widget, Gtk, Hyprland};
use lib::icons;
use lib::utils;
use node_modules::fzf::Fzf;
use types::widgets::button;
use types::service::applications;

fn app_icon(app: applications::Application) -> Widget::Icon {
    Widget::Icon {
        class_name: "app-icon".to_string(),
        icon: utils::icon(app.icon_name),
    }
}

fn app_button(app: applications::Application) -> Widget::Button {
    Widget::Button {
        on_clicked: Box::new(move || {
            App::close_window("launcher");
            Hyprland::message_async(format!("dispatch exec {}", app.executable)).then(|e| print(e)).catch(log_error);
            app.frequency += 1;
        }),
        attribute: { "app": app },
        tooltip_text: app.description.to_string(),
        class_name: "app-button".to_string(),
        child: Widget::Box {
            children: vec![
                app_icon(app),
                Widget::Box {
                    vertical: true,
                    children: vec![
                        Widget::Label {
                            xalign: 0,
                            max_width_chars: 28,
                            truncate: "end".to_string(),
                            use_markup: true,
                            label: app.name.to_string(),
                            class_name: "app-name".to_string(),
                        },
                        Widget::Label {
                            xalign: 0,
                            max_width_chars: 40,
                            truncate: "end".to_string(),
                            label: app.description.to_string(),
                            class_name: "app-description".to_string(),
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

let fzf: Fzf<types::widgets::button::Button> = Fzf::new(Applications::list.iter().map(|app| app_button(app)).collect(), FzfOptions {
    selector: |item| item.attribute.app.name,
    tiebreakers: vec![|a, b| b.item.attribute.app._frequency - a.item.attribute.app._frequency],
});

fn search_apps(text: String, results: Widget::Box) {
    results.children.iter().for_each(|c| results.remove(c));
    let fzf_results = fzf.find(text);
    let context = results.get_style_context();
    let color = context.get_color(Gtk::StateFlags::NORMAL);
    let hexcolor = format!("#{:02X}{:02X}{:02X}", (color.red * 0xff) as u8, (color.green * 0xff) as u8, (color.blue * 0xff) as u8);
    fzf_results.iter().for_each(|entry| {
        let name_chars = entry.item.attribute.app.name.normalize().chars().collect::<Vec<char>>();
        entry.item.child.children[1].children[0].label = name_chars.iter().enumerate().map(|(i, char)| {
            if entry.positions.contains(&i) {
                format!("<span foreground=\"{}\">{}</span>", hexcolor, char)
            } else {
                char.to_string()
            }
        }).collect::<String>();
    });
    results.children = fzf_results.iter().map(|e| e.item).collect();
}

fn search_box(launcher_state: State) -> Widget::Box {
    let results = Widget::Box {
        vertical: true,
        vexpand: true,
        class_name: "search-results".to_string(),
    };
    let entry = Widget::Entry {
        class_name: "search-entry".to_string(),
        placeholder_text: "search".to_string(),
        primary_icon_name: icons::launcher::search.to_string(),
    }
    .on("notify::text", |entry| search_apps(entry.text.clone().unwrap_or_default(), results.clone()))
    .on("activate", || {
        results.children.get(0)?.attribute.app.launch();
        App::close_window("launcher");
    })
    .hook(launcher_state, || {
        if launcher_state.value != "Search" {
            return;
        }
        entry.text = "-".to_string();
        entry.text = "".to_string();
        entry.grab_focus();
    })
    .hook(App, |_, name, visible| {
        if name != "launcher" || !visible {
            return;
        }
        if launcher_state.value == "Search" {
            entry.text = "-".to_string();
            entry.text = "".to_string();
            entry.grab_focus();
        }
    }, "window-toggled".to_string());

    Widget::Box {
        vertical: true,
        class_name: "launcher-search".to_string(),
        children: vec![
            entry,
            Widget::Scrollable {
                class_name: "search-scroll".to_string(),
                child: results,
            }
        ]
    }
}

SearchBox(launcherState)