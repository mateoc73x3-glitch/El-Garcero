export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Dish {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}

export interface ReservationInput {
  customerName: string;
  phone: string;
  dateTime: string;
  guests: number;
  notes?: string;
}
