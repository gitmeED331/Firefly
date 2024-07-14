import { Widget, Utils, Mpris, App } from "imports"
import options from "options"

//const { RoundedCorner } = Roundedges
const { Box, Button, Icon, Label } = Widget

//const players = Mpris.bind("players")
//const player = Mpris.getPlayer("Deezer") || Mpris.getPlayer('')

const { bar, playwin } = options
const pos = playwin.position.bind()
const layout = Utils.derive([bar.position, playwin.position], (bar, qs) =>
	`${bar}-${qs}` as const,
)

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
		size: 15,
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
		className: "tickerbox",
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
				//tickerBox.css = `background-image: url("${Utils.lookUpIcon(iconName) ? iconName : FALLBACK_ICON}");`;

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
		onPrimaryClick: () => App.toggleWindow("mediaplayerwindow"),
		setup: (self) => {
			const update = () => {
				const player = Mpris.getPlayer('Deezer') || Mpris.getPlayer('');
				if (player) {
					self.tooltip_markup = `<b>${player.identity}</b>\n\n<u>${player.trackArtists.join(", ")}</u>\n\n${player.trackTitle}`;
					self.on_secondary_click = () => player.playPause();
					self.on_scroll_up = () => player.previous();
					self.on_scroll_down = () => player.next();

				} else {
					self.tooltip_text = "";
					self.on_secondary_click = null;
					self.on_scroll_up = null;
					self.on_scroll_down = null;
				}
				updateTicker(player);
			}
			update();
			setInterval(update, 1000);
		}
	}, tickerBox);

	return button
}
