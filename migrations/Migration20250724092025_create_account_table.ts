import { Migration } from '@mikro-orm/migrations';

export class Migration20250724092025_create_account_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "account" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "password_hash" varchar(255) not null, "user_id" int not null);`,
    );
    this.addSql(
      `alter table "account" add constraint "account_user_id_unique" unique ("user_id");`,
    );

    this.addSql(
      `alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "account" cascade;`);
  }
}
