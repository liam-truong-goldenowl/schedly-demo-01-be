import { Migration } from '@mikro-orm/migrations';

export class Migration20250801090106_add_cascase_persist_to_schedule extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "schedule_weekly_hour" drop constraint "schedule_weekly_hour_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "schedule_date_override" drop constraint "schedule_date_override_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "schedule_weekly_hour" alter column "schedule_id" type int using ("schedule_id"::int);`,
    );
    this.addSql(
      `alter table "schedule_weekly_hour" alter column "schedule_id" set not null;`,
    );
    this.addSql(
      `alter table "schedule_weekly_hour" add constraint "schedule_weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "schedule_date_override" alter column "schedule_id" type int using ("schedule_id"::int);`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "schedule_id" set not null;`,
    );
    this.addSql(
      `alter table "schedule_date_override" add constraint "schedule_date_override_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "schedule_weekly_hour" drop constraint "schedule_weekly_hour_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "schedule_date_override" drop constraint "schedule_date_override_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "schedule_weekly_hour" alter column "schedule_id" type int using ("schedule_id"::int);`,
    );
    this.addSql(
      `alter table "schedule_weekly_hour" alter column "schedule_id" drop not null;`,
    );
    this.addSql(
      `alter table "schedule_weekly_hour" add constraint "schedule_weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on delete cascade;`,
    );

    this.addSql(
      `alter table "schedule_date_override" alter column "schedule_id" type int using ("schedule_id"::int);`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "schedule_id" drop not null;`,
    );
    this.addSql(
      `alter table "schedule_date_override" add constraint "schedule_date_override_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on delete cascade;`,
    );
  }
}
