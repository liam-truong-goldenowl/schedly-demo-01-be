import { Migration } from '@mikro-orm/migrations';

export class Migration20250812021600_remove_unique_constraint_on_meeting extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "meeting" drop constraint "meeting_start_date_start_time_event_id_unique";`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "meeting" add constraint "meeting_start_date_start_time_event_id_unique" unique ("start_date", "start_time", "event_id");`,
    );
  }
}
