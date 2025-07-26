import { User } from '../entities/user.entity';

export class CreateUserResponseDto {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
  publicSlug: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.avatarUrl = user.avatarUrl || null;
    this.publicSlug = user.publicSlug;
  }
}
