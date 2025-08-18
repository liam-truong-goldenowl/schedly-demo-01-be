import { Migration } from '@mikro-orm/migrations';

export class Migration20250804101105_add_location_type_and_details_columns_event_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create type "location_type" as enum ('phone', 'in_person', 'online');`,
    );
    this.addSql(
      `alter table "event" add column "location_type" "location_type" not null, add column "location_details" varchar(255) not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "event" drop column "location_type", drop column "location_details";`,
    );

    this.addSql(`drop type "location_type";`);
  }
}
