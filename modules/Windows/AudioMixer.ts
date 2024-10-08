import { Widget, Utils, PopupWindow, App } from "imports";
import options from "options";
import { AudioMixer } from "../Widgets/index"

const { Box, Button, Icon, Slider, Label } = Widget;

const { bar, dashvol } = options;
const pos = dashvol.position.bind();
const layout = Utils.derive([bar.position, dashvol.position], (bar, qs) =>
    `${bar}-${qs}` as const,
);

// --- Audio Mixer PopupWindow ---
export default () => PopupWindow({
    name: "audiomixerwindow",
    className: "audiomixerwindow",
    anchor: pos,
    transition: "crossfade",
    layer: "top",
    exclusivity: 'normal',
    keymode: 'on-demand',
    margins: [0, 525],
    child:
        AudioMixer(),

});

