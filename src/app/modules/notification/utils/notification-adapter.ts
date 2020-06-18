import { NotificationModel } from '../models/notification.model';

class Options implements NotificationOptions {
  public lang = 'ru';

  constructor(
    public body,
    public timestamp,
    ) {
  }
}

export class NotificationAdapter {
  static createOptions(notification: NotificationModel): NotificationOptions {
    return new Options(notification.message, notification.dateTime);
  }
}
