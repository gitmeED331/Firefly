import icons from '../icons/index';

import { Widget, Utils, App, Roundedges, Mpris } from 'imports'

const { RoundedAngleEnd } = Roundedges
const { Box } = Widget
const { lookUpIcon, execAsync } = Utils

const MusicContainer = () => Widget.EventBox({
  on_primary_click: () => {
    const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
    if (!player) return;
    player.playPause();
  },
  on_secondary_click: () => {
    const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
    if (!player) return;
    player.next();
  },
  child: Widget.Box({
    class_name: "bar-music-container spacing-5",
    children: [
      Widget.CircularProgress({
        class_name: "music-progress",
        start_at: 0.75,
        child: Widget.Icon()
          .hook(Mpris, (icon) => {
            const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
            if (!player) return;
            let icn = icons.mpris.stopped;
            if (player.play_back_status === "Playing")
              icn = icons.mpris.playing;
            else if (player.play_back_status === "Paused")
              icn = icons.mpris.paused;
            icon.icon = icn;
          }),
      })
        .hook(Mpris, (prog) => {
          const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
          if (!player) return;
          prog.value = player.position / player.length;
        })
        .poll(1000, (prog) => {
          const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
          if (!player) return;
          prog.value = player.position / player.length;
        }),
      Widget.Label({
        max_width_chars: 35,
        truncate: "end",
      })
        .hook(Mpris, (label) => {
          const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
          if (!player) return;
          label.label = player?.track_title + " - " + player?.track_artists;
        })
    ]
  })
});
const MusicBarContainer = () => Widget.Box({
  hexpand: true,
  children: [
    RoundedAngleEnd("topleft", { class_name: "angle" }),
    MusicContainer(),
    RoundedAngleEnd("topright", { class_name: "angle" }),
  ],
});

const MusicBarContainerRevealer = () => {
  const box = Widget.Box({
    vertical: false,
    vpack: "start",
  });
  box.pack_start(Widget.Revealer({
    child: MusicBarContainer(),
    transition: "slide_down",
    transition_duration: 200,
    reveal_child: Utils.watch([], [
      [Mpris, "player-changed"],
      [Mpris, "player-added"],
      [Mpris, "player-closed"],
    ], () => Mpris.players)
      .transform(players => players.filter(p => p.play_back_status !== "Stopped"))
      .transform(players => players.length > 0)
  }), false, false, 0);
  return box;
};
export default MusicBarContainerRevealer;
