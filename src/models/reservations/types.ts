export interface ReservationType {
  id: string;
  user_id: string;
  book_id: string;
  cart_id: string;
  quantity: number;
  start_date: Date;
  end_date: Date;
  return_date: Date;
  status: string;
}
