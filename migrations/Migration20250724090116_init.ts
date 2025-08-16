import { Migration } from '@mikro-orm/migrations';

export class Migration20250724090116_init extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "email" varchar(255) not null, "name" varchar(255) not null, "avatar_url" varchar(255) null, "public_slug" varchar(255) not null);`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
    this.addSql(
      `alter table "user" add constraint "user_public_slug_unique" unique ("public_slug");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
