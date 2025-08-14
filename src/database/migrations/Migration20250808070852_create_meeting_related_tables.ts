import { Migration } from '@mikro-orm/migrations';

export class Migration20250808070852_create_meeting_related_tables extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "meeting" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "note" varchar(255) null, "start_date" date not null, "start_time" time(0) not null, "timezone" varchar(255) not null, "event_id" int not null);`,
    );
    this.addSql(
      `alter table "meeting" add constraint "meeting_start_date_start_time_event_id_unique" unique ("start_date", "start_time", "event_id");`,
    );

    this.addSql(
      `create table "meeting_invitee" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "meeting_id" int not null, "email" varchar(255) not null, "name" varchar(255) not null);`,
    );
    this.addSql(
      `alter table "meeting_invitee" add constraint "meeting_invitee_meeting_id_email_unique" unique ("meeting_id", "email");`,
    );

    this.addSql(
      `create table "meeting_host" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "meeting_id" int not null, "host_id" int not null);`,
    );
    this.addSql(
      `alter table "meeting_host" add constraint "meeting_host_meeting_id_host_id_unique" unique ("meeting_id", "host_id");`,
    );

    this.addSql(
      `create table "meeting_guest" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz null, "meeting_id" int not null, "email" varchar(255) not null);`,
    );
    this.addSql(
      `alter table "meeting_guest" add constraint "meeting_guest_meeting_id_email_unique" unique ("meeting_id", "email");`,
    );

    this.addSql(
      `alter table "meeting" add constraint "meeting_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "meeting_invitee" add constraint "meeting_invitee_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "meeting_host" add constraint "meeting_host_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "meeting_host" add constraint "meeting_host_host_id_foreign" foreign key ("host_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "meeting_guest" add constraint "meeting_guest_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "meeting_invitee" drop constraint "meeting_invitee_meeting_id_foreign";`,
    );

    this.addSql(
      `alter table "meeting_host" drop constraint "meeting_host_meeting_id_foreign";`,
    );

    this.addSql(
      `alter table "meeting_guest" drop constraint "meeting_guest_meeting_id_foreign";`,
    );

    this.addSql(`drop table if exists "meeting" cascade;`);

    this.addSql(`drop table if exists "meeting_invitee" cascade;`);

    this.addSql(`drop table if exists "meeting_host" cascade;`);

    this.addSql(`drop table if exists "meeting_guest" cascade;`);
  }
}
