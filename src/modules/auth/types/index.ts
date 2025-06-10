export interface ILoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  }
}