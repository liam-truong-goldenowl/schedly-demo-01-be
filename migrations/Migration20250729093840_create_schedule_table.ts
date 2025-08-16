import { Migration } from '@mikro-orm/migrations';

export class Migration20250729093840_create_schedule_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "schedule" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "user_id" int not null, "name" varchar(255) not null, "timezone" varchar(255) not null, "is_default" boolean not null default true);`,
    );

    this.addSql(
      `alter table "schedule" add constraint "schedule_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "schedule" cascade;`);
  }
}
