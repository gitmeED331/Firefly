use imports::{Widget, Utils, Mpris, PopupWindow, App};
use options;
use crate::Widgets::index::Player;

//const { RoundedCorner } = Roundedges
const { Box } = Widget;

let players = Mpris::bind("players");
let player = Mpris::getPlayer("Deezer").unwrap_or(Mpris::getPlayer(""));

let { bar, playwin } = options;
let pos = playwin.position.bind();
let layout = Utils::derive([bar.position, playwin.position], |bar, qs| {
    format!("{}-{}", bar, qs)
});

// ----------- The Player Window ------------

fn mpw() -> PopupWindow {
    PopupWindow {
        name: "mediaplayerwindow",
        class_name: "mediaplayerwindow",
        anchor: pos,
        layer: "top",
        exclusivity: "normal",
        keymode: "on-demand",
        margins: [0, 90, 0, 0],
        transition: if pos == "top" { "slide_down" } else { "slide_up" },
        child: Box {
            vertical: true,
            children: Utils::watch(vec![], vec![
                [Mpris, "player-changed"],
                [Mpris, "player-added"],
                [Mpris, "player-closed"],
            ], || Mpris::players())
            .transform(|p| p.iter().filter(|p| p.play_back_status != "Stopped").map(Player)),
        },
    }
}

pub fn media_player_window() {
    App::add_window(mpw());
    layout.connect("changed", || {
        App::remove_window("mediaplayerwindow");
        App::add_window(mpw());
    });
}