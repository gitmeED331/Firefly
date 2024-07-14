import { Widget, Utils, Mpris, Roundedges } from "imports"

const { RoundedCorner } = Roundedges
const { Box, Button, Icon, Label, Slider, } = Widget

const players = Mpris.bind("players")
const player = Mpris.getPlayer("Deezer") || Mpris.getPlayer('')

const FALLBACK_ICON = "audio-x-generic-symbolic"
const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"
const CLOSE_ICON = "window-close-symbolic"

const Spacer = () => Box({
    //className: "spacer",
    vexpand: true,
})

function trimTrackTitle(title) {
    if (!title) return '';
    const cleanPatterns = [
        /【[^】]*】/,         // Touhou n weeb stuff
        " [FREE DOWNLOAD]", // F-777
        " (Radio Version)",
        " (Album Version)",
        " (Cafe Session)",
        " (International Version)",
    ];
    cleanPatterns.forEach((expr) => title = title.replace(expr, ''));
    return title
}

/** @param {number} length */
function lengthStr(length) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

/** @param {import('types/service/mpris').MprisPlayer} player */
export function Player(player) {
    const img = Box({
        class_name: "trackimg",
        vpack: "center",
        hpack: "center",
        css: player.bind("track_cover_url").transform(p => {
            if (!p) {
                return `
				min-width: 0px;
				min-height: 0px;
				border: none;
				margin: 0px;
				padding: 0px;
				`;
            } else {
                return `
				background-image: url('${p}');
				min-width: 60px;
				min-height: 65px;
				`;
            }
        }),
    })

    const title = Label({
        className: "tracktitle",
        wrap: false,
        hpack: "center",
        vpack: "end",
        vexpand: true,
        truncate: 'end',
        maxWidthChars: 35,
        lines: 1,
        label: `${trimTrackTitle(player.trackTitle)}`,
    })

    const artist = Label({
        className: "artist",
        wrap: false,
        hpack: "center",
        vpack: "start",
        truncate: 'end',
        maxWidthChars: 30,
        label: player.bind("track_artists").transform(a => a.join(", ")),
    })

    const positionSlider = Slider({
        class_name: "position",
        draw_value: false,
        on_change: ({ value }) => player.position = value * player.length,
        visible: player.bind("length").as(l => l > 0),
        setup: self => {
            function update() {
                const value = player.position / player.length;
                self.value = value > 0 ? value : 0;
            }
            self.hook(player, update);
            self.hook(player, update, "position");
            self.poll(1000, update);
        },
    }).on("realize", self => {
        self.visible = player.length > 0;
    })

    const positionLabel = Label({
        className: "position",
        hpack: "center",
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
        className: "length",
        hpack: "center",
        visible: player.bind("length").transform(l => l > 0),
        label: player.bind("length").transform(lengthStr),
    })

    const icon = () => Icon({
        hexpand: true,
        hpack: "end",
        vpack: "center",
        className: "playicon",
        tooltip_text: player.identity || "",
        icon: player.bind("entry").transform(entry => {
            const name = `${entry}`
            return Utils.lookUpIcon(name) ? name : FALLBACK_ICON
        }),
    })

    const playPause = Button({
        class_name: "play-pause",
        vpack: "center",
        on_clicked: () => player.playPause(),
        visible: player.bind("can_play"),
        child: Icon({
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
        vpack: "center",
        on_clicked: () => player.previous(),
        visible: player.bind("can_go_prev"),
        child: Icon(PREV_ICON),
    })

    const next = Button({
        className: "next",
        vpack: "center",
        on_clicked: () => player.next(),
        visible: player.bind("can_go_next"),
        child: Icon(NEXT_ICON),
    })

    const close = Button({
        className: "close",
        vpack: "center",
        onClicked: () => player.stop(),
        child: Icon(CLOSE_ICON),
    })

    return Box(
        {
            className: "player",
            vertical: false,
            vexpand: true,
        },
        img,
        Box(
            { vertical: true, vpack: "center", },
            Box(
                { vertical: false, },
                Box(
                    {
                        vertical: true,
                        hexpand: true,
                        hpack: "fill",
                        vpack: "center",
                        spacing: 5,
                    },
                    title,
                    artist,
                ),
                Box(
                    {
                        vertical: true,
                        hpack: "end",
                        vpack: "center",
                        spacing: 5,
                    },
                    icon(),
                    positionLabel,
                ),
            ),
            positionSlider,
        ),
        Box({ vertical: true, vpack: "fill", },
            RoundedCorner("topright", { className: "mediacurves", vpack: "start" }),
            Spacer(),
            RoundedCorner("bottomright", { className: "mediacurves", vpack: "end" }),
        ),
        Box(
            {
                className: "playercontrols",
                vexpand: false,
                hexpand: false,
                hpack: 'center',
            },
            prev,
            playPause,
            next,
            close,
        ),
    )
}