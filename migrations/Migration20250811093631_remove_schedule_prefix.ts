import { Migration } from '@mikro-orm/migrations';

export class Migration20250811093631_remove_schedule_prefix extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "date_override" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "date" date not null, "start_time" time(0) null, "end_time" time(0) null, "schedule_id" int not null);`,
    );

    this.addSql(
      `create table "weekly_hour" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "weekday" "weekday" not null, "start_time" time(0) not null, "end_time" time(0) not null, "schedule_id" int not null);`,
    );

    this.addSql(
      `alter table "date_override" add constraint "date_override_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "weekly_hour" add constraint "weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );

    this.addSql(`drop table if exists "schedule_weekly_hour" cascade;`);

    this.addSql(`drop table if exists "schedule_date_override" cascade;`);

    this.addSql(`drop table if exists "user_setting" cascade;`);

    this.addSql(`drop type "language";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create type "language" as enum ('en', 'vi');`);
    this.addSql(
      `create table "schedule_weekly_hour" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "weekday" "weekday" not null, "start_time" time(0) not null, "end_time" time(0) not null, "schedule_id" int not null);`,
    );

    this.addSql(
      `create table "schedule_date_override" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "date" date not null, "start_time" time(0) null, "end_time" time(0) null, "schedule_id" int not null);`,
    );

    this.addSql(
      `create table "user_setting" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "timezone" varchar(255) not null, "language" "language" not null default 'en', "country" varchar(255) null, "user_id" int not null);`,
    );
    this.addSql(
      `alter table "user_setting" add constraint "user_setting_user_id_unique" unique ("user_id");`,
    );

    this.addSql(
      `alter table "schedule_weekly_hour" add constraint "schedule_weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "schedule_date_override" add constraint "schedule_date_override_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "user_setting" add constraint "user_setting_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(`drop table if exists "date_override" cascade;`);

    this.addSql(`drop table if exists "weekly_hour" cascade;`);
  }
}
