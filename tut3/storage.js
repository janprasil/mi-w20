import { Map, Record } from 'immutable';
import { baseUrl } from './index';


export const Storage = {
  orders: Map(),
  orderIds: 2,
  items: Map(),
  customers: Map(),
};

export class Order extends Record({
  id: '',
  customerId: '',
  itemId: '',
}, 'order') {
  withLinks(isGetAll) {
    const result = this.toJS();
    const ordersArray = Storage.orders.toArray();
    const item = Storage.orders.filter(x => x.id === this.id).first();
    const index = ordersArray.indexOf(item);
    const nextId = ordersArray[index + 1] && ordersArray[index + 1].id;

    const links = [];

    links.push({ href: `${baseUrl}/orders/${this.id}`, rel: 'self' });
    links.push({ href: `${baseUrl}/orders/${this.id}`, rel: 'delete' });

    if (nextId) links.push({ href: `${baseUrl}/orders/${nextId}`, rel: 'next' });

    result['_links'] = links;
    return result;
  }
};

export const Item = Record({
  id: '',
  name: '',
}, 'item');

export const Customer = Record({
  id: '',
  firstName: '',
  lastName: '',
  apiKey: '',
}, 'customer');

Storage.items = Storage.items.set(1, new Item({ id: 1, name: 'Test' }));
Storage.items = Storage.items.set(2, new Item({ id: 2, name: 'Test 2' }));
Storage.items = Storage.items.set(3, new Item({ id: 3, name: 'Test 3' }));

Storage.customers = Storage.customers.set(1, new Customer({ id: 1, firstName: 'Jan', lastName: 'Prasil', apiKey: 'HONZA' }));
Storage.customers = Storage.customers.set(2, new Customer({ id: 2, firstName: 'Miloš', lastName: 'Zeman', apiKey: 'MILOS' }));

Storage.orders = Storage.orders.set(1, new Order({ id: 1, customerId: 1, itemId: 1 }));
Storage.orders = Storage.orders.set(2, new Order({ id: 2, customerId: 1, itemId: 2 }));
