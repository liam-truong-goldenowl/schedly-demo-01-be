import { Factory } from '@mikro-orm/seeder';
import { randEmail, randLastName, randFirstName } from '@ngneat/falso';

import { User } from '@/modules/user/entities/user.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    const firstName = randFirstName();
    const lastName = randLastName();

    return {
      name: `${firstName} ${lastName}`,
      email: randEmail({ firstName, lastName }),
    };
  }
}
