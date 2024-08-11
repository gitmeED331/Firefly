use imports::{Widget, Utils, Mpris};
use lib::icons;

use std::process::Command;

fn trim_track_title(title: &str) -> String {
    if title.is_empty() {
        return String::new();
    }

    let clean_patterns = [
        r#"【[^】]*】"#,         // Touhou n weeb stuff
        " [FREE DOWNLOAD]", // F-777
        " (Radio Version)",
        " (Album Version)",
        " (Cafe Session)",
        " (International Version)",
    ];

    let mut cleaned_title = title.to_string();
    for pattern in clean_patterns.iter() {
        cleaned_title = cleaned_title.replace(pattern, "");
    }

    cleaned_title
}

async fn blur_cover_art_css(cover_path: &str) -> String {
    let player_bg_gen = |bg: &str, color: &str| {
        format!(
            "background-image: radial-gradient(circle at left, rgba(0, 0, 0, 0), {} 11.5rem), url('{}');\
            background-position: left top, left top;\
            background-size: contain;\
            transition: all 0.7s ease;\
            background-repeat: no-repeat;",
            color, bg
        )
    };

    if !cover_path.is_empty() {
        let color = Command::new("bash")
            .arg("-c")
            .arg(format!("convert {} -alpha off -crop 5%x100%0+0+0 -colors 1 -unique-colors txt: | head -n2 | tail -n1 | cut -f4 -d' '", cover_path))
            .output()
            .await
            .expect("Failed to execute command");

        let color = String::from_utf8_lossy(&color.stdout).trim().to_string();
        return player_bg_gen(cover_path, &color);
    }

    "background-color: #0e0e1e".to_string()
}

fn length_str(length: u32) -> String {
    let min = length / 60;
    let sec = length % 60;
    let sec_str = if sec < 10 { "0" } else { "" };
    format!("{}:{}{}", min, sec_str, sec)
}

fn player(player: &MprisPlayer) -> Box {
    let title = Label {
        class_name: "tracktitle",
        wrap: false,
        hexpand: true,
        hpack: "center",
        truncate: "end",
        max_width_chars: 35,
        label: trim_track_title(&player.track_title),
    };

    let artist = Label::new()
    .class_name("artist")
    .wrap(false)
    .hexpand(true)
    .hpack("center")
    .truncate("end")
    .max_width_chars(30)
    .label(player.bind("track_artists").transform(|a| a.join(", ")));

let positionSlider = Slider::new()
    .class_name("position")
    .draw_value(false)
    .on_change(|value| player.position = value * player.length)
    .visible(player.bind("length").as(|l| l > 0))
    .setup(|self| {
        let update = || {
            let value = player.position / player.length;
            self.set_value(if value > 0 { value } else { 0 });
        };
        self.hook(player, update);
        self.hook(player, update, "position");
        self.poll(1000, update);
    })
    .on_realize(|self| {
        self.visible = player.length > 0;
    });

let positionLabel = Label::new()
    .class_name("trackposition")
    .hpack("end")
    .setup(|self| {
        let update = |_, time| {
            self.set_label(length_str(time.unwrap_or(player.position)));
            self.visible = player.length > 0;
        };
        self.hook(player, update, "position");
        self.poll(1000, update);
    });

let lengthLabel = Label::new()
    .class_name("tracklength")
    .hpack("start")
    .visible(player.bind("length").transform(|l| l > 0))
    .label(player.bind("length").transform(length_str));

let icon = || Button::new()
    .on_clicked(async || {
        let entry_value = player.entry;
        if let Some(entry) = entry_value {
            if let Some(entry_str) = entry.as_str() {
                Utils::exec_async(format!("bash -c 'hyprctl dispatch exec \"{}\"'", entry_str)).await;
            }
        }
    })
    .child(Icon::new()
        .class_name("playicon")
        .hexpand(true)
        .hpack("end")
        .vpack("center")
        .size(30)
        .tooltip_text(player.identity.unwrap_or(""))
        .icon(player.bind("entry").transform(|entry| {
            let name = format!("{}", entry);
            if Utils::look_up_icon(&name) {
                name
            } else {
                icons::player::FALLBACK
            }
        })));

let playPause = Button::new()
    .class_name("play-pause")
    .vpack("center")
    .on_clicked(|| player.play_pause())
    .visible(player.bind("can_play"))
    .child(Icon::new()
        .icon(player.bind("play_back_status").transform(|s| match s {
            "Playing" => icons::player::PAUSE,
            "Paused" | "Stopped" => icons::player::PLAY,
            _ => unreachable!(),
        }));

let prev = Button::new()
    .class_name("previous")
    .vpack("center")
    .on_clicked(|| player.previous())
    .visible(player.bind("can_go_prev"))
    .child(Icon::new(icons::player::PREV));

let next = Button::new()
    .class_name("next")
    .vpack("center")
    .on_clicked(|| player.next())
    .visible(player.bind("can_go_next"))
    .child(Icon::new(icons::player::NEXT));

let close = Button::new()
    .class_name("close")
    .vpack("center")
    .on_clicked(|| player.stop())
    .child(Icon::new(icons::player::CLOSE));

Box::new()
    .vertical(false)
    .spacing(5)
    .hpack("end")
    .vpack("center")
    .class_name("player")
    .add(Widget::CenterBox::new()
        .class_name("mediainfo")
        .vertical(true)
        .vexpand(true)
        .start_widget(Box::new()
            .vertical(false)
            .vpack("center")
            .add(Box::new()
                .class_name("trackinfo")
                .vpack("center")
                .hpack("center")
                .hexpand(true)
                .vertical(true)
                .spacing(5)
                .add(title)
                .add(artist))
            .add(Box::new()
                .hpack("end")
                .vertical(false)
                .add(icon())))
        .center_widget(Box::new()
            .vertical(true)
            .add(positionSlider)
            .add(Widget::CenterBox::new()
                .vertical(false)
                .start_widget(lengthLabel)
                .end_widget(positionLabel)))
        .end_widget(Box::new()
            .class_name("playercontrols")
            .vexpand(false)
            .hexpand(false)
            .hpack("center")
            .vpack("center")
            .add(prev)
            .add(playPause)
            .add(next)))
    .add(close)
    .hook(player, async |self| {
        self.css = blur_cover_art_css(player.cover_path).await;
    }, "notify::cover-path");
}