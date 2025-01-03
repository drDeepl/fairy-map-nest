export interface CreateJwt {
  sub: string; // userId
  role: string;
  email: string;
  firstName: string;
  lastName: string;
}
