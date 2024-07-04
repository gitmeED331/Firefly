import GLib from "gi://GLib"
import {Gdk} from "imports"
// import options from "options"
//
// const intval = options.system.fetchInterval.value
// const tempPath = options.system.temperature.value

export const clock = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, () => GLib.DateTime.new_now_local()],
})

export const uptime = Variable(0, {
    poll: [60_000, "cat /proc/uptime", line =>
        Number.parseInt(line.split(".")[0]) / 60,
    ],
})

export const distro = {
    id: GLib.get_os_info("ID"),
    logo: GLib.get_os_info("LOGO"),
}

// const divide = ([total, free]: string[]) => Number.parseInt(free) / Number.parseInt(total)
//
// export const cpu = Variable(0, {
//     poll: [intval, "top -b -n 1", out => divide(["100", out.split("\n")
//         .find(line => line.includes("Cpu(s)"))
//         ?.split(/\s+/)[1]
//         .replace(",", ".") || "0"])],
// })
//
// export const ram = Variable(0, {
//     poll: [intval, "free", out => divide(out.split("\n")
//         .find(line => line.includes("Mem:"))
//         ?.split(/\s+/)
//         .splice(1, 2) || ["1", "1"])],
// })
//
// export const temperature = Variable(0, {
//     poll: [intval, `cat ${tempPath}`, n => {
//         return Number.parseInt(n) / 100_000
//     }],
// })

export const verticalMargin = () => {
    const screenHeight = Gdk.Screen.get_default().get_height(); // Get screen height
    const verticalMargin = screenHeight * .765; // Adjust the percentage as needed
    return verticalMargin;
}

export const horizontalMargin = () => {
    const screenWidth = Gdk.Screen.get_default().get_width(); // Get screen width
    const horizontalMargin = screenWidth * .765; // Adjust the percentage as needed
    return horizontalMargin;
}
