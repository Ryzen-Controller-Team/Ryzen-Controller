const UIkit = require("uikit");
const app = window.require("electron").remote.app;

type SystemNotifications = Array<Notification>;
type GroupedSystemNotifications = {
  [groupName: string]: SystemNotifications;
};
let systemNotifications: GroupedSystemNotifications = {};

type NotificationSettingStatusType = "primary" | "success" | "warning" | "danger";
type NotificationSettingPosType =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
type NotificationSettingsType = {
  message: string;
  status?: NotificationSettingStatusType;
  timeout?: number;
  group?: string;
  pos?: NotificationSettingPosType;
};

const custom = function(settings: NotificationSettingsType): void {
  const window = app.getWindow();
  if (window.isVisible() && !window.isMinimized()) {
    if (settings.group) {
      UIkit.notification.closeAll(settings.group);
    }
    UIkit.notification({
      status: "primary",
      timeout: 4000,
      group: null,
      pos: "top-center",
      ...settings,
    });
  } else {
    let notif;
    let group = "none";
    if (settings.group) {
      group = settings.group;
    }
    if (!systemNotifications.hasOwnProperty(group)) {
      systemNotifications[group] = [];
    }
    while ((notif = systemNotifications[group].pop())) {
      notif.close();
    }
    notif = new Notification("Ryzen Controller", {
      body: settings.message,
      silent: group !== "none",
      requireInteraction: group === "none",
    });
    notif.onclick = () => {
      const window = app.getWindow();
      window.show();
      if (window.isMinimized()) {
        window.restore();
      }
      if (window.isVisible()) {
        window.focus();
      }
    };
    systemNotifications[group].push(notif);
  }
};

const success = function(message: string, group?: string): void {
  custom({
    message: message + " 😃",
    status: "success",
    group,
  });
};

const talk = function(message: string, group?: string): void {
  custom({ message: message, group });
};

const warning = function(message: string, group?: string): void {
  custom({
    message: message + " 🙁",
    status: "warning",
    group,
  });
};

const error = function(message: string, group?: string): void {
  custom({
    message: message + " 😬",
    status: "danger",
    group,
  });
};

export default {
  success,
  talk,
  warning,
  error,
  custom,
};
