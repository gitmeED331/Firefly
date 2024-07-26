import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Icon from "lib/icons"

const players = Mpris.bind("players")
// this will generate a player for each audio output currently playing 

const player = Mpris.getPlayer("cider") || Mpris.getPlayer('');
//or to ensure only one specific player, use: const player = "cider"

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
 * @param {import('types/service/mpris').MprisPlayer} player
 */
async function blurCoverArtCss(player, default_color) {

    const coverPath = player.cover_path;

    /** @param {string} bg
    *   @param {string} color
    */
    const genCss = (bg, color) =>
        `background-image: radial-gradient(
      circle at right,
      rgba(0, 0, 0, 0),
      ${color} 11.5rem), ${bg};
    background-position: right top, right top;
    background-size: contain;
    transition: all 0.7s ease;
    background-repeat: no-repeat;`;

    if (coverPath) {
        const color = await execAsync(`bash -c "convert ${coverPath} -alpha off -crop 5%x100%0+0+0 -colors 1 -unique-colors txt: | head -n2 | tail -n1 | cut -f4 -d' '"`);
        return genCss(`url('${coverPath}')`, color);
    }
    return genCss(`-gtk-icontheme('${player.entry}')`, default_color);
}

/** @param {number} length */
function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? "0" : "";
    return `${min}:${sec0}${sec}`;
}

/** @param {import('types/service/mpris').MprisPlayer} player */
function Player(player) {
    const Title = Widget.Label({
        classNames: ["cc-media-label", "cc-media-title"],
        justification: 'left',
        truncate: 'end',
        xalign: 0,
        maxWidthChars: 28,
        wrap: false,
        hpack: "start",
        label: trimTrackTitle(player.trackTitle).toUpperCase()
    });

    const Artist = Widget.Label({
        classNames: ["cc-media-label", "cc-media-artist"],
        justification: 'left',
        truncate: 'end',
        xalign: 0,
        maxWidthChars: 24,
        wrap: false,
        hpack: "start",
        label: player.bind("track_artists").transform(artist => artist.join(", ").toUpperCase())
    });

    const positionLabel = Widget.Label({
        classNames: ["cc-media-label", "cc-media-position-label"],
        hpack: "start",
        setup: self => {
            const update = (_, time) => {
                self.label = lengthStr(time || player.position);
                self.visible = player.length > 0;
            };

            self.hook(player, update, "position");
            self.poll(1000, update);
        },
    });

    const lengthLabel = Widget.Label({
        classNames: ["cc-media-label", "cc-media-length-label"],
        hpack: "start",
        visible: player.bind("length").transform(l => l > 0),
        label: player.bind("length").transform(lengthStr),
    })

    const positionSlider = Widget.Slider({
        classNames: ["cc-media-position-slider", "cc-slider"],
        drawValue: false,
        hexpand: true,
        hpack: "fill",
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
    });

    const SliderControlBox = Widget.CenterBox({
        classNames: [""],
        spacing: 0,
        vertical: false,
        startWidget: positionLabel,
        centerWidget: positionSlider,
        endWidget: lengthLabel,
        hexpand: true,
        hpack: "fill"
    });

    const IconPrevious = Widget.Button({
        classNames: ["cc-button", "cc-media-button"],
        vpack: "center",
        on_clicked: () => player.previous(),
        visible: player.bind("can_go_prev"),
    },
        Widget.Icon(Icon.media.previous),
    )


    const IconToggle = Widget.Button(
        {
            classNames: ["cc-button", "cc-media-button"],
            vpack: "center",
            on_clicked: () => player.playPause(),
            visible: player.bind("can_play"),
        },
        Widget.Icon({
            icon: player.bind("play_back_status").transform(s => {
                switch (s) {
                    case "Playing": return Icon.media.pause
                    case "Paused":
                    case "Stopped": return Icon.media.play
                }
            }),
        }),
    )

    const IconNext = Widget.Button(
        {
            classNames: ["cc-button", "cc-media-button"],
            vpack: "center",
            on_clicked: () => player.next(),
            visible: player.bind("can_go_next"),
        },
        Widget.Icon(Icon.media.next),
    )

    const MediaDetailsBox = Widget.Box(
        {
            classNames: ["cc-media-details-box"],
            vertical: true,
            vpack: "end",
            vexpand: true,
            hpack: "start",
            hexpand: true
        },
        Title, Artist
    );

    return Widget.Box({
        className: "cc-media-player",
        vertical: false,
        hexpand: true,
        hpack: "fill",
        vpack: "fill",
        vexpand: true,
        children: [
            Widget.Box(
                {
                    classNames: ["cc-media-details-container"],
                    vertical: true,
                    hexpand: true,
                    hpack: "fill"
                },
                MediaDetailsBox,
                SliderControlBox
            ),
            Widget.CenterBox({
                classNames: ["cc-media-controls-box"],
                spacing: 5,
                vertical: true,
                startWidget: IconPrevious,
                centerWidget: IconToggle,
                endWidget: IconNext,
                hexpand: false,
                hpack: "end",
                vexpand: true,
                vpack: "fill"
            })
        ],

    }).hook(player, async (self) => {
        const color = self.get_style_context().get_background_color(Gtk.StateFlags.NORMAL).to_string();
        self.css = await blurCoverArtCss(player, color);
    }, "notify::cover-path");
}

export default Player

// use this to import the player:
// import { Player } from 'ags/modules/Widgets/Media.js'

// Use this where you want to use the player (this will prevent any player that is
//stopped / closed from being shown, such as a closed web browser tab)
// however, it will show a player for every audio output currentlying,
// see the adjustment at the top to set it to only one specific output
// without making any adjustment to the code below:
// 
// widget.Box({
//     visible: Players.as(player => player.length > 0),
//     children: Utils.watch([], [
//         [Mpris, "player-changed"],
//         [Mpris, "player-added"],
//         [Mpris, "player-closed"],
//     ], () => Mpris.players)
//         .transform(p => p.filter(p => p.play_back_status !== 'Stopped').map(Player))
// })