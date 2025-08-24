export interface SendConfirmationEmailJobPayload {
  person: {
    email: string;
    name: string;
    timezone: string;
  };
  event: {
    id: number;
    name: string;
    timezone: string;
  };
  meeting: {
    date: string;
    time: string;
  };
}
