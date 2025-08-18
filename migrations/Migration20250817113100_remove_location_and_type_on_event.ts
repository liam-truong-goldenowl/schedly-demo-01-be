import { Migration } from '@mikro-orm/migrations';

export class Migration20250817113100_remove_location_and_type_on_event extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "event" drop column "type", drop column "location_type", drop column "location_details";`,
    );

    this.addSql(`drop type "event_type";`);
    this.addSql(`drop type "location_type";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create type "event_type" as enum ('one_on_one', 'group');`);
    this.addSql(
      `create type "location_type" as enum ('phone', 'in_person', 'online');`,
    );
    this.addSql(
      `alter table "event" add column "type" "event_type" not null, add column "location_type" "location_type" not null, add column "location_details" varchar(255) not null;`,
    );
  }
}
