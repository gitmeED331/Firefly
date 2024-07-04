import { Widget, Utils, Mpris, PopupWindow, Roundedges, Revealer } from "imports"
import options from "options"
import icon from "lib/utils"
import icons from "lib/icons"
import {horizontalMargin} from "../buttons/variables"

const { RoundedAngleEnd, RoundedCorner } = Roundedges
const { Box, Button, Icon, Label, Slider, EventBox } = Widget
const { execAsync, lookUpIcon } = Utils

const mpris = await Service.import("mpris")
const players = Mpris.bind("players")
const player = Mpris.getPlayer("deezer-enhanced") || Mpris.getPlayer('')

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

export function TickerBTN() {
	const tickerTrack = Label({
		className: "tickertrack",
		wrap: false,
		hpack: "center",
		vpack: "center",
		vexpand: true,
		truncate: 'end',
		maxWidthChars: 30,
		label: "",
	})

	const tickerArtist = Label({
		className: "tickerartist",
		wrap: false,
		hpack: "center",
		vpack: "center",
		truncate: 'end',
		maxWidthChars: 30,
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
		vexpand: true,
		label: "No Media"
	})

	const tickerBox = Box({
		vertical: false,
		hexpand: true,
		vexpand: false,
		vpack: "center",
		spacing: 5,
		children: [noMediaLabel],
	})

	const updateTicker = (player) => {
		try {
			if (player) {
				updateTickerContent(player);
			} else {
				hideTicker();
			}
		} catch (e) {
			console.error("Failed to update ticker: ", e);
		}
	};

	const updateTickerContent = (player) => {
		try {
			tickerTrack.set_text(trimTrackTitle(player.trackTitle));
			tickerArtist.set_text(player.trackArtists.join(", "));
			const iconName = player.entry ? `${player.entry}` : FALLBACK_ICON;
			tickerIcon.set_from_icon_name(iconName, Gtk.IconSize.BUTTON);

			showTickerElements();
		} catch (e) {
			console.error("Failed to update ticker content: ", e);
		}
	};

	const hideTicker = () => {
		try {
			if (tickerBox.get_children().includes(tickerTrack)) {
				tickerBox.remove(tickerTrack);
			}
			if (tickerBox.get_children().includes(tickerIcon)) {
				tickerBox.remove(tickerIcon);
			}
			if (tickerBox.get_children().includes(tickerArtist)) {
				tickerBox.remove(tickerArtist);
			}
			if (!tickerBox.get_children().includes(noMediaLabel)) {
				tickerBox.add(noMediaLabel);
			}
		} catch (e) {
			console.error("Failed to hide ticker: ", e);
		}
	};

	const showTickerElements = () => {
		try {
			if (tickerBox.get_children().includes(noMediaLabel)) {
				tickerBox.remove(noMediaLabel);
			}

			if (!tickerBox.get_children().includes(tickerTrack)) {
				tickerBox.add(tickerTrack);
			}
			if (!tickerBox.get_children().includes(tickerIcon)) {
				tickerBox.add(tickerIcon);
			}
			if (!tickerBox.get_children().includes(tickerArtist)) {
				tickerBox.add(tickerArtist);
			}
		} catch (e) {
			console.error("Failed to show ticker elements: ", e);
		}
	};


	const initialPlayerData = null
	updateTicker(initialPlayerData)


	const button = Button({
		className: 'tickerbtn',
		vexpand: false,
		hexpand: true,
		onPrimaryClick: () => App.toggleWindow("playwin"),
		setup: (self) => {
			const update = () => {
				try {
					const player = Mpris.getPlayer('deezer-enhanced') || Mpris.getPlayer('');
					if (player) {

						self.tooltipText = `${player.identity}\n${player.trackArtists.join(", ")}\n\t${player.trackTitle}`;

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
				} catch (e) {
					console.error("Failed to update button: ", e);
				}
			}

			update();
			setInterval(update, 1000);
		}
	}, tickerBox);

	return button;
}
