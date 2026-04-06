// ═══════════════════════════════════════════════════════════════
// SUTH iDELL HAIKU — SMART AUTO-REPLY BOT (REPLACE IN INDEX.HTML)
// Find: "// ========== SMART AI CHATBOT" 
// Replace everything till end of </script> with this
// ═══════════════════════════════════════════════════════════════

// ── REPEAT TRACKER ──
const _repeatMap = {};
function trackRepeat(intent) {
  _repeatMap[intent] = (_repeatMap[intent] || 0) + 1;
  return _repeatMap[intent];
}

// ── NAVIGATION ACTION BUTTONS ──
function navBtn(label, page) {
  return `<button onclick="gotoPage('${page}');document.getElementById('chat-screen').classList.remove('open');chatOpen=false;document.body.style.overflow=''" 
    style="margin-top:8px;display:inline-block;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 16px;font-size:.75rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">
    ${label} →
  </button>`;
}

// ── PRE-FILL ORDER ──
function prefillOrder(platform, serviceId, qty) {
  // Navigate to new order page
  gotoPage('new-order');
  document.getElementById('chat-screen').classList.remove('open');
  chatOpen = false;
  document.body.style.overflow = '';
  // Wait for page to render then fill
  setTimeout(() => {
    selectPltGrid(platform);
    setTimeout(() => {
      const svc = (SERVICES[platform] || []).find(s => s.id === serviceId);
      if (svc) {
        selectService(svc);
        if (qty) {
          setTimeout(() => {
            const qEl = document.getElementById('of-qty');
            if (qEl) { qEl.value = qty; calcCharge(); }
          }, 200);
        }
      }
    }, 150);
  }, 400);
}

// ── KNOWLEDGE BASE (3 languages) ──
const KB_HAIKU = {
  en: {
    greet: [
      "Hey! I'm iDELL Haiku AI 👋 Ask me anything about services, pricing, orders, or your account.",
      "Hello! Welcome to iDELL Haiku. How can I help you today?",
      "Hi there! Ask about pricing, how to order, add balance, or anything else."
    ],
    balance: {
      text: "Your balance shows on the Dashboard and top bar.\n\nTo add balance:\n• Minimum: Rs. 5\n• Pay via PhonePe/GPay/Paytm/UPI\n• UPI ID: rambaisaket@axl\n• PhonePe: +91 9104679086\n• Send UTR + screenshot on WhatsApp: +91 9313195257\n• Balance added in 5–10 minutes",
      nav: navBtn("Add Funds Now", "funds")
    },
    order: {
      text: "Placing an order is easy:\n1. Choose platform (Instagram/YouTube/Facebook)\n2. Select service type\n3. Paste your link\n4. Enter quantity\n5. Hit Submit!",
      nav: navBtn("Place Order Now", "new-order")
    },
    price: {
      text: "Our prices — India's cheapest:\n• IG Followers: Rs.35/1,000\n• IG Likes: Rs.32/1,000\n• IG Reels Views: Rs.0.177/1,000\n• YT Subscribers: Rs.60/1,000\n• YT Views: Rs.110/1,000\n• FB Reels Views: Rs.0.177/1,000",
      nav: navBtn("Calculate Price", "calculator")
    },
    instagram: {
      text: "Instagram services available:\n• Followers (Rs.35/1K)\n• Followers Real (Rs.40/1K)\n• Likes (Rs.32/1K)\n• Reels Views (Rs.0.177/1K)\n• Story Views (Rs.0.177/1K)\n• Comments (Rs.50/50)",
      nav: `<button onclick="prefillOrder('instagram','ig-views',10000)" style="margin-top:8px;margin-right:4px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Order Views →</button>
            <button onclick="prefillOrder('instagram','ig-followers',1000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Order Followers →</button>`
    },
    youtube: {
      text: "YouTube services:\n• Views Adwords (Rs.110/1K)\n• Subscribers (Rs.60/1K)\n• Likes (Rs.32/1K)\n• Watch Hours (Rs.200/500h)\n• Comments (Rs.60/50)",
      nav: `<button onclick="prefillOrder('youtube','yt-subs',1000)" style="margin-top:8px;margin-right:4px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Order Subs →</button>
            <button onclick="prefillOrder('youtube','yt-views',10000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Order Views →</button>`
    },
    facebook: {
      text: "Facebook services:\n• Reels Views (Rs.0.177/1K)\n• Followers (Rs.25/1K)",
      nav: `<button onclick="prefillOrder('facebook','fb-reels',50000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Order FB Views →</button>`
    },
    delivery: { text: "Most orders start within 1–5 minutes. Delivery speed depends on quantity. Track status in Order History.", nav: navBtn("View Orders", "orders") },
    refill: { text: "Refill-guaranteed services are automatically topped up FREE if counts drop within warranty period (30 days to lifetime depending on service).", nav: null },
    safety: { text: "100% safe. We never ask for your password. All payments through UPI. No sensitive data stored. Your account security is our priority.", nav: null },
    minimum: { text: "Minimum payment: Rs. 5. No maximum limit. Add any amount you like.", nav: navBtn("Add Funds", "funds") },
    whatsapp: { text: "WhatsApp support: +91 9313195257\nTeam replies within minutes. Send your order issues, payment screenshots, or any query there.", nav: null },
    who: { text: "iDELL Haiku was created by Sahil Suthariya — a young developer and entrepreneur from India. Built to give everyone affordable SMM services.", nav: null },
    sahil: { text: "Sahil Suthariya is the founder of iDELL Haiku. He built this platform with his own hands to help people grow on social media affordably.", nav: null },
    login: { text: "To login: tap 'Sign In' on home page → click the Google button. Free, one-tap, no password needed.", nav: null },
    history: { text: "Check your order status, tracking, and history in Order History page.", nav: navBtn("View Order History", "orders") },
    dashboard: { text: "Your dashboard shows balance, total orders, pending, and completed stats.", nav: navBtn("Go to Dashboard", "dashboard") },
    calculator: { text: "Use the Price Calculator to see exact cost before ordering. Select platform + service + quantity = instant price!", nav: navBtn("Open Calculator", "calculator") },
    thanks: ["You're welcome! Happy to help anytime 😊", "Anytime! Feel free to ask more.", "Glad I could help! 🙌"]
  },
  hi: {
    greet: [
      "नमस्ते! मैं iDELL Haiku AI हूँ 👋 सर्विसेज़, कीमतें, ऑर्डर, बैलेंस — कुछ भी पूछें।",
      "हैलो! iDELL Haiku में स्वागत है। आज मैं क्या मदद कर सकता हूँ?",
      "नमस्कार! सर्विसेज़, कीमतें, बैलेंस जोड़ने — किसी भी चीज़ के बारे में पूछें।"
    ],
    balance: {
      text: "आपका बैलेंस डैशबोर्ड और टॉप बार पर दिखता है।\n\nबैलेंस जोड़ने के लिए:\n• न्यूनतम: Rs. 5\n• PhonePe/GPay/Paytm/UPI से पेमेंट करें\n• UPI ID: rambaisaket@axl\n• WhatsApp पर UTR + स्क्रीनशॉट भेजें: +91 9313195257\n• 5–10 मिनट में बैलेंस जुड़ जाता है",
      nav: navBtn("अभी बैलेंस जोड़ें", "funds")
    },
    order: {
      text: "ऑर्डर देना बहुत आसान है:\n1. प्लेटफॉर्म चुनें (Instagram/YouTube/Facebook)\n2. सर्विस चुनें\n3. अपना लिंक पेस्ट करें\n4. क्वांटिटी डालें\n5. Submit दबाएं!",
      nav: navBtn("अभी ऑर्डर दें", "new-order")
    },
    price: {
      text: "हमारी कीमतें — भारत में सबसे सस्ती:\n• IG Followers: Rs.35/1,000\n• IG Likes: Rs.32/1,000\n• IG Reels Views: Rs.0.177/1,000\n• YT Subscribers: Rs.60/1,000\n• YT Views: Rs.110/1,000",
      nav: navBtn("कीमत कैलकुलेट करें", "calculator")
    },
    instagram: {
      text: "Instagram सर्विसेज़:\n• Followers (Rs.35/1K)\n• Likes (Rs.32/1K)\n• Reels Views (Rs.0.177/1K)\n• Story Views (Rs.0.177/1K)",
      nav: `<button onclick="prefillOrder('instagram','ig-views',10000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Views ऑर्डर करें →</button>`
    },
    youtube: {
      text: "YouTube सर्विसेज़:\n• Views (Rs.110/1K)\n• Subscribers (Rs.60/1K)\n• Watch Hours (Rs.200/500h)",
      nav: `<button onclick="prefillOrder('youtube','yt-subs',1000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Subscribers ऑर्डर करें →</button>`
    },
    facebook: {
      text: "Facebook सर्विसेज़:\n• Reels Views (Rs.0.177/1K)\n• Followers (Rs.25/1K)",
      nav: `<button onclick="prefillOrder('facebook','fb-reels',50000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">FB Views ऑर्डर करें →</button>`
    },
    delivery: { text: "अधिकांश ऑर्डर 1–5 मिनट में शुरू होते हैं। Order History में स्टेटस देखें।", nav: navBtn("ऑर्डर हिस्ट्री देखें", "orders") },
    refill: { text: "रिफिल-गारंटी सर्विसेज़ मुफ्त में टॉप-अप होती हैं।", nav: null },
    safety: { text: "100% सुरक्षित। हम कभी पासवर्ड नहीं मांगते। सभी भुगतान UPI से।", nav: null },
    minimum: { text: "न्यूनतम भुगतान: Rs. 5. कोई अधिकतम सीमा नहीं।", nav: navBtn("बैलेंस जोड़ें", "funds") },
    whatsapp: { text: "WhatsApp सपोर्ट: +91 9313195257", nav: null },
    who: { text: "iDELL Haiku साहिल सुथारिया ने बनाया है — भारत के एक युवा डेवलपर।", nav: null },
    sahil: { text: "साहिल सुथारिया iDELL Haiku के संस्थापक हैं।", nav: null },
    login: { text: "होम पेज पर 'Sign In' → Google बटन क्लिक करें। फ्री, एक टैप में।", nav: null },
    history: { text: "Order History में अपने ऑर्डर की स्थिति देखें।", nav: navBtn("ऑर्डर हिस्ट्री", "orders") },
    dashboard: { text: "डैशबोर्ड पर बैलेंस, ऑर्डर, पेंडिंग सब दिखता है।", nav: navBtn("डैशबोर्ड जाएं", "dashboard") },
    calculator: { text: "Price Calculator में प्लेटफॉर्म + सर्विस + क्वांटिटी डालें — तुरंत कीमत मिलेगी!", nav: navBtn("Calculator खोलें", "calculator") },
    thanks: ["स्वागत है! कभी भी पूछें 😊", "खुशी हुई मदद करके!", "धन्यवाद! कुछ और चाहिए तो बताएं।"]
  },
  hinglish: {
    greet: [
      "Hey! Main iDELL Haiku AI hoon 👋 Services, pricing, orders, balance — kuch bhi pooch sakte ho!",
      "Hello! iDELL Haiku mein welcome! Kya help chahiye?",
      "Hi! Pricing, order karna, balance add karna — sab ke liye main yahan hoon."
    ],
    balance: {
      text: "Balance dashboard aur top bar pe dikhta hai.\n\nBalance add karne ke liye:\n• Minimum: Rs. 5\n• PhonePe/GPay/Paytm/UPI se pay karo\n• UPI ID: rambaisaket@axl\n• WhatsApp pe UTR + screenshot bhejo: +91 9313195257\n• 5–10 minute mein balance add ho jaata hai",
      nav: navBtn("Abhi Balance Jodo", "funds")
    },
    order: {
      text: "Order karna bahut easy hai:\n1. Platform chuno (Instagram/YouTube/Facebook)\n2. Service type chuno\n3. Apna link paste karo\n4. Quantity daalo\n5. Submit dabaao!",
      nav: navBtn("Order Do Abhi", "new-order")
    },
    price: {
      text: "Hamari prices — India ki cheapest:\n• IG Followers: Rs.35/1,000\n• IG Likes: Rs.32/1,000\n• IG Reels Views: Rs.0.177/1,000\n• YT Subscribers: Rs.60/1,000\n• YT Views: Rs.110/1,000\n• FB Reels Views: Rs.0.177/1,000",
      nav: navBtn("Price Calculate Karo", "calculator")
    },
    instagram: {
      text: "Instagram services available hain:\n• Followers (Rs.35/1K)\n• Real Followers (Rs.40/1K)\n• Likes (Rs.32/1K)\n• Reels Views (Rs.0.177/1K)\n• Story Views (Rs.0.177/1K)\n• Comments (Rs.50/50)",
      nav: `<button onclick="prefillOrder('instagram','ig-views',10000)" style="margin-top:8px;margin-right:4px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Views Order Karo →</button>
            <button onclick="prefillOrder('instagram','ig-followers',1000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Followers Order Karo →</button>`
    },
    youtube: {
      text: "YouTube services:\n• Views Adwords (Rs.110/1K)\n• Subscribers (Rs.60/1K)\n• Likes (Rs.32/1K)\n• Watch Hours (Rs.200/500h)",
      nav: `<button onclick="prefillOrder('youtube','yt-subs',1000)" style="margin-top:8px;margin-right:4px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Subs Order Karo →</button>
            <button onclick="prefillOrder('youtube','yt-views',10000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">Views Order Karo →</button>`
    },
    facebook: {
      text: "Facebook services:\n• Reels Views (Rs.0.177/1K)\n• Followers (Rs.25/1K)",
      nav: `<button onclick="prefillOrder('facebook','fb-reels',50000)" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:.73rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">FB Views Order Karo →</button>`
    },
    delivery: { text: "Zyaadatar orders 1–5 minute mein start ho jaate hain. Status Order History mein dekh sakte ho.", nav: navBtn("Orders Dekho", "orders") },
    refill: { text: "Refill-guaranteed services automatically top-up hoti hain — free mein!", nav: null },
    safety: { text: "100% safe. Hum kabhi password nahi maangte. Sab payments UPI se. Koi sensitive data store nahi karte.", nav: null },
    minimum: { text: "Minimum payment: Rs. 5. Koi maximum limit nahi.", nav: navBtn("Balance Jodo", "funds") },
    whatsapp: { text: "WhatsApp support: +91 9313195257\nTeam minutes mein reply karti hai!", nav: null },
    who: { text: "iDELL Haiku ko Sahil Suthariya ne banaya — India ke ek young developer aur entrepreneur hain.", nav: null },
    sahil: { text: "Sahil Suthariya iDELL Haiku ke founder hain. Unhone ye platform khud build kiya — sab ko affordable SMM dene ke liye.", nav: null },
    login: { text: "Login ke liye: Home page pe 'Sign In' → Google button click karo. Free, ek tap mein. Koi password nahi.", nav: null },
    history: { text: "Order History mein apne saare orders aur unka status dekho.", nav: navBtn("Order History Dekho", "orders") },
    dashboard: { text: "Dashboard pe balance, total orders, pending, completed — sab ek jagah.", nav: navBtn("Dashboard Jao", "dashboard") },
    calculator: { text: "Price Calculator mein platform + service + quantity daalo — turant exact price milegi!", nav: navBtn("Calculator Kholo", "calculator") },
    thanks: ["Welcome! Kabhi bhi pooch sakte ho 😊", "Khushi hui! Kuch aur chahiye toh batao.", "Anytime! Main hamesha yahan hoon 🙌"]
  }
};

// ── INTENT DETECTION ──
const INTENT_KEYWORDS = {
  balance:    ['balance','paisa','paise','kitna','wallet','rs.','rupee','rupay','fund','bakaya','how much','remaining','left'],
  order:      ['order','kaise','place','submit','service karna','lena','buy','purchase','ordering'],
  price:      ['price','rate','cost','kitne','cheap','afford','sasta','kitna lagega','kharcha','charge','fees','pricing','how much for','how much does'],
  instagram:  ['instagram','insta','ig','reel','story','followers','likes','views','post'],
  youtube:    ['youtube','yt','subscriber','subs','watch hour','video views','yt views','channel'],
  facebook:   ['facebook','fb','fb reel','facebook follower'],
  delivery:   ['delivery','time','kitna time','kitni der','fast','quickly','speed','eta','start'],
  refill:     ['refill','drop','decrease','kum','guarantee','warranty','wapas','back'],
  safety:     ['safe','password','secure','hacked','scam','legit','trust','real','fake'],
  minimum:    ['minimum','min','5 rs','least amount','kitna kam'],
  whatsapp:   ['whatsapp','wa','support','contact','help','issue','problem','admin'],
  who:        ['who made','who created','who built','kisne banaya','founder','company'],
  sahil:      ['sahil','suthariya'],
  login:      ['login','sign in','log in','signin','kaise login','how to login','google'],
  history:    ['history','status','track','purana','past orders','check order'],
  dashboard:  ['dashboard','home','main page','overview','stats'],
  calculator: ['calculator','calc','calculate','kalkulator','estimate','price check'],
  greet:      ['hi','hello','hey','hii','helo','namaste','namaskar','hy','yo','sup','hola'],
  thanks:     ['thanks','thank you','shukriya','dhanyawad','tysm','thx','ty','thanks a lot']
};

// Sonali / GF easter egg
const GF_TRIGGERS = ['sonali','gf','girlfriend','ladki','girl friend','sahil gf','sahil ki gf','sahil girlfriend'];
let _gfAsked = 0;
function checkGFEaster(msg) {
  const m = msg.toLowerCase();
  return GF_TRIGGERS.some(t => m.includes(t));
}
function gfEasterReply(lang) {
  _gfAsked++;
  if (_gfAsked === 1) {
    if (lang === 'hi') return "Haha, arey bhai yeh business platform hai 😄 Par chalo... Sahil ne ek baar ek ladki ko like kiya tha — Sonali naam tha. Bas 2-3 mahine ka saga tha, aur khatam 😂 Ab sirf iDELL Haiku se pyaar hai!";
    if (lang === 'hinglish') return "Arre yaar haha 😂 Bhai ne ek baar Sonali naam ki ladki ko like kiya tha — bas 2-3 months ka drama tha aur phir khatam! Ab toh sirf iDELL Haiku se ishq hai boss 😄";
    return "Haha this is a business platform 😄 But okay... Sahil once had a crush named Sonali — lasted maybe 2-3 months and that was that 😂 Now the only love is iDELL Haiku!";
  } else {
    if (lang === 'hi') return "Yaar yeh third baar pooch raha hai 😅 Sonali ke baare mein toh itna hi bata sakta hoon jitna pehle bataya! Chalo koi order place karo?";
    if (lang === 'hinglish') return "Bhai baar baar wahi pooch raha hai 😄 Sonali story khatam ho gayi bhai — ab order karo na!";
    return "You keep asking about this 😄 Sonali story is done — now let's focus on growing your social media! Want to place an order?";
  }
}

// Abusive filter
const ABUSIVE = ['sala','saala','gali','mc','bc','bkl','chutiya','bhd','rand','gaand','harami','madarchod','bh*d','ch*t'];
function isAbusive(msg) { const m = msg.toLowerCase(); return ABUSIVE.some(w => m.includes(w)); }

// Detect lang from message
function detectMsgLang(msg) {
  const m = msg.toLowerCase();
  // Devanagari chars → Hindi
  if (/[\u0900-\u097F]/.test(msg)) return 'hi';
  // Common hinglish words
  const hWords = ['kya','kaise','kitna','mujhe','mere','haiku','bhai','yaar','toh','aur','nahi','hai','hain','karo','jao','dekho','batao','chahiye'];
  if (hWords.some(w => m.includes(w))) return 'hinglish';
  return 'en';
}

// Main intent detector
function detectHaikuIntent(msg) {
  const m = msg.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(k => m.includes(k))) return intent;
  }
  return null;
}

// Build reply with navigation button
function buildReply(intent, lang) {
  const kb = KB_HAIKU[lang] || KB_HAIKU.en;
  const entry = kb[intent];
  if (!entry) return null;
  if (Array.isArray(entry)) {
    // Thanks/greet — random
    return { text: entry[Math.floor(Math.random() * entry.length)], nav: null };
  }
  return entry;
}

// ── TAP SOUND (good feel) ──
let _tapAC2 = null;
function playTapSound() {
  try {
    if (!_tapAC2) _tapAC2 = new (window.AudioContext || window.webkitAudioContext)();
    const o = _tapAC2.createOscillator();
    const g = _tapAC2.createGain();
    o.connect(g); g.connect(_tapAC2.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(660, _tapAC2.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, _tapAC2.currentTime + 0.12);
    g.gain.setValueAtTime(0.08, _tapAC2.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, _tapAC2.currentTime + 0.15);
    o.start(); o.stop(_tapAC2.currentTime + 0.15);
  } catch(e) {}
}

// Add tap sounds to all interactive elements
document.addEventListener('click', function(e) {
  const el = e.target;
  if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('.nav-item') || el.closest('.quick-btn') || el.closest('.plt-card') || el.closest('.service-card') || el.closest('.filter-btn') || el.closest('.cquick-btn')) {
    playTapSound();
  }
}, {passive: true});

// ── INLINE ORDER QUANTITY CHIPS (1500 etc) ──
window._savedQtyFromBot = null;

// ── MAIN BOT SEND FUNCTION ──
let chatLoading = false, chatOpen = false, chatModeVal = 'chat';
let chatHist = [], chatAttach = null;

function cFmt(t) {
  return t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\n/g,'<br/>');
}
function cMkWrap(role) { const w = document.createElement('div'); w.className = 'cmsg-wrap' + (role==='usr' ? ' u-wrap' : ''); return w; }
function cMkBubble(role) { const b = document.createElement('div'); b.className = 'cmsg ' + role; return b; }
function cMkBot() { const w = cMkWrap('bot'); const b = cMkBubble('bot'); w.appendChild(b); const a = document.createElement('div'); a.className = 'cact'; a.innerHTML = `<button class="cact-btn" onclick="cCopyMsg(this)">Copy</button>`; w.appendChild(a); return {w,b}; }
function cThink(lbl) { const box = document.getElementById('cb'); const w = document.createElement('div'); w.className = 'cmsg-wrap'; w.id = 'cthink'; const d = document.createElement('div'); d.className = 'cthink'; d.innerHTML = `<div class="cspin"></div><span class="cthink-lbl">${lbl||'Thinking...'}</span>`; w.appendChild(d); box.appendChild(w); box.scrollTop = 9999; }
function cRmThink() { document.getElementById('cthink')?.remove(); }
function cStream(el, text, done) { let i = 0; const chars = Array.from(text); const box = document.getElementById('cb'); function nx() { if (i < chars.length) { el.innerHTML = cFmt(chars.slice(0,i+1).join('')) + '<span class="ccursor"></span>'; i++; box.scrollTop = 9999; setTimeout(nx, chars.length > 600 ? 5 : chars.length > 200 ? 8 : 12); } else { el.innerHTML = cFmt(text); box.scrollTop = 9999; if (done) done(); } } nx(); }
function cMode(m) { chatModeVal = m; document.querySelectorAll('.chat-mode-btn').forEach(b => b.classList.remove('on')); document.getElementById('cm-'+m)?.classList.add('on'); document.getElementById('ci').placeholder = {chat:'Message...', deep:'Deep question...', image:'Describe...'}[m]; }
function chatToggle() { chatOpen = !chatOpen; document.getElementById('chat-screen').classList.toggle('open', chatOpen); document.body.style.overflow = chatOpen ? 'hidden' : ''; document.getElementById('chat-fab').classList.toggle('fab-hide', chatOpen); document.querySelector('.fab-dot').style.display = 'none'; if (chatOpen) { setTimeout(() => document.getElementById('ci').focus(), 280); document.getElementById('cb').scrollTop = 9999; } }
function cQuick(t) { playTapSound(); document.getElementById('cq').style.display='none'; document.getElementById('ci').value=t; cSend(); }
const ci = document.getElementById('ci');
ci.addEventListener('input', function() { this.style.height='auto'; this.style.height=Math.min(this.scrollHeight,100)+'px'; });
ci.addEventListener('keydown', function(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();cSend();} });
function cFile(input) { const f = input.files[0]; if (!f) return; const r = new FileReader(); r.onload = e => { chatAttach = {name:f.name, content:e.target.result}; const bar = document.getElementById('cab'); bar.style.display = 'flex'; bar.innerHTML = `<div style="display:inline-flex;align-items:center;gap:4px;background:var(--surface2);border:1px solid var(--border);border-radius:100px;padding:2px 9px;font-size:.65rem;"><span>${f.name}</span><button onclick="cClearAttach()" style="background:none;border:none;cursor:pointer;">x</button></div>`; }; r.readAsText(f); input.value = ''; }
function cClearAttach() { chatAttach = null; const b = document.getElementById('cab'); b.style.display='none'; b.innerHTML=''; }
function cLinkModal() { document.getElementById('link-modal').classList.add('show'); setTimeout(()=>document.getElementById('link-inp').focus(),200); }
function closeLink() { document.getElementById('link-modal').classList.remove('show'); document.getElementById('link-inp').value=''; }
function submitLink() { const u=document.getElementById('link-inp').value.trim(); if(!u)return; closeLink(); document.getElementById('ci').value=`Tell me about this: ${u}`; cSend(); }
document.getElementById('link-modal').addEventListener('click', function(e){if(e.target===this)closeLink();});
document.getElementById('link-inp').addEventListener('keydown', e=>{if(e.key==='Enter')submitLink();});

// Idle timer — show virus animation after 1 min of inactivity in chat
let _idleTimer = null;
let _idleTriggered = false;

function resetIdleTimer() {
  if (!chatOpen) return;
  clearTimeout(_idleTimer);
  _idleTriggered = false;
  _idleTimer = setTimeout(() => {
    if (!chatOpen || _idleTriggered) return;
    _idleTriggered = true;
    showCyberAlert();
  }, 60000); // 1 minute
}

function showCyberAlert() {
  const box = document.getElementById('cb');
  const w = document.createElement('div');
  w.className = 'cmsg-wrap';
  const b = document.createElement('div');
  b.className = 'cmsg bot';
  b.style.cssText = 'background:#0a0a0a;color:#00ff41;font-family:monospace;border-color:#00ff41;';
  b.innerHTML = `<div style="animation:none;">
    ⚠️ IDLE DETECTED<br/>
    > SYSTEM MONITORING...<br/>
    > USER INACTIVE FOR 60s<br/>
    > INITIATING CYBER SCAN...<br/><br/>
    <span style="color:#ff0000;">■■■■■■■■■■</span> 100%<br/><br/>
    <span style="color:#ffff00;">ALL CLEAR. No threats found.</span><br/>
    Still here? Ask me something! 😄
  </div>`;
  w.appendChild(b);
  box.appendChild(w);
  box.scrollTop = 9999;
}

document.getElementById('ci').addEventListener('keydown', resetIdleTimer);
document.getElementById('ci').addEventListener('input', resetIdleTimer);
document.getElementById('chat-screen').addEventListener('click', resetIdleTimer);

async function cSend() {
  if (chatLoading) return;
  let text = document.getElementById('ci').value.trim();
  if (!text && !chatAttach) return;
  
  resetIdleTimer();
  playTapSound();
  
  document.getElementById('ci').value = '';
  document.getElementById('ci').style.height = 'auto';
  document.getElementById('cq').style.display = 'none';
  
  let display = text;
  if (chatAttach) {
    display = text ? `${text}\n[File: ${chatAttach.name}]` : `[File: ${chatAttach.name}]`;
    cClearAttach();
  }
  
  const box = document.getElementById('cb');
  const uw = cMkWrap('usr');
  const ub = cMkBubble('usr');
  ub.innerHTML = cFmt(display);
  uw.appendChild(ub);
  box.appendChild(uw);
  box.scrollTop = 9999;
  
  chatHist.push({role:'user', content:text});
  chatLoading = true;
  document.getElementById('csend').disabled = true;
  
  // Detect lang
  const lang = detectMsgLang(text);
  
  // Abusive check
  if (isAbusive(text)) {
    cThink();
    await new Promise(r => setTimeout(r, 400));
    cRmThink();
    const {w,b} = cMkBot();
    const abMsg = lang === 'hi' ? "Yaar galat baat mat karo 😑 Sahi se poocho toh help karoonga!" 
                : lang === 'hinglish' ? "Bhai galat language mat use karo 😑 Seedha pooch — main help karunga!" 
                : "Please keep it respectful! I'm happy to help if you ask nicely 😊";
    box.appendChild(w);
    cStream(b, abMsg);
    chatLoading = false;
    document.getElementById('csend').disabled = false;
    return;
  }
  
  // GF Easter egg
  if (checkGFEaster(text)) {
    cThink();
    await new Promise(r => setTimeout(r, 600));
    cRmThink();
    const {w,b} = cMkBot();
    box.appendChild(w);
    cStream(b, gfEasterReply(lang));
    chatLoading = false;
    document.getElementById('csend').disabled = false;
    return;
  }
  
  cThink(chatModeVal === 'deep' ? 'Deep analyzing...' : 'Thinking...');
  await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
  cRmThink();
  
  const intent = detectHaikuIntent(text);
  
  const {w, b} = cMkBot();
  box.appendChild(w);
  
  if (!intent) {
    // No match — Sahil message
    const noMatch = lang === 'hi' 
      ? "माफ करना, मैं समझ नहीं पाया 😅\n\nSahil bhai को message kar raha hoon...\n\nWaise tab tak कोशिश करो: **balance**, **order**, **price**, **instagram**, **youtube**, **whatsapp** जैसे keywords use करो!"
      : lang === 'hinglish'
      ? "Samajh nahi aaya yaar 😅\n\nSahil bhai ko message kar raha hoon...\n\nTab tak try karo: **balance**, **order**, **price**, **instagram**, **youtube**, **whatsapp** keywords use karo!"
      : "Hmm, I didn't quite get that 😅\n\nMessaging Sahil about your query...\n\nMeanwhile try keywords like: **balance**, **order**, **price**, **instagram**, **youtube**, **whatsapp**";
    cStream(b, noMatch);
  } else {
    // Repeat detection
    const repeatCount = trackRepeat(intent);
    
    if (repeatCount >= 3 && intent !== 'greet' && intent !== 'thanks') {
      const repeatMsg = lang === 'hi' 
        ? `Yaar yahi ${repeatCount} baar pooch chuke ho 😄 Ruk, Sahil ko message karta hoon tere baare mein! Waise main pehle bhi yahi bata chuka hoon. ${navBtn('Seedha Dekho', intent === 'balance' ? 'funds' : intent === 'order' ? 'new-order' : 'dashboard')}`
        : lang === 'hinglish'
        ? `Bhai ${repeatCount} baar same cheez pooch raha hai 😄 Sahil ko message karta hoon tere baare mein! Par bhai main pehle bhi bata chuka hoon. ${navBtn('Seedha Jao', intent === 'balance' ? 'funds' : intent === 'order' ? 'new-order' : 'dashboard')}`
        : `You've asked this ${repeatCount} times now 😄 Messaging Sahil about you! But I already answered this — ${navBtn('Go Directly', intent === 'balance' ? 'funds' : intent === 'order' ? 'new-order' : 'dashboard')}`;
      b.innerHTML = repeatMsg;
    } else {
      const reply = buildReply(intent, lang);
      if (reply) {
        cStream(b, reply.text, () => {
          if (reply.nav) {
            const navDiv = document.createElement('div');
            navDiv.innerHTML = reply.nav;
            b.appendChild(navDiv);
          }
        });
      } else {
        cStream(b, "Ask me about services, pricing, orders, or your account!");
      }
    }
  }
  
  chatLoading = false;
  document.getElementById('csend').disabled = false;
  chatHist.push({role:'assistant', content: b.innerText || ''});
  document.getElementById('ci').focus();
}

function cCopyMsg(btn) { const t = btn.closest('.cmsg-wrap').querySelector('.cmsg').innerText; navigator.clipboard.writeText(t).then(() => { btn.textContent = 'Copied'; setTimeout(()=>btn.textContent='Copy',1800); }); }
function cShare() { const lines = chatHist.map(m => (m.role==='user'?'You: ':'iDELL Haiku AI: ') + m.content); document.getElementById('share-txt').textContent = lines.length ? 'iDELL Haiku Chat\n\n' + lines.join('\n\n') : 'No conversation yet.'; document.getElementById('share-modal').classList.add('show'); }
function closeShare() { document.getElementById('share-modal').classList.remove('show'); }
function doCopy() { navigator.clipboard.writeText(document.getElementById('share-txt').textContent).then(() => { const b = document.querySelector('#share-modal .modal-btn.prim'); b.textContent = 'Copied'; setTimeout(() => { b.textContent='Copy'; closeShare(); }, 1500); }); }
document.getElementById('share-modal').addEventListener('click', function(e){if(e.target===this)closeShare();});
document.addEventListener('keydown', e => { if(e.key==='Escape'&&chatOpen) chatToggle(); });

if (!document.getElementById('toast')) { const d=document.createElement('div'); d.className='toast'; d.id='toast'; document.body.appendChild(d); }
