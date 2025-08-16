import { Migration } from '@mikro-orm/migrations';

export class Migration20250729100922_create_schedule_weekky_hour_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create type "weekday" as enum ('0', '1', '2', '3', '4', '5', '6');`,
    );
    this.addSql(
      `create table "schedule_weekly_hour" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "weekday" "weekday" not null, "start_time" time(0) not null, "end_time" time(0) not null, "schedule_id" int not null);`,
    );

    this.addSql(
      `alter table "schedule_weekly_hour" add constraint "schedule_weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "schedule_weekly_hour" cascade;`);

    this.addSql(`drop type "weekday" cascade;`);
  }
}
