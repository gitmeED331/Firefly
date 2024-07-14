The folder structure is a mess and will be cleaned up at a later time, when I reach a point I have every feature I want.

https://github.com/gitmeED331/Firefly/assets/142960718/dfa016ad-aa7d-45b8-9bd9-3864162733ac

There are Many files that are not being used and will not be used, they will be removed later, they remain until I reach a point I have integrated what I want and am happy with my setup.

# Elements of this project:
- [X] Overview
- [X] Workspaces
  - New:
    - Added dynamic expandability
    - Converted primary workspace labels to icons
    - Added animation and additional styling
  - Issues: ?
- [X] Title box
  - New:
    - Added App icon
    - Added animation and additional styling
- [X] Media Ticker & Player Popup:
    - New:
      - added app icon to ticker
      - added album art to player
      - Additional styling
    - Issues:
      - [ ] player icon is blurred (may be unsolveable due to AGS limitations)
- [ ] System app Tray
  - New:
    - Added reveal button
    - Added app launcher
    - Additional styling
  - Issues:
    - [X] some program menus are not working properly (such as Deezer)
    - [X] want to make is dynamic (open and close with arrow button)
  - To Do:
    - [ ] Need to find a way for specific "favorite" or "always show" apps so I can shrink the bar but keep the ones I use most always visible
- [ ] System Info Tray
  - New:
    - Added power profiles popup window menu
    - Additional styling
  - To Do:
    - [ ] need to move the wifi controls from the system tray to the system info tray
    - [ ] need to create bluetooth control
- [X] Date/Clock & Calendar Popup
  - New:
    - Created a custom built calendar widget
    - Additional styling
- [X] Dashboard Button & Dashboard
  - New:
    - Added calendar widget
    - Added Wifi and Bluetooth menus
- [X] Lockscreen
- [X] Session Control window
- [X] AGS Greeter (greetd)
- Theming/Styling
  - Status: almost complete
  - To Do:
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
