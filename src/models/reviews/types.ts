export interface ReviewType {
  id: string;
  user_id: string;
  book_id: string;
  comment: string;
  rating: number;
  created_on: Date;
}
