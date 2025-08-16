import { Migration } from '@mikro-orm/migrations';

export class Migration20250804071222_make_start_and_end_time_null_on_date_override extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "schedule_date_override" alter column "start_time" type time(0) using ("start_time"::time(0));`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "start_time" drop not null;`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "end_time" type time(0) using ("end_time"::time(0));`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "end_time" drop not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "schedule_date_override" alter column "start_time" type time(0) using ("start_time"::time(0));`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "start_time" set not null;`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "end_time" type time(0) using ("end_time"::time(0));`,
    );
    this.addSql(
      `alter table "schedule_date_override" alter column "end_time" set not null;`,
    );
  }
}
