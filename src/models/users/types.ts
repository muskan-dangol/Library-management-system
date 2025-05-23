export interface UserType {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_on?: Date;
}
