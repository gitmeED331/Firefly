import { Widget, Audio, App } from "imports";

const { Box, Button } = Widget;

// --- volume button in sysinfo ---

export const VolumeIndicator = () => Box({
    className: 'volumebtn',
    child:
        Button({
            onPrimaryClick: () => { App.toggleWindow("volumemixer") },
            onSecondaryClick: () => { Audio.speaker.is_muted = !Audio.speaker.is_muted },
            on_scroll_up: () => Audio.speaker.volume += 0.035,
            on_scroll_down: () => Audio.speaker.volume -= 0.035,
            child:
                Widget.Icon().hook(Audio.speaker, self => {
                    const vol = Audio.speaker.volume * 150;
                    const icon = [
                        [101, 'overamplified'],
                        [67, 'high'],
                        [34, 'medium'],
                        [1, 'low'],
                        [0, 'muted'],
                    ].find(([threshold]) => threshold <= vol)?.[1];
                    self.icon = `audio-volume-${icon}-symbolic`;
                    self.tooltip_text = `Volume ${Math.floor(vol)}%`;
                }),
        }),
});
