import { Utils, App, Gio, Gtk, Hyprland, Widget } from "./imports";
import "./lib/session";
import init from "./lib/init";
import options from "./options";

// Windows
import { Bar } from "./modules/bar/bar";
import { Dashboard } from "./modules/dashboard/dashboard";
import { Playwin } from "./modules/bar/media";
import { powerWIN } from "./modules/dashboard/power";
import { CalendarWin } from "./modules/bar/calendar";
import{ Dashvol } from "./modules/bar/sysinfo/volume";
//import { NetWidget } from "./modules/bar/sysinfo/network";
import Overview from "./modules/bar/overview/Overview";
import NotificationPopups from "./modules/notificationPopups";

const { execAsync, exec, monitorFile } = Utils;

const scss = `${App.configDir}/style/main.scss`;
const css = `${App.configDir}/style.css`;
const icons = `${App.configDir}/assets`;

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

// Main config
App.config({
	onConfigParsed: () => {
		Dashboard()
		Dashvol()
		Playwin()
		CalendarWin()
		NotificationPopups()
		powerWIN()
	},
	closeWindowDelay: {
		"overview": options.transition.value,
		},
	style: applyScss(),
	icons: icons,
	windows: () => [ 
		Bar(),
		Overview(),
	],
})
