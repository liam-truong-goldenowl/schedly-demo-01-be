export interface ILocalStrategy {
  id: number;
  email: string;
  publicSlug: string;
}

export interface IJwtStrategy {
  id: number;
  email: string;
  publicSlug: string;
}

export interface ITokenPayload {
  id: number;
  email: string;
  publicSlug: string;
}
