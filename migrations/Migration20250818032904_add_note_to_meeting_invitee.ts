import { Migration } from '@mikro-orm/migrations';

export class Migration20250818032904_add_note_to_meeting_invitee extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "meeting_invitee" add column "note" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "meeting_invitee" drop column "note";`);
  }
}
