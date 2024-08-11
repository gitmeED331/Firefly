use imports::{Widget, Audio, App};

fn volume_indicator() -> Widget {
    let update = |self: &mut Widget| {
        let vol = Audio::speaker().volume * 150.0;
        let mut icon = match [
            (101.0, "overamplified"),
            (67.0, "high"),
            (34.0, "medium"),
            (1.0, "low"),
            (0.0, "muted"),
        ]
        .iter()
        .find(|&&(threshold, _)| threshold <= vol) {
            Some(&(_, name)) => name,
            None => "",
        };

        if Audio::speaker().is_muted {
            icon = "muted";
            self.tooltip_text = "Muted".to_string();
        } else {
            self.tooltip_text = format!("Volume {}%", vol.floor());
        }
        self.icon = format!("audio-volume-{}-symbolic", icon);
        self.toggle_class_name("muted", Audio::speaker().is_muted);
    };

    Widget::Button(Box::new(|| {
        Widget::Icon().hook(Audio::speaker(), move |self| {
            update(self);
            self.hook(Audio::speaker(), || update(self));
        })
    }))
    .class_name("volumebtn")
    .on_primary_click(|| App::toggle_window("audiomixerwindow"))
    .on_secondary_click(move |self| {
        Audio::speaker().is_muted = !Audio::speaker().is_muted;
        update(self);
    })
    .on_scroll_up(move |self| {
        Audio::speaker().volume += 0.035;
        update(self);
    })
    .on_scroll_down(move |self| {
        Audio::speaker().volume -= 0.035;
        update(self);
    })
}