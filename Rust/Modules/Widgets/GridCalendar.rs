use gtk::prelude::*;
use gtk::{Align, Box, Grid, Label, Widget};
use std::collections::HashMap;

const DAYS_OF_WEEK: [&str; 7] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES_SHORT: [&str; 12] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

fn generate_calendar(month: u32, year: i32) -> Vec<Vec<u32>> {
    let first_day_of_month = chrono::NaiveDate::from_ymd(year, month, 1).weekday().num_days_from_sunday();
    let days_in_month = chrono::NaiveDate::from_ymd(year, month + 1, 1)
        .pred()
        .day();
    let mut weeks = Vec::new();
    let mut week = Vec::new();

    let prev_month_last_day = chrono::NaiveDate::from_ymd(year, month, 1).pred().day();
    let prev_month_days = first_day_of_month;
    for i in prev_month_last_day - prev_month_days + 1..=prev_month_last_day {
        week.push(i);
    }

    for i in 1..=days_in_month {
        week.push(i);
        if week.len() == 7 {
            weeks.push(week.clone());
            week.clear();
        }
    }

    if !week.is_empty() {
        let remaining_days = 7 - week.len();
        for i in 1..=remaining_days {
            week.push(i);
        }
        weeks.push(week);
    }

    weeks
}

fn grid_calendar() -> Box {
    let current_month = chrono::Local::now().month();
    let current_year = chrono::Local::now().year();
    let mut grid_calendar: Option<Grid> = None;
    let mut day_labels: Vec<Label> = Vec::new();

    let update_grid_calendar = || {
        let updated_weeks = generate_calendar(current_month, current_year);

        if let Some(grid) = &grid_calendar {
            for label in &day_labels {
                grid.remove(label);
            }
        }

        day_labels.clear();

        for (index, day) in DAYS_OF_WEEK.iter().enumerate() {
            let day_label = Label::new(Some(day));
            grid_calendar.as_ref().unwrap().attach(&day_label, index as i32, 0, 1, 1);
            day_labels.push(day_label);
        }

        for (row_index, week) in updated_weeks.iter().enumerate() {
            for (col_index, day) in week.iter().enumerate() {
                let day_label = Label::new(Some(&day.to_string()));
                if day == &chrono::Local::now().day() && current_month == chrono::Local::now().month() && current_year == chrono::Local::now().year() {
                    day_label.set_markup(&format!("<b>{}</b>", day));
                    day_label.get_style_context().add_class("calendar-today");
                }
                grid_calendar.as_ref().unwrap().attach(&day_label, col_index as i32, (row_index + 1) as i32, 1, 1);
                day_labels.push(day_label);
            }
        }

        grid_calendar.as_ref().unwrap().show_all();
    };

    let month_selector = gtk::ComboBoxText::new();
    for month in &MONTH_NAMES_SHORT {
        month_selector.append_text(month);
    }
    month_selector.get_style_context().add_class("calendar-month-selector");
    month_selector.set_hexpand(false);
    month_selector.set_vexpand(false);
    month_selector.set_halign(Align::Center);
    month_selector.set_valign(Align::Center);
    month_selector.set_active(current_month as u32);
    month_selector.connect_changed(move |_| {
        current_month = month_selector.get_active_text().unwrap().parse().unwrap();
        update_grid_calendar();
    });

    let years: Vec<i32> = (current_year - 5..current_year + 11).collect();
    let year_selector = gtk::ComboBoxText::new();
    for year in &years {
        year_selector.append_text(&year.to_string());
    }
    year_selector.get_style_context().add_class("calendar-year-selector");
    year_selector.set_hexpand(false);
    year_selector.set_vexpand(false);
    year_selector.set_halign(Align::Center);
    year_selector.set_valign(Align::Center);
    year_selector.set_active(years.iter().position(|&y| y == current_year).unwrap() as u32);
    year_selector.connect_changed(move |_| {
        current_year = year_selector.get_active_text().unwrap().parse().unwrap();
        update_grid_calendar();
    });

    let spacer = || {
        let box = Box::new(gtk::Orientation::Horizontal, 0);
        box.set_hexpand(true);
        box.get_style_context().add_class("calendar-spacer");
        box
    };

    let return_to_today_button = gtk::Button::new();
    return_to_today_button.get_style_context().add_class("calendar-return-today-button");
    return_to_today_button.set_halign(Align::Center);
    return_to_today_button.set_valign(Align::Center);
    return_to_today_button.set_child(Some(&gtk::Image::from_icon_name(Some("nix-snowflake-symbolic"), gtk::IconSize::Button)));
    return_to_today_button.connect_clicked(move |_| {
        current_month = chrono::Local::now().month();
        current_year = chrono::Local::now().year();
        month_selector.set_active(current_month as u32);
        year_selector.set_active(years.iter().position(|&y| y == current_year).unwrap() as u32);
        update_grid_calendar();
    });

    let header = gtk::Box::new(gtk::Orientation::Horizontal, 30);
    header.get_style_context().add_class("calendar-header");
    header.set_halign(Align::Center);
    header.set_valign(Align::Center);
    header.pack_start(&month_selector, false, false, 0);
    header.pack_start(&spacer(), true, true, 0);
    header.pack_start(&return_to_today_button, false, false, 0);
    header.pack_start(&spacer(), true, true, 0);
    header.pack_start(&year_selector, false, false, 0);

    update_grid_calendar();

    let grid_calendar_box = gtk::Box::new(gtk::Orientation::Vertical, 0);
    grid_calendar_box.set_name("GridCalendar");
    grid_calendar_box.get_style_context().add_class("calendar-grid");
    grid_calendar_box.set_halign(Align::Center);
    grid_calendar_box.set_valign(Align::Center);
    grid_calendar_box.pack_start(&header, false, false, 0);
    grid_calendar_box.pack_start(grid_calendar.as_ref().unwrap(), false, false, 0);

    grid_calendar_box
}