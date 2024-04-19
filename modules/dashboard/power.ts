import { Widget } from "../../imports";

const powerProfiles = await Service.import('powerprofiles')

const label = Widget.Label({
    label: powerProfiles.bind('active_profile'),
})

export const PWRProfiles = Widget.Button({
	name: "pwrProfiles",
	child: Widget.Label({ label:'= ⏻  =' }),
    onClicked: () => {
        switch (powerProfiles.active_profile) {
            case 'balanced':
                powerProfiles.active_profile = 'performance';
                break;
            default:
                powerProfiles.active_profile = 'balanced';
                break;
        };
    },
})
