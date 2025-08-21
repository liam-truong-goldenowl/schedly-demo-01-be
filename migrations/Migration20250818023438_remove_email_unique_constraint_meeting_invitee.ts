import { Migration } from '@mikro-orm/migrations';

export class Migration20250818023438_remove_email_unique_constraint_meeting_invitee extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "meeting_invitee" drop constraint "meeting_invitee_meeting_id_email_unique";`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "meeting_invitee" add constraint "meeting_invitee_meeting_id_email_unique" unique ("meeting_id", "email");`,
    );
  }
}
