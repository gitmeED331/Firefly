import { Service, App, Utils, Gio } from "imports"

const { monitorFile } = Utils

class DirectoryMonitorService extends Service {
  static {
    Service.register(this, {}, {});
  }

  constructor() {
    super();
    this.recursiveDirectoryMonitor(`${App.configDir}/style`);
  }

  recursiveDirectoryMonitor(directoryPath) {

    monitorFile(directoryPath, (_, eventType) => {
      if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
        this.emit("changed");
      }
    }, "directory");

    const directory = Gio.File.new_for_path(directoryPath);
    const enumerator = directory.enumerate_children("standard::*", Gio.FileQueryInfoFlags.NONE, null);

    let fileInfo;
    while ((fileInfo = enumerator.next_file(null)) !== null) {
      const childPath = directoryPath + "/" + fileInfo.get_name();
      if (fileInfo.get_file_type() === Gio.FileType.DIRECTORY) {
        this.recursiveDirectoryMonitor(childPath);
      }
    }
  }
}

const service = new DirectoryMonitorService();
export default service;
