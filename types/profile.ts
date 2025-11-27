export interface Profile {
  id: string;
  pseudo: string | null;
  email: string;
  picture: string | null;
  friendcode: string;
  firstname?: string | null;
  lastname?: string | null;
}