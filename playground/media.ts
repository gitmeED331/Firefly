
//const MediaIcon = Button({
//	classNames: ['media', 'mbtn'],
//	 onClicked: () => {
//		 const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
//		  player.playPause()
//	},
//	child: Icon()
//	.hook(Mpris, (icon) => {
//		const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
//		if (!player) return;
//		let icn = icons.mpris.stopped;
//		if (player.play_back_status === "Playing")
//		  icn = icons.mpris.playing;
//		else if (player.play_back_status === "Paused")
//		  icn = icons.mpris.paused;
//		icon.icon = icn;
//	  }),
//})

//function pwinOverlay() {
//	const player = Mpris.getPlayer('')
//	const positionBar = Widget.LevelBar({
//		class_name: "position",
//		draw_value: false,
//		on_change: ({ value }) => player.position = value * player.length,
//		visible: player.bind("length").as(l => l > 0),
//		setup: self => {
//			function update() {
//				const value = player.position / player.length
//				self.value = value > 0 ? value : 0
//			}
//			self.hook(player, update)
//			self.hook(player, update, "position")
//			self.poll(1000, update)
//		},
//	})
//
//	const positionLabel = Label({
//		className: "position",
//		hpack: "center",
//		setup: self => {
//			const update = (_, time) => {
//				self.label = lengthStr(time || player.position)
//				self.visible = player.length > 0
//			}
//
//			self.hook(player, update, "position")
//			self.poll(1000, update)
//		},
//	})
//	const lengthLabel = Label({
//		className: "length",
//		hpack: "end",
//		visible: player.bind("length").transform(l => l > 0),
//		label: player.bind("length").transform(lengthStr),
//	})
//	const trackTitle = Button({
//	classNames: ['media', 'mbtn'],
//	onPrimaryClick: ( ) => App.toggleWindow("playwin"),
//	onSecondaryClick: () => {
//		 const player = Mpris.getPlayer("deezer") || Mpris.getPlayer();
//		  player.playPause()
//	},
//	child: Label({
//		hexpand: true,
//		truncate: 'end',
//		//maxWidthChars: 30,
//		setup: (self) => self.hook(Mpris, label => {
//			const mpris = Mpris.getPlayer('');
//			if (mpris)
//				label.label =  ` ${trimTrackTitle(mpris.trackTitle)} • ${mpris.trackArtists.join(', ')}`;
//			else
//				self.label = 'No media';
//		}),
//	})
//	})
//	return mover = Widget.Overlay({
//		passThrough: true,
//		overlays: [
//			positionBar,
//			positionLabel,
//			lengthLabel,
//		],
//		child: trackTitle
//	})
//}



/*
Label('-').hook(Mpris, self => {
		if (Mpris.players[0]) {
			const { track_title } = Mpris.players[0];
			self.label = track_title.length > 30 ? `${track_title.substring(0, 30)}...` : track_title;
		} 
	else {
		self.label = 'Nothing is playing';
	}
	}, 'player-changed'),
*/


/*
 * function bruteForcePlaybackTime() {
	clearInterval(counter);
	counter = setInterval(() => {
		if (playBackStatus.value !== "Playing") return;
		position.value = position.value + 1;
		if (length.value > 0) {
			let thisPercentage = position.value / length.value;
			percentage.setValue((thisPercentage > 0) ? thisPercentage : 0.0);
		}
	}, 1000)
}
if (title.value !== getplayer.track_title) {
		title.value = getplayer.track_title;

		if (getplayer.position === -1) {
			position.value = 1;
			bruteForcePlaybackTime()
		}
	}
*/
