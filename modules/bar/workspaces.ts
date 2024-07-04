import { Utils, Widget, Hyprland } from "imports";
import options from "options";
import icons from "lib/icons";

const { execAsync } = Utils;
const { Box, Button, Label, Icon } = Widget;

let hyprland;
Service.import("hyprland").then(service => {
    hyprland = service;
}).catch(error => {
    console.error("Failed to import Hyprland service:", error);
});

const dispatch = (arg: string | number) => {
    execAsync(`hyprctl dispatch workspace ${arg}`);
};

export default () => {
    const workspaces = Box({
        vpack: 'center',
        vexpand: true,
        children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Button({
            cursor: "pointer",

            onMiddleClick: () => App.toggleWindow("overview"),
            onPrimaryClick: () => dispatch(i),
            onSecondaryClick: () => Hyprland.messageAsync([`dispatch movetoworkspacesilent ${i}`]).catch(console.error),

            attribute: i,

            child: icons.wsicon[`ws${i}`] ? Icon({ icon: icons.wsicon[`ws${i}`] }) : Label({ label: `${i}` }),

            setup: self => self.hook(Hyprland, () => {
                self.toggleClassName("active", Hyprland.active.workspace.id === i);
                self.toggleClassName("occupied", (Hyprland.getWorkspace(i)?.windows || 0) > 0);
            }),
        })),
        setup: self => self.hook(Hyprland, () => {
            self.children.forEach(btn => {
                btn.visible = btn.attribute <= 4 || hyprland.workspaces.some(ws => ws.id === btn.attribute);
            });
        }),
    });

    return Box({
        name: "Workspaces",
        className: "workspaces",
        child: workspaces,
    });
};
