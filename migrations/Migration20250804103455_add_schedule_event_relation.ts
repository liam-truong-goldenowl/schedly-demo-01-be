import { Migration } from '@mikro-orm/migrations';

export class Migration20250804103455_add_schedule_event_relation extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "event" add column "schedule_id" int not null;`);
    this.addSql(
      `alter table "event" add constraint "event_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "event" drop constraint "event_schedule_id_foreign";`,
    );

    this.addSql(`alter table "event" drop column "schedule_id";`);
  }
}
