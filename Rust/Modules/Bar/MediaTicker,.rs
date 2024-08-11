use imports::{Widget, Utils, Mpris, App, Gdk, Variable};
use options;
use crate::Widgets::index::Player;

//const { RoundedCorner } = Roundedges
let Widget::{Box, Button, Icon, Label};

//const players = Mpris.bind("players")
//const player = Mpris.getPlayer("Deezer") || Mpris.getPlayer('')

let { bar, playwin } = options;
let pos = playwin.position.bind();
let layout = Utils.derive([bar.position, playwin.position], |bar, qs| {
    format!("{}-{}", bar, qs)
});

const FALLBACK_ICON: &str = "audio-x-generic-symbolic";
const PLAY_ICON: &str = "media-playback-start-symbolic";
const PAUSE_ICON: &str = "media-playback-pause-symbolic";
const PREV_ICON: &str = "media-skip-backward-symbolic";
const NEXT_ICON: &str = "media-skip-forward-symbolic";
const CLOSE_ICON: &str = "window-close-symbolic";

fn spacer() -> Box {
    Box {
        //className: "spacer",
        vexpand: true,
    }
}

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
    for expr in clean_patterns.iter() {
        cleaned_title = cleaned_title.replace(expr, "");
    }
    cleaned_title
}

// ------------- Bar Media Ticker button -----------

pub fn ticker_btn() -> Button {
    let ticker_track = Label {
        className: "tickertrack",
        wrap: false,
        hpack: "center",
        vpack: "center",
        vexpand: true,
        truncate: "end",
        //maxWidthChars: 30,
        label: "",
    };

    let ticker_artist = Label {
        className: "tickerartist",
        wrap: false,
        hpack: "center",
        vpack: "center",
        truncate: "end",
        //maxWidthChars: 30,
        label: "",
    };

    let ticker_icon = Icon {
        hexpand: true,
        hpack: "center",
        vpack: "center",
        className: "tickericon",
        size: 15,
        tooltip_text: "",
        icon: FALLBACK_ICON,
    };

    let no_media_label = Label {
        className: "nomedia",
        wrap: false,
        hpack: "center",
        vpack: "center",
        hexpand: true,
        label: "No Media",
    };

    let ticker_content = Box {
        vertical: false,
        visible: true,
        spacing: 5,
        children: vec![ticker_track, ticker_icon, ticker_artist],
    };

    let ticker_box = Box {
        className: "tickerbox",
        vertical: false,
        hexpand: true,
        vexpand: false,
        visible: true,
        vpack: "center",
        children: vec![no_media_label],
    };

    let update_ticker = |player: Player| {
        if let Some(player) = player {
            ticker_track.label = trim_track_title(&player.track_title);
            ticker_artist.label = player.track_artists.join(", ");
            ticker_icon.tooltip_text = player.identity;
            let icon_name = player.entry.unwrap_or(FALLBACK_ICON.to_string());
            ticker_icon.icon = if Utils::look_up_icon(&icon_name) { icon_name } else { FALLBACK_ICON.to_string() };
            if ticker_box.children.contains(&no_media_label) {
                ticker_box.children.retain(|&x| x != no_media_label);
            }
            if !ticker_box.children.contains(&ticker_content) {
                ticker_box.children.push(ticker_content);
            }
        } else {
            if ticker_box.children.contains(&ticker_content) {
                ticker_box.children.retain(|&x| x != ticker_content);
            }
            if !ticker_box.children.contains(&no_media_label) {
                ticker_box.children.push(no_media_label);
            }
        }
    };

    let button = Button {
        className: "tickerbtn",
        vexpand: false,
        hexpand: true,
        on_primary_click: || App::toggle_window("mediaplayerwindow"),
        setup: |self| {
            let update = || {
                let player = Mpris::get_player("Deezer").or_else(|| Mpris::get_player(""));
                if let Some(player) = player {
                    self.tooltip_markup = format!("<b>{}</b>\n\n<u>{}</u>\n\n{}", player.identity, player.track_artists.join(", "), player.track_title);
                    self.on_secondary_click = || player.play_pause();
                    self.on_scroll_up = || player.previous();
                    self.on_scroll_down = || player.next();
                } else {
                    self.tooltip_text = "".to_string();
                    self.on_secondary_click = None;
                    self.on_scroll_up = None;
                    self.on_scroll_down = None;
                }
                update_ticker(player);
            };
            update();
            std::thread::spawn(move || loop {
                std::thread::sleep(std::time::Duration::from_secs(1));
                update();
            });
        },
    };

    button
}