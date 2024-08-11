use imports::{Widget, Gtk, App, Utils};
use modules::service::popupwindow;
use std::collections::HashMap;

const WINDOW_NAME: &str = "cliphist";

type EntryObject = HashMap<&str, &str>;

fn ClipHistItem(entry: &str) -> Widget {
    let mut parts = entry.split("\t");
    let id = parts.next().unwrap_or_default();
    let content: Vec<&str> = parts.collect();
    let mut click_count = 0;

    let button = Widget::Button(HashMap::from([
        ("class_name", "clip_container"),
        ("child", Widget::Box(HashMap::from([
            ("children", vec![
                Widget::Label(HashMap::from([
                    ("label", id),
                    ("class_name", "clip_id"),
                    ("xalign", "0"),
                    ("vpack", "center"),
                ])),
                Widget::Label(HashMap::from([
                    ("label", "・"),
                    ("class_name", "dot_divider"),
                    ("xalign", "0"),
                    ("vpack", "center"),
                ])),
                Widget::Label(HashMap::from([
                    ("label", content.join(" ").trim()),
                    ("class_name", "clip_label"),
                    ("xalign", "0"),
                    ("vpack", "center"),
                    ("truncate", "end"),
                ])),
            ],
        ]))),
    ]));

    button.connect("clicked", move || {
        click_count += 1;
        if click_count == 2 {
            App::close_window(WINDOW_NAME);
            Utils::exec_async(&format!("{}/scripts/cliphist.sh --copy-by-id {}", App::config_dir(), id));
            click_count = 0;
        }
    });

    button.connect("focus-out-event", move || {
        click_count = 0;
    });

    Widget::Box(HashMap::from([
        ("attribute", HashMap::from([("content", content.join(" ").trim())])),
        ("orientation", Gtk::Orientation::Vertical),
        ("children", vec![
            button,
            Widget::Separator(HashMap::from([
                ("class_name", "clip_divider"),
                ("orientation", Gtk::Orientation::Horizontal),
            ])),
        ]),
    ]))
}

fn ClipHistWidget(width: i32, height: i32, spacing: i32) -> Widget {
    let mut output = String::new();
    let mut entries: Vec<&str> = Vec::new();
    let mut clip_hist_items: Vec<EntryObject> = Vec::new();
    let mut widgets: Vec<Widget> = Vec::new();

    let list = Widget::Box(HashMap::from([
        ("vertical", true),
        ("spacing", spacing),
    ]));

    async fn repopulate() {
        let output = Utils::exec_async(&format!("{}/scripts/cliphist.sh --get", App::config_dir()))
            .await
            .unwrap_or_default();
        let entries = output.split("\n").filter(|line| line.trim() != "").collect::<Vec<&str>>();
        let clip_hist_items = entries.iter().map(|entry| {
            let mut parts = entry.split("\t");
            let id = parts.next().unwrap_or_default().trim();
            let content: Vec<&str> = parts.collect();
            HashMap::from([("id", id), ("content", content.join(" ").trim()), ("entry", *entry)])
        }).collect::<Vec<EntryObject>>();
        let widgets = clip_hist_items.iter().map(|item| ClipHistItem(item.get("entry").unwrap())).collect::<Vec<Widget>>();
        list.children = widgets;
    }
    repopulate().await;

    let entry = Widget::Entry(HashMap::from([
        ("hexpand", true),
        ("class_name", "cliphistory_entry"),
        ("placeholder_text", "Search"),
        ("on_change", move |args| {
            let text = args.get("text").unwrap_or_default().to_lowercase();
            widgets.iter().for_each(|item| {
                item.visible = item.attribute.get("content").unwrap_or_default().to_lowercase().contains(&text);
            });
        }),
    ]));

    Widget::Box(HashMap::from([
        ("vertical", true),
        ("class_name", "cliphistory_box"),
        ("margin_top", 14),
        ("margin_right", 14),
        ("children", vec![
            entry,
            Widget::Separator(HashMap::new()),
            Widget::Scrollable(HashMap::from([
                ("hscroll", "never"),
                ("css", format!("min-width: {}px; min-height: {}px;", width, height)),
                ("child", list),
            ])),
        ]),
        ("setup", move |self| {
            self.hook(App, |_, window_name, visible| {
                if window_name != WINDOW_NAME {
                    return;
                }

                if visible {
                    repopulate();
                    entry.text = "";
                }
            });
        }),
    ]))
}

let cliphist = popupwindow(HashMap::from([
    ("name", WINDOW_NAME),
    ("class_name", "cliphistory"),
    ("visible", false),
    ("keymode", "exclusive"),
    ("child", ClipHistWidget(500, 500, 0)),
    ("anchor", vec!["top", "right"]),
]));