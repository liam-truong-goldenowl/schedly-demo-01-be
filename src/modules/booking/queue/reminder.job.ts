export interface SendReminderJobPayload {
  person: {
    email: string;
    name: string;
    timezone: string;
  };
  event: {
    id: number;
    name: string;
  };
  meeting: {
    date: string;
    time: string;
  };
}
