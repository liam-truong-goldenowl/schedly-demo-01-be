import { Migration } from '@mikro-orm/migrations';

export class Migration20250817142324_move_timezone_column_to_meeting_invitee extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "meeting" drop column "timezone";`);

    this.addSql(
      `alter table "meeting_invitee" add column "timezone" varchar(255) not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "meeting" add column "timezone" varchar(255) not null;`,
    );

    this.addSql(`alter table "meeting_invitee" drop column "timezone";`);
  }
}
