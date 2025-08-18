import { Migration } from '@mikro-orm/migrations';

export class Migration20250807045824_add_slug_column_event extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "event" add column "slug" varchar(255) not null;`);
    this.addSql(
      `alter table "event" add constraint "event_slug_unique" unique ("slug");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "event" drop constraint "event_slug_unique";`);
    this.addSql(`alter table "event" drop column "slug";`);
  }
}
