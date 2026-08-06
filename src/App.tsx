import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  CloudOff,
  FileText,
  Gem,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  Users,
  X,
} from 'lucide-react';

type Tab = 'home' | 'visit' | 'followups' | 'catalog' | 'academy';
type Role = 'کارشناس فروش' | 'کارشناس ارشد فروش ولایتی' | 'دفتر مرکزی';

type Visit = {
  id: number;
  store: string;
  area: string;
  status: string;
  province: string;
  date: string;
};

type OrderLine = { product: string; quantity: number; amount: number };

const provinces = ['کابل', 'هرات', 'مزارشریف', 'قندهار', 'ننگرهار', 'غزنی', 'کندز', 'خوست'];
const lines = ['Temptation', 'Romance', 'Magnolia', 'Please', 'Sensual', 'Angelo', 'Aqua Touch'];
const products = ['بادی اسپلش تمپتیشن 250ml', 'شامپو مگنولیا 250ml', 'کرم دست آووکادو 100ml', 'ماسک مو آنجلو 200ml', 'بالم لب توت‌زمینی 15ml'];
const catalogItems = [
  { name: 'Temptation', subtitle: 'برای پوست و موی چرب', color: '#9c7c32', products: 'بادی اسپلش، شامپو، شوینده و کرم مو' },
  { name: 'Romance', subtitle: 'برای پوست و موی چرب', color: '#b75883', products: 'بادی اسپلش، شامپو و میسلار واتر' },
  { name: 'Magnolia', subtitle: 'برای پوست و موی نرمال تا خشک', color: '#d68aa6', products: 'بادی اسپلش، شامپو و نرم‌کننده' },
  { name: 'Please', subtitle: 'برای پوست و موی نرمال تا خشک', color: '#55b7cb', products: 'بادی اسپلش، شامپو و ماسک مو' },
  { name: 'Sensual', subtitle: 'برای موهای رنگ‌شده و آسیب‌دیده', color: '#d7357f', products: 'بادی اسپلش، شامپو و ماسک مو' },
  { name: 'Angelo', subtitle: 'برای پوست و موی نرمال', color: '#cb5960', products: 'بادی اسپلش، شامپو و نرم‌کننده' },
  { name: 'Aqua Touch', subtitle: 'برای پوست و موی خشک و حساس', color: '#2da5c4', products: 'بادی اسپلش، میسلار واتر و ماسک مو' },
];

const initialVisits: Visit[] = [
  { id: 1, store: 'فروشگاه زیبایی گل سرخ', area: 'شهرنو', status: 'موفق', province: 'کابل', date: 'امروز' },
  { id: 2, store: 'داروخانه امید', area: 'کارته چهار', status: 'نیاز به پیگیری', province: 'کابل', date: 'امروز' },
  { id: 3, store: 'بوتیک آرایشی مهتاب', area: 'وزیر اکبرخان', status: 'موفق', province: 'کابل', date: 'دیروز' },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('سارا احمدی');
  const [role, setRole] = useState<Role>('کارشناس فروش');
  const [tab, setTab] = useState<Tab>('home');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [toast, setToast] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('victoria-rose-visits');
    if (saved) setVisits(JSON.parse(saved) as Visit[]);
    const session = localStorage.getItem('victoria-rose-session');
    if (session) {
      const parsed = JSON.parse(session) as { userName: string; role: Role };
      setUserName(parsed.userName);
      setRole(parsed.role);
      setLoggedIn(true);
    }
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem('victoria-rose-session', JSON.stringify({ userName, role }));
    setLoggedIn(true);
    showToast('خوش آمدید؛ فضای کاری شما آماده است');
  }

  function handleLogout() {
    localStorage.removeItem('victoria-rose-session');
    setLoggedIn(false);
  }

  function addVisit(visit: Omit<Visit, 'id' | 'date'>) {
    const next = [{ ...visit, id: Date.now(), date: 'امروز' }, ...visits];
    setVisits(next);
    localStorage.setItem('victoria-rose-visits', JSON.stringify(next));
    setTab('home');
    showToast('گزارش بازدید با موفقیت ثبت شد');
  }

  if (!loggedIn) return <Login userName={userName} setUserName={setUserName} role={role} setRole={setRole} onSubmit={handleLogin} />;

  return (
    <div className="app-shell" dir="rtl">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="logo-mark">VR</div>
          <div><strong>ویکتوریارز</strong><span>مدیریت فروش</span></div>
          <button className="close-menu" onClick={() => setMobileMenu(false)} aria-label="بستن منو"><X size={20} /></button>
        </div>
        <div className="offline-pill"><span className="status-dot" /> فعال و آماده ثبت آفلاین</div>
        <nav className="main-nav">
          <NavItem icon={<Home size={19} />} label="داشبورد" active={tab === 'home'} onClick={() => { setTab('home'); setMobileMenu(false); }} />
          <NavItem icon={<MapPin size={19} />} label="ثبت بازدید" active={tab === 'visit'} onClick={() => { setTab('visit'); setMobileMenu(false); }} />
          <NavItem icon={<Bell size={19} />} label="پیگیری‌ها" badge="۳" active={tab === 'followups'} onClick={() => { setTab('followups'); setMobileMenu(false); }} />
          <NavItem icon={<ShoppingBag size={19} />} label="کاتالوگ محصولات" active={tab === 'catalog'} onClick={() => { setTab('catalog'); setMobileMenu(false); }} />
          <NavItem icon={<BookOpen size={19} />} label="آکادمی فروش" active={tab === 'academy'} onClick={() => { setTab('academy'); setMobileMenu(false); }} />
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-card"><Sparkles size={18} /><div><strong>نکته امروز</strong><p>بدون سولفات و بدون پارابن؛ انتخابی مطمئن برای مشتریان حساس.</p></div></div>
          <button className="logout-button" onClick={handleLogout}><LogOut size={18} /> خروج از حساب</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="باز کردن منو"><Menu size={22} /></button>
          <div className="page-context"><span className="eyebrow">پرتال فروشندگان</span><h1>{tab === 'home' ? 'داشبورد شما' : tab === 'visit' ? 'ثبت بازدید جدید' : tab === 'followups' ? 'پیگیری مشتریان' : tab === 'catalog' ? 'کاتالوگ محصولات' : 'آکادمی فروش'}</h1></div>
          <div className="topbar-actions">
            <div className="sync-status"><CloudOff size={16} /><span>ذخیره روی دستگاه</span></div>
            <button className="icon-button notification-button" aria-label="اعلان‌ها"><Bell size={19} /><i /></button>
            <button className="profile-button" onClick={() => setShowProfile(!showProfile)}><span className="avatar">س</span><span className="profile-name">{userName}</span><ChevronDown size={16} /></button>
            {showProfile && <div className="profile-menu"><strong>{userName}</strong><span>{role}</span><button onClick={handleLogout}>خروج از حساب</button></div>}
          </div>
        </header>

        <div className="content-wrap">
          {tab === 'home' && <Dashboard visits={visits} onNavigate={setTab} />}
          {tab === 'visit' && <VisitForm onSave={addVisit} />}
          {tab === 'followups' && <FollowUps />}
          {tab === 'catalog' && <Catalog />}
          {tab === 'academy' && <Academy />}
        </div>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function Login({ userName, setUserName, role, setRole, onSubmit }: { userName: string; setUserName: (value: string) => void; role: Role; setRole: (value: Role) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="login-page" dir="rtl"><div className="login-art"><div className="art-circle circle-one" /><div className="art-circle circle-two" /><div className="login-quote"><div className="logo-mark large">VR</div><h1>Victoria's Rose</h1><p>زیبایی، کیفیت و اعتماد در هر دیدار</p></div><div className="art-footer">نماینده رسمی و انحصاری برند ویکتوریارز در افغانستان</div></div><div className="login-panel"><div className="mobile-brand"><div className="logo-mark">VR</div><strong>ویکتوریارز</strong></div><span className="eyebrow">فضای کاری نمایندگان فروش</span><h2>به فضای مدیریت فروش خوش آمدید</h2><p className="login-description">برای شروع فعالیت روزانه، وارد حساب کاری خود شوید.</p><form onSubmit={onSubmit}><label>ایمیل یا نام کاربری<input required value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="مثلاً: sara.ahmadi" /></label><label>رمز عبور<input required type="password" defaultValue="123456" placeholder="رمز عبور خود را وارد کنید" /></label><label>نقش کاری<select value={role} onChange={(e) => setRole(e.target.value as Role)}><option>کارشناس فروش</option><option>کارشناس ارشد فروش ولایتی</option><option>دفتر مرکزی</option></select></label><button className="primary-button login-button" type="submit">ورود به پنل <ArrowLeft size={18} /></button></form><div className="login-note"><CloudOff size={16} /><span>اطلاعات شما حتی بدون اینترنت روی دستگاه ذخیره می‌شود.</span></div></div></div>;
}

function NavItem({ icon, label, active, badge, onClick }: { icon: React.ReactNode; label: string; active: boolean; badge?: string; onClick: () => void }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{badge && <b>{badge}</b>}</button>; }

function Dashboard({ visits, onNavigate }: { visits: Visit[]; onNavigate: (tab: Tab) => void }) {
  const todayVisits = visits.filter((visit) => visit.date === 'امروز').length;
  return <div className="dashboard-page"><section className="welcome-row"><div><span className="eyebrow">شنبه، ۲۱ جدی ۱۴۰۳</span><h2>روز پربرکتی داشته باشید، سارا</h2><p>امروز برای ساختن ارتباط‌های ارزشمند و رشد فروش آماده‌اید؟</p></div><button className="primary-button" onClick={() => onNavigate('visit')}><Plus size={18} /> ثبت بازدید جدید</button></section><section className="stats-grid"><StatCard icon={<MapPin />} label="بازدیدهای تکمیل‌شده امروز" value={String(todayVisits).padStart(2, '۰')} trend="۲۳٪ بیشتر از دیروز" tone="purple" /><StatCard icon={<Package />} label="سفارش‌های ثبت‌شده" value="۰۶" trend="۱۲٪ رشد این هفته" tone="gold" /><StatCard icon={<Target />} label="نرخ تبدیل بازدید" value="۴۸٪" trend="هدف ماهانه: ۵۵٪" tone="green" /><StatCard icon={<Activity />} label="مشتریان فعال" value="۲۸" trend="۴ مشتری جدید" tone="blue" /></section><div className="dashboard-grid"><section className="panel visits-panel"><div className="panel-heading"><div><span className="eyebrow">فعالیت‌های اخیر</span><h3>بازدیدهای ثبت‌شده</h3></div><button className="text-button" onClick={() => onNavigate('visit')}>ثبت بازدید <ArrowLeft size={15} /></button></div><div className="visit-list">{visits.slice(0, 4).map((visit) => <div className="visit-row" key={visit.id}><div className="store-icon"><Store size={18} /></div><div className="visit-info"><strong>{visit.store}</strong><span>{visit.area} · {visit.province}</span></div><span className={`status-chip ${visit.status === 'موفق' ? 'success' : 'warning'}`}>{visit.status}</span><span className="visit-date">{visit.date}</span></div>)}</div></section><section className="panel summary-panel"><div className="panel-heading"><div><span className="eyebrow">نمای کلی</span><h3>خلاصه عملکرد ماه</h3></div><CalendarDays size={19} className="muted-icon" /></div><div className="progress-wrap"><div className="progress-label"><span>هدف بازدید ماهانه</span><strong>۷۲٪</strong></div><div className="progress-bar"><span style={{ width: '72%' }} /></div><small>۳۶ از ۵۰ بازدید تکمیل شده</small></div><div className="mini-metrics"><div><strong>۲۳</strong><span>مشتری جدید</span></div><div><strong>۱۴</strong><span>پیگیری موفق</span></div><div><strong>۸۶٪</strong><span>حضور به‌موقع</span></div></div></section></div><section className="panel followup-preview"><div className="panel-heading"><div><span className="eyebrow">اقدام بعدی</span><h3>پیگیری‌های نزدیک</h3></div><button className="text-button" onClick={() => onNavigate('followups')}>مشاهده همه <ArrowLeft size={15} /></button></div><div className="followup-cards"><FollowupCard name="فروشگاه زیبایی نیلوفر" date="فردا، ساعت ۱۰:۳۰" tag="مشتری داغ" /><FollowupCard name="داروخانه سلامت" date="پس‌فردا، ساعت ۱۴:۰۰" tag="ارسال کاتالوگ" /><FollowupCard name="بوتیک لیلا" date="۲۵ جدی، ساعت ۱۱:۰۰" tag="مذاکره سفارش" /></div></section></div>;
}

function StatCard({ icon, label, value, trend, tone }: { icon: React.ReactNode; label: string; value: string; trend: string; tone: string }) { return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{trend}</small></div>; }
function FollowupCard({ name, date, tag }: { name: string; date: string; tag: string }) { return <div className="followup-card"><div className="followup-icon"><Clock3 size={18} /></div><div><strong>{name}</strong><span>{date}</span></div><em>{tag}</em></div>; }

function VisitForm({ onSave }: { onSave: (visit: Omit<Visit, 'id' | 'date'>) => void }) {
  const [store, setStore] = useState(''); const [area, setArea] = useState(''); const [province, setProvince] = useState('کابل'); const [status, setStatus] = useState('موفق'); const [category, setCategory] = useState('آرایشی'); const [contact, setContact] = useState(''); const [phone, setPhone] = useState(''); const [outcome, setOutcome] = useState('ثبت شد'); const [notes, setNotes] = useState(''); const [hasLocation, setHasLocation] = useState(false); const [linesState, setLinesState] = useState<OrderLine[]>([]);
  const total = useMemo(() => linesState.reduce((sum, line) => sum + line.amount, 0), [linesState]);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSave({ store, area, status, province }); }
  function addLine() { setLinesState([...linesState, { product: products[0], quantity: 1, amount: 0 }]); }
  return <form className="form-page" onSubmit={submit}><div className="form-intro"><div><span className="eyebrow">فرم روزانه نماینده</span><h2>جزئیات بازدید را ثبت کنید</h2><p>اطلاعات کامل دیدار امروز را وارد کنید تا پیگیری و سفارش‌گیری دقیق‌تر انجام شود.</p></div><div className="date-badge"><CalendarDays size={17} /> شنبه، ۲۱ جدی ۱۴۰۳</div></div><div className="form-layout"><div className="form-main"><section className="form-card"><div className="form-section-title"><span>۰۱</span><div><h3>اطلاعات مشتری و موقعیت</h3><p>اطلاعات پایه فروشگاه و تماس را وارد کنید.</p></div></div><div className="fields-grid"><Field label="نام فروشگاه / موقعیت" required><input required value={store} onChange={(e) => setStore(e.target.value)} placeholder="مثلاً: فروشگاه زیبایی گل سرخ" /></Field><Field label="ناحیه / منطقه"><input value={area} onChange={(e) => setArea(e.target.value)} placeholder="مثلاً: شهرنو" /></Field><Field label="ولایت"><select value={province} onChange={(e) => setProvince(e.target.value)}>{provinces.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="دسته‌بندی کسب‌وکار"><select value={category} onChange={(e) => setCategory(e.target.value)}><option>آرایشی</option><option>داروخانه</option><option>غیره</option></select></Field><Field label="نام شخص تماس"><input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="نام و نام خانوادگی" /></Field><Field label="شماره تماس"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07xx xxx xxxx" /></Field></div><div className="location-row"><div className="location-icon"><MapPin size={18} /></div><div><strong>موقعیت مکانی فروشگاه</strong><span>{hasLocation ? 'موقعیت فعلی با موفقیت ثبت شد' : 'برای اعتبارسنجی ولایت، موقعیت خود را ثبت کنید'}</span></div><button type="button" className={hasLocation ? 'location-done' : 'outline-button'} onClick={() => setHasLocation(true)}>{hasLocation ? <><CheckCircle2 size={16} /> ثبت شد</> : 'تشخیص موقعیت'}</button></div></section><section className="form-card"><div className="form-section-title"><span>۰۲</span><div><h3>نتیجه و ارزیابی بازدید</h3><p>وضعیت دیدار و فرصت همکاری را مشخص کنید.</p></div></div><div className="fields-grid"><Field label="وضعیت بازدید"><div className="choice-group">{['موفق', 'ناموفق', 'نیاز به پیگیری'].map((item) => <button type="button" key={item} className={status === item ? 'choice selected' : 'choice'} onClick={() => setStatus(item)}>{item}</button>)}</div></Field><Field label="نتیجه بازدید"><select value={outcome} onChange={(e) => setOutcome(e.target.value)}><option>ثبت شد</option><option>نیاز به پیگیری</option><option>علاقه‌مند نبود</option><option>حضور نداشت</option><option>محصول رقیب دارد</option><option>در آینده همکاری می‌کند</option></select></Field><Field label="سطح مشتری"><select><option>متوسط</option><option>ضعیف</option><option>عالی</option></select></Field><Field label="زمان ورود"><input type="time" defaultValue="09:30" /></Field><Field label="زمان خروج"><input type="time" defaultValue="10:15" /></Field><Field label="تاریخ پیگیری"><select><option>بدون پیگیری</option><option>۷ روز بعد</option><option>۱۴ روز بعد</option><option>۱ ماه بعد</option><option>تاریخ سفارشی</option></select></Field></div><Field label="ملاحظات و یادداشت‌ها"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="نکات مهم درباره مشتری، محصولات مورد علاقه یا اقدام بعدی..." /></Field></section><section className="form-card"><div className="form-section-title"><span>۰۳</span><div><h3>سفارش چندمحصولی</h3><p>چند محصول را در یک سفارش ثبت کنید.</p></div><button type="button" className="outline-button add-line" onClick={addLine}><Plus size={16} /> افزودن محصول</button></div>{linesState.length === 0 ? <div className="empty-order"><Package size={24} /><span>برای ثبت سفارش، محصول اضافه کنید.</span></div> : <div className="order-lines">{linesState.map((line, index) => <div className="order-line" key={index}><select value={line.product} onChange={(e) => setLinesState(linesState.map((item, i) => i === index ? { ...item, product: e.target.value } : item))}>{products.map((product) => <option key={product}>{product}</option>)}</select><input type="number" min="1" value={line.quantity} onChange={(e) => setLinesState(linesState.map((item, i) => i === index ? { ...item, quantity: Number(e.target.value) } : item))} placeholder="درجن" /><input type="number" min="0" value={line.amount} onChange={(e) => setLinesState(linesState.map((item, i) => i === index ? { ...item, amount: Number(e.target.value) } : item))} placeholder="مبلغ افغانی" /><button type="button" onClick={() => setLinesState(linesState.filter((_, i) => i !== index))}><X size={17} /></button></div>)}<div className="order-total"><span>مجموع سفارش</span><strong>{total.toLocaleString('fa-AF')} افغانی</strong></div></div>}</section></div><aside className="form-aside"><div className="save-card"><div className="save-icon"><CheckCircle2 size={21} /></div><h3>آماده ثبت هستید؟</h3><p>اطلاعات شما ابتدا روی دستگاه ذخیره می‌شود و پس از اتصال اینترنت همگام خواهد شد.</p><button className="primary-button submit-button" type="submit">ثبت نهایی بازدید <ArrowLeft size={18} /></button></div><div className="checklist-card"><h3>چک‌لیست بازدید</h3><label><input type="checkbox" defaultChecked /> معرفی داستان برند</label><label><input type="checkbox" /> معرفی مزیت رقابتی</label><label><input type="checkbox" /> بررسی موجودی محصولات</label><label><input type="checkbox" /> پیشنهاد سفارش</label></div></aside></div></form>;
}
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="field"><span>{label}{required && <i> *</i>}</span>{children}</label>; }

function FollowUps() { return <div className="section-page"><section className="page-intro"><div><span className="eyebrow">۳ سرنخ فعال</span><h2>پیگیری‌های شما</h2><p>با پیگیری به‌موقع، ارتباط را به همکاری پایدار تبدیل کنید.</p></div><div className="search-box"><Search size={18} /><input placeholder="جست‌وجوی مشتری..." /></div></section><div className="filter-tabs"><button className="active">همه پیگیری‌ها <b>۳</b></button><button>امروز <b>۰</b></button><button>این هفته <b>۳</b></button><button>تکمیل‌شده</button></div><div className="followup-table panel"><div className="table-header"><span>مشتری و موقعیت</span><span>اقدام بعدی</span><span>زمان پیگیری</span><span>اولویت</span><span>عملیات</span></div>{[['فروشگاه زیبایی نیلوفر', 'کارته سه', 'تماس برای نمونه محصول', 'فردا، ۱۰:۳۰', 'مشتری داغ'], ['داروخانه سلامت', 'مکروریان', 'ارسال لیست قیمت عمده', 'پس‌فردا، ۱۴:۰۰', 'مهم'], ['بوتیک لیلا', 'تایمنی', 'مذاکره سفارش اولیه', '۲۵ جدی، ۱۱:۰۰', 'عادی']].map((item) => <div className="table-row" key={item[0]}><div className="customer-cell"><span className="avatar soft">{item[0][0]}</span><div><strong>{item[0]}</strong><small>{item[1]}</small></div></div><span>{item[2]}</span><strong>{item[3]}</strong><em className="priority">{item[4]}</em><button className="small-action">مشاهده</button></div>)}</div></div>; }

function Catalog() { return <div className="section-page"><section className="page-intro catalog-intro"><div><span className="eyebrow">هفت رایحه، یک استاندارد</span><h2>کاتالوگ محصولات</h2><p>محصولات ویکتوریارز با فرمولاسیون فرانسوی و استانداردهای جهانی.</p></div><button className="outline-button"><FileText size={17} /> مشاهده لیست قیمت</button></section><div className="catalog-grid">{catalogItems.map((item, index) => <article className="catalog-card" key={item.name}><div className="product-art" style={{ background: `linear-gradient(135deg, ${item.color}, #211625)` }}><div className="bottle bottle-one" /><div className="bottle bottle-two" /><div className="bottle bottle-three" /><span>Victoria's Rose</span><strong>{String(index + 1).padStart(2, '۰')}</strong></div><div className="catalog-card-body"><div><h3>{item.name}</h3><span>{item.subtitle}</span></div><Gem size={18} className="gold-icon" /><p>{item.products}</p><div className="benefit-tags"><em>بدون سولفات</em><em>بدون پارابن</em></div></div></article>)}</div><section className="price-banner"><div><span className="eyebrow">قیمت‌گذاری شفاف</span><h3>لیست قیمت پرچون و عمده</h3><p>قیمت‌های قابل ارائه به مشتری را سریع و ساده ببینید.</p></div><button className="primary-button"><FileText size={17} /> باز کردن لیست قیمت</button></section></div>; }

function Academy() { return <div className="section-page"><section className="page-intro"><div><span className="eyebrow">یادگیری در مسیر فروش</span><h2>آکادمی فروش</h2><p>دانش محصول و مهارت گفت‌وگو، دو بال یک فروشنده حرفه‌ای هستند.</p></div></section><div className="academy-grid"><article className="academy-feature"><div className="academy-number">۰۱</div><BookOpen size={25} /><h3>داستان و هویت برند</h3><p>از میراث ویکتوریارز، زنجیره تأمین فرمولاسیون فرانسوی و تعهد به کیفیت بگویید.</p><button className="text-button">مطالعه درس <ArrowLeft size={15} /></button></article><article className="academy-feature light"><div className="academy-number">۰۲</div><Sparkles size={25} /><h3>شناخت محصولات و مزیت‌ها</h3><p>مزیت‌های بدون سولفات و بدون پارابن را به زبان ساده برای مشتری توضیح دهید.</p><button className="text-button">مطالعه درس <ArrowLeft size={15} /></button></article><article className="academy-feature dark"><div className="academy-number">۰۳</div><Users size={25} /><h3>راهنمای پاسخ به اعتراض‌ها</h3><p>پاسخ‌های حرفه‌ای برای گفت‌وگوهای B2B و ساختن اعتماد در فروش.</p><button className="text-button">مطالعه درس <ArrowLeft size={15} /></button></article></div><section className="documents-panel panel"><div className="panel-heading"><div><span className="eyebrow">منابع همراه شما</span><h3>اسناد آموزشی و کاتالوگ</h3></div></div><div className="document-list"><div><FileText size={20} /><span>سند هویت و داستان برند</span><small>مطالعه PDF</small></div><div><FileText size={20} /><span>شناخت محصولات و مزیت‌های رقابتی</span><small>مطالعه PDF</small></div><div><FileText size={20} /><span>کاتالوگ محصولات ویکتوریارز</span><small>مشاهده کاتالوگ</small></div></div></section></div>; }

export default App;
