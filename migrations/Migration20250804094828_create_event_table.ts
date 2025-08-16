import { Migration } from '@mikro-orm/migrations';

export class Migration20250804094828_create_event_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "event" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "name" varchar(255) not null, "duration" int not null, constraint event_check check (duration > 0));`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "event" cascade;`);
  }
}
