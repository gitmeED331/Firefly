r
use imports::{Widget, Roundedges, App, Service};
use options;

use std::future::Future;

const RoundedAngleEnd = Roundedges::RoundedAngleEnd;
const Window = Widget::Window;
const Box = Widget::Box;
const CenterBox = Widget::CenterBox;
const Button = Widget::Button;
const Icon = Widget::Icon;

// let mpris = Service::import("mpris").await;

// Widgets
mod Workspaces;
use Workspaces::Workspaces;
mod App_Title_Ticker;
use App_Title_Ticker::Title;
mod Media_Ticker;
use Media_Ticker::TickerBTN;
mod SysInfo;
use SysInfo::SysInfo;
mod SysTray;
use SysTray::{TrayReveal, Expandbtn};
mod Clock;
use Clock::Clock;

let pos = options::bar.position.bind();

fn Dashbtn() -> Widget {
    Button {
        class_name: "BarBTN".to_string(),
        css: "padding-right: 0.5rem;".to_string(),
        tooltip_text: "Dashboard".to_string(),
        on_clicked: || App::toggle_window("dashboard"),
        child: Icon { icon: "nix-snowflake-symbolic".to_string() },
    }
}

fn Powerbtn() -> Widget {
    Button {
        class_name: "BarBTN".to_string(),
        css: "padding-right: 0.5rem;".to_string(),
        tooltip_text: "Power Menu".to_string(),
        child: Icon { icon: "preferences-system-network-wakeonlan".to_string() },
        on_clicked: || App::toggle_window("sessioncontrols"),
    }
}

fn Left() -> Widget {
    Box {
        class_name: "barleft".to_string(),
        hpack: "start".to_string(),
        vpack: "center".to_string(),
        children: vec![
            Workspaces(),
            RoundedAngleEnd("topright", "angleRight".to_string()),
            RoundedAngleEnd("topleft", "angleLeft".to_string()),
            Title(),
            RoundedAngleEnd("topright", "angleRight".to_string()),
        ],
    }
}

fn Center() -> Widget {
    Box {
        class_name: "barcenter".to_string(),
        hpack: "center".to_string(),
        vpack: "center".to_string(),
        hexpand: true,
        children: vec![
            RoundedAngleEnd("topleft", "angleLeft".to_string()),
            Clock(),
            RoundedAngleEnd("topright", "angleRight".to_string()),
            RoundedAngleEnd("topleft", "angleLeft".to_string()),
            Expandbtn(),
            TrayReveal(),
            RoundedAngleEnd("topright", "angleRight".to_string()),
            SysInfo(),
        ],
    }
}

fn Right() -> Widget {
    Box {
        class_name: "barright".to_string(),
        hpack: "end".to_string(),
        vpack: "center".to_string(),
        hexpand: true,
        children: vec![
            RoundedAngleEnd("topleft", "angleLeft".to_string()),
            TickerBTN(),
            RoundedAngleEnd("topright", "angleRight".to_string()),
            RoundedAngleEnd("topleft", "angleLeft".to_string()),
            Dashbtn(),
            Powerbtn(),
        ],
    }
}

pub fn Bar() -> Widget {
    Window {
        name: "bar".to_string(),
        layer: "top".to_string(),
        anchor: pos.as(|pos| vec![pos, "right".to_string(), "left".to_string()]),
        exclusivity: "exclusive".to_string(),
        child: CenterBox {
            class_name: "bar".to_string(),
            hexpand: true,
            vexpand: true,
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right(),
        },
    }
}

