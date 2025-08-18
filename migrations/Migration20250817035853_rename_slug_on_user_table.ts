import { Migration } from '@mikro-orm/migrations';

export class Migration20250817035853_rename_slug_on_user_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" drop constraint "user_public_slug_unique";`,
    );

    this.addSql(`alter table "user" rename column "public_slug" to "slug";`);
    this.addSql(
      `alter table "user" add constraint "user_slug_unique" unique ("slug");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_slug_unique";`);

    this.addSql(`alter table "user" rename column "slug" to "public_slug";`);
    this.addSql(
      `alter table "user" add constraint "user_public_slug_unique" unique ("public_slug");`,
    );
  }
}
