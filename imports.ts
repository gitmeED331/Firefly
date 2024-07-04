import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Service from "resource:///com/github/Aylur/ags/service.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";

import Applications from "resource:///com/github/Aylur/ags/service/applications.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import Battery from "resource:///com/github/Aylur/ags/service/battery.js";
import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";

import Gio from "gi://Gio";
import Gtk from 'gi://Gtk';
import Gdk from "gi://Gdk";
import GLib from "gi://GLib";
import type GObject from "gi://GObject"
import Lock from "gi://GtkSessionLock";
import Cairo from "gi://cairo";

import PopupWindow from "./lib/PopupWindow.ts";
import RegularWindow from "./lib/RegularWindow.ts";
import * as Roundedges from "./lib/roundedCorner";

export {
    App,
    Widget,
    Service,
    Variable,
    Utils,
    Applications,
    Audio,
    Battery,
    Bluetooth,
    Hyprland,
    Mpris,
    Network,
    Notifications,
    SystemTray,
    Gio,
    Gtk,
    Gdk,
    GLib,
    GObject,
    Cairo,
    PopupWindow,
    Roundedges,
    Lock,
};
