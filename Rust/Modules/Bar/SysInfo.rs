r
use imports::{Widget, Roundedges};
use Widgets::index::{VolumeIndicator, Battery};

let RoundedAngleEnd = Roundedges::RoundedAngleEnd;
let Box = Widget::Box;

fn sys_info_box() -> Box {
    Box::new()
        .hexpand(true)
        .class_name("sysinfo")
        .spacing(8)
        .children(vec![
            VolumeIndicator::new(),
            Battery::new(),
        ])
}

pub fn sys_info() -> Box {
    Box::new()
        .children(vec![
            RoundedAngleEnd("topleft", vec![("class_name", "angleLeft")]),
            sys_info_box(),
            RoundedAngleEnd("topright", vec![("class_name", "angleRight")]),
        ])
}

