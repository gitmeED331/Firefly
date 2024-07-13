import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Service from "resource:///com/github/Aylur/ags/service.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";

import Gio from "gi://Gio";
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from "gi://Gdk?version=3.0";
import GLib from "gi://GLib";
import type GObject from "gi://GObject"
import Lock from "gi://GtkSessionLock";
import Cairo from "gi://cairo";

import AstalAuth from "gi://AstalAuth";

import * as Roundedges from "./lib/roundedCorner";

export {
    App,
    Service,
    Utils,
    Variable,
    Widget,
    
    Mpris,

    Gio,
    Gtk,
    Gdk,
    Lock,

    AstalAuth,

    Roundedges,
};
