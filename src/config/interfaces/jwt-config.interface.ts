export interface JwtConfig {
  patient: JwtTokenOptions;

  doctor: JwtTokenOptions;
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
