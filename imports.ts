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
import Gtk from 'gi://Gtk'; //?version=4.0
import Gdk from "gi://Gdk";
import GLib from "gi://GLib";
import type GObject from "gi://GObject"
import Lock from "gi://GtkSessionLock";
import Cairo from "gi://cairo";

import AstalAuth from "gi://AstalAuth";

import PopupWindow from "./lib/PopupWindow";
import RegularWindow from "./lib/RegularWindow";
import * as Roundedges from "./lib/roundedCorner";

export {
    App,
    Service,
    Utils,
    Variable,
    Widget,

    Applications,
    Audio,
    Battery,
    Bluetooth,
    Hyprland,
    Mpris,
    Network,
    Notifications,
    SystemTray,

    Cairo,
    Gio,
    Gtk,
    Gdk,
    GLib,
    GObject,
    Lock,

    AstalAuth,

    PopupWindow,
    RegularWindow,
    Roundedges,
};
