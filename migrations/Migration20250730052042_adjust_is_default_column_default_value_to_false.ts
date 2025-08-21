import { Migration } from '@mikro-orm/migrations';

export class Migration20250730052042_adjust_is_default_column_default_value_to_false extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "schedule" alter column "is_default" type boolean using ("is_default"::boolean);`,
    );
    this.addSql(
      `alter table "schedule" alter column "is_default" set default false;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "schedule" alter column "is_default" type boolean using ("is_default"::boolean);`,
    );
    this.addSql(
      `alter table "schedule" alter column "is_default" set default true;`,
    );
  }
}
