import { Migration } from '@mikro-orm/migrations';

export class Migration20250730064033_add_cascase_rule_on_schedule_weekly_hour extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "schedule_weekly_hour" drop constraint "schedule_weekly_hour_schedule_id_foreign";`,
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
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "schedule_weekly_hour" drop constraint "schedule_weekly_hour_schedule_id_foreign";`,
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
  }
}
