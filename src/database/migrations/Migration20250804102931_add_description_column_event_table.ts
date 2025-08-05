import { Migration } from '@mikro-orm/migrations';

export class Migration20250804102931_add_description_column_event_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "event" add column "description" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "event" drop column "description";`);
  }
}
