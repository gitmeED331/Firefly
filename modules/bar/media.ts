import { Widget, Utils, Mpris, PopupWindow, Roundedges, Revealer, Gtk, Gdk } from "imports"
import options from "options"
import icon from "lib/utils"
import icons from "lib/icons"
import {horizontalMargin} from "../buttons/variables"

const { RoundedAngleEnd, RoundedCorner } = Roundedges
const { Box, Button, Icon, Label, Slider, EventBox } = Widget
const { execAsync, lookUpIcon } = Utils

const mpris = await Service.import("mpris")
const players = Mpris.bind("players")
const player = Mpris.getPlayer("Deezer") || Mpris.getPlayer('')

const { bar, playwin } = options;
const pos = playwin.position.bind();
const layout = Utils.derive([bar.position, playwin.position], (bar, qs) => 
		`${bar}-${qs}` as const,
	);

const FALLBACK_ICON = "audio-x-generic-symbolic"
const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"
const CLOSE_ICON = "window-close-symbolic"

const Spacer = () => Box({
	//className: "spacer",
	vexpand: true,
});


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
	return title;
}

// ----------- The Player ------------

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
	});

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


	const positionSlider = Widget.Slider({
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
	});

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
			{ vertical: true, vpack: "center",},
			Box(
				{vertical: false,},
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
		Box({vertical: true, vpack: "fill", },
		RoundedCorner("topright", {className: "mediacurves", vpack: "start"}),
		Spacer(),
		RoundedCorner("bottomright", {className: "mediacurves", vpack: "end"}),
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

function PWin() {
	return PopupWindow({
		name: "playwin",
		className: "playwin",
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

export function Playwin() {
	App.addWindow(PWin())
	layout.connect("changed", () => {
		App.removeWindow("playwin")
		App.addWindow(PWin())
	})
}

// ------------- Bar Media Ticker button -----------

export function TickerBTN() {
	const tickerTrack = Label({
		className: "tickertrack",
		wrap: false,
		hpack: "center",
		vpack: "center",
		vexpand: true,
		truncate: 'end',
		//maxWidthChars: 30,
		label: "",
	})

	const tickerArtist = Label({
		className: "tickerartist",
		wrap: false,
		hpack: "center",
		vpack: "center",
		truncate: 'end',
		//maxWidthChars: 30,
		label: "",
	})

	const tickerIcon = Icon({
		hexpand: true,
		hpack: "center",
		vpack: "center",
		className: "tickericon",
		tooltip_text: "",
		icon: FALLBACK_ICON,
	})

	const noMediaLabel = Label({
		className: "nomedia",
		wrap: false,
		hpack: "center",
		vpack: "center",
		hexpand: true,
		label: "No Media"
	})

	const tickerContent = Box(
		{
			vertical: false,
			visible: true,
			spacing: 5,
		},
		tickerTrack,
		tickerIcon,
		tickerArtist,
	)

	const tickerBox = Box({
		vertical: false,
		hexpand: true,
		vexpand: false,
		visible: true,
		vpack: "center",
		children: [noMediaLabel],
	})

	const updateTicker = (player) => {
		if (player) {
			if (tickerTrack && tickerArtist && tickerIcon) {
				tickerTrack.label = `${trimTrackTitle(player.trackTitle)}`;
				tickerArtist.label = player.trackArtists.join(", ");
				tickerIcon.tooltip_text = player.identity || "";

			const iconName = player.entry ? `${player.entry}` : FALLBACK_ICON;
				tickerIcon.icon = Utils.lookUpIcon(iconName) ? iconName : FALLBACK_ICON;

			if (tickerBox.get_children().includes(noMediaLabel)) {
				tickerBox.remove(noMediaLabel);
			}
			if (!tickerBox.get_children().includes(tickerContent)) {
				tickerBox.add(tickerContent);
			}
		}
		} else {
			if (tickerBox.get_children().includes(tickerContent)) {
				tickerBox.remove(tickerContent);
			}

			if (!tickerBox.get_children().includes(noMediaLabel)) {
				tickerBox.add(noMediaLabel);
			}
		}
	}

	const button = Button({
		className: 'tickerbtn',
		vexpand: false,
		hexpand: true,
		onPrimaryClick: () => App.toggleWindow("playwin"),
		setup: (self) => {
			const update = () => {
				const player = Mpris.getPlayer('Deezer') || Mpris.getPlayer('');
				if (player) {
					self.tooltipMarkup = `<b>${player.identity}</b>\n\n<u>${player.trackArtists.join(", ")}</u>\n\n${player.trackTitle}`;
					//`${player.identity}\n${player.trackArtists.join(", ")}\n\t${player.trackTitle}`;
					self.onSecondaryClick = () => player.playPause();
					self.onScrollUp = () => player.previous();
					self.onScrollDown = () => player.next();

				} else {
					self.tooltipText = "";
					self.onSecondaryClick = null;
					self.onScrollUp = null;
					self.onScrollDown = null;
				}
				updateTicker(player);
		}
		update();
		setInterval(update, 1000);
		}
	}, tickerBox);

	return button;
}
