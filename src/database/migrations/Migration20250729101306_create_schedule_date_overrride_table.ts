import { Migration } from '@mikro-orm/migrations';

export class Migration20250729101306_create_schedule_date_overrride_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "schedule_date_override" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "date" date not null, "start_time" time(0) not null, "end_time" time(0) not null, "schedule_id" int not null);`,
    );

    this.addSql(
      `alter table "schedule_date_override" add constraint "schedule_date_override_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "schedule_date_override" cascade;`);
  }
}
