import { Variable, Widget, Utils, Mpris } from "imports"
import icons from "lib/icons"

const { Box, Button, Icon, Label, Slider, } = Widget
const { execAsync } = Utils

const players = Mpris.bind("players")
const player = Mpris.getPlayer("Deezer") || Mpris.getPlayer('')

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

/**
 * @param {string} coverPath
 */
async function blurCoverArtCss(coverPath: string): Promise<string> {

    /**
     * Generate CSS background style for music player.
     * @param {string} bg - Background image path.
     * @param {string} color - Dominant color extracted from the image.
     * @returns {string} CSS background style.
     */
    const playerBGgen = (bg: string, color: string): string =>
        `background-image: radial-gradient(circle at left, rgba(0, 0, 0, 0), ${color} 11.5rem), url('${bg}');
    background-position: left top, left top;
    background-size: contain;
    transition: all 0.7s ease;
    background-repeat: no-repeat;`;

    if (coverPath) {
        const color = await execAsync(`bash -c "convert ${coverPath} -alpha off -crop 5%x100%0+0+0 -colors 1 -unique-colors txt: | head -n2 | tail -n1 | cut -f4 -d' '"`);
        return playerBGgen(coverPath, color);
    }
    return "background-color: #0e0e1e";
}

/** @param {number} length */
function lengthStr(length) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

/** @param {import('types/service/mpris').MprisPlayer} player */
function Player(player) {
    const title = Label({
        className: "tracktitle",
        wrap: false,
        hexpand: true,
        hpack: "center",
        truncate: 'end',
        maxWidthChars: 35,
        label: trimTrackTitle(player.trackTitle)
    })

    const artist = Label({
        className: "artist",
        wrap: false,
        hexpand: true,
        hpack: "center",
        truncate: 'end',
        maxWidthChars: 30,
        label: player.bind("track_artists").transform(a => a.join(", ")),
    })

    const positionSlider = Slider({
        className: "position",
        drawValue: false,
        onChange: ({ value }) => player.position = value * player.length,
        visible: player.bind("length").as(l => l > 0),
        setup: self => {
            const update = () => {
                const value = player.position / player.length;
                self.value = value > 0 ? value : 0;
            };
            self.hook(player, update);
            self.hook(player, update, "position");
            self.poll(1000, update);
        },
    }).on("realize", self => {
        self.visible = player.length > 0;
    })

    const positionLabel = Label({
        className: "trackposition",
        hpack: "end",
        setup: self => {
            const update = (_, time) => {
                self.label = lengthStr(time || player.position);
                self.visible = player.length > 0;
            };

            self.hook(player, update, "position");
            self.poll(1000, update);
        },
    })

    const lengthLabel = Label({
        className: "tracklength",
        hpack: "start",
        visible: player.bind("length").transform(l => l > 0),
        label: player.bind("length").transform(lengthStr),
    })

    const icon = () => Button({
        onClicked: async () => {
            const entryValue = player.entry;
            if (entryValue && typeof entryValue === 'string') {
                await Utils.execAsync(`bash -c 'hyprctl dispatch exec "${entryValue}"'`);
            }
        },
        child: Icon({
            className: "playicon",
            hexpand: true,
            hpack: "end",
            vpack: "center",
            size: 30,
            tooltip_text: player.identity || "",
            icon: player.bind("entry").transform(entry => {
                const name = `${entry}`
                return Utils.lookUpIcon(name) ? name : icons.player.FALLBACK
            }),
        })
    })

    const playPause = Button({
        class_name: "play-pause",
        vpack: "center",
        on_clicked: () => player.playPause(),
        visible: player.bind("can_play"),
    },
        Icon({
            icon: player.bind("play_back_status").transform(s => {
                switch (s) {
                    case "Playing": return icons.player.PAUSE
                    case "Paused":
                    case "Stopped": return icons.player.PLAY
                }
            }),
        }),
    )

    const prev = Button({
        className: "previous",
        vpack: "center",
        on_clicked: () => player.previous(),
        visible: player.bind("can_go_prev"),
    },
        Icon(icons.player.PREV),
    )

    const next = Button({
        className: "next",
        vpack: "center",
        on_clicked: () => player.next(),
        visible: player.bind("can_go_next"),
    },
        Icon(icons.player.NEXT),
    )
    let revealClose = Variable(false)
    const close =
        Button({
            className: "close",
            vpack: "center",
            onClicked: () => player.stop(),
        },
            Icon(icons.player.CLOSE),
        )

    return Box(
        { vertical: false, spacing: 5, hpack: "end", vpack: "center", className: "player", },
        Widget.CenterBox({
            className: "mediainfo",
            vertical: true,
            vexpand: true,

            startWidget: Box(
                { vertical: false, vpack: "center", },
                Box({ className: "trackinfo", vpack: "center", hpack: "center", hexpand: true, vertical: true, spacing: 5, },
                    title,
                    artist,
                ),
                Box(
                    { hpack: "end", vertical: false },
                    icon(),
                )
            ),

            centerWidget: Box(
                { vertical: true },
                positionSlider,
                Widget.CenterBox({
                    vertical: false,
                    startWidget: lengthLabel,
                    endWidget: positionLabel,
                }),
            ),
            endWidget: Box(
                { className: "playercontrols", vexpand: false, hexpand: false, hpack: 'center', vpack: "center" },
                prev, playPause, next,
            ),
        },

        ),
        close,
    ).hook(player, async (self) => {
        self.css = await blurCoverArtCss(player.cover_path);
    }, "notify::cover-path");
}

export default Player