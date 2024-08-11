use imports::{App, Applications, Widget, Utils, Gtk};
use crate::search::AppIcon;

use std::collections::HashMap;

const { Box, Button, Label, Icon } = Widget;

const mainCategories = [
    "AudioVideo",
    "Audio",
    "Video",
    "Development",
    "Education",
    "Game",
    "Graphics",
    "Network",
    "Office",
    "Science",
    "Settings",
    "System",
    "Utility"
];

fn get_categories(app: &types::service::applications::Application) -> Vec<String> {
    let substitute = |cat: &str| -> &str {
        let map: HashMap<&str, &str> = [
            ("Audio", "Multimedia"),
            ("AudioVideo", "Multimedia"),
            ("Video", "Multimedia"),
            ("Graphics", "Multimedia"),
            ("Science", "Education"),
            ("Settings", "System"),
        ].iter().cloned().collect();
        map.get(cat).copied().unwrap_or(cat)
    };

    app.app.get_categories()
        .map(|categories| categories.split(";").filter(|c| mainCategories.contains(&c)).map(substitute).collect())
        .unwrap_or_else(|| Vec::new())
}

fn category_list() -> HashMap<String, Vec<types::service::applications::Application>> {
    let mut cats_map = HashMap::new();

    Applications.list.iter().for_each(|app| {
        let cats = get_categories(app);
        cats.iter().for_each(|cat| {
            cats_map.entry(cat.to_string()).or_insert(Vec::new()).push(app.clone());
        });
    });

    cats_map
}

fn app_button(app: &types::service::applications::Application) -> Widget {
    Button {
        on_clicked: || {
            app.launch();
            App.close_window("launcher");
        },
        tooltip_text: app.description,
        class_name: "app-button",
        child: Box {
            vertical: true,
            children: vec![
                AppIcon(app),
                Label {
                    max_width_chars: 8,
                    truncate: "end",
                    label: app.name,
                    vpack: "center",
                    class_name: "app-name",
                },
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

fn category_list_widget(list: Vec<types::service::applications::Application>) -> Widget {
    let flow_box = Widget.FlowBox({});
    list.iter().for_each(|app| {
        flow_box.add(app_button(app));
    });

    Box {
        class_name: "launcher-category",
        children: vec![
            Widget.Scrollable {
                hscroll: "never",
                vscroll: "automatic",
                hexpand: true,
                child: Box {
                    vertical: true,
                    children: vec![
                        flow_box,
                        Box { vexpand: true },
                    ]
                }
            }
        ]
    }
}

fn categories() -> HashMap<String, Widget> {
    category_list()
        .into_iter()
        .map(|(key, val)| (key, category_list_widget(val)))
        .collect()
}

Categories