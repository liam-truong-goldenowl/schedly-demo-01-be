import { Migration } from '@mikro-orm/migrations';

export class Migration20250730030013_update_weekday_enum_to_use_string extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter type "weekday" add value if not exists 'sunday' before '0';`,
    );

    this.addSql(
      `alter type "weekday" add value if not exists 'monday' after 'sunday';`,
    );

    this.addSql(
      `alter type "weekday" add value if not exists 'tuesday' after 'monday';`,
    );

    this.addSql(
      `alter type "weekday" add value if not exists 'wednesday' after 'tuesday';`,
    );

    this.addSql(
      `alter type "weekday" add value if not exists 'thursday' after 'wednesday';`,
    );

    this.addSql(
      `alter type "weekday" add value if not exists 'friday' after 'thursday';`,
    );

    this.addSql(
      `alter type "weekday" add value if not exists 'saturday' after 'friday';`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter type "weekday" add value if not exists '0' before 'sunday';`,
    );

    this.addSql(`alter type "weekday" add value if not exists '1' after '0';`);

    this.addSql(`alter type "weekday" add value if not exists '2' after '1';`);

    this.addSql(`alter type "weekday" add value if not exists '3' after '2';`);

    this.addSql(`alter type "weekday" add value if not exists '4' after '3';`);

    this.addSql(`alter type "weekday" add value if not exists '5' after '4';`);

    this.addSql(`alter type "weekday" add value if not exists '6' after '5';`);
  }
}
