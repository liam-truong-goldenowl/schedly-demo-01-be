import { Migration } from '@mikro-orm/migrations';

export class Migration20250804100143_add_type_column_event_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create type "event_type" as enum ('one_on_one', 'group');`);
    this.addSql(`alter table "event" add column "type" "event_type" not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "event" drop column "type";`);

    this.addSql(`drop type "event_type";`);
  }
}
