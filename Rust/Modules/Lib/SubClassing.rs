use imports::{Widget, Gtk};

let Switch = Widget::subclass::<Gtk::Switch>("AgsSwitch");
let TextView = Widget::subclass::<Gtk::TextView>("AgsTextView");
let ComboBoxText = Widget::subclass::<Gtk::ComboBoxText>("AgsComboBoxText");
let ComboBox = Widget::subclass::<Gtk::ComboBox>("AgsComboBox");

pub {
    Switch,
    TextView,
    ComboBox,
    ComboBoxText,
};
