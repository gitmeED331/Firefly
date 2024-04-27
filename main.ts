import { Utils, App, Gio, Gtk, Hyprland } from "./imports";
import "./lib/session";
import init from "./lib/init";
import options from "./options";


// Windows
import { Bar } from "./modules/bar/bar";
import { Dashboard } from "./modules/dashboard/dashboard";
import { Playwin } from "./modules/bar/media";
import { Calendar } from "./modules/bar/calendar";
import{ Dashvol } from "./modules/bar/sysinfo/volume";
import Overview from "./modules/bar/overview/Overview";

const { execAsync, exec, monitorFile } = Utils;

const scss = `${App.configDir}/style/main.scss`;
const css = `${App.configDir}/style.css`;
const icons = `${App.configDir}/Icons`;

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
        Calendar()
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
