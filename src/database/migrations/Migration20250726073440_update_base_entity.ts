import { Migration } from '@mikro-orm/migrations';

export class Migration20250726073440_update_base_entity extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
    );

    this.addSql(
      `alter table "account" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
    );

    this.addSql(
      `alter table "user_setting" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user" alter column "updated_at" type varchar(255) using ("updated_at"::varchar(255));`,
    );

    this.addSql(
      `alter table "account" alter column "updated_at" type varchar(255) using ("updated_at"::varchar(255));`,
    );

    this.addSql(
      `alter table "user_setting" alter column "updated_at" type varchar(255) using ("updated_at"::varchar(255));`,
    );
  }
}
