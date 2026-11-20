/** Illustrative UI-only data. Not business records or confirmed prices/credit policies. */
export const demoShop = {
  name: 'Sunrise Mini Mart',
  owner: 'Shop Owner',
  accountId: 'PIVO-SH-001',
  creditLimit: 50000, // Proposal's *proposed* standard limit — confirmation pending.
  outstanding: 17500,
  creditTermDays: 20, // Proposal's *proposed* payment term — confirmation pending.
};

export const demoProducts = [
  { id: 'mango', name: 'Mango Nectar', size: '500 ml', image: '/assets/mango-bottle.webp', tone: 'mango', description: 'Bright tropical mango refreshment.' },
  { id: 'mix', name: 'Mix Fruit Nectar', size: '500 ml', image: '/assets/mix-fruit-bottle.webp', tone: 'mix', description: 'A colorful blend of fruity flavors.' },
  { id: 'woodapple', name: 'Woodapple Nectar', size: '500 ml', image: '/assets/woodapple-bottle.webp', tone: 'woodapple', description: 'A distinctive local favorite.' },
  { id: 'aloe', name: 'Aloe Vera Nectar', size: '500 ml', image: '/assets/aloe-bottle.webp', tone: 'aloe', description: 'Cool, light aloe vera nectar.' },
];

export const initialOrders = [
  { id: 'PV-1028', date: '18 Nov 2026', status: 'Pending Approval', items: [{ productId:'mango', quantity:12 }, { productId:'mix', quantity:8 }], total: 12800, payment: 'Credit' },
  { id: 'PV-1026', date: '16 Nov 2026', status: 'Dispatched', items: [{ productId:'aloe', quantity:10 }, { productId:'mango', quantity:10 }], total: 10400, payment: 'Credit' },
  { id: 'PV-1024', date: '14 Nov 2026', status: 'Approved', items: [{ productId:'woodapple', quantity:10 }, { productId:'mix', quantity:6 }], total: 8600, payment: 'Bank transfer' },
  { id: 'PV-1018', date: '08 Nov 2026', status: 'Delivered', items: [{ productId:'mango', quantity:8 }, { productId:'woodapple', quantity:8 }], total: 9200, payment: 'Cash' },
];

export const demoInvoices = [
  { id: 'INV-2026-091', orderId: 'PV-1018', date: '08 Nov 2026', due: '28 Nov 2026', amount: 9200, status: 'Paid' },
  { id: 'INV-2026-094', orderId: 'PV-1024', date: '14 Nov 2026', due: '04 Dec 2026', amount: 8600, status: 'Pending Verification' },
  { id: 'INV-2026-095', orderId: 'PV-1026', date: '16 Nov 2026', due: '06 Dec 2026', amount: 10400, status: 'Unpaid' },
];

export const initialNotifications = [
  { id: 1, title: 'Order PV-1028 awaits approval', detail: 'Your latest order was received for review.', when: 'Today', read: false },
  { id: 2, title: 'Delivery PV-1026 is on its way', detail: 'Your order has been dispatched.', when: '17 Nov', read: false },
  { id: 3, title: 'Invoice INV-2026-095 created', detail: 'View invoice details in Payments.', when: '16 Nov', read: true },
];

export const orderStages = ['Pending Approval', 'Approved', 'Dispatched', 'Delivered'];
