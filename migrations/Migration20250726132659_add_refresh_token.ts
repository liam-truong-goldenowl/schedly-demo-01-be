import { Migration } from '@mikro-orm/migrations';

export class Migration20250726132659_add_refresh_token extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "account" add column "refresh_token_hash" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account" drop column "refresh_token_hash";`);
  }
}
