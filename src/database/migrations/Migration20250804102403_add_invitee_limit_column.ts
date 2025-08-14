import { Migration } from '@mikro-orm/migrations';

export class Migration20250804102403_add_invitee_limit_column extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "event" add column "invitee_limit" int not null default 1;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "event" drop column "invitee_limit";`);
  }
}
