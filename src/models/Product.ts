export class Product {
  id: string;
  name: string;
  buyCost: number;
  sellPrice: number;

  constructor(id: string, name: string, buyCost: number, sellPrice: number) {
    this.id = id;
    this.name = name;
    this.buyCost = buyCost;
    this.sellPrice = sellPrice;
  }
}
