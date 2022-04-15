class Good {
  constructor(id, name, description, sizes, price) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.sizes = sizes;
      this.price = price;
      this.available = false;
  }

  setAvailable(value) {
      this.available = value;
  }    
};

class GoodsList {
  constructor(filter, sortPrice, sortDir) {
      this.goods = []
      this.filter = filter === undefined ? /./i: filter;
      this.sortDir = sortDir === undefined ? false: sortDir;
      this.sortPrice = sortPrice === undefined ? false: sortPrice;
  }

  findIndex(id) {
      let index = this.goods.map((a, b) => [b, a]).filter(elem => elem[1].id === id)[0];
      if(index === undefined) {
          return -1;
      }
      return index[0];
  }

  removeIndexOf(index) {
      this.goods.splice(index, 1);
  }

  get list() {

      let result = this.goods.filter(elem => this.filter.test(elem.name));
      if(!this.sortPrice) {
          return result;
      }

      if(this.sortDir) {
          return result.sort((elem_1, elem_2) => elem_1.price - elem_2.price);
      }
      return result.sort((elem_1, elem_2) => elem_2.price - elem_1.price);
  }

  add(good) {
      this.goods.push(good);
  }

  remove(id) {
      let index = this.findIndex(id);;
      if( index === -1) {
          return
      }

      this.removeIndexOf(index);
  }
};

class BasketGood extends Good {
    constructor(id, name, description, sizes, price, amount) {
        super(id, name, description, sizes, price)
        this.amount = amount;
    }
  };

class Basket extends GoodsList {
  constructor(...args) {
      super(...args)
  }

  get totalAmount() {
      return this.goods.reduce((accum, curr) => accum + curr.amount, 0);
  }

  get totalSum() {
      return this.goods.reduce((accum, curr) => accum + curr.amount * curr.price, 0);
  }

  add(good, amount) {
      let index = this.findIndex(good.id);
      if(index === -1) {
          good.amount += amount;
          super.add(good);
          return;
      }

      this._goods[index].amount += amount;
  }

  remove(good, amount) {
      let index = this.findIndex(good.id);
      if(index === -1) {
          return;
      }

      this.goods[index].amount -= amount;

      if(this.goods[index].amount <= 0) {
          super.removeIndexOf(index);
      }
  }

  clear() {
      this.goods = [];
  }

  removeUnavailable() {
      this.goods = this.goods.filter(elem => elem.available)
  }
};


function main() {
  let goods = [
      new Good(124, "skis", "empty", [35,36], 10000),
      new Good(55, "shoes", "empty", [35,36], 2500),
      new Good(66, "shirts", "empty", [35,36], 1500),
      new Good(203, "helmet", "empty", [35,36], 5500),
      new Good(39, "shorts", "empty", [35,36], 1000),
  ];

  let goodsList = new GoodsList();

  goodsList.add(goods[1]);
  goodsList.add(goods[2]);
  goodsList.add(goods[3]);

  console.log(goodsList.list);
  goodsList.filter = /a/i;
  console.log("filtered ", goodsList.list);

  goodsList.remove(39);
  console.log(goodsList.list);

  goodsList.filter = /./i;
  console.log("sorted\n")
  goodsList.sortPrice = true;
  goodsList.sortDir = true;
  console.log(goodsList.list);


  let basket = new Basket();
  let basketGoods = [
      new BasketGood(124, "skis", "empty", [35,36], 10000, 10),
      new BasketGood(55, "shoes", "empty", [35,36], 2500, 2),
      new BasketGood(66, "shirts", "empty", [35,36], 1500, 6),
      new BasketGood(203, "helmet", "empty", [35,36], 5500, 2),
      new BasketGood(39, "shorts", "empty", [35,36], 1000, 3),
  ];

  basket.add(basketGoods[0], 5);
  console.log(basket.list);

  basket.remove(basketGoods[0], 45)
  console.log(basket.list);

  basket.remove(basketGoods[0], 20)
  console.log(basket.list);

  basket.add(basketGoods[1], 3);
  console.log(basket.list);
  console.log(basket.totalAmount, basket.totalSum);

  basket.removeUnavailable();
  console.log(basket.list);

  basket.add(basketGoods[1], 2);
  basket.clear();
  console.log(basket.list);
}

main(); 