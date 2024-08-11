r
use imports::{Widget, Utils, App, Variable, GLib};
use crate::Windows::Calendar;

use Widget::{Button, Label};
use Utils::exec_async;

let time = Variable::new(GLib::DateTime::new_now_local(), |poll| {
    poll.push(1000, || GLib::DateTime::new_now_local());
});

pub const Clock = || {
    Button::new()
        .class_name("clock")
        .on_clicked(|| {
            if App::get_window("calendar").is_none() {
                App::add_window(Calendar());
            } else {
                App::toggle_window("calendar");
            }
        })
        .child(Label::new()
            .label(time.bind().as(|c| c.format("%a %b %d %H:%M.%S"))))
};

