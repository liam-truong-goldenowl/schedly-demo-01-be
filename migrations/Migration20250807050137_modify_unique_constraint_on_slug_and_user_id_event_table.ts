import { Migration } from '@mikro-orm/migrations';

export class Migration20250807050137_modify_unique_constraint_on_slug_and_user_id_event_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "event" drop constraint "event_slug_unique";`);

    this.addSql(
      `create unique index "event_slug_user_id_id_unique" on "event" (slug, user_id);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "event_slug_user_id_id_unique";`);

    this.addSql(
      `alter table "event" add constraint "event_slug_unique" unique ("slug");`,
    );
  }
}
