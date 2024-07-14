import { Widget, Utils, Mpris, PopupWindow, App } from "imports"
import options from "options"
import { Player } from "../Widgets/index"

//const { RoundedCorner } = Roundedges
const { Box } = Widget

const players = Mpris.bind("players")
const player = Mpris.getPlayer("Deezer") || Mpris.getPlayer('')

const { bar, playwin } = options
const pos = playwin.position.bind()
const layout = Utils.derive([bar.position, playwin.position], (bar, qs) =>
    `${bar}-${qs}` as const,
)

// ----------- The Player Window ------------

function MPW() {
    return PopupWindow({
        name: "mediaplayerwindow",
        className: "mediaplayerwindow",
        anchor: pos,
        layer: "top",
        exclusivity: "normal",
        keymode: "on-demand",
        margins: [0, 90, 0, 0],
        transition: pos.as(pos => (pos === "top" ? "slide_down" : "slide_up")),
        child: Box({
            vertical: true,
            children: Utils.watch([], [
                [Mpris, "player-changed"],
                [Mpris, "player-added"],
                [Mpris, "player-closed"],
            ], () => Mpris.players)
                .transform(p => p.filter(p => p.play_back_status !== 'Stopped').map(Player)),
        }),
    });
}

export function MediaPlayerWindow() {
    App.addWindow(MPW())
    layout.connect("changed", () => {
        App.removeWindow("mediaplayerwindow")
        App.addWindow(MPW())
    })
}