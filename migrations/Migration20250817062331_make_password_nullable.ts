import { Migration } from '@mikro-orm/migrations';

export class Migration20250817062331_make_password_nullable extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "account" alter column "password_hash" type varchar(255) using ("password_hash"::varchar(255));`,
    );
    this.addSql(
      `alter table "account" alter column "password_hash" drop not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "account" alter column "password_hash" type varchar(255) using ("password_hash"::varchar(255));`,
    );
    this.addSql(
      `alter table "account" alter column "password_hash" set not null;`,
    );
  }
}
