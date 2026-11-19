import { useEffect, useMemo, useState } from 'react';
import { demoShop, demoProducts, initialOrders, demoInvoices, initialNotifications, orderStages } from '../data/shopOwnerDemo.js';
import './ShopOwnerDashboard.css';

const money = (n) => n == null ? 'To be confirmed' : `Rs. ${Number(n).toLocaleString('en-LK')}`;
const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

function Icon({ name, size = 20, strokeWidth = 1.8, className = '' }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></>,
    box: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="M3 7v10l9 5 9-5V7M12 12v10"/></>,
    cart: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 2h3l2.5 12.5a2 2 0 0 0 2 1.5h11a2 2 0 0 0 2-1.5L23 6H5"/></>,
    orders: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    truck: <><path d="M3 6h12v11H3zM15 10h4l3 3v4h-7z"/><circle cx="7.5" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    invoice: <><path d="M5 3h14v18l-3.5-2-3.5 2-3.5-2L5 21V3Z"/><path d="M9 8h6M9 12h6"/></>,
    wallet: <><rect x="2" y="6" width="20" height="15" rx="3"/><path d="M2 10h20M6 6V4a2 2 0 0 1 2-2h11"/><path d="M16 15h3"/></>,
    return: <><path d="m8 7-5 5 5 5"/><path d="M3 12h12a5 5 0 0 0 0-10"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9"/><path d="M10 21h4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.6 1-2 3.5-1.8-.9a8 8 0 0 1-2.2 1.3l-.1 2h-4l-.1-2a8 8 0 0 1-2.2-1.3l-1.8.9-2-3.5 1.6-1a8 8 0 0 1 0-2.5l-1.6-1 2-3.5 1.8.9a8 8 0 0 1 2.2-1.3l.1-2h4l.1 2a8 8 0 0 1 2.2 1.3l1.8-.9 2 3.5-1.6 1a8 8 0 0 1-.1 2.4Z" transform="translate(0 -1) scale(.98)"/></>,
    search: <><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    down: <><path d="m6 9 6 6 6-6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    close: <><path d="M18 6 6 18M6 6l12 12"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    check: <><path d="m4 12 5 5L20 6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/></>,
    alert: <><path d="M12 3 2 21h20L12 3Z"/><path d="M12 10v4M12 18h.01"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></>,
    filter: <><path d="M4 7h16M7 12h10M10 17h4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    credit: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></>,
    sparkle: <><path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3L12 2Z"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/></>,
  };
  return <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}

const menu = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'products', label: 'Product catalogue', icon: 'box' },
  { id: 'order', label: 'Place an order', icon: 'cart' },
  { id: 'orders', label: 'My orders', icon: 'orders' },
  { id: 'deliveries', label: 'Delivery tracking', icon: 'truck' },
  { id: 'invoices', label: 'Invoices & payments', icon: 'invoice' },
  { id: 'credit', label: 'Credit account', icon: 'wallet' },
  { id: 'returns', label: 'Returns & complaints', icon: 'return' },
];

const statusLabels = { 'Pending Approval': 'pending', Approved: 'approved', Dispatched: 'dispatched', Delivered: 'delivered', 'Pending Verification': 'pending', Unpaid: 'pending', Paid: 'delivered' };
function Status({ value }) { return <span className={`pivo-status pivo-status--${statusLabels[value] || 'pending'}`}><span className="status-dot"/>{value}</span>; }
function SectionHeader({ eyebrow, title, action }) { return <div className="dash-section-title"><div>{eyebrow && <span className="section-eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action}</div>; }
function EmptyState({ title, detail }) { return <div className="dash-empty"><Icon name="box" size={30}/><strong>{title}</strong><span>{detail}</span></div>; }

export default function ShopOwnerDashboard() {
  const [active, setActive] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(initialOrders);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returns, setReturns] = useState([]);
  const [returnReason, setReturnReason] = useState('Damaged product');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnOrder, setReturnOrder] = useState('PV-1018');
  const [message, setMessage] = useState('');

  const availableCredit = Math.max(0, demoShop.creditLimit - demoShop.outstanding);
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
  const awaiting = orders.filter(o => o.status === 'Pending Approval').length;
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredOrders = useMemo(() => orders.filter(o => `${o.id} ${o.status} ${o.date}`.toLowerCase().includes(search.toLowerCase())), [orders, search]);
  const filteredProducts = useMemo(() => demoProducts.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())), [search]);

  const navigate = id => {
    setMobileNav(false);
    setSearch('');
    if (id === 'order') { setCartOpen(true); return; }
    setActive(id);
  };
  const addProduct = (id, delta = 1) => { setCart(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) })); setCartOpen(true); };
  const notify = value => { setMessage(value); };
  const submitOrder = () => {
    if (!cartCount) return;
    const newOrder = { id: `PV-DEMO-${String(orders.length + 1).padStart(3,'0')}`, date: shortDate, status: 'Pending Approval', items: demoProducts.filter(p => cart[p.id] > 0).map(p => ({ productId: p.id, quantity: cart[p.id] })), total: null, payment: 'To be confirmed' };
    setOrders(prev => [newOrder, ...prev]);
    setCart({}); setCartOpen(false); setActive('orders');
    notify('Demo order added locally. No real order was sent to PIVO.');
  };
  const submitReturn = e => {
    e.preventDefault();
    const item = { id: `RET-DEMO-${String(returns.length + 1).padStart(3,'0')}`, orderId: returnOrder, reason: returnReason, notes: returnNotes.trim(), status: 'Submitted (demo)' };
    setReturns(prev => [item, ...prev]); setReturnNotes('');
    notify('Demo return request saved locally. No request was sent.');
  };
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') { setCartOpen(false); setSelectedOrder(null); setNoticeOpen(false); setMobileNav(false); } };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  function Header() { return <header className="shop-topbar">
    <div className="topbar-left"><button className="mobile-menu-btn icon-button" onClick={() => setMobileNav(v => !v)} aria-label="Toggle menu"><Icon name="menu"/></button><div className="topbar-crumb"><span>My shop</span><Icon name="chevron" size={14}/><strong>{menu.find(m => m.id === active)?.label ?? 'Overview'}</strong></div></div>
    <div className="topbar-actions"><div className="topbar-search"><Icon name="search" size={18}/><input aria-label="Search products and orders" placeholder="Search orders or products..." value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌕</kbd></div><button className="icon-button topbar-notify" onClick={() => setNoticeOpen(true)} aria-label={`Notifications (${unreadCount} unread)`}><Icon name="bell" size={20}/>{unreadCount > 0 && <i/>}</button><div className="topbar-profile"><span className="profile-avatar">SM</span><div><strong>{demoShop.name}</strong><small>Shop owner</small></div><Icon name="down" size={15}/></div></div>
  </header>; }

  function Sidebar() { return <aside className={`shop-sidebar ${mobileNav ? 'mobile-visible' : ''}`}>
    <a href="/" className="shop-brand" aria-label="PIVO public homepage"><img src="/assets/pivo-logo.png" alt="PIVO logo"/><div><strong>PIVO <span>HOLDINGS</span></strong><small>Distribution portal</small></div></a>
    <div className="sidebar-context"><span className="sidebar-context-icon"><Icon name="user" size={17}/></span><div><strong>SHOP OWNER</strong><small>{demoShop.accountId}</small></div><Icon name="down" size={15}/></div>
    <nav className="sidebar-navigation" aria-label="Shop owner navigation"><span className="sidebar-group-label">WORKSPACE</span>{menu.map(item => <button key={item.id} className={`sidebar-link ${active === item.id ? 'is-active' : ''}`} onClick={() => navigate(item.id)}><Icon name={item.icon} size={19}/><span>{item.label}</span>{item.id === 'orders' && awaiting > 0 && <span className="sidebar-count">{awaiting}</span>}</button>)}<span className="sidebar-group-label sidebar-bottom-label">ACCOUNT</span><button className={`sidebar-link ${active === 'notifications' ? 'is-active' : ''}`} onClick={() => navigate('notifications')}><Icon name="bell" size={19}/><span>Notifications</span>{unreadCount > 0 && <span className="sidebar-count">{unreadCount}</span>}</button><button className={`sidebar-link ${active === 'settings' ? 'is-active' : ''}`} onClick={() => navigate('settings')}><Icon name="settings" size={19}/><span>Shop settings</span></button></nav>
    <div className="sidebar-footer"><div className="sidebar-help"><div className="sidebar-help-star"><Icon name="sparkle" size={20}/></div><strong>Need a hand?</strong><p>Get help with PIVO ordering and shop services.</p><button onClick={() => notify('Support integration will be added when contact details are confirmed.')}>Contact support <Icon name="arrow" size={15}/></button></div><a href="/" className="sidebar-home"><Icon name="logout" size={18}/> Visit public website</a></div>
  </aside>; }

  function Metrics() { return <div className="metric-grid"><div className="metric-card"><div className="metric-head"><span className="metric-icon tone-red"><Icon name="orders" size={21}/></span><span className="metric-arrow"><Icon name="arrow" size={15}/></span></div><div className="metric-value">{activeOrders.toString().padStart(2, '0')}</div><div className="metric-name">Active orders</div><div className="metric-foot"><span className="trend-red">{awaiting} awaiting approval</span></div></div><div className="metric-card"><div className="metric-head"><span className="metric-icon tone-orange"><Icon name="truck" size={22}/></span><span className="metric-arrow"><Icon name="arrow" size={15}/></span></div><div className="metric-value">{orders.filter(o => o.status === 'Dispatched').length.toString().padStart(2, '0')}</div><div className="metric-name">Out for delivery</div><div className="metric-foot"><span>See delivery progress</span></div></div><div className="metric-card"><div className="metric-head"><span className="metric-icon tone-green"><Icon name="credit" size={22}/></span><span className="metric-arrow"><Icon name="arrow" size={15}/></span></div><div className="metric-value metric-money">{money(availableCredit)}</div><div className="metric-name">Available credit</div><div className="metric-foot"><span>Proposed account limit</span></div></div><div className="metric-card"><div className="metric-head"><span className="metric-icon tone-purple"><Icon name="wallet" size={22}/></span><span className="metric-arrow"><Icon name="arrow" size={15}/></span></div><div className="metric-value metric-money">{money(demoShop.outstanding)}</div><div className="metric-name">Outstanding balance</div><div className="metric-foot"><span>Example invoice balance</span></div></div></div>; }

  function OrdersTable({ compact = false }) { return <div className="table-wrap"><table className="orders-table"><thead><tr><th>ORDER ID</th><th>DATE</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th><th aria-label="Actions"/></tr></thead><tbody>{(compact ? filteredOrders.slice(0, 4) : filteredOrders).map(order => <tr key={order.id}><td><button className="order-link" onClick={() => setSelectedOrder(order)}>{order.id}</button></td><td>{order.date}</td><td>{order.items.reduce((s,i) => s+i.quantity, 0)} bottles</td><td className="table-total">{money(order.total)}</td><td><Status value={order.status}/></td><td><button className="table-action" onClick={() => setSelectedOrder(order)} aria-label={`View ${order.id}`}><Icon name="chevron" size={18}/></button></td></tr>)}</tbody></table>{filteredOrders.length === 0 && <EmptyState title="No matching orders" detail="Try another search term."/>}</div>; }

  function CreditCard({ expanded = false }) { return <div className={`panel credit-panel ${expanded ? 'credit-expanded' : ''}`}><div className="panel-heading"><div><span className="section-eyebrow">YOUR ACCOUNT</span><h3>Credit overview</h3></div><span className="credit-symbol"><Icon name="wallet" size={20}/></span></div><div className="credit-balance-label">Available credit</div><strong className="credit-balance">{money(availableCredit)}</strong><div className="credit-progress"><span style={{ width: `${demoShop.outstanding / demoShop.creditLimit * 100}%` }}/></div><div className="credit-scale"><span>{money(demoShop.outstanding)} used</span><span>{money(demoShop.creditLimit)} limit</span></div><div className="credit-split"><div><span>Outstanding</span><strong>{money(demoShop.outstanding)}</strong></div><div><span>Proposed payment term</span><strong>{demoShop.creditTermDays} days</strong></div></div><div className="credit-disclaimer"><Icon name="info" size={15}/><span>Credit limit and terms are provisional, pending PIVO confirmation. Balances shown are demo data.</span></div><button className="panel-link credit-link" onClick={() => navigate('invoices')}>View invoices & payments <Icon name="arrow" size={17}/></button></div>; }

  function TrackingCard() {
    const delivery = orders.find(o => o.status === 'Dispatched') || orders[0];
    const stage = delivery?.status === 'Delivered' ? 3 : Math.max(0, orderStages.indexOf(delivery?.status));
    return <div className="panel tracking-panel"><div className="panel-heading"><div><span className="section-eyebrow">LIVE WORKFLOW PREVIEW</span><h3>Delivery progress</h3></div><span className="tracking-truck"><Icon name="truck" size={19}/></span></div><div className="tracking-number"><strong>{delivery?.id || '—'}</strong><Status value={delivery?.status || 'Pending Approval'}/></div><div className="timeline">{['Order placed','Order approved','Dispatched','Delivered'].map((label, i) => <div className={`timeline-step ${i <= stage ? 'step-done' : ''}`} key={label}><span className="timeline-dot">{i < stage ? <Icon name="check" size={11}/> : i === stage ? <span/> : null}</span><div><strong>{label}</strong><small>{i === stage ? 'Current stage' : i < stage ? 'Completed (demo)' : 'Upcoming'}</small></div></div>)}</div><button className="panel-link" onClick={() => navigate('deliveries')}>Track deliveries <Icon name="arrow" size={17}/></button></div>;
  }

  function ProductGrid({ max = 4 }) { return <div className="shop-products-grid">{filteredProducts.slice(0, max).map(p => <article className="shop-product" key={p.id}><div className={`shop-product-image product-tone-${p.tone}`}><span className="product-size">{p.size}</span><img src={p.image} alt={`${p.name} bottle`} loading="lazy"/></div><div className="shop-product-bottom"><div><strong>{p.name}</strong><small>Price confirmed on order</small></div><button className="product-add" onClick={() => addProduct(p.id)} aria-label={`Add ${p.name} to quick order`}><Icon name="plus" size={19}/></button></div></article>)}</div>; }

  function Overview() { return <>
    <div className="dashboard-greeting"><div><span className="greeting-kicker"><Icon name="calendar" size={15}/> {shortDate} <span className="demo-pill">UI DEMO</span></span><h1>Good to see you again! <span>👋</span></h1><p>Here’s what’s happening with <strong>{demoShop.name}</strong> today.</p></div><button className="btn btn-primary main-new-order" onClick={() => setCartOpen(true)}><Icon name="plus" size={18}/> Place new order</button></div>
    <div className="demo-note"><Icon name="info" size={17}/><span>All orders, payments, balances and notifications below are illustrative sample data. No live PIVO records are connected.</span></div>
    {Metrics()}
    <div className="dashboard-columns"><div className="dashboard-main-column"><div className="order-banner"><div className="order-banner-content"><span>QUICK & CONVENIENT</span><h2>Time to restock<br/>your shelves?</h2><p>Browse PIVO drinks and prepare your next order in a few clicks.</p><button onClick={() => setCartOpen(true)}>Start an order <Icon name="arrow" size={17}/></button></div><div className="order-banner-art" aria-hidden="true"><div className="banner-circle"/><img className="banner-bottle one" src="/assets/mix-fruit-bottle.webp" alt=""/><img className="banner-bottle two" src="/assets/mango-bottle.webp" alt=""/></div></div>
      <div className="panel orders-panel"><SectionHeader title="Recent orders" eyebrow="YOUR ORDERS" action={<button className="text-action" onClick={() => navigate('orders')}>View all <Icon name="arrow" size={16}/></button>}/>{OrdersTable({ compact: true })}</div>
    </div><div className="dashboard-side-column">{CreditCard({})}{TrackingCard()}</div></div>
    <section className="dashboard-products-section"><SectionHeader eyebrow="PIVO COLLECTION" title="Restock your favorites" action={<button className="text-action" onClick={() => navigate('products')}>Browse all products <Icon name="arrow" size={16}/></button>}/>{ProductGrid({})}</section>
  </>; }

  function PageHeading({ eyebrow, title, text, action }) { return <div className="page-heading"><div><span className="section-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>; }
  function OtherPages() {
    switch (active) {
      case 'products': return <><PageHeading eyebrow="PRODUCT CATALOGUE" title="Explore PIVO drinks" text="Browse the available product range and add bottles to a sample order." action={<button className="btn btn-primary" onClick={() => setCartOpen(true)}><Icon name="cart" size={18}/> Quick order ({cartCount})</button>}/><div className="demo-note"><Icon name="info" size={17}/>Product availability and pricing will come from Laravel once connected. These are sample catalogue cards.</div>{ProductGrid({})}</>;
      case 'orders': return <><PageHeading eyebrow="ORDER HISTORY" title="My orders" text="Review your recent orders, quantities and approval status." action={<button className="btn btn-primary" onClick={() => setCartOpen(true)}><Icon name="plus" size={18}/> New order</button>}/><div className="panel all-orders-panel">{OrdersTable({})}</div></>;
      case 'deliveries': return <><PageHeading eyebrow="DELIVERY TRACKING" title="Delivery status" text="Follow each delivery from approval to the final outcome."/><div className="deliveries-layout">{TrackingCard()}<div className="panel"><SectionHeader title="Orders by status" eyebrow="FULFILLMENT"/><div className="delivery-list">{orders.map(o => <button className="delivery-list-item" key={o.id} onClick={() => setSelectedOrder(o)}><span className="delivery-list-icon"><Icon name="truck" size={21}/></span><span><strong>{o.id}</strong><small>{o.date} · {o.items.reduce((s,i)=>s+i.quantity,0)} bottles</small></span><Status value={o.status}/><Icon name="chevron" size={17}/></button>)}</div></div></div></>;
      case 'invoices': return <><PageHeading eyebrow="BILLING" title="Invoices & payments" text="View your invoices and payment verification status."/><div className="demo-note"><Icon name="info" size={17}/>Bank transfer and cheque payments may remain pending until verified by a Finance Officer.</div><div className="panel all-orders-panel"><div className="table-wrap"><table className="orders-table"><thead><tr><th>INVOICE</th><th>ORDER</th><th>ISSUED</th><th>DUE DATE*</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{demoInvoices.map(i => <tr key={i.id}><td className="table-total">{i.id}</td><td>{i.orderId}</td><td>{i.date}</td><td>{i.due}</td><td className="table-total">{money(i.amount)}</td><td><Status value={i.status}/></td></tr>)}</tbody></table></div></div><p className="table-footnote">* Example due dates using the proposed 20-day term. No live invoice or payment processing is implemented.</p></>;
      case 'credit': return <><PageHeading eyebrow="FINANCIAL OVERVIEW" title="Your credit account" text="Keep track of your account balance and proposed credit availability."/><div className="credit-layout">{CreditCard({ expanded: true })}<div className="panel"><SectionHeader eyebrow="INVOICE SUMMARY" title="Recent invoice activity"/><div className="invoice-list">{demoInvoices.map(i => <div className="invoice-item" key={i.id}><div><strong>{i.id}</strong><span>{i.date} · {i.orderId}</span></div><div><strong>{money(i.amount)}</strong><Status value={i.status}/></div></div>)}</div></div></div></>;
      case 'returns': return <><PageHeading eyebrow="CUSTOMER SUPPORT" title="Returns & complaints" text="Raise a return request or report an order-related issue."/><div className="returns-layout"><form className="panel return-form" onSubmit={submitReturn}><SectionHeader eyebrow="NEW REQUEST" title="Submit a return request"/><label>Related order<select value={returnOrder} onChange={e => setReturnOrder(e.target.value)}>{orders.filter(o => o.status === 'Delivered').map(o => <option key={o.id} value={o.id}>{o.id} — {o.date}</option>)}</select></label><label>Reason<select value={returnReason} onChange={e => setReturnReason(e.target.value)}><option>Damaged product</option><option>Incorrect quantity</option><option>Incorrect product</option><option>Product quality concern</option><option>Other complaint</option></select></label><label>Additional details<textarea rows="4" placeholder="Describe the issue..." value={returnNotes} onChange={e => setReturnNotes(e.target.value)} required/></label><button className="btn btn-primary" type="submit">Submit demo request <Icon name="arrow" size={17}/></button><p className="form-hint">This is a frontend demo; real return submissions require Laravel APIs and Store Manager review.</p></form><div className="panel"><SectionHeader eyebrow="REQUEST HISTORY" title="Submitted requests"/>{returns.length ? returns.map(r => <div className="return-record" key={r.id}><strong>{r.id}</strong><span>{r.orderId} · {r.reason}</span><small>{r.status}</small></div>) : <EmptyState title="No return requests yet" detail="Use the form to create a demo request."/>}</div></div></>;
      case 'notifications': return <><PageHeading eyebrow="UPDATES" title="Notifications" text="Stay informed about the progress of your orders and payments." action={<button className="btn btn-outline" onClick={() => setNotifications(list => list.map(n => ({ ...n, read: true })))}>Mark all as read</button>}/><div className="panel notification-page-list">{notifications.map(n => <div className={`notification-item ${n.read ? '' : 'is-unread'}`} key={n.id}><span className="notification-circle"><Icon name="bell" size={20}/></span><div><strong>{n.title}</strong><p>{n.detail}</p><small>{n.when}</small></div>{!n.read && <span className="unread-dot"/>}</div>)}</div></>;
      case 'settings': return <><PageHeading eyebrow="ACCOUNT" title="Shop information" text="This view will show your approved shop profile once connected to the backend."/><div className="panel settings-panel"><div className="settings-avatar">SM</div><div><span>Shop name</span><strong>{demoShop.name}</strong></div><div><span>Account reference</span><strong>{demoShop.accountId}</strong></div><div><span>Account access</span><strong>Shop Owner</strong></div><p className="form-hint">This is a demonstration profile. Shop details and editing permissions will be provided by Laravel.</p></div></>;
      default: return Overview();
    }
  }

  return <div className="shop-app">
    {mobileNav && <button className="shop-nav-backdrop" aria-label="Close menu" onClick={() => setMobileNav(false)}/>}
    {Sidebar()}
    <div className="shop-body">{Header()}<main className="shop-main"><div className="shop-content">{active === 'overview' ? Overview() : OtherPages()}<div className="dashboard-footer"><span>© 2026 PIVO Holdings (Pvt) Ltd.</span><span>Shop Owner Portal · Frontend demonstration</span></div></div></main></div>
    {cartOpen && <div className="drawer-overlay" role="presentation" onMouseDown={e=>{ if (e.target === e.currentTarget) setCartOpen(false); }}><section className="shop-drawer" role="dialog" aria-modal="true" aria-labelledby="quick-order-title"><div className="drawer-heading"><div><span className="section-eyebrow">SHOP OWNER</span><h2 id="quick-order-title">Quick order</h2><p>Select quantities to prepare a new order.</p></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close quick order"><Icon name="close"/></button></div><div className="drawer-list">{demoProducts.map(p => <div className="drawer-product" key={p.id}><div className={`drawer-product-img product-tone-${p.tone}`}><img src={p.image} alt=""/></div><div className="drawer-product-name"><strong>{p.name}</strong><small>{p.size} · Unit price to be confirmed</small></div><div className="qty-control"><button aria-label={`Remove ${p.name}`} onClick={() => addProduct(p.id,-1)}><Icon name="minus" size={14}/></button><b>{cart[p.id] || 0}</b><button aria-label={`Add ${p.name}`} onClick={() => addProduct(p.id,1)}><Icon name="plus" size={14}/></button></div></div>)}</div><div className="drawer-bottom"><div className="drawer-summary"><span>Total bottles</span><strong>{cartCount}</strong></div><p><Icon name="info" size={16}/> This demo stores the order only in browser state. Stock checks, credit validation and approval require the Laravel backend.</p><button className="btn btn-primary drawer-submit" disabled={!cartCount} onClick={submitOrder}>Submit demo order <Icon name="arrow" size={18}/></button></div></section></div>}
    {noticeOpen && <div className="drawer-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setNoticeOpen(false); }}><section className="shop-drawer" role="dialog" aria-modal="true" aria-labelledby="notification-title"><div className="drawer-heading"><div><span className="section-eyebrow">ACCOUNT UPDATES</span><h2 id="notification-title">Notifications</h2></div><button className="icon-button" onClick={()=>setNoticeOpen(false)} aria-label="Close notifications"><Icon name="close"/></button></div><div className="drawer-list">{notifications.map(n=><div className={`notification-item ${n.read ? '' : 'is-unread'}`} key={n.id}><span className="notification-circle"><Icon name="bell" size={20}/></span><div><strong>{n.title}</strong><p>{n.detail}</p><small>{n.when}</small></div></div>)}</div><div className="drawer-bottom"><button className="btn btn-outline drawer-submit" onClick={() => { setNotifications(prev=>prev.map(n=>({...n,read:true}))); setNoticeOpen(false); }}>Mark all as read</button></div></section></div>}
    {selectedOrder && <div className="drawer-overlay modal-wrap" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedOrder(null); }}><section className="shop-modal" role="dialog" aria-modal="true" aria-labelledby="order-modal-title"><div className="drawer-heading"><div><span className="section-eyebrow">ORDER DETAILS</span><h2 id="order-modal-title">{selectedOrder.id}</h2><p>{selectedOrder.date}</p></div><button className="icon-button" aria-label="Close order details" onClick={()=>setSelectedOrder(null)}><Icon name="close"/></button></div><div className="modal-detail"><div className="modal-status"><span>Current order status</span><Status value={selectedOrder.status}/></div><h3>Items in this order</h3>{selectedOrder.items.map(item => { const p = demoProducts.find(p => p.id === item.productId); return <div className="modal-line" key={item.productId}><span>{p?.name || item.productId}</span><strong>{item.quantity} bottles</strong></div>; })}<div className="modal-total"><span>Order total</span><strong>{money(selectedOrder.total)}</strong></div><div className="modal-note"><Icon name="info" size={16}/> Example records only. The Store Manager approves orders and coordinates dispatch after validation.</div></div><div className="modal-actions"><button className="btn btn-primary" onClick={()=>setSelectedOrder(null)}>Done</button></div></section></div>}
    {message && <div className="demo-toast" role="status"><Icon name="check" size={18}/><span>{message}</span><button aria-label="Dismiss notification" onClick={()=>setMessage('')}><Icon name="close" size={16}/></button></div>}
  </div>;
}
