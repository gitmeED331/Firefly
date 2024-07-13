import { Widget, Gtk } from "imports";

const { Box, Label, Button, Icon } = Widget;

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateCalendar = (month, year) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];

  let week = [];

  let prevMonthLastDay = new Date(year, month, 0).getDate();
  let prevMonthDays = firstDayOfMonth;
  for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
    week.push(i);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    week.push(i);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    const remainingDays = 7 - week.length;
    for (let i = 1; i <= remainingDays; i++) {
      week.push(i);
    }
    weeks.push(week);
  }

  return weeks;
};

function GridCalendar() {
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let gridCalendar;
  let dayLabels = [];

  const updateGridCalendar = () => {
    const updatedWeeks = generateCalendar(currentMonth, currentYear);

    if (!gridCalendar) {
      gridCalendar = new Gtk.Grid({
        halign: Gtk.Align.CENTER,
        valign: Gtk.Align.CENTER,
      });
    }

    dayLabels.forEach(label => gridCalendar.remove(label));
    dayLabels = [];

    daysOfWeek.forEach((day, index) => {
      const dayLabel = new Label({ label: day, className: "calendar-days" });
      gridCalendar.attach(dayLabel, index, 0, 1, 1);
      dayLabels.push(dayLabel);
    });

    updatedWeeks.forEach((week, rowIndex) => {
      week.forEach((day, columnIndex) => {
        const dayLabel = new Label({ label: day.toString() || '', className: 'calendar-day' });
        if (day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
          dayLabel.set_markup(`<b>${day}</b>`);
          dayLabel.get_style_context().add_class("calendar-today");
        }
        gridCalendar.attach(dayLabel, columnIndex, rowIndex + 1, 1, 1);
        dayLabels.push(dayLabel);
      });
    });

    gridCalendar.show_all();
  };

  const monthSelector = new Gtk.ComboBoxText();
  monthNamesShort.forEach((month, index) => {
    monthSelector.append_text(month);
  });
  monthSelector.get_style_context().add_class("calendar-month-selector");
  monthSelector.set_hexpand(false);
  monthSelector.set_vexpand(false);
  monthSelector.set_halign(Gtk.Align.CENTER);
  monthSelector.set_valign(Gtk.Align.CENTER);
  monthSelector.set_active(currentMonth);
  monthSelector.connect('changed', () => {
    currentMonth = monthSelector.get_active();
    updateGridCalendar();
  });

  const years = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i); // Show 5 years prior and 10 years later
  const yearSelector = new Gtk.ComboBoxText();
  years.forEach((year) => {
    yearSelector.append_text(year.toString());
  });
  yearSelector.get_style_context().add_class("calendar-year-selector");
  yearSelector.set_hexpand(false);
  yearSelector.set_vexpand(false);
  yearSelector.set_halign(Gtk.Align.CENTER);
  yearSelector.set_valign(Gtk.Align.CENTER);
  yearSelector.set_active(years.indexOf(currentYear));
  yearSelector.connect('changed', () => {
    currentYear = parseInt(yearSelector.get_active_text(), 10);
    updateGridCalendar();
  });

  const Spacer = () => Box({
    hexpand: true,
    css: `min-width: 20px;`,
  });

  const returnToTodayButton = Button({
    className: "calendar-return-today-button",
    hpack: 'center',
    child: Icon({ icon: "nix-snowflake-symbolic" }),
    onClicked: () => {
      currentMonth = new Date().getMonth();
      currentYear = new Date().getFullYear();
      monthSelector.set_active(currentMonth);
      yearSelector.set_active(years.indexOf(currentYear));
      updateGridCalendar();
    }
  });

  const header = Widget.CenterBox({
    className: "calendar-header",
    vertical: false,
    spacing: 30,
    hpack: "center",
    vpack: "center",
    startWidget: monthSelector,
    centerWidget: returnToTodayButton,
    endWidget: yearSelector,
  });

  updateGridCalendar();

  return Box(
    {
      name: "GridCalendar",
      className: "calendar-grid",
      vertical: true,
      hpack: "center",
      vpack: "center",
    },
    header,
    gridCalendar,
  );
}

export default GridCalendar;
