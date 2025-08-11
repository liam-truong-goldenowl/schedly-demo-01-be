import { Migration } from '@mikro-orm/migrations';

export class Migration20250811103633_add_removing_cascade_rules extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "date_override" drop constraint "date_override_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "date_override" add constraint "date_override_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "weekly_hour" drop constraint "weekly_hour_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "weekly_hour" add constraint "weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "date_override" drop constraint "date_override_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "date_override" add constraint "date_override_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "weekly_hour" add constraint "weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "weekly_hour" add constraint "weekly_hour_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );
  }
}
