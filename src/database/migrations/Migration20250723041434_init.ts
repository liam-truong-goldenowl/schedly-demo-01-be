import { Migration } from '@mikro-orm/migrations';

export class Migration20250723041434_init extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "tasks" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "description" varchar(255) not null);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tasks" cascade;`);
  }
}
