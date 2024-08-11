use imports::{Gdk, Gtk, Hyprland, Widget, App};
use options;

const { overview } = options;

const TARGET = [Gtk::TargetEntry::new("text/plain", Gtk::TargetFlags::SAME_APP, 0)];

fn dispatch(args: &str) {
    Hyprland::message_async(&format!("dispatch {}", args));
}

fn size(id: i32) -> (i32, i32) {
    let def = (1080, 1920);
    if let Some(ws) = Hyprland::get_workspace(id) {
        if let Some(mon) = Hyprland::get_monitor(ws.monitor_id) {
            return (mon.height, mon.width);
        }
    }
    def
}

fn scale(size: i32) -> i32 {
    (overview.scale.value / 100) * size
}

fn create_workspace(id: i32) -> Widget {
    let fixed = Widget::Fixed();

    async fn update(fixed: &Widget::Fixed, id: i32) {
        if let Some(json) = Hyprland::message_async("j/clients").await {
            let clients: Vec<Hyprland::clients> = serde_json::from_str(&json).unwrap();
            fixed.get_children().iter().for_each(|ch| ch.destroy());
            clients
                .iter()
                .filter(|c| c.workspace.id == id)
                .for_each(|c| {
                    let x = c.at[0] - (Hyprland::get_monitor(c.monitor)?.x.unwrap_or(0));
                    let y = c.at[1] - (Hyprland::get_monitor(c.monitor)?.y.unwrap_or(0));
                    if c.mapped {
                        fixed.put(Window::new(c), scale(x), scale(y));
                    }
                });
            fixed.show_all();
        }
    }

    Widget::Box::new({
        attribute: { id },
        tooltip_text: format!("{}", id),
        class_name: "workspace",
        vpack: "center",
        css: overview.scale.bind().as(|v| {
            format!(
                "min-width: {}px; min-height: {}px;",
                (v / 100) * size(id).1,
                (v / 100) * size(id).0
            )
        }),
        setup: |box| {
            box.hook(overview.scale, || update(&fixed, id));
            box.hook(Hyprland, || update(&fixed, id), "notify::clients");
            box.hook(Hyprland.active.client, || update(&fixed, id));
            box.hook(Hyprland.active.workspace, || {
                box.toggle_class_name("active", Hyprland.active.workspace.id == id);
            });
        },
        child: Widget::EventBox::new({
            expand: true,
            on_primary_click: || {
                App::close_window("overview");
                dispatch(&format!("workspace {}", id));
            },
            setup: |eventbox| {
                eventbox.drag_dest_set(Gtk::DestDefaults::ALL, &TARGET, Gdk::DragAction::COPY);
                eventbox.connect("drag-data-received", |_w, _c, _x, _y, data| {
                    let address = String::from_utf8_lossy(data.get_data()).to_string();
                    dispatch(&format!("movetoworkspacesilent {},address:{}", id, address));
                });
            },
            child: fixed,
        }),
    })
}