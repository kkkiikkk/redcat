export interface IJwtPayload {
  userId: string;
}

export interface IJwtPayloadRefresh extends IJwtPayload {
  refreshToken?: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
