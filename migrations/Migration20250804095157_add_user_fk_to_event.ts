import { Migration } from '@mikro-orm/migrations';

export class Migration20250804095157_add_user_fk_to_event extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "event" add column "user_id" int not null;`);
    this.addSql(
      `alter table "event" add constraint "event_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "event" drop constraint "event_user_id_foreign";`);

    this.addSql(`alter table "event" drop column "user_id";`);
  }
}
