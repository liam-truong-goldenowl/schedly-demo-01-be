import { Migration } from '@mikro-orm/migrations';

export class Migration20250724093238_create_user_setting_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create type "language" as enum ('en', 'vi');`);
    this.addSql(
      `create table "user_setting" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "timezone" varchar(255) not null, "language" "language" not null default 'en', "country" varchar(255) null, "user_id" int not null);`,
    );
    this.addSql(
      `alter table "user_setting" add constraint "user_setting_user_id_unique" unique ("user_id");`,
    );

    this.addSql(
      `alter table "user_setting" add constraint "user_setting_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_setting" cascade;`);

    this.addSql(`drop type "language";`);
  }
}
