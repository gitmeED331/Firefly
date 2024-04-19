const mpris = await Service.import("mpris");;
const players = mpris.bind("players");

import { Widget, Utils, Mpris, Hyprland, Utils } from "../../imports";
import icons from "../icons/index.js";

const { Window, Box, CenterBox, Button, Icon, Label, Slider } = Widget;
const { lookUpIcon, execAsync } = Utils;

const FALLBACK_ICON = "audio-x-generic-symbolic"
const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"

/** @param {number} length */
function lengthStr(length) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

/** @param {import('types/service/mpris').MprisPlayer} player */
function Player(player) {
    const img = Box({
        class_name: "img",
        vpack: "start",
        css: player.bind("cover_path").transform(p => `
            background-image: url('${p}');
        `),
    })

    const title = Label({
        class_name: "mtitle",
        wrap: true,
        hpack: "start",
        label: player.bind("track_title"),
    })

    const artist = Label({
        class_name: "artist",
        wrap: true,
        hpack: "start",
        label: player.bind("track_artists").transform(a => a.join(", ")),
    })

    const positionSlider = Slider({
        class_name: "position",
        draw_value: false,
        on_change: ({ value }) => player.position = value * player.length,
        visible: player.bind("length").as(l => l > 0),
        setup: self => {
            function update() {
                const value = player.position / player.length
                self.value = value > 0 ? value : 0
            }
            self.hook(player, update)
            self.hook(player, update, "position")
            self.poll(1000, update)
        },
    })

    const positionLabel = Label({
        class_name: "position",
        hpack: "start",
        setup: self => {
            const update = (_, time) => {
                self.label = lengthStr(time || player.position)
                self.visible = player.length > 0
            }

            self.hook(player, update, "position")
            self.poll(1000, update)
        },
    })

    const lengthLabel = Label({
        class_name: "length",
        hpack: "end",
        visible: player.bind("length").transform(l => l > 0),
        label: player.bind("length").transform(lengthStr),
    })

    const icon = Icon({
        class_name: "icon",
        hexpand: true,
        hpack: "end",
        vpack: "start",
        tooltip_text: player.identity || "",
        icon: player.bind("entry").transform(entry => {
            const name = `${entry}-symbolic`
            return Utils.lookUpIcon(name) ? name : FALLBACK_ICON
        }),
    })

    const playPause = Button({
        class_name: "play-pause",
        on_clicked: () => player.playPause(),
        visible: player.bind("can_play"),
        child: Widget.Icon({
            icon: player.bind("play_back_status").transform(s => {
                switch (s) {
                    case "Playing": return PAUSE_ICON
                    case "Paused":
                    case "Stopped": return PLAY_ICON
                }
            }),
        }),
    })

    const prev = Button({
		className: "previous",
        on_clicked: () => player.previous(),
        visible: player.bind("can_go_prev"),
        child: Widget.Icon(PREV_ICON),
    })

    const next = Widget.Button({
		className: "next",
        on_clicked: () => player.next(),
        visible: player.bind("can_go_next"),
        child: Widget.Icon(NEXT_ICON),
    })

    return Widget.Box(
        { class_name: "player" },
        img,
        Box(
            {
                vertical: true,
                hexpand: true,
            },
            Box([
                artist,
                icon,
            ]),
            title,
            Box({ vexpand: true }),
            positionSlider,
            Widget.CenterBox({
                start_widget: positionLabel,
                center_widget: Box([
                    prev,
                    playPause,
                    next,
                ]),
                end_widget: lengthLabel,
            }),
        ),
    )
}

export function Muppet() {
    return Widget.Box({
        vertical: true,
        css: "min-height: 2px; min-width: 2px;", // small hack to make it visible
        visible: players.as(p => p.length > 0),
        children: players.as(p => p.map(Player)),
    })
}
