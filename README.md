
## This is a work in progress.

![screenshot1](https://github.com/gitmeED331/FireflyAGS/screenshots/screenshot1.png)
![screenshot2](https://github.com/gitmeED331/FireflyAGS/screenshots/screenshot2.png)
![screenshot3](https://github.com/gitmeED331/FireflyAGS/screenshots/screenshot3.png)
![screenshot4](https://github.com/gitmeED331/FireflyAGS/screenshots/screenshot4.png)

https://github.com/gitmeED331/FireflyAGS/assets/142960718/28bf5b8d-5a53-4478-8330-a098923c981f

The folder structure is a mess and will be cleaned up at a later time, when I reach a point I have every feature I want.

Many of the files are not being used and will not be used, they will be removed later, they remain until I reach a point I am happy with my setup.

# Elements of this project:
- [X] Overview
  - Status: I'm good with it
  - Issues:
    - [X] styling
    - [X] Dimensions
- [X] Title box
- [ ] Media Ticker & Player Popup:
  - Status: nearly complete
    - Issues:
    - [ ] popup window (auto close on click off)
    - [X] Window Placement issue: currently causes excess window and cover up * - now placed correctly without issue
- [ ]System app Tray
  - status: nearly complete
  - issues:
    - [X] some program menus are not working properly (such as Deezer)
    - [X] want to make is dynamic (open and close with arrow button)
    - [ ] Need to find a way for specific "favorite" or "always show" apps so I can shrink the bar but keep the ones I use most always visible
- [ ] System Info Tray
  - Status: nearly complete
  - issues:
    - [X] Reactive Volume icon with popup window sliders
      - [X] added app mixer and sink selector, thanks to Aylur
    - [ ] need to move the wifi controls from the system tray to the system info tray
    - [ ] need to create bluetooth control
    - [ ] need to make power profile selection menu for the battery indicator
    - [X] Added battery bar, thanks to Aylur
- [ ] Date/Clock & Calendar Popup
  - Status: nearly complete
  - Issues:
    - [ ] popup window (auto close on click off)
    - [X] Window Placement issue: currently causes excess window and cover up * - now placed correctly without issue
- [ ] Dashboard Button & Dashboard
  - Status: nearly complete
  - Issues:
    - popup window
      - [ ] auto close on click off
      - [X] spanning notification section to the bottom of screen
- [X] Lockscreen
- [X] AGS Greeter (greetd)
- Theming/Styling
  - Status: almost complete
  - Issues:
    - [ ] Need to consolidate and refine (eliminate duplicate code)

**I am running Arch Linux**

## Required apps/packages (all found in main repository and AUR)
- pavucontrol
- pipewire-pulse
- light (for screen brightness control)
- mpd/mpris
- power-profiles-daemon
- upower

A gigantic thanks to Aylur and Kotontrion for all their work and help!
