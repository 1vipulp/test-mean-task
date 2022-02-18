export interface productData {
  id: string,
  name: string,
  image_url: string,
  price: number
}

export interface CartData {
  id: string,
  name: string,
  image_url: string,
  price: number,
  quantity: number,
  subtotal: number
}