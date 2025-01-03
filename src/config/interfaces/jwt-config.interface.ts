export interface JwtConfig {
  user: JwtTokenOptions;
  moder: JwtTokenOptions;
  admin: JwtTokenOptions;
}

export interface JwtTokenOptions {
  access: {
    secret: string;
    expiresIn: string;
  };
  refresh: {
    secret: string;
    expiresIn: string;
  };
}
