import { Utils, App, Gio, Gtk, Hyprland, Widget } from "imports"
import "lib/session"
//import init from "lib/init"
import { forMonitors } from "lib/utils"
import options from "options"
import DirectoryMonitorService from "lib/DirectoryMonitorService"

// Windows
import { Bar } from "modules/bar/bar"
import { Dashboard } from "modules/dashboard/dashboard"
import { Playwin } from "modules/bar/media"
import { Calendar } from "modules/bar/calendar"
import{ Dashvol } from "modules/bar/sysinfo/volume"


import NotificationPopups from "modules/notificationPopups"
import Overview from "modules/overview/Overview"
import sessioncontrols from "modules/sessioncontrol"
import pwrprofiles from "modules/powerprofile"
import Launcher from "modules/launcher/Launcher"

const { execAsync, exec, monitorFile } = Utils;

const scss = `${App.configDir}/style/main.scss`
const css = `${App.configDir}/style.css`
const icons = `${App.configDir}/assets`

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
	onConfigParsed: () => {
		Dashboard()
		Dashvol()
		Playwin()
		Calendar()
	},
	closeWindowDelay: {
		"overview": options.transition.value,
		},
	style: applyScss(),
	icons: icons,
	windows: () => [ 
		...forMonitors(Bar),
		...forMonitors(NotificationPopups),
		Overview(),
		sessioncontrols(),
		pwrprofiles(),
		Launcher()
	],
})
