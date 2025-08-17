import { Migration } from '@mikro-orm/migrations';

export class Migration20250817122401_move_note_column_to_meeting_invitee extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "meeting_guest" cascade;`);

    this.addSql(`alter table "meeting" drop column "note";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "meeting_guest" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "meeting_id" int not null, "email" varchar(255) not null);`,
    );
    this.addSql(
      `alter table "meeting_guest" add constraint "meeting_guest_meeting_id_email_unique" unique ("meeting_id", "email");`,
    );

    this.addSql(
      `alter table "meeting_guest" add constraint "meeting_guest_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade;`,
    );

    this.addSql(`alter table "meeting" add column "note" varchar(255) null;`);
  }
}
