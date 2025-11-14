export type LoginResponse = {
  accessToken: string;
  refreshtoken: string;
  isNewUser: boolean;
  userDto: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    birthday: string;
    weight: number;
    height: number;
    gender: string;
    activityLevel: string;
    dailyCaloGoal: number;
    currentPlanId: number;
    currentSubscriptionExpiresAt: string; 
    roles: string[];
  };
};

export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
}

export type RefreshTokenRequest = {
    accessToken: string;
    refreshToken: string;
}

export type logoutRequest = {
  refreshToken: string;
}

export type loginGoogleRequest = {
  idToken: string;
}

export type loginFacebookRequest = {
  accessToken: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginDefaultResponse = {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  userDto: UserDTOLogin
};

export interface UserDTOLogin {
  id: string; // UUID/GUID format
  email: string;
  name: string;
  avatarUrl: string;
  gender: string;
  age: number;
  targetMonths: number;
  currentSubscriptionExpiresAt: string;
  currentPlanId: number;
  startWeight: number;
  targetWeight: number;
  dailyCaloGoal: number;
  status: string;
  roles: string[]; // Array of strings (e.g., ["Admin", "User"])
}