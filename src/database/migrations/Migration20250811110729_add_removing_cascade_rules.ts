import { Migration } from '@mikro-orm/migrations';

export class Migration20250811110729_add_removing_cascade_rules extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "event" drop constraint "event_user_id_foreign";`);
    this.addSql(
      `alter table "event" drop constraint "event_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "event" add constraint "event_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "event" add constraint "event_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "event" drop constraint "event_user_id_foreign";`);
    this.addSql(
      `alter table "event" drop constraint "event_schedule_id_foreign";`,
    );

    this.addSql(
      `alter table "event" add constraint "event_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "event" add constraint "event_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade;`,
    );
  }
}
