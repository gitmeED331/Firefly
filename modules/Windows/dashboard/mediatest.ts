import { Mpris } from "imports";
const players = Mpris.bind("players");
const player = Mpris.getPlayer('deezer') || Mpris.getPlayer('');

export default () => {
    console.log(player);
    const loop = player.bind('loop-status');

    const artwork = Widget.Box({
        vpack: 'start',
        className: 'media-artwork',
        css: player.bind('cover_path').transform(p => `background-image: url('${p}');`) || ``,
    });

    const title = Widget.Label({
        wrap: true,
        hpack: 'start',
        cursor: 'text',
        truncate: 'end',
        className: 'media-title',
        label: player.bind('track-title') || 'No Media Playing',
    });

    const artists = Widget.Label({
        wrap: true,
        hpack: 'start',
        cursor: 'text',
        truncate: 'end',
        className: 'media-artists',
        label: player.bind('track-artists').transform(a => a.join(", ")) || 'No Media Playing',
    });

    const next = Widget.Button({
        className: 'media-button',
        onClicked: () => player.next(),
        child: Widget.Icon({ icon: 'tabler-next' })
    });

    const previous = Widget.Button({
        className: 'media-button',
        onClicked: () => player.previous(),
        child: Widget.Icon({ icon: 'tabler-previous' })
    });

    const shuffle = Widget.Button({
        className: 'media-button',
        onClicked: () => player.shuffle(),
        child: Widget.Icon({ icon: 'tabler-shuffle' }),
        css: !!player.bind('shuffle-status') ? 'background-color: #1E2127;' : ''
    });

    const repeat = Widget.Button({
        className: 'media-button',
        onClicked: () => player.loop(),
        css: player && loop !== 'None' ? 'background-color: #1E2127;' : '',
        child: Widget.Icon({ icon: `tabler-repeat${loop === 'Track' ? '-one' : ''}` }),
    });

    const toggle = Widget.Button({
        className: 'media-button-primary',
        onClicked: () => player.playPause(),
        child: Widget.Icon({ icon: player && !player.can_play ? 'tabler-pause' : 'tabler-play' }),
    });

    const controls = Widget.CenterBox({
        spacing: 6, vpack: 'end', expand: true, className: 'media-controls',
        endWidget: Widget.Label({ hpack: 'end', className: 'media-position', label: player.bind('length') || '0:00' }),
        startWidget: Widget.Label({ hpack: 'start', className: 'media-position', label: player.bind('position') || '0:00' }),
        centerWidget: Widget.Box({ spacing: 5, children: [shuffle, previous, toggle, next, repeat] })
    });

    const media = Widget.CenterBox({
        vertical: true,
        endWidget: controls,
        className: 'media-primary',
        startWidget: Widget.Box({ vertical: true, children: [title, artists] }),
    });

    return Widget.Box({ className: 'media', children: [artwork, media] });
};
