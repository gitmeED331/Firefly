import { Utils, App } from "imports"
import "lib/session"
//import init from "lib/init"
import { forMonitors } from "lib/utils"
import options from "options"
import DirectoryMonitorService from "lib/DirectoryMonitorService"

// Windows
import { Bar } from "modules/bar/bar"
import {
	Dashboard,
	MediaPlayer,
	calendar,
	AudioMixer,
	NotificationPopups,
	Overview,
	sessioncontrols,
	pwrprofiles,
	Launcher,
	cliphist,
	bluetoothmenu,
	networkmenu
} from "modules/Windows/index"

const { execAsync, exec, monitorFile } = Utils;

const scss = `${App.configDir}/style/main.scss`
const css = `${App.configDir}/style.css`
const icons = `${App.dataDir}/icons/astal`

//console.time("startup")
const applyScss = () => {
	// monitor for changes
	monitorFile(
		// directory that contains the scss files
		`${App.configDir}/style`,

		exec(`sass ${scss} ${css}`),
		console.log("Scss compiled"),

		// main scss file
		App.resetCss(),
		console.log("Reset"),
		App.applyCss(css),
		console.log("Compiled css applied"),
	);
};

DirectoryMonitorService.connect("changed", () => applyScss());

// Main config
App.config({
	style: applyScss(),
	icons: icons,


	windows: () => [
		...forMonitors(Bar),
		...forMonitors(NotificationPopups),
		pwrprofiles(),
		Overview(),
		sessioncontrols(),
		Launcher(),
		cliphist,
		networkmenu(),
		bluetoothmenu(),
		calendar(),
		AudioMixer(),
		MediaPlayer(),
		Dashboard(),
		//console.timeEnd("startup")
	],
	closeWindowDelay: {
		"overview": options.transition.value,
		"dashboard": options.transition.value,
		"pwrprofiles": options.transition.value,
		"sessioncontrols": options.transition.value,
		"launcher": options.transition.value,
		"audiomixer": options.transition.value,
		"mediaplayer": options.transition.value,

	},
})
