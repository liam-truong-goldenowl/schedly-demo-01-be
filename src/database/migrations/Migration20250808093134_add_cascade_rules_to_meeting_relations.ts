import { Migration } from '@mikro-orm/migrations';

export class Migration20250808093134_add_cascade_rules_to_meeting_relations extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "meeting_invitee" drop constraint "meeting_invitee_meeting_id_foreign";`,
    );

    this.addSql(
      `alter table "meeting_host" drop constraint "meeting_host_meeting_id_foreign";`,
    );
    this.addSql(
      `alter table "meeting_host" drop constraint "meeting_host_host_id_foreign";`,
    );

    this.addSql(
      `alter table "meeting_guest" drop constraint "meeting_guest_meeting_id_foreign";`,
    );

    this.addSql(
      `alter table "meeting_invitee" alter column "meeting_id" type int using ("meeting_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_invitee" alter column "meeting_id" drop not null;`,
    );
    this.addSql(
      `alter table "meeting_invitee" add constraint "meeting_invitee_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "meeting_host" alter column "meeting_id" type int using ("meeting_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_host" alter column "meeting_id" drop not null;`,
    );
    this.addSql(
      `alter table "meeting_host" alter column "host_id" type int using ("host_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_host" alter column "host_id" drop not null;`,
    );
    this.addSql(
      `alter table "meeting_host" add constraint "meeting_host_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "meeting_host" add constraint "meeting_host_host_id_foreign" foreign key ("host_id") references "user" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "meeting_guest" alter column "meeting_id" type int using ("meeting_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_guest" alter column "meeting_id" drop not null;`,
    );
    this.addSql(
      `alter table "meeting_guest" add constraint "meeting_guest_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade on delete cascade;`,
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
      `alter table "meeting_host" drop constraint "meeting_host_host_id_foreign";`,
    );

    this.addSql(
      `alter table "meeting_guest" drop constraint "meeting_guest_meeting_id_foreign";`,
    );

    this.addSql(
      `alter table "meeting_invitee" alter column "meeting_id" type int using ("meeting_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_invitee" alter column "meeting_id" set not null;`,
    );
    this.addSql(
      `alter table "meeting_invitee" add constraint "meeting_invitee_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "meeting_host" alter column "meeting_id" type int using ("meeting_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_host" alter column "meeting_id" set not null;`,
    );
    this.addSql(
      `alter table "meeting_host" alter column "host_id" type int using ("host_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_host" alter column "host_id" set not null;`,
    );
    this.addSql(
      `alter table "meeting_host" add constraint "meeting_host_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "meeting_host" add constraint "meeting_host_host_id_foreign" foreign key ("host_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "meeting_guest" alter column "meeting_id" type int using ("meeting_id"::int);`,
    );
    this.addSql(
      `alter table "meeting_guest" alter column "meeting_id" set not null;`,
    );
    this.addSql(
      `alter table "meeting_guest" add constraint "meeting_guest_meeting_id_foreign" foreign key ("meeting_id") references "meeting" ("id") on update cascade;`,
    );
  }
}
