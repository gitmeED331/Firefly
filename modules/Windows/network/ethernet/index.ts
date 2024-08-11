import { Widget, Service } from "imports";
const network = await Service.import("network");

const Ethernet = () => {
  return Widget.Box({
    className: "network-menu wired",
    vertical: true,
    children: [
      Widget.Box({
        className: "network menu-label-container",
        hpack: "fill",
        child: Widget.Label({
          class_name: "network-menu-label",
          hexpand: true,
          hpack: "start",
          label: "Ethernet",
        }),
      }),
      Widget.Box({
        class_name: "network-menu-items-section",
        vertical: true,
        child: Widget.Box({
          class_name: "network-menu-content",
          vertical: true,
          setup: (self) => {
            self.hook(network, () => {
              return (self.child = Widget.Box({
                class_name: "network-element-item",
                child: Widget.Box({
                  spacing: 10,
                  hpack: "start",
                  children: [
                    Widget.Icon({
                      hpack: "start",
                      vpack: "center",
                      class_name: `network-icon ethernet ${network.wired.state === "activated" ? "active" : ""}`,
                      tooltip_text: network.wired.internet,
                      icon: `${network.wired["icon_name"]}`,
                    }),
                    Widget.Box({
                      class_name: "connection-container",
                      vertical: true,
                      children: [
                        Widget.Label({
                          class_name: "active-connection",
                          hpack: "start",
                          truncate: "end",
                          wrap: true,
                          label: `Ethernet Connection ${network.wired.state !== "unknown" && typeof network.wired?.speed === "number" ? `(${network.wired?.speed / 1000} Gbps)` : ""}`,
                        }),
                        Widget.Label({
                          hpack: "start",
                          class_name: `connection-status ${network.wired.state === "activated" ? "active" : ""}`,
                          label:
                            network.wired.internet.charAt(0).toUpperCase() +
                            network.wired.internet.slice(1),
                        }),
                      ],
                    }),
                  ],
                }),
              }));
            });
          },
        }),
      }),
    ],
  });
};

export { Ethernet };
