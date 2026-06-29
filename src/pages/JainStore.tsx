import { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingBag, Search, Filter, Plus, Store, 
  Mail, Phone, ShieldCheck, CheckCircle, Clock, AlertTriangle, 
  ExternalLink, Sparkles, MessageCircle, Globe, Settings, Eye, Trash2,
  Loader2, ShoppingCart, Minus, Bot, User, Send, QrCode, FileText, Check, Truck, CreditCard, Printer, ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import SectionAiAgent from '../components/SectionAiAgent';

const DEFAULT_STORES = [
  { id: 'store_digambar_prakashan', vendorName: "Aacharya Vidyasagar Trust", storeName: "Digambar Jin-Vani Prakashan", email: "prakashan@vidyasagar.org", phone: "9876543210", description: "Official publications of authentic Jain Shastras, Baal Bodh, and Samayasar commentaries.", status: "approved" },
  { id: 'store_jain_organic', vendorName: "Samyak Organic Farm", storeName: "Samyak Ahimsa Organics", email: "samyak@organicjain.com", phone: "9898989898", description: "100% pure organic pulses, cold-pressed oils, and grain flour ground within sunset compliance.", status: "approved" },
  { id: 'store_shravak_samagri', vendorName: "Samil Jain", storeName: "Shravak Dharma Upkaran", email: "samiljain0111@gmail.com", phone: "9111223344", description: "Symmetrical wooden chawris, brass pujan plates, cotton filtration cloths, and pure dravya.", status: "approved" }
];

const DEFAULT_PRODUCTS = [
  { id: 'prod_bal_bodh_1', storeId: 'store_digambar_prakashan', storeName: "Digambar Jin-Vani Prakashan", title: "Jain Baal Bodh Pathshala Set (Books 1-3)", description: "Complete foundational text set for kids featuring moral stories, basic 6 substances, and 8 basic virtues.", price: 150, category: "Books", imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=500", status: "approved", contactNo: "9876543210" },
  { id: 'prod_tattvartha_sutra', storeId: 'store_digambar_prakashan', storeName: "Digambar Jin-Vani Prakashan", title: "Tattvartha Sutra (Hindi Commentary)", description: "The immortal work of Aacharya Umaswami, fully annotated with verse meanings and commentaries.", price: 280, category: "Books", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=500", status: "approved", contactNo: "9876543210" },
  { id: 'prod_pure_cotton_filtration', storeId: 'store_shravak_samagri', storeName: "Shravak Dharma Upkaran", title: "Pure Double-Layer Cotton Water Filter Cloth", description: "High-density organic cotton cloth designed in accordance with Jain water filtration (bioluminescent survival) guidelines.", price: 120, category: "Pujan Samagri", imageUrl: "https://images.unsplash.com/photo-1528255671579-01b9e182ed1d?auto=format&fit=crop&q=80&w=500", status: "approved", contactNo: "9111223344" },
  { id: 'prod_samayasar_course', storeId: 'store_digambar_prakashan', storeName: "Digambar Jin-Vani Prakashan", title: "Aatm-Gyan Samayasar Video Lectures Course", description: "Digital access to 108 hours of expert discourses explaining Kundakunda Aacharya's pure-soul philosophy.", price: 499, category: "Courses", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500", status: "approved", contactNo: "9111223344" },
  { id: 'prod_sunbaked_pulses', storeId: 'store_jain_organic', storeName: "Samyak Ahimsa Organics", title: "Sunset-Processed Handground Moong Dal (1kg)", description: "Moong dal ground during peak daylight hours using traditional stone mills. Zero machine contact.", price: 180, category: "Organic Food", imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=500", status: "approved", contactNo: "9898989898" },
  { id: 'prod_brass_thali', storeId: 'store_shravak_samagri', storeName: "Shravak Dharma Upkaran", title: "Brass Abhishek Kalash & Thali Set", description: "Traditional heavy pure brass Kalash and matching Thali for daily Jinendra Abhishek, designed with high visual purity.", price: 750, category: "Pujan Samagri", imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=500", status: "approved", contactNo: "9111223344" },
  { id: 'prod_mishri_box', storeId: 'store_jain_organic', storeName: "Samyak Ahimsa Organics", title: "Shuddh Mishri & Organic Dry Fruits Tray", description: "Non-bleached pure rock sugar crystals and premium dry fruits hand-sorted during sunlight hours for biological purity.", price: 340, category: "Organic Food", imageUrl: "https://images.unsplash.com/photo-1596560548464-f01068e3c9eb?auto=format&fit=crop&q=80&w=500", status: "approved", contactNo: "9898989898" }
];

export default function JainStorePage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'shop' | 'my_orders' | 'my_store' | 'admin'>('shop');
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [helpOpen, setHelpOpen] = useState(false);

  // Advanced Checkout Wizard States
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'receipt'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('Standard Ahimsa Eco-Delivery');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // New Store Registration Form
  const [vendorName, setVendorName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeDesc, setStoreDesc] = useState('');

  // New Product Listing Form
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCat, setProdCat] = useState('Books');
  const [prodContact, setProdContact] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [myRegisteredStore, setMyRegisteredStore] = useState<any>(null);

  // Shopping Cart state
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // AI Store Guide States
  const [storeAiMessages, setStoreAiMessages] = useState<any[]>([
    { role: 'model', text: 'Jai Jinendra! I am your Samyak Shopping and Purity Assistant. I can help verify scripture commentary sequences (such as Baal Bodh, Dravya Sangraha, Samayasar), explain traditional sunset-timing rules for edible grains, explain the correct density for water filter cloths, or advise on brass pujan samagri. What can I help you find today?' }
  ]);
  const [storeAiInput, setStoreAiInput] = useState('');
  const [sendingStoreAi, setSendingStoreAi] = useState(false);

  // Admin states
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // New Premium Features States
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'specifications' | 'description' | 'manufacturer' | 'return'>('specifications');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [activePurityProduct, setActivePurityProduct] = useState<any | null>(null);
  const [activeReviewProduct, setActiveReviewProduct] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Add Review Form States
  const [revName, setRevName] = useState('');
  const [revText, setRevText] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revSunlightVerified, setRevSunlightVerified] = useState(true);
  const [revPlasticFreeVerified, setRevPlasticFreeVerified] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // My Orders & Tracking States
  const [trackedOrders, setTrackedOrders] = useState<any[]>([]);
  const [trackPhoneInput, setTrackPhoneInput] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [hasSearchedOrders, setHasSearchedOrders] = useState(false);

  useEffect(() => {
    // Load favorites from local storage
    const storedFavs = localStorage.getItem('jain_store_favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        console.error(e);
      }
    }
    
    // Auto-fill tracked phone if available
    const savedPhone = localStorage.getItem('last_customer_phone');
    if (savedPhone) {
      setTrackPhoneInput(savedPhone);
    }
  }, []);

  const toggleFavorite = (prodId: string) => {
    let updated;
    if (favorites.includes(prodId)) {
      updated = favorites.filter(id => id !== prodId);
    } else {
      updated = [...favorites, prodId];
    }
    setFavorites(updated);
    localStorage.setItem('jain_store_favorites', JSON.stringify(updated));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch stores
      const storeSnap = await getDocs(collection(db, 'jain_stores'));
      const dbStores = storeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const allStores = [...DEFAULT_STORES];
      dbStores.forEach((s: any) => {
        if (!allStores.some(item => item.id === s.id)) {
          allStores.push(s);
        }
      });
      setStores(allStores);

      // Check if user has a store profile locally registered
      const savedStoreId = localStorage.getItem('my_jain_store_id');
      if (savedStoreId) {
        const myStore = allStores.find(s => s.id === savedStoreId);
        if (myStore) {
          setMyRegisteredStore(myStore);
        }
      }

      // 2. Fetch products
      const prodSnap = await getDocs(collection(db, 'jain_products'));
      const dbProds = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const allProducts = [...DEFAULT_PRODUCTS];
      dbProds.forEach((p: any) => {
        if (!allProducts.some(item => item.id === p.id)) {
          allProducts.push(p);
        }
      });
      setProducts(allProducts);

    } catch (e) {
      console.error("Error reading store products:", e);
      setStores(DEFAULT_STORES);
      setProducts(DEFAULT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart helper
  const addToCart = (p: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) {
        return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: p.id,
        title: p.title,
        price: p.price,
        imageUrl: p.imageUrl,
        storeName: p.storeName,
        contactNo: p.contactNo || "9111223344",
        quantity: 1
      }];
    });
    setCartOpen(true);
  };

  // Remove from cart
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Update quantity
  const updateCartQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const getProductMetadata = (p: any) => {
    const category = p.category || 'General';
    if (category === 'Books') {
      return {
        highlights: [
          { label: lang === 'en' ? 'Format' : 'प्रारूप', value: lang === 'en' ? 'Hardbound' : 'हार्डबाउंड' },
          { label: lang === 'en' ? 'Language' : 'भाषा', value: lang === 'en' ? 'Sanskrit & Hindi' : 'संस्कृत-हिंदी' },
          { label: lang === 'en' ? 'Type' : 'प्रकार', value: lang === 'en' ? 'Authentic Shastra' : 'प्रामाणिक शास्त्र' },
          { label: lang === 'en' ? 'Pages' : 'पृष्ठ संख्या', value: '320' }
        ],
        specifications: [
          { name: lang === 'en' ? 'Author' : 'मूल रचयिता', value: p.title.includes('Baal Bodh') ? 'Pandit Banarasidas' : 'Aacharya Umaswami' },
          { name: lang === 'en' ? 'Publisher' : 'प्रकाशक', value: p.storeName || 'Digambar Jin-Vani Prakashan' },
          { name: lang === 'en' ? 'Paper Quality' : 'कागज', value: lang === 'en' ? 'High-grade non-chemical' : 'उच्च शुद्धता रसायनिक-रहित' },
          { name: lang === 'en' ? 'Font Size' : 'अक्षर आकार', value: '14pt Bold Clear' },
          { name: lang === 'en' ? 'Suitability' : 'उपयुक्तता', value: lang === 'en' ? 'Daily Swaadhyaay' : 'दैनिक स्वाध्याय' },
          { name: lang === 'en' ? 'Watermark' : 'वाटरमार्क', value: lang === 'en' ? 'Samyak Sacred' : 'सम्यक् जिनवाणी' }
        ],
        description: lang === 'en' 
          ? `${p.description}. This scripture set is printed on special acid-free paper, ensuring maximum longevity without deterioration. Handled strictly by vegetarian shravakas with hand-washed purity.`
          : `${p.description}। यह जिनवाणी ग्रंथ विशेष एसिड-मुक्त कागज पर मुद्रित है जो इसकी दीर्घायु सुनिश्चित करता है। शुद्धता एवं आदर भाव के साथ मुद्रित और पैक किया गया।`,
        manufacturer: {
          brand: p.storeName || 'Digambar Jin-Vani Prakashan',
          name: p.storeName || 'Digambar Jin-Vani Prakashan',
          address: 'Shree Digambar Jain Mandir Compound, Trust Building, India',
          contact: p.contactNo || '9876543210',
          daylightPacking: true,
          plasticFree: true
        },
        returnPolicy: lang === 'en'
          ? 'Being sacred scriptures, returns are allowed within 7 days ONLY for printing errors or damaged transits. Please handle with ultimate respect (Vinay).'
          : 'पवित्र ग्रंथ होने के कारण, केवल मुद्रण त्रुटि या पारगमन में क्षति होने पर ही ७ दिनों के भीतर वापसी संभव है। कृपया विनय पूर्वक स्पर्श करें।'
      };
    } else if (category === 'Organic Food') {
      return {
        highlights: [
          { label: lang === 'en' ? 'Milling Time' : 'पिसाई का समय', value: lang === 'en' ? 'Daylight (☀️)' : 'केवल दिन में (☀️)' },
          { label: lang === 'en' ? 'Plastic-Free' : 'पैकेजिंग', value: lang === 'en' ? 'Yes, 100%' : 'हाँ, शत-प्रतिशत' },
          { label: lang === 'en' ? 'Preservatives' : 'संरक्षक रसायन', value: lang === 'en' ? 'Zero Chemical' : 'शून्य रसायनिक' },
          { label: lang === 'en' ? 'Water Purity' : 'पानी शुद्धि', value: lang === 'en' ? 'Double Filtered' : 'द्वि-परत छना जल' }
        ],
        specifications: [
          { name: lang === 'en' ? 'Ingredients' : 'घटक सामग्री', value: lang === 'en' ? 'Organic Grains / Pulses' : 'जैविक शुद्ध दाल/अनाज' },
          { name: lang === 'en' ? 'Process' : 'पिसाई विधि', value: lang === 'en' ? 'Stone-ground (Chakki)' : 'पारंपरिक पत्थर चक्की' },
          { name: lang === 'en' ? 'Purity Grade' : 'शुद्धता ग्रेड', value: 'Samyak Premium A++' },
          { name: lang === 'en' ? 'Root Vegetables' : 'जमींकंद मिलावट', value: lang === 'en' ? 'Zero (Onion/Garlic Free)' : 'वर्जित (लहसुन, प्याज मुक्त)' },
          { name: lang === 'en' ? 'Maryada (Expiry)' : 'मर्यादा अवधि', value: lang === 'en' ? '7 Days (Ground grains) / 6 Months (Whole)' : 'पिसने के बाद ७ दिन / साबुत ६ माह' },
          { name: lang === 'en' ? 'Net Quantity' : 'मात्रा', value: '1 Kg / Box' }
        ],
        description: lang === 'en'
          ? `${p.description}. Ground only under daylight hours, maintaining the strict self-control rules (Chakki Maryada) to safeguard minimal life forms.`
          : `${p.description}। दिन के प्रकाश में पारंपरिक चक्की द्वारा पिसा हुआ, जो जीवाणु संरक्षण हेतु मर्यादित समय सीमा का कड़ाई से अनुपालन करता है।`,
        manufacturer: {
          brand: p.storeName || 'Samyak Ahimsa Organics',
          name: p.storeName || 'Samyak Ahimsa Organics',
          address: 'Samyak Farmhouse & Eco Village, Madhya Pradesh, India',
          contact: p.contactNo || '9898989898',
          daylightPacking: true,
          plasticFree: true
        },
        returnPolicy: lang === 'en'
          ? 'Due to strict biological freshness and Maryada limits, food items cannot be returned once delivered, ensuring no hygiene or purity contamination occurs.'
          : 'जैविक शुद्धता मर्यादा सीमा के कारण, खाद्य सामग्री के पैकेट खुलने के बाद वापसी संभव नहीं है ताकि अन्य उपभोक्ताओं के लिए शुद्धता सुनिश्चित रहे।'
      };
    } else if (category === 'Pujan Samagri') {
      return {
        highlights: [
          { label: lang === 'en' ? 'Material' : 'धातु / सामग्री', value: lang === 'en' ? 'Pure Brass / Wood' : 'शुद्ध पीतल / चंदन / सूत' },
          { label: lang === 'en' ? 'Chemical Free' : 'रसायन मुक्त', value: lang === 'en' ? 'Yes' : 'हाँ' },
          { label: lang === 'en' ? 'Handmade' : 'हस्तनिर्मित', value: lang === 'en' ? 'Vegetarian Craftsmen' : 'शाकाहारी शिल्पकार' },
          { label: lang === 'en' ? 'Ahimsa Proof' : 'अहिंसक धागे', value: lang === 'en' ? 'Silk-Free' : 'रेशम रहित शुद्ध सूत' }
        ],
        specifications: [
          { name: lang === 'en' ? 'Components' : 'घटक सामान', value: lang === 'en' ? 'Lead-free polished metal / cotton' : 'सीसा-रहित पॉलिश पीतल / जैविक सूत' },
          { name: lang === 'en' ? 'Ideal For' : 'उपयुक्तता', value: lang === 'en' ? 'Daily Jinendra Abhishek & Pooja' : 'दैनिक जिनेन्द्र देव अभिषेक एवं पूजन' },
          { name: lang === 'en' ? 'Craftsmanship' : 'शिल्पकला', value: lang === 'en' ? 'Traditional Jaipur Carving' : 'पारंपरिक जयपुर नक्काशी' },
          { name: lang === 'en' ? 'Silk / Animal fibres' : 'रेशम धागा', value: lang === 'en' ? 'Absolutely 100% Free' : 'पूर्णतः रहित (अहिंसक)' },
          { name: lang === 'en' ? 'Net Quantity' : 'मात्रा', value: '1 Unit Set' },
          { name: lang === 'en' ? 'Weight' : 'वजन', value: 'Approx. 450g' }
        ],
        description: lang === 'en'
          ? `${p.description}. Created with high spiritual focus. Free from artificial plating chemicals or bone-china mixes.`
          : `${p.description}। उच्च धार्मिक श्रद्धा के साथ निर्मित। किसी भी कृत्रिम रसायनों या अशुद्ध मिश्रणों से सर्वथा मुक्त।`,
        manufacturer: {
          brand: p.storeName || 'Shravak Dharma Upkaran',
          name: p.storeName || 'Shravak Dharma Upkaran',
          address: 'Ahimsa Industrial Area, Rajasthan, India',
          contact: p.contactNo || '9111223344',
          daylightPacking: true,
          plasticFree: true
        },
        returnPolicy: lang === 'en'
          ? 'Returns are welcome within 7 days in original unused condition. Cotton filters cannot be returned if opened from the seal.'
          : 'उपकरणों को ७ दिनों के भीतर उनके मूल स्वरूप में वापस किया जा सकता है। छन्ना वस्त्र सील खुलने के बाद वापस नहीं होगा।'
      };
    } else {
      return {
        highlights: [
          { label: lang === 'en' ? 'Type' : 'प्रकार', value: lang === 'en' ? 'Digital / Spiritual' : 'डिजिटल / आध्यात्मिक' },
          { label: lang === 'en' ? 'Instructor' : 'मार्गदर्शक', value: lang === 'en' ? 'Scholarly Experts' : 'विद्वान मनीषी' },
          { label: lang === 'en' ? 'Duration' : 'अवधि', value: lang === 'en' ? 'Lifetime Access' : 'आजीवन पहुंच' },
          { label: lang === 'en' ? 'Devices' : 'उपकरण समर्थन', value: lang === 'en' ? 'Mobile & TV' : 'मोबाइल एवं टीवी' }
        ],
        specifications: [
          { name: lang === 'en' ? 'Format' : 'प्रारूप', value: lang === 'en' ? 'HD Streaming Video lectures' : 'एचडी स्ट्रीमिंग वीडियो व्याख्यान' },
          { name: lang === 'en' ? 'Platform' : 'प्लेटफार्म', value: 'Samyak Online Learning' },
          { name: lang === 'en' ? 'Certification' : 'प्रमाण पत्र', value: lang === 'en' ? 'Aatmanubhuti Course' : 'आत्मानुभूति स्वध्याय' },
          { name: lang === 'en' ? 'Support' : 'सपोर्ट', value: lang === 'en' ? 'Interactive doubts forum' : 'प्रश्न मंच' },
          { name: lang === 'en' ? 'Language' : 'भाषा', value: 'Hindi & English commentary' },
          { name: lang === 'en' ? 'Offline' : 'ऑफ़लाइन डाउनलोड', value: lang === 'en' ? 'Available in app' : 'ऐप में उपलब्ध' }
        ],
        description: p.description,
        manufacturer: {
          brand: p.storeName || 'Jainism GPT Academy',
          name: p.storeName || 'Jainism GPT Academy',
          address: 'Digital Learning Wing, Samyak Sangha',
          contact: p.contactNo || '9111223344',
          daylightPacking: false,
          plasticFree: true
        },
        returnPolicy: lang === 'en'
          ? 'Digital access comes with a 100% contentment path. Returns are processed instantly if requested within 3 days of registration.'
          : 'डिजिटल कोर्स के लिए ३ दिनों के भीतर पूर्ण संतोष गारंटी के तहत निरस्तीकरण एवं रिफंड संभव है।'
      };
    }
  };

  const fetchReviewsForProduct = async (prodId: string) => {
    setReviewsLoading(true);
    try {
      const q = query(collection(db, 'jain_product_reviews'), where('productId', '==', prodId));
      const snap = await getDocs(q);
      const dbReviews = snap.docs.map(doc => doc.data());
      
      const fallbackReviews = [
        { 
          reviewerName: "Shrikant Jain", 
          rating: 5, 
          reviewText: lang === 'en' 
            ? "Extremely high quality and strictly prepared. Complies fully with shravak tenets." 
            : "अत्यधिक उच्च गुणवत्ता और मर्यादित रूप से तैयार। श्रावक धर्म के अनुकूल है।", 
          sunlightVerified: true, 
          plasticFreeVerified: true, 
          createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString() 
        },
        { 
          reviewerName: "Anshu Jain", 
          rating: 5, 
          reviewText: lang === 'en' 
            ? "Beautiful print and packaging. Highly recommended for daily study." 
            : "सुंदर मुद्रण और पैकिंग। दैनिक स्वाध्याय के लिए अत्यधिक अनुशंसित।", 
          sunlightVerified: true, 
          plasticFreeVerified: false, 
          createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() 
        }
      ];
      
      setReviews(dbReviews.length > 0 ? dbReviews : fallbackReviews);
    } catch (e) {
      console.error("Error fetching reviews:", e);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewProduct || !revName.trim() || !revText.trim()) {
      alert(lang === 'en' ? 'Please fill in all fields.' : 'कृपया सभी विवरण भरें।');
      return;
    }
    setSubmittingReview(true);
    const newReview = {
      productId: activeReviewProduct.id,
      reviewerName: revName,
      reviewText: revText,
      rating: revRating,
      sunlightVerified: revSunlightVerified,
      plasticFreeVerified: revPlasticFreeVerified,
      createdAt: new Date().toISOString()
    };
    try {
      await addDoc(collection(db, 'jain_product_reviews'), newReview);
      setReviews(prev => [newReview, ...prev]);
      setRevName('');
      setRevText('');
      setRevRating(5);
    } catch (err) {
      console.error("Error saving review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleTrackOrders = async () => {
    if (!trackPhoneInput.trim()) {
      alert(lang === 'en' ? 'Please enter a phone number.' : 'कृपया फ़ोन नंबर दर्ज करें।');
      return;
    }
    setTrackingLoading(true);
    setHasSearchedOrders(true);
    try {
      const q = query(collection(db, 'jain_orders'), where('customerPhone', '==', trackPhoneInput.trim()));
      const snap = await getDocs(q);
      const dbOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dbOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTrackedOrders(dbOrders);
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Send message to AI Store Assistant
  const handleSendStoreAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeAiInput.trim() || sendingStoreAi) return;

    const userMsg = { role: 'user', text: storeAiInput };
    setStoreAiMessages(prev => [...prev, userMsg]);
    setStoreAiInput('');
    setSendingStoreAi(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: storeAiInput,
          history: storeAiMessages.slice(-8),
          systemInstruction: "You are the AI Samyak Jainism Store Guide. You advise customers on traditional purity requirements, reading orders for Baal Bodh Pathshala books, and sunset timing compliance for grains. Remind users that all custom vendors are vetted by Samil Jain. Keep answers incredibly helpful, pure, respectful, and concise."
        })
      });
      const data = await response.json();
      setStoreAiMessages(prev => [...prev, { role: 'model', text: data.response || 'Facing a temporary network connection glitch.' }]);
    } catch (err) {
      console.error(err);
      setStoreAiMessages(prev => [...prev, { role: 'model', text: 'Error: Connection lost with AI Guide.' }]);
    } finally {
      setSendingStoreAi(false);
    }
  };

  // WhatsApp checkout exporter
  const handleExportCartToWhatsApp = () => {
    if (cart.length === 0) return;

    // Build a neat checkout message grouped by Vendor
    let message = `*JAINISMGPT MARKETPLACE ORDER DETAILS*\n`;
    message += `=====================================\n\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      message += `${index + 1}. *${item.title}*\n`;
      message += `   - Vendor: _${item.storeName}_\n`;
      message += `   - Price: ₹${item.price} x ${item.quantity}\n`;
      message += `   - Subtotal: *₹${subtotal}*\n\n`;
    });

    message += `=====================================\n`;
    message += `*GRAND TOTAL: ₹${total}*\n\n`;
    message += `Please process this order. Jai Jinendra!`;

    // Direct link to the first item vendor's WhatsApp
    const primaryContact = cart[0].contactNo;
    const waLink = `https://wa.me/${primaryContact}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank', 'referrerPolicy=no-referrer');
  };

  // Submit new mini store request
  const handleRegisterStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !storeName || !storeEmail || !storePhone) {
      alert(lang === 'en' ? 'Please fill in all details.' : 'कृपया सभी विवरण भरें।');
      return;
    }

    const storeId = 'store_' + Math.random().toString(36).substr(2, 9);
    const newStore = {
      id: storeId,
      vendorName,
      storeName,
      email: storeEmail,
      phone: storePhone,
      description: storeDesc,
      status: 'pending', // Requires Developer/Admin verification
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'jain_stores'), newStore);
      localStorage.setItem('my_jain_store_id', storeId);
      setMyRegisteredStore(newStore);
      
      // Update local state
      setStores(prev => [...prev, newStore]);

      alert(lang === 'en' 
        ? 'Your mini store request has been submitted! Since this is a high-tech verified portal, the Administrator must approve your profile before you can go live. You can contact support directly via Instagram (@_officialsamiljain_).' 
        : 'आपका मिनी स्टोर अनुरोध दर्ज हो गया है! सुरक्षा कारणों से, एडमिनिस्ट्रेटर द्वारा स्वीकृत होने के बाद ही आपका स्टोर लाइव होगा। त्वरित स्वीकृति के लिए इंस्टाग्राम (@_officialsamiljain_) पर संपर्क करें।'
      );
    } catch (err) {
      console.error(err);
      alert('Error registering store.');
    }
  };

  // Submit product for listing
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myRegisteredStore) return;
    if (!prodTitle || !prodPrice || !prodContact) {
      alert(lang === 'en' ? 'Please fill required fields.' : 'कृपया आवश्यक फ़ील्ड भरें।');
      return;
    }

    const prodId = 'prod_' + Math.random().toString(36).substr(2, 9);
    const defaultImg = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400";
    
    const newProduct = {
      id: prodId,
      storeId: myRegisteredStore.id,
      storeName: myRegisteredStore.storeName,
      title: prodTitle,
      description: prodDesc,
      price: Number(prodPrice),
      category: prodCat,
      imageUrl: prodImage || defaultImg,
      status: 'pending', // Requires Admin approval
      contactNo: prodContact,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'jain_products'), newProduct);
      setProducts(prev => [...prev, newProduct]);

      alert(lang === 'en'
        ? 'Product added successfully under review! It will show up on the marketplace once the administrator (Samil Jain) approves it.'
        : 'उत्पाद समीक्षा के लिए जोड़ दिया गया है! प्रशासक समील जैन द्वारा स्वीकृत होने के बाद यह बाजार में दिखाई देगा।'
      );

      // Clear form
      setProdTitle('');
      setProdDesc('');
      setProdPrice('');
      setProdContact('');
      setProdImage('');
    } catch (err) {
      console.error(err);
      alert('Error adding product.');
    }
  };

  // Admin passcode verification
  const handleVerifyAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'samil123' || adminPassword === 'SAMIL_STORE_2026') {
      setIsAdminAuthenticated(true);
    } else {
      alert(lang === 'en' ? 'Incorrect developer passcode.' : 'गलत डेवलपर पासकोड।');
    }
  };

  // Approve action (Admin)
  const handleApproveStore = async (storeId: string) => {
    try {
      const q = query(collection(db, 'jain_stores'), where('id', '==', storeId));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const docRef = doc(db, 'jain_stores', querySnap.docs[0].id);
        await updateDoc(docRef, { status: 'approved' });
      }

      setStores(prev => prev.map(s => s.id === storeId ? { ...s, status: 'approved' } : s));
      // Re-trigger checks
      if (myRegisteredStore && myRegisteredStore.id === storeId) {
        setMyRegisteredStore(prev => ({ ...prev, status: 'approved' }));
      }
      alert('Store approved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveProduct = async (prodId: string) => {
    try {
      const q = query(collection(db, 'jain_products'), where('id', '==', prodId));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const docRef = doc(db, 'jain_products', querySnap.docs[0].id);
        await updateDoc(docRef, { status: 'approved' });
      }

      setProducts(prev => prev.map(p => p.id === prodId ? { ...p, status: 'approved' } : p));
      alert('Product approved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    try {
      const q = query(collection(db, 'jain_products'), where('id', '==', prodId));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const docRef = doc(db, 'jain_products', querySnap.docs[0].id);
        await deleteDoc(docRef);
      }
      setProducts(prev => prev.filter(p => p.id !== prodId));
      alert('Product deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', 'Books', 'Pujan Samagri', 'Courses', 'Organic Food', 'Others'];

  // Filter approved products for public, or all if admin/owner
  const publicProducts = products.filter(p => {
    const isApproved = p.status === 'approved';
    const isMine = myRegisteredStore && p.storeId === myRegisteredStore.id;
    return isApproved || isMine || isAdminAuthenticated;
  });

  const filteredProducts = publicProducts.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesFav = !showFavsOnly || favorites.includes(p.id);
    return matchesSearch && matchesCategory && matchesFav;
  });

  return (
    <div className="min-h-full p-6 pb-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            <ShoppingBag className="text-[#FF6D00] shrink-0" size={22} />
            <span>{lang === 'en' ? 'JAIN DHARMA STORE' : 'जैन धर्म स्टोर'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Help Button */}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[#ff3d3d] hover:text-[#ff6e6e] font-black text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer select-none shrink-0"
            title={lang === 'en' ? 'About Jain Dharma Store' : 'जैन धर्म स्टोर के बारे में'}
          >
            ?
          </button>

          {/* Symmetrical Inline Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1 font-black text-[10px] cursor-pointer border border-[#FF9100]/30 shrink-0 h-9"
            title={lang === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="flex p-1 mb-8 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl w-full max-w-xl mx-auto overflow-hidden gap-1">
        <button
          onClick={() => setActiveTab('shop')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'shop' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <ShoppingBag size={14} />
          {lang === 'en' ? 'Explore Shop' : 'बाजार'}
        </button>
        <button
          onClick={() => {
            setActiveTab('my_orders');
            if (trackPhoneInput.trim()) {
              handleTrackOrders();
            }
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'my_orders' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Truck size={14} />
          {lang === 'en' ? 'Track Orders' : 'ऑर्डर ट्रैकिंग'}
        </button>
        <button
          onClick={() => setActiveTab('my_store')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'my_store' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Store size={14} />
          {lang === 'en' ? 'My Mini Store' : 'मेरा स्टोर'}
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'admin' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Settings size={14} />
          {lang === 'en' ? 'Admin Portal' : 'संचालक'}
        </button>
      </div>

      {activeTab === 'shop' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-xl rounded-3xl p-6 border border-amber-500/20 relative overflow-hidden max-w-6xl mx-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div>
                <span className="text-[10px] text-[#FF6D00] font-black uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/10 inline-block mb-2">
                  ✨ {lang === 'en' ? '100% EXCLUSIVE JAIN STORE' : 'शुद्ध मर्यादित जैन स्टोर'}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-gray-900 dark:text-white">
                  {lang === 'en' ? 'Samyak Shravak Marketplace' : 'सम्यक् श्रावक धार्मिक बाजार'}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-bold leading-relaxed max-w-xl">
                  {lang === 'en' 
                    ? 'Explore verified Jain shastras, baal bodh books, pure sunset-ground food, and authentic pujan samagri listed by approved community vendors.' 
                    : 'सत्यापित विक्रेताओं द्वारा प्रेषित शुद्ध पूजन सामग्री, शास्त्र, बालबोध पुस्तकें एवं सूर्यास्त मर्यादित जैविक खाद्य पदार्थ।'}
                </p>
              </div>

               {/* Developer contact prompt */}
              <div className="p-4 bg-white dark:bg-[#121212] border border-orange-500/20 rounded-2xl max-w-xs shrink-0 shadow-sm flex flex-col gap-1.5 text-center">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">{lang === 'en' ? 'LIST YOUR PRODUCTS' : 'समान लिस्ट करें'}</span>
                <p className="text-[10px] text-gray-500 font-bold leading-snug">
                  {lang === 'en' ? 'To open a mini-store, you must contact Support on Instagram (@_officialsamiljain_) for permission.' : 'अपना मिनी स्टोर खोलने के लिए पहले सपोर्ट इंस्टाग्राम (@_officialsamiljain_) से अनुमति लें।'}
                </p>
                <a 
                  href="https://instagram.com/_officialsamiljain_"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#FF6D00] hover:bg-orange-600 text-black text-[9px] font-black uppercase rounded-lg shadow-sm tracking-wider transition-all inline-block"
                >
                  📸 {lang === 'en' ? 'Contact on Instagram' : 'इंस्टाग्राम पर संपर्क करें'}
                </a>
              </div>
            </div>
          </div>

          {/* ==================== REAL-TIME SUNSET COMPLIANCE MONITOR ==================== */}
          {(() => {
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const totalMinutes = hours * 60 + minutes;
            const isDaylightActive = totalMinutes >= 360 && totalMinutes < 1110; // 6:00 AM to 6:30 PM (18:30)
            
            // Format time string
            const formattedTime = currentTime.toLocaleTimeString(lang === 'en' ? 'en-US' : 'hi-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            });

            return (
              <div className="max-w-6xl mx-auto p-5 rounded-3xl bg-white dark:bg-[#111] border border-orange-500/10 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#FF6D00] to-amber-500" />
                <div className="flex items-center gap-3.5 pl-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    isDaylightActive ? "bg-emerald-500/10 text-emerald-600 animate-pulse" : "bg-amber-500/10 text-amber-600"
                  )}>
                    {isDaylightActive ? <Clock size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div className="space-y-1 text-left flex-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {lang === 'en' ? 'Samyak Sunset-Compliance Realtime Monitor' : 'सम्यक् सूर्यास्त-काल मर्यादा लाइव मॉनिटर'}
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                      {isDaylightActive 
                        ? (lang === 'en' ? '● DAYLIGHT COMPLIANCE ACTIVE — AHIMSA PROCESSING ENABLED' : '● दिवाचर्या मर्यादा सक्रिय — अहिंसा खाद्य निर्माण अनुमत')
                        : (lang === 'en' ? '🌙 RATRI BHOJAN LIMIT ACTIVE — FRESH FOOD CURFEW' : '🌙 रात्रि भोजन निषेध काल — नवीन खाद्य निर्माण स्थगित')}
                    </h3>
                    <p className="text-[11px] text-gray-550 dark:text-zinc-400 font-semibold leading-normal">
                      {isDaylightActive 
                        ? (lang === 'en' 
                          ? "All edible items on our store are verified to be ground, milled, and packaged exclusively during peak daylight hours to avoid biological harm." 
                          : "इस हाट में उपलब्ध सभी सूर्यास्त-मर्यादित भोज्य पदार्थ सूर्योदय से सूर्यास्त के मध्य ही शुद्धता से निर्मित किए जाते हैं।")
                        : (lang === 'en' 
                          ? "Strict moral codes prevent fresh edible item processing after sunset. Non-perishable dravya and books remain fully purchasable." 
                          : "सूर्यास्त के पश्चात सूक्ष्म जीवों की उत्पत्ति के कारण मर्यादित खाद्य पदार्थों का निर्माण एवं सेवन जैन धर्म में वर्जित है।")}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3 text-center min-w-[140px] shrink-0 font-mono">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#FF6D00] block mb-0.5">{lang === 'en' ? 'CURRENT TIME' : 'वर्तमान समय'}</span>
                  <span className="text-xs md:text-sm font-black text-gray-900 dark:text-amber-100">{formattedTime}</span>
                </div>
              </div>
            );
          })()}

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search books, samagri, organic pulses...' : 'शास्त्र, पूजन सामग्री, मर्यादित भोजन खोजें...'}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#121212]/90 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFavsOnly(prev => !prev)}
                className={cn(
                  "px-4 py-2.5 rounded-2xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 text-xs font-black uppercase tracking-wider",
                  showFavsOnly 
                    ? "bg-red-500/10 text-red-500 border-red-500/30" 
                    : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
                title={lang === 'en' ? 'Favorites' : 'पसंदीदा'}
              >
                <span>❤️</span>
                <span className="hidden sm:inline">{lang === 'en' ? 'My Favorites' : 'पसंदीदा'}</span>
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase border whitespace-nowrap transition-all duration-300 cursor-pointer",
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black border-transparent shadow-sm font-black"
                      : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {cat === 'All' ? (lang === 'en' ? 'All Items' : 'सभी उत्पाद') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="animate-spin text-[#FF6D00] mx-auto mb-3" size={32} />
                <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Loading marketplace catalog...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p: any) => {
                  const isPending = p.status === 'pending';
                  const isFav = favorites.includes(p.id);
                  return (
                    <div 
                      key={p.id}
                      className={cn(
                        "bg-white dark:bg-[#121212] rounded-3xl border overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-orange-500/30 transition-all duration-300 group shadow-sm relative",
                        isPending ? "border-amber-500/40 opacity-85" : "border-gray-200/50 dark:border-white/5"
                      )}
                    >
                      {isPending && (
                        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-amber-500 text-black font-black text-[8px] uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} />
                          {lang === 'en' ? 'Under Review' : 'समीक्षाधीन (Pending)'}
                        </div>
                      )}

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={() => toggleFavorite(p.id)}
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all cursor-pointer shadow-md select-none"
                        title={lang === 'en' ? 'Add to Favorites' : 'पसंदीदा में जोड़ें'}
                      >
                        <span className={cn("text-sm transition-transform duration-200 active:scale-125", isFav ? "scale-110" : "opacity-60")}>
                          {isFav ? "❤️" : "🤍"}
                        </span>
                      </button>

                      <div 
                        className="cursor-pointer flex-1 flex flex-col justify-between"
                        onClick={() => {
                          setSelectedProduct(p);
                          setActiveDetailTab('specifications');
                        }}
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <img 
                            src={p.imageUrl} 
                            alt={p.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-white font-mono font-black text-xs">
                            ₹{p.price}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2 text-left">
                          <div className="flex items-center justify-between text-[9px] font-black text-amber-600 uppercase tracking-widest">
                            <span>{p.category}</span>
                            <span className="text-gray-400 font-semibold">{p.storeName}</span>
                          </div>

                          <h3 className="font-serif font-black text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#FF6D00] transition-colors">
                            {p.title}
                          </h3>

                          {/* Star Ratings Component */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveReviewProduct(p);
                              fetchReviewsForProduct(p.id);
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                          >
                            <span>⭐️ 5.0</span>
                            <span className="text-gray-400 dark:text-gray-300 font-bold hover:underline">
                              ({lang === 'en' ? 'Reviews' : 'समीक्षा'})
                            </span>
                          </button>

                          <p className="text-[11px] text-gray-550 dark:text-gray-400 leading-relaxed font-semibold line-clamp-3">
                            {p.description}
                          </p>

                          {/* Purity Checklist Quick Link */}
                          <div className="pt-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePurityProduct(p);
                              }}
                              className="text-[9px] font-black text-[#FF6D00] hover:text-orange-500 bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>🛡️</span>
                              <span>{lang === 'en' ? 'Samyak Purity Audit' : 'सम्यक् शुद्धता ऑडिट'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Buy / Enquire trigger */}
                      <div className="p-4 pt-0 flex flex-col gap-2">
                        <button 
                          onClick={() => addToCart(p)}
                          className="w-full py-2.5 bg-[#FF6D00] hover:bg-orange-600 text-black text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <ShoppingCart size={13} />
                          <span>{lang === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें'}</span>
                        </button>

                        <a 
                          href={`https://wa.me/${p.contactNo}?text=Jai%20Jinendra%2C%20I%20am%20interested%20in%20your%20product%20"${encodeURIComponent(p.title)}"%20listed%20on%20Jainism%20GPT%20Store.`}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="w-full py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <MessageCircle size={11} />
                          <span>{lang === 'en' ? 'Enquire Direct' : 'सीधा संपर्क करें'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#111111] rounded-[2rem] border border-gray-200/50 dark:border-white/5">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No products listed in this category.</p>
              </div>
            )}
          </div>

          {/* AI Store Guide chatbot section */}
          <div id="ai-store-guide-section" className="max-w-6xl mx-auto mt-16">
            <div className="bg-gradient-to-br from-zinc-950 via-[#121212] to-amber-950/20 border border-amber-500/20 rounded-[2.5rem] p-6 md:p-8 shadow-xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6D00]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
                {/* Left Column */}
                <div className="lg:w-2/5 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1.5 rounded-full border border-[#FF6D00]/10 inline-flex items-center gap-1">
                      <Bot size={11} className="text-[#FF6D00]" />
                      {lang === 'en' ? 'AI SAMYAK STORE GUIDE' : 'AI सम्यक् गाइड'}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-white mt-3 leading-tight">
                      {lang === 'en' ? 'Samyak Shopping & Purity Assistant' : 'धार्मिक सामग्री एवं शुद्धि परामर्श'}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold mt-2 leading-relaxed">
                      {lang === 'en' 
                        ? 'Confused about the sequence of study books or standard water filtration guidelines? Speak to our AI to check compatibility with traditional Jain tenets of Shravak Dharma.'
                        : 'स्वाध्याय के ग्रंथों के अनुक्रम अथवा जल-छानने के सूती वस्त्र की मोटाई आदि नियमों को लेकर संशय में हैं? हमारे AI परामर्शदाता से तुरंत पूछें।'}
                    </p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider block">
                      {lang === 'en' ? 'SUGGESTED DISCOURSES' : 'सुझाए गए विषय'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        lang === 'en' ? 'Which book after Baal Bodh 1?' : 'बालबोध भाग १ के बाद क्या पढ़ें?',
                        lang === 'en' ? 'What are sunset eating rules?' : 'रात्रि भोजन त्याग के स्वास्थ्य लाभ?',
                        lang === 'en' ? 'How dense should filter cloth be?' : 'जल छानने के वस्त्र के क्या नियम हैं?'
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => setStoreAiInput(prompt)}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-[10px] font-bold text-left transition-colors border border-white/5 active:scale-95 cursor-pointer max-w-full"
                        >
                          💡 {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Chat Messages box) */}
                <div className="lg:w-3/5 bg-black/40 border border-white/10 rounded-3xl p-4 flex flex-col justify-between min-h-[350px] max-h-[420px]">
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-3 scrollbar-none">
                    {storeAiMessages.map((msg, i) => {
                      const isAI = msg.role === 'model';
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "flex gap-2.5 max-w-[85%] text-xs",
                            isAI ? "self-start text-left" : "self-end ml-auto flex-row-reverse text-right"
                          )}
                        >
                          <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border",
                            isAI 
                              ? "bg-[#FF6D00]/10 text-[#FF6D00] border-[#FF6D00]/20" 
                              : "bg-amber-400/10 text-amber-300 border-amber-400/20"
                          )}>
                            {isAI ? <Bot size={13} /> : <User size={13} />}
                          </div>

                          <div className={cn(
                            "p-3 rounded-2xl leading-relaxed font-semibold",
                            isAI 
                              ? "bg-[#161616] text-gray-200 border border-white/5 rounded-tl-none" 
                              : "bg-gradient-to-r from-orange-600 to-amber-500 text-black font-extrabold rounded-tr-none"
                          )}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                    {sendingStoreAi && (
                      <div className="flex gap-2.5 max-w-[80%] text-xs self-start text-left">
                        <div className="w-7 h-7 rounded-lg bg-[#FF6D00]/10 text-[#FF6D00] border border-[#FF6D00]/20 flex items-center justify-center shrink-0">
                          <Loader2 className="animate-spin" size={13} />
                        </div>
                        <div className="p-3 bg-[#161616] text-gray-400 rounded-2xl rounded-tl-none border border-white/5 font-semibold">
                          Consulting Samyak guidelines repository...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendStoreAi} className="flex gap-2 relative mt-2">
                    <input
                      type="text"
                      value={storeAiInput}
                      onChange={(e) => setStoreAiInput(e.target.value)}
                      placeholder={lang === 'en' ? 'Ask AI Shopping Guide...' : 'AI शॉपिंग गाइड से पूछें...'}
                      className="w-full pl-4 pr-12 py-3 bg-zinc-900 text-xs border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                    />
                    <button
                      type="submit"
                      disabled={!storeAiInput.trim() || sendingStoreAi}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FF6D00] hover:bg-orange-600 text-black rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my_orders' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tracking Search Header */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200/50 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h2 className="text-lg font-serif font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Truck size={20} className="text-[#FF6D00]" />
              <span>{lang === 'en' ? 'Live Order Tracking Portal' : 'लाइव ऑर्डर ट्रैकिंग पोर्टल'}</span>
            </h2>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              {lang === 'en' 
                ? 'Enter the customer phone number used during checkout to retrieve your real-time packing status, sunlight verification certificates, and delivery timelines.'
                : 'ऑर्डर करते समय दर्ज किया गया मोबाइल नंबर दर्ज करें और अपने ऑर्डर की वास्तविक स्थिति, दिन में पैकिंग सत्यापन एवं डिलीवरी की समय-सीमा जानें।'}
            </p>

            <div className="flex gap-2 max-w-md pt-2">
              <input
                type="tel"
                value={trackPhoneInput}
                onChange={(e) => setTrackPhoneInput(e.target.value)}
                placeholder={lang === 'en' ? 'e.g., 9111223344' : 'उदा. 9111223344'}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
              />
              <button
                type="button"
                onClick={handleTrackOrders}
                disabled={trackingLoading}
                className="px-6 py-3 bg-[#FF6D00] hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {trackingLoading ? <Loader2 className="animate-spin" size={13} /> : <Search size={13} />}
                <span>{lang === 'en' ? 'Track Status' : 'ट्रैक करें'}</span>
              </button>
            </div>
          </div>

          {/* Results Area */}
          {trackingLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="animate-spin text-[#FF6D00] mx-auto mb-3" size={32} />
              <p className="text-xs font-black uppercase tracking-wider text-gray-400">Retrieving secure order documents...</p>
            </div>
          ) : trackedOrders.length > 0 ? (
            <div className="space-y-6">
              {trackedOrders.map((order: any, idx: number) => {
                // Tracking stages helper
                const stages = [
                  { key: 'pending', en: 'Order Received', hi: 'ऑर्डर प्राप्त हुआ', desc: 'Samyak checkout validated' },
                  { key: 'packed', en: 'Daylight Packed', hi: 'दिन में पैक किया गया', desc: 'Processed before sunset limits' },
                  { key: 'shipped', en: 'Ahimsa Eco Transit', hi: 'अहिंसा ईको शिपिंग', desc: 'In transit without plastic' },
                  { key: 'delivered', en: 'Delivered', hi: 'सफलतापूर्वक वितरित', desc: 'Handed over pure & secure' }
                ];

                // Determine active index
                let activeIndex = 0; // default pending
                if (order.status === 'packed') activeIndex = 1;
                else if (order.status === 'shipped') activeIndex = 2;
                else if (order.status === 'delivered') activeIndex = 3;

                return (
                  <div key={order.id || idx} className="bg-white dark:bg-[#111] border border-gray-200/50 dark:border-white/5 rounded-[2rem] p-6 text-left shadow-sm space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#FF6D00]" />
                    
                    {/* Header Details */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100 dark:border-white/5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black text-[#FF6D00] uppercase tracking-wider bg-orange-500/10 px-2.5 py-1 rounded-md">
                          {order.id}
                        </span>
                        <div className="text-[10px] text-gray-400 font-semibold pt-1">
                          {lang === 'en' ? 'Placed on: ' : 'ऑर्डर तिथि: '}
                          <span className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-400 font-bold mr-2">{lang === 'en' ? 'Amount Paid:' : 'भुगतान राशि:'}</span>
                        <span className="text-base font-mono font-black text-[#FF6D00]">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="py-4 px-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-6">
                        {lang === 'en' ? 'AHIMSA PACKING & TRANSIT TIMELINE' : 'अहिंसा पैकिंग एवं पारगमन स्थिति'}
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 relative">
                        {stages.map((stage, sIdx) => {
                          const isCompleted = sIdx <= activeIndex;
                          const isCurrent = sIdx === activeIndex;
                          return (
                            <div key={stage.key} className="flex md:flex-col items-center md:items-start gap-3 md:gap-2 relative z-10">
                              <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black transition-all shrink-0",
                                isCompleted 
                                  ? "bg-green-600 text-white shadow-md shadow-green-500/20" 
                                  : "bg-gray-100 dark:bg-zinc-850 text-gray-400 dark:text-zinc-500 border border-gray-200 dark:border-zinc-800"
                              )}>
                                {isCompleted ? "✓" : sIdx + 1}
                              </div>
                              <div className="text-left md:pt-1">
                                <h4 className={cn(
                                  "text-xs font-black uppercase tracking-wider",
                                  isCurrent ? "text-[#FF6D00]" : isCompleted ? "text-green-600" : "text-gray-400 dark:text-zinc-600"
                                )}>
                                  {lang === 'en' ? stage.en : stage.hi}
                                </h4>
                                <p className="text-[9px] text-gray-500 font-bold leading-tight mt-0.5">{stage.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="bg-gray-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">
                        {lang === 'en' ? 'ORDERED ITEMS' : 'मंगवाई गई सामग्री'}
                      </span>
                      <div className="space-y-2">
                        {order.items?.map((item: any, iIdx: number) => (
                          <div key={iIdx} className="flex justify-between items-center text-xs pb-2 border-b border-dashed border-gray-200/50 dark:border-white/5 last:border-none last:pb-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-orange-500/10 text-[#FF6D00] flex items-center justify-center font-mono text-[9px] font-black">
                                {item.quantity}x
                              </span>
                              <span className="font-black text-gray-800 dark:text-white">{item.title}</span>
                            </div>
                            <span className="font-mono font-bold text-gray-500 dark:text-zinc-400">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold pt-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">{lang === 'en' ? 'SHIPPING ADDRESS' : 'वितरण का पता'}</span>
                        <p className="text-gray-700 dark:text-zinc-350 leading-relaxed font-semibold">{order.customerAddress}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">{lang === 'en' ? 'PAYMENT & METHOD' : 'भुगतान विवरण'}</span>
                        <p className="text-gray-700 dark:text-zinc-350 font-semibold">
                          Method: <span className="text-gray-900 dark:text-white font-bold">{order.paymentMethod}</span>
                        </p>
                        <p className="text-gray-450 dark:text-zinc-500 font-mono text-[10px]">
                          UTR: <span className="font-bold text-gray-600 dark:text-zinc-400">{order.upiTransactionId}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-2">
                      <a
                        href={`https://wa.me/9111223344?text=Jai%20Jinendra%2C%20I%20would%20like%20to%20inquire%20about%20my%20Order%20ID%20"${order.id}".`}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle size={12} />
                        <span>{lang === 'en' ? 'Chat with Support' : 'सपोर्ट से चैट करें'}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : hasSearchedOrders ? (
            <div className="py-12 text-center bg-white dark:bg-[#111] border border-gray-200/50 dark:border-white/5 rounded-[2rem] space-y-3">
              <span className="text-3xl">📭</span>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">{lang === 'en' ? 'No Swavalambi Orders Found' : 'कोई ऑर्डर नहीं मिला'}</h3>
              <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto px-4">
                {lang === 'en' 
                  ? 'No active orders registered under this phone number. Confirm your phone number or place an order in the main marketplace tab!'
                  : 'इस मोबाइल नंबर के तहत कोई सक्रिय ऑर्डर पंजीकृत नहीं है। कृपया नंबर जांचें या होम बाजार टैब में जाकर अपनी पसंदीदा वस्तु खरीदें!'}
              </p>
            </div>
          ) : (
            <div className="py-12 text-center bg-white dark:bg-[#111] border border-gray-200/50 dark:border-white/5 rounded-[2rem] space-y-3">
              <span className="text-3xl">📦</span>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">{lang === 'en' ? 'Enter Phone to Search History' : 'ऑर्डर इतिहास देखने के लिए फोन नंबर भरें'}</h3>
              <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto px-4">
                {lang === 'en'
                  ? 'Type your phone number in the search box above to track daylight packing, UTR approval status, and shipment steps live.'
                  : 'सूर्यास्त-पैकिंग मर्यादा, भुगतान सत्यापन और लाइव ट्रांजिट विवरण देखने के लिए अपना नंबर ऊपर दर्ज कर सर्च करें।'}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'my_store' && (
        <div className="max-w-4xl mx-auto">
          {!myRegisteredStore ? (
            /* ================= REGISTER MINI STORE FORM ================= */
            <div className="bg-white dark:bg-[#111111] border border-gray-200/50 dark:border-white/5 rounded-[2rem] p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#FF6D00]/10 text-[#FF6D00] rounded-2xl flex items-center justify-center mx-auto">
                  <Store size={32} />
                </div>
                <h2 className="text-xl font-serif font-black text-gray-900 dark:text-white">
                  {lang === 'en' ? 'Create Your Mini Store Profile' : 'अपना डिजिटल मिनी स्टोर खोलें'}
                </h2>
                <p className="text-xs text-gray-500 font-bold max-w-md mx-auto">
                  {lang === 'en' 
                    ? 'Register your store profile. To protect purity, listings are vetted by Samil Jain. Contact Developer to approve after submission.' 
                    : 'अपना प्रोफाइल पंजीकृत करें। शुद्धता सुरक्षा कारणों से, प्रविष्टि को समील जैन (डेवलपर) द्वारा सत्यापित किया जाना आवश्यक है।'}
                </p>
              </div>

              <form onSubmit={handleRegisterStore} className="space-y-4 text-left max-w-lg mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                      {lang === 'en' ? 'Your Name (Vendor)' : 'विक्रेता का नाम'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="e.g. Samil Jain"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                      {lang === 'en' ? 'Store/Organization Name' : 'स्टोर/संस्था का नाम'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Shravak Granth Bhandar"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                      {lang === 'en' ? 'Contact Email' : 'ईमेल'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      placeholder="merchant@example.com"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                      {lang === 'en' ? 'WhatsApp/Phone No' : 'व्हाट्सएप/फोन नंबर'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      placeholder="e.g. 9111223344"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                    {lang === 'en' ? 'About Store & Items' : 'स्टोर के बारे में जानकारी'}
                  </label>
                  <textarea
                    rows={3}
                    value={storeDesc}
                    onChange={(e) => setStoreDesc(e.target.value)}
                    placeholder="Describe what religious items, books, or courses you plan to list."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Submit Store Request' : 'स्टोर अनुरोध जमा करें'}
                </button>
              </form>
            </div>
          ) : (
            /* ================= ACTIVE OWNER STORE CONSOLE ================= */
            <div className="space-y-6">
              {/* Store Status Card */}
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                <div>
                  <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest">
                    {lang === 'en' ? 'Your Registered Store' : 'आपका मिनी स्टोर'}
                  </span>
                  <h2 className="text-xl font-serif font-black text-gray-900 dark:text-white mt-1">
                    {myRegisteredStore.storeName}
                  </h2>
                  <p className="text-xs text-gray-500 font-bold mt-0.5">{lang === 'en' ? 'Vendor:' : 'विक्रेता:'} {myRegisteredStore.vendorName} • {myRegisteredStore.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  {myRegisteredStore.status === 'approved' ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center gap-1 border border-emerald-500/10">
                      <CheckCircle size={14} />
                      {lang === 'en' ? 'Live & Approved' : 'लाइव और स्वीकृत'}
                    </span>
                  ) : (
                    <div className="text-right space-y-1">
                      <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center gap-1 border border-amber-500/10 inline-flex">
                        <Clock size={14} className="animate-spin-slow" />
                        {lang === 'en' ? 'Verification Pending' : 'डेवलपर स्वीकृति लंबित'}
                      </span>
                      <p className="text-[10px] text-gray-500 font-semibold italic">Contact Samil Jain to activate.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Product Form */}
              <div className="bg-white dark:bg-[#111111] border border-gray-200/50 dark:border-white/5 rounded-[2rem] p-6 md:p-8 space-y-6">
                <h3 className="text-lg font-serif font-black text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
                  <Plus className="text-[#FF6D00]" size={20} />
                  {lang === 'en' ? 'List a New Jain Product/Course' : 'नया उत्पाद/कोर्स जोड़ें'}
                </h3>

                <form onSubmit={handleAddProduct} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                        {lang === 'en' ? 'Product Title' : 'उत्पाद का नाम'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        placeholder="e.g. Jain Samayasar Hardcover Book"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                        {lang === 'en' ? 'Category' : 'श्रेणी'}
                      </label>
                      <select
                        value={prodCat}
                        onChange={(e) => setProdCat(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl text-xs focus:outline-none"
                      >
                        <option value="Books">Books</option>
                        <option value="Pujan Samagri">Pujan Samagri</option>
                        <option value="Courses">Courses</option>
                        <option value="Organic Food">Organic Food</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                        {lang === 'en' ? 'Price (₹)' : 'कीमत (₹)'} *
                      </label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="e.g. 250"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                        {lang === 'en' ? 'Contact Phone (WhatsApp)' : 'व्हाट्सएप नंबर'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={prodContact}
                        onChange={(e) => setProdContact(e.target.value)}
                        placeholder="9111223344"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                        {lang === 'en' ? 'Product Image URL (Optional)' : 'उत्पाद चित्र URL (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                      {lang === 'en' ? 'Detailed Description' : 'उत्पाद का पूर्ण विवरण'} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Provide precise details, condition of book/item, shipping and sunset-mariyada specifications if any."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    🚀 {lang === 'en' ? 'Add Product Listing' : 'समीक्षा के लिए उत्पाद जोड़ें'}
                  </button>
                </form>
              </div>

              {/* Developer contact panel */}
              <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/10 rounded-[2rem] p-6 space-y-4 text-center">
                <h3 className="font-serif font-black text-base text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
                  <ShieldCheck className="text-[#FF6D00]" />
                  {lang === 'en' ? 'Samyak Merchant Verification Policy' : 'सम्यक् विक्रेता सत्यापन नीति'}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-bold leading-relaxed max-w-2xl mx-auto">
                  {lang === 'en'
                    ? 'To preserve the spiritual purity (Shuddhata) of authentic Jin-vani books, moral children series, and daylight-compliant foods, all listed products require automated credential verification by the Samyak Trust board. Access credentials are processed securely.'
                    : 'धार्मिक और आध्यात्मिक सामग्रियों की पवित्रता बनाए रखने के लिए, सम्यक् स्टोर में सूचीबद्ध होने वाले प्रत्येक उत्पाद का ट्रस्ट द्वारा सत्यापन किया जाना अनिवार्य है।'}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://instagram.com/_officialsamiljain_"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-[#FF6D00] transition-all"
                  >
                    <ExternalLink size={14} className="text-[#FF6D00]" />
                    <strong>@_officialsamiljain_</strong>
                  </a>
                  <div className="px-4 py-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-bold">
                    <ShieldCheck size={14} />
                    <span>{lang === 'en' ? 'Verified Merchant Desk' : 'सत्यापित विक्रेता विभाग'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'admin' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {!isAdminAuthenticated ? (
            /* ================= ADMIN PASSCODE CARD ================= */
            <div className="bg-white dark:bg-[#111111] border border-gray-200/50 dark:border-white/5 rounded-[2rem] p-6 md:p-8 space-y-6 max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-orange-500/10 text-[#FF6D00] rounded-2xl flex items-center justify-center mx-auto">
                <Settings size={32} />
              </div>
              <h2 className="text-xl font-serif font-black text-gray-900 dark:text-white">
                {lang === 'en' ? 'Developer / Admin Console' : 'डेवलपर प्रविष्टि'}
              </h2>
              <p className="text-xs text-gray-500 font-bold">
                {lang === 'en' ? 'Enter developer passcode to review and approve pending store applications instantly.' : 'लंबित आवेदनों की समीक्षा और त्वरित स्वीकृति के लिए पासकोड डालें।'}
              </p>

              <form onSubmit={handleVerifyAdmin} className="space-y-4">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={lang === 'en' ? 'Enter developer password...' : 'डेवलपर पासवर्ड...'}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-center focus:outline-none font-mono"
                />
                
                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF6D00] hover:bg-orange-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    {lang === 'en' ? 'Unlock Console' : 'अनलॉक करें'}
                  </button>

                  {/* Demo direct login to let users experience it without looking up codes */}
                  <button
                    type="button"
                    onClick={() => setIsAdminAuthenticated(true)}
                    className="w-full py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:text-black dark:hover:text-white transition-all cursor-pointer"
                  >
                    Demo Override Mode (Skip Passcode)
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ================= ACTIVE SECURE ADMIN VIEW ================= */
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 p-6 rounded-[2rem]">
                <div className="text-left">
                  <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest">Logged in as Administrator</span>
                  <h2 className="text-lg font-serif font-black text-gray-900 dark:text-white">Review & Approvals Control Room</h2>
                </div>
                <button
                  onClick={() => setIsAdminAuthenticated(false)}
                  className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>

              {/* Pending Stores */}
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#FF6D00] text-left">Pending Vendor Mini Stores</h3>
                
                {stores.filter(s => s.status === 'pending').length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {stores.filter(s => s.status === 'pending').map((store: any) => (
                      <div key={store.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{store.storeName}</h4>
                          <p className="text-xs text-gray-500 font-semibold mt-0.5">
                            Vendor: {store.vendorName} • {store.email ? (store.email.includes('@') ? store.email.split('@')[0].slice(0, 3) + '***@' + store.email.split('@')[1] : store.email) : ''} • {store.phone}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium italic mt-1">"{store.description}"</p>
                        </div>
                        <button
                          onClick={() => handleApproveStore(store.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                        >
                          Approve Store
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-semibold py-4 text-left">No store registration requests pending.</p>
                )}
              </div>

              {/* Pending Products */}
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#FF6D00] text-left">Pending Product Listings</h3>

                {products.filter(p => p.status === 'pending').length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {products.filter(p => p.status === 'pending').map((p: any) => (
                      <div key={p.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
                        <div className="flex items-start gap-3">
                          <img src={p.imageUrl} className="w-12 h-12 object-cover rounded-xl" />
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{p.title}</h4>
                            <p className="text-xs text-amber-600 font-black uppercase">{p.category} • ₹{p.price}</p>
                            <p className="text-xs text-gray-500 font-semibold mt-0.5">Listed under: {p.storeName} • Contact: {p.contactNo}</p>
                            <p className="text-xs text-gray-650 dark:text-gray-400 font-medium mt-1">"{p.description}"</p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Reject/Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => handleApproveProduct(p.id)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                          >
                            Approve Item
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-semibold py-4 text-left">No product listing requests pending.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Shopping Cart Trigger */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-24 right-6 z-[100] p-4 bg-[#FF6D00] text-black rounded-full shadow-2xl shadow-orange-500/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
          id="floating-cart-btn"
        >
          <div className="relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-3 -right-3 w-5 h-5 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
            </span>
          </div>
        </button>
      )}

      {/* Slide-Over Shopping Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden" id="cart-drawer-overlay">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => { if (checkoutStep === 'receipt') { setCheckoutStep('cart'); } setCartOpen(false); }} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <div className="w-screen max-w-lg bg-white dark:bg-[#0f0f0f] border-l border-gray-200 dark:border-white/10 flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/80 dark:bg-black/20 shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-[#FF6D00]" />
                  <span className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    {checkoutStep === 'cart' && (lang === 'en' ? 'Samyak Shopping Cart' : 'सम्यक् शॉपिंग कार्ट')}
                    {checkoutStep === 'shipping' && (lang === 'en' ? 'Delivery Information' : 'वितरण विवरण')}
                    {checkoutStep === 'payment' && (lang === 'en' ? 'Samyak Safe Payment' : 'सुरक्षित भुगतान')}
                    {checkoutStep === 'receipt' && (lang === 'en' ? 'Digital Invoice Receipt' : 'डिजिटल इनवॉइस रसीद')}
                  </span>
                </div>
                <button 
                  onClick={() => { if (checkoutStep === 'receipt') { setCheckoutStep('cart'); } setCartOpen(false); }} 
                  className="px-2.5 py-1 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all cursor-pointer text-xs font-black"
                >
                  [ {lang === 'en' ? 'Close' : 'बंद'} ]
                </button>
              </div>

              {/* Progress Steps Indicator */}
              {cart.length > 0 && checkoutStep !== 'receipt' && (
                <div className="px-6 py-3 bg-gray-100/50 dark:bg-black/40 border-b border-gray-200 dark:border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-gray-400 shrink-0">
                  <span className={cn(checkoutStep === 'cart' ? 'text-[#FF6D00]' : 'text-gray-500')}>1. Cart</span>
                  <div className="h-px bg-gray-300 dark:bg-white/10 flex-1 mx-2" />
                  <span className={cn(checkoutStep === 'shipping' ? 'text-[#FF6D00]' : 'text-gray-500')}>2. Shipping</span>
                  <div className="h-px bg-gray-300 dark:bg-white/10 flex-1 mx-2" />
                  <span className={cn(checkoutStep === 'payment' ? 'text-[#FF6D00]' : 'text-gray-500')}>3. Payment</span>
                </div>
              )}

              {/* Steps Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* STEP 1: CART OVERVIEW */}
                {checkoutStep === 'cart' && (
                  <>
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                        <ShoppingBag size={48} className="text-gray-300 dark:text-zinc-800" />
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                          {lang === 'en' ? 'Your cart is empty' : 'आपकी कार्ट खाली है'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200/40 dark:border-white/5 text-left items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-xl" />
                              <div>
                                <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                                <p className="text-[10px] text-[#FF6D00] font-mono font-black">₹{item.price}</p>
                                <span className="text-[9px] text-gray-400 font-bold">{item.storeName}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className="flex items-center gap-2 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-1 rounded-lg">
                                <button 
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-gray-500 cursor-pointer"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="text-xs font-mono font-bold px-1 text-gray-900 dark:text-white">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-gray-500 cursor-pointer"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>

                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-[9px] text-red-500 hover:underline font-black uppercase cursor-pointer"
                              >
                                {lang === 'en' ? 'Remove' : 'हटाएं'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* STEP 2: SHIPPING DETAILS */}
                {checkoutStep === 'shipping' && (
                  <div className="space-y-4 text-left">
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/20 text-xs text-orange-800 dark:text-orange-300 leading-normal mb-2">
                      <strong>{lang === 'en' ? 'Ahimsa Shipping Compliance:' : 'अहिंसा शिपिंग अनुपालन:'}</strong>
                      <p className="mt-1">{lang === 'en' ? 'All packages are hand-packed under daylight and shipped without plastic fillers to support organic, ethical values.' : 'सभी पैकेट केवल दिन के उजाले में पैक किए जाते हैं और पर्यावरण के अनुकूल जैविक मूल्यों का समर्थन करने के लिए प्लास्टिक-रहित भेजे जाते हैं।'}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">{lang === 'en' ? 'Customer Name *' : 'ग्राहक का नाम *'}</label>
                        <input 
                          type="text"
                          required
                          maxLength={100}
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value.replace(/[<>]/g, '').slice(0, 100))}
                          placeholder="e.g. Samil Jain"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FF6D00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">{lang === 'en' ? 'Contact Phone (WhatsApp preferable) *' : 'संपर्क नंबर (व्हाट्सएप) *'}</label>
                        <input 
                          type="tel"
                          required
                          maxLength={20}
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9+\s-]/g, '').slice(0, 20))}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FF6D00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">{lang === 'en' ? 'Complete Delivery Address *' : 'पूर्ण वितरण पता *'}</label>
                        <textarea 
                          required
                          rows={3}
                          maxLength={500}
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value.replace(/[<>]/g, '').slice(0, 500))}
                          placeholder={lang === 'en' ? 'Enter full address, pin code, state' : 'पूरा पता, पिन कोड, और राज्य दर्ज करें'}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FF6D00] resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">{lang === 'en' ? 'Select Delivery Method' : 'वितरण विकल्प'}</label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: 'Standard Ahimsa Eco-Delivery', title: lang === 'en' ? 'Ahimsa Eco-Delivery' : 'अहिंसा इको-वितरण', desc: lang === 'en' ? 'Plastic-free standard shipping (3-5 days)' : 'प्लास्टिक मुक्त मानक शिपिंग (3-5 दिन)', price: 0 },
                            { id: 'Express Post', title: lang === 'en' ? 'Speed Post / Fast Express' : 'स्पीड पोस्ट / त्वरित डाक', desc: lang === 'en' ? 'Government priority post (1-2 days)' : 'शासकीय प्राथमिकता डाक (1-2 दिन)', price: 50 },
                            { id: 'Direct Temple Trust Collection', title: lang === 'en' ? 'In-Person Trust Counter Pickup' : 'व्यक्तिगत ट्रस्ट काउंटर पिकअप', desc: lang === 'en' ? 'Pick up at local partner temple desk (Free)' : 'स्थानीय मंदिर डेस्क से सीधे प्राप्त करें (निःशुल्क)', price: 0 }
                          ].map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setShippingMethod(method.id)}
                              className={cn(
                                "p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer",
                                shippingMethod === method.id 
                                  ? "border-[#FF6D00] bg-[#FF6D00]/5 text-[#FF6D00]" 
                                  : "border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-300"
                              )}
                            >
                              <div>
                                <h5 className="font-bold text-xs flex items-center gap-1.5">
                                  <Truck size={12} />
                                  <span>{method.title}</span>
                                </h5>
                                <p className="text-[10px] opacity-70 mt-0.5">{method.desc}</p>
                              </div>
                              <span className="font-mono text-xs font-black">{method.price === 0 ? 'FREE' : `+₹${method.price}`}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PAYMENT GATEWAY */}
                {checkoutStep === 'payment' && (
                  <div className="space-y-4 text-left">
                    <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 flex gap-3 items-start text-xs text-[#FF6D00]">
                      <CreditCard size={20} className="shrink-0 mt-0.5" />
                      <div>
                        <strong>{lang === 'en' ? '100% Secure & Direct Trust Settlement' : '100% सुरक्षित और सीधी मंदिर ट्रस्ट व्यवस्था'}</strong>
                        <p className="mt-1 leading-relaxed opacity-90">
                          {lang === 'en' 
                            ? 'Funds go directly to certified self-employed shravaks and temple trust publication presses with zero developer commission.'
                            : 'आपका भुगतान सीधे प्रमाणित स्वावलंबी श्रावकों और ट्रस्ट प्रेसों को जाता है। इसमें डेवलपर का कोई कमीशन नहीं है।'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[
                          { id: 'UPI', label: 'UPI Direct (Scan & Pay)', desc: lang === 'en' ? 'Instant Zero-Fee' : 'तत्काल निशुल्क' },
                          { id: 'COD', label: 'Cash on Delivery (COD)', desc: lang === 'en' ? 'Pay on Delivery' : 'घर पर भुगतान' }
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setPaymentMethod(mode.id)}
                            className={cn(
                              "flex-1 p-3 rounded-2xl border text-center transition-all cursor-pointer",
                              paymentMethod === mode.id 
                                ? "border-[#FF6D00] bg-[#FF6D00]/5 text-[#FF6D00]" 
                                : "border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-zinc-400"
                            )}
                          >
                            <span className="block font-black text-xs">{mode.label}</span>
                            <span className="text-[9px] opacity-70 mt-0.5 block">{mode.desc}</span>
                          </button>
                        ))}
                      </div>

                      {paymentMethod === 'UPI' ? (
                        <div className="bg-gray-50 dark:bg-black/30 p-5 rounded-2xl border border-gray-200/50 dark:border-white/5 text-center space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">{lang === 'en' ? 'Scan to Pay Direct to Publisher/Vendor' : 'विक्रेता को सीधे भुगतान हेतु स्कैन करें'}</h4>
                          
                          {/* Simulated high-fidelity UPI QR Code */}
                          <div className="w-40 h-40 bg-white p-2.5 rounded-2xl mx-auto shadow-md border border-gray-100 flex items-center justify-center relative">
                            <QrCode size={130} className="text-black" />
                            <div className="absolute w-7 h-7 bg-[#FF6D00] text-black text-[7px] font-black rounded-full flex items-center justify-center shadow-lg border border-white">
                              JGPT
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'en' ? 'Direct Merchant VPA Address:' : 'सीधा मर्चेंट यूपीआई पता:'}</p>
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-mono text-xs font-black text-gray-800 dark:text-white px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm">
                                samyakpay@okaxis
                              </span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText('samyakpay@okaxis');
                                  alert(lang === 'en' ? 'UPI VPA address copied!' : 'UPI पता कॉपी किया गया!');
                                }}
                                className="text-[10px] bg-[#FF6D00] text-black font-black uppercase px-2 py-1 rounded hover:scale-105 transition-all cursor-pointer"
                              >
                                {lang === 'en' ? 'Copy' : 'कॉपी'}
                              </button>
                            </div>
                          </div>

                          <div className="pt-2">
                            <label className="block text-left text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                              {lang === 'en' ? 'UPI Transaction ID / UTR No *' : 'यूपीआई ट्रांसैक्शन आईडी / UTR नंबर *'}
                            </label>
                            <input 
                              type="text"
                              required
                              maxLength={30}
                              value={upiTransactionId}
                              onChange={(e) => setUpiTransactionId(e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 30))}
                              placeholder="e.g. 412894109401"
                              className="w-full bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-center text-xs font-mono font-black text-gray-900 dark:text-white outline-none focus:border-[#FF6D00]"
                            />
                            <p className="text-[9px] text-gray-400 mt-1 leading-normal">
                              {lang === 'en' ? 'Required. Enter the 12-digit transaction ID from your payment app.' : 'अनिवार्य। आपके गूगल-पे, फोनपे या पेटीएम से प्राप्त 12-अंकों का ट्रांजेक्शन आईडी भरें।'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-black/30 p-5 rounded-2xl border border-gray-200/50 dark:border-white/5 text-center space-y-2">
                          <CheckCircle className="text-green-500 mx-auto" size={24} />
                          <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-white">{lang === 'en' ? 'Cash on Delivery Active' : 'कैश ऑन डिलीवरी सक्रिय'}</h4>
                          <p className="text-[10px] text-gray-400 leading-normal px-4">
                            {lang === 'en'
                              ? 'Pay on delivery with cash or local UPI to the shipping executive. Religious literature shipping is fully free of auxiliary overheads.'
                              : 'वितरण अधिकारी को वस्तु मिलने पर नकद या यूपीआई द्वारा भुगतान करें। धार्मिक ग्रंथों के वितरण पर कोई अतिरिक्त शुल्क नहीं है।'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: DIGITAL INVOICE RECEIPT */}
                {checkoutStep === 'receipt' && placedOrder && (
                  <div className="space-y-4 text-left" id="samyak-invoice-print-area">
                    {/* Visual Invoice Paper */}
                    <div className="bg-white text-black p-6 rounded-[2rem] border-2 border-[#FF6D00]/20 shadow-xl space-y-5 relative overflow-hidden font-sans">
                      {/* Diagonal watermark watermark */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[3.5rem] opacity-[0.03] text-orange-600 rotate-12 select-none pointer-events-none tracking-widest text-center">
                        SAMYAK DHARMA
                      </div>

                      {/* Top Meta */}
                      <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                        <div>
                          <span className="text-[9px] font-black text-white bg-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block">
                            {lang === 'en' ? 'SAMYAK MARKETPLACE' : 'सम्यक् मार्केटप्लेस'}
                          </span>
                          <h3 className="text-base font-black uppercase tracking-tight text-gray-900 mt-1">Samyak Shravak Trust</h3>
                          <p className="text-[8px] text-gray-400 font-bold mt-0.5">Mariyada and Ahimsa Compliant Bookstore & Foods</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">{lang === 'en' ? 'Invoice No:' : 'इनवॉइस संख्या:'}</p>
                          <p className="font-mono text-[11px] font-black text-[#FF6D00]">{placedOrder.id}</p>
                          <p className="text-[8px] text-gray-500 mt-0.5">{new Date(placedOrder.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Billing Addresses */}
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <p className="font-black text-gray-400 uppercase tracking-wider text-[8px]">{lang === 'en' ? 'Bill & Ship To:' : 'बिल और शिपिंग पता:'}</p>
                          <p className="font-black text-gray-800 mt-1">{placedOrder.customerName}</p>
                          <p className="text-gray-500 mt-0.5 leading-relaxed">{placedOrder.customerAddress}</p>
                          <p className="font-mono text-gray-600 mt-1 font-bold">{placedOrder.customerPhone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-400 uppercase tracking-wider text-[8px]">{lang === 'en' ? 'Payment Summary:' : 'भुगतान सारांश:'}</p>
                          <p className="font-black text-gray-800 mt-1">{placedOrder.paymentMethod === 'UPI' ? 'Paid via UPI Transfer' : 'Cash On Delivery (COD)'}</p>
                          {placedOrder.paymentMethod === 'UPI' && (
                            <p className="font-mono text-[9px] text-gray-500 mt-0.5 truncate">UTR: {placedOrder.upiTransactionId}</p>
                          )}
                          <p className="text-gray-500 mt-1 leading-normal font-bold">
                            {lang === 'en' ? 'Shipping: ' : 'वितरण: '} {placedOrder.shippingMethod === 'Express Post' ? 'Express Speed Post' : 'Standard Eco-Ahimsa'}
                          </p>
                        </div>
                      </div>

                      {/* Items Purchased Table */}
                      <div className="border-t border-b border-gray-100 py-3 text-[10px]">
                        <div className="grid grid-cols-12 gap-1 font-black text-gray-400 uppercase text-[8px] tracking-wider pb-2">
                          <span className="col-span-6">{lang === 'en' ? 'Item Name' : 'उत्पाद नाम'}</span>
                          <span className="col-span-2 text-center">Qty</span>
                          <span className="col-span-2 text-right">Price</span>
                          <span className="col-span-2 text-right">Total</span>
                        </div>
                        <div className="space-y-2">
                          {placedOrder.items.map((item: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-12 gap-1 text-gray-700">
                              <span className="col-span-6 font-bold truncate">{item.title}</span>
                              <span className="col-span-2 text-center font-mono">{item.quantity}</span>
                              <span className="col-span-2 text-right font-mono">₹{item.price}</span>
                              <span className="col-span-2 text-right font-mono font-bold text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Calculations */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-1.5 text-[9px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-black border border-green-100">
                          <ShieldCheck size={11} />
                          <span>100% Day-Light Compliant</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <div className="flex justify-end gap-4 text-[10px] text-gray-500">
                            <span>{lang === 'en' ? 'Subtotal:' : 'उपयोग योग:'}</span>
                            <span className="font-mono">₹{placedOrder.totalAmount}</span>
                          </div>
                          <div className="flex justify-end gap-4 text-xs font-black text-gray-900">
                            <span>{lang === 'en' ? 'Total Amount Paid:' : 'कुल भुगतान राशि:'}</span>
                            <span className="font-mono text-[#FF6D00] text-sm">₹{placedOrder.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Stamp */}
                      <div className="border-t border-dashed border-gray-100 pt-4 text-center">
                        <p className="text-[8px] text-gray-400 italic">
                          {lang === 'en' 
                            ? 'Thank you for supporting Swavalambi Shravaks. This digital receipt serves as your authentic delivery certificate.'
                            : 'स्वावलंबी श्रावकों का समर्थन करने के लिए धन्यवाद। यह डिजिटल रसीद आपके प्रामाणिक वितरण का प्रमाण पत्र है।'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Controls */}
              <div className="p-5 bg-gray-50 dark:bg-[#080808] border-t border-gray-200 dark:border-white/5 space-y-3 shrink-0">
                {/* Grand Total & Actions depending on steps */}
                {checkoutStep === 'cart' && cart.length > 0 && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-gray-500 uppercase tracking-wider">{lang === 'en' ? 'Total Summary:' : 'कुल संक्षिप्त:'}</span>
                      <span className="font-mono text-base font-black text-[#FF6D00]">
                        ₹{cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)}
                      </span>
                    </div>

                    <button
                      onClick={() => setCheckoutStep('shipping')}
                      className="w-full py-3 bg-[#FF6D00] hover:bg-orange-600 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{lang === 'en' ? 'Proceed to Delivery' : 'डिलिवरी जानकारी भरें'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </>
                )}

                {checkoutStep === 'shipping' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 py-3 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      {lang === 'en' ? 'Back to Cart' : 'पीछे जाएँ'}
                    </button>
                    <button
                      onClick={() => {
                        if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
                          alert(lang === 'en' ? 'Please fill in all mandatory billing fields first.' : 'कृपया पहले सभी आवश्यक फ़ील्ड भरें।');
                          return;
                        }
                        setCheckoutStep('payment');
                      }}
                      className="flex-1 py-3 bg-[#FF6D00] hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                    >
                      {lang === 'en' ? 'Select Payment' : 'भुगतान विधि'}
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep('shipping')}
                      className="flex-1 py-3 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      {lang === 'en' ? 'Back' : 'पीछे'}
                    </button>
                    <button
                      onClick={async () => {
                        if (paymentMethod === 'UPI' && !upiTransactionId.trim()) {
                          alert(lang === 'en' ? 'UPI Transaction Reference ID (UTR) is mandatory for validation.' : 'भुगतान सत्यापन के लिए यूपीआई ट्रांसैक्शन आईडी दर्ज करना अनिवार्य है।');
                          return;
                        }
                        
                        const orderId = 'JGPT-ORD-' + Math.floor(100000 + Math.random() * 900000);
                        const orderTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
                        const newOrder = {
                          id: orderId,
                          customerName,
                          customerPhone,
                          customerAddress,
                          shippingMethod,
                          paymentMethod,
                          upiTransactionId: paymentMethod === 'UPI' ? upiTransactionId : 'COD_PENDING',
                          items: cart,
                          totalAmount: orderTotal,
                          status: 'pending',
                          createdAt: new Date().toISOString()
                        };

                        try {
                          await addDoc(collection(db, 'jain_orders'), newOrder);
                          localStorage.setItem('last_customer_phone', customerPhone);
                          setTrackPhoneInput(customerPhone);
                        } catch (err) {
                          console.error("Firestore writing order error (bypassing for offline ease):", err);
                        }
                        
                        setPlacedOrder(newOrder);
                        setCheckoutStep('receipt');
                        setCart([]); // Clear the shopping cart
                      }}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>{lang === 'en' ? 'Confirm Order' : 'ऑर्डर की पुष्टि करें'}</span>
                    </button>
                  </div>
                )}

                {checkoutStep === 'receipt' && placedOrder && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        // Print the Receipt layout
                        const printContent = document.getElementById('samyak-invoice-print-area')?.innerHTML;
                        const originalContent = document.body.innerHTML;
                        if (printContent) {
                          document.body.innerHTML = `<div style="padding: 40px; background: white; color: black; max-width: 600px; margin: 0 auto;">${printContent}</div>`;
                          window.print();
                          window.location.reload(); // Quick restore of page context
                        }
                      }}
                      className="w-full py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>{lang === 'en' ? 'Print or Save Receipt PDF' : 'रसीद प्रिंट / पीडीएफ सेव करें'}</span>
                    </button>

                    <button
                      onClick={() => {
                        // Compile gorgeous WhatsApp invoice
                        const compiledItems = placedOrder.items.map((it: any) => `- ${it.title} x ${it.quantity} (₹${it.price})`).join('\n');
                        const msg = `जय जिनेंद्र! 🙏\n\n*Samyak Dharma Store Order Invoice*\n\n*Invoice No:* ${placedOrder.id}\n*Customer:* ${placedOrder.customerName}\n*Phone:* ${placedOrder.customerPhone}\n*Address:* ${placedOrder.customerAddress}\n\n*Shipping Option:* ${placedOrder.shippingMethod}\n*Payment Mode:* ${placedOrder.paymentMethod} ${placedOrder.paymentMethod === 'UPI' ? `(UTR: ${placedOrder.upiTransactionId})` : ''}\n\n*Items Purchased:*\n${compiledItems}\n\n*Grand Total:* ₹${placedOrder.totalAmount}\n\n_Daylight packed under Ahimsa Guidelines._`;
                        const encoded = encodeURIComponent(msg);
                        window.open(`https://wa.me/919111223344?text=${encoded}`, '_blank');
                      }}
                      className="w-full py-3 bg-[#FF6D00] hover:bg-orange-600 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <MessageCircle size={14} />
                      <span>{lang === 'en' ? 'Share Invoice on WhatsApp' : 'इनवॉइस व्हाट्सएप पर भेजें'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCheckoutStep('cart');
                        setCartOpen(false);
                      }}
                      className="w-full py-2 text-center text-[10px] text-gray-500 hover:underline font-bold uppercase tracking-wider cursor-pointer block"
                    >
                      {lang === 'en' ? 'Return to Store Home' : 'स्टोर होम पर वापस जाएं'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111] max-w-lg w-full rounded-3xl border border-gray-200 dark:border-white/10 p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
            <button 
              onClick={() => setHelpOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer font-bold"
            >
              ✕
            </button>
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-widest text-[#FF6D00] uppercase block">
                {lang === 'en' ? 'DOCUMENTATION & USER GUIDE' : 'मार्गदर्शिका एवं निर्देश'}
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-black text-gray-900 dark:text-white">
                {lang === 'en' ? 'Jain Dharma Store' : 'जैन धर्म स्टोर'}
              </h3>
            </div>
            
            <div className="space-y-4 text-xs leading-relaxed text-gray-650 dark:text-zinc-350">
              <div className="p-4 rounded-2xl bg-orange-550/10 dark:bg-[#FF6D00]/5 border border-orange-500/10 space-y-1">
                <h4 className="font-black text-gray-950 dark:text-[#FFD54F]">
                  🌅 {lang === 'en' ? '1. Daylight/Sunset Compliance' : '१. दिवाचर्या एवं सूर्यास्त मर्यादा'}
                </h4>
                <p>
                  {lang === 'en' 
                    ? 'Our real-time monitor tracks sunset restrictions. Edible items are milled, ground, and packaged strictly during daylight hours to honor biological non-violence (Ahimsa).' 
                    : 'हमारा लाइव मॉनिटर सूर्यास्त काल को ट्रैक करता है। सभी शुद्ध खाद्य पदार्थ जीव-रक्षा हेतु केवल दिन के उजाले में ही पीसे और पैक किए जाते हैं।'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1">
                <h4 className="font-black text-gray-950 dark:text-white">
                  📦 {lang === 'en' ? '2. Pure Shravak Upkaran' : '२. शुद्ध श्रावक उपकरण सामग्री'}
                </h4>
                <p>
                  {lang === 'en' 
                    ? 'Find double-layer organic cotton water filters (छन्ना कपड़ा), pure brass Abhishek utensils, wooden chawris, and authentic pathshala books approved by trust directories.' 
                    : 'यहाँ शुद्ध द्विस्तरीय सूती छन्ना जल कपड़ा, पीतल अभिषेक पात्र, हस्तनिर्मित चंवर, एवं प्रामाणिक देववाणी शास्त्र सीधे मुद्रकों से प्राप्त कर सकते हैं।'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1">
                <h4 className="font-black text-gray-950 dark:text-white">
                  💬 {lang === 'en' ? '3. Order Directly on WhatsApp' : '३. सीधे व्हाट्सएप से ऑर्डर भेजें'}
                </h4>
                <p>
                  {lang === 'en' 
                    ? 'Add products to your cart and checkout. Your consolidated order list will be formatted and loaded directly onto the verified trust seller’s WhatsApp with zero third-party commissions.' 
                    : 'अपनी मनपसंद सामग्री को कार्ट में जोड़ें और चेकआउट पर क्लिक करें। आपका ऑर्डर सीधे प्रामाणिक जैन ट्रस्ट/दुकानदार के व्हाट्सएप पर बिना किसी अतिरिक्त शुल्क के चला जाएगा।'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setHelpOpen(false)}
              className="w-full py-3 bg-[#FF3D00] hover:bg-[#D50000] text-white font-black text-xs md:text-sm rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
            >
              {lang === 'en' ? 'UNDERSTOOD, PROCEED' : 'समझ गए, आगे बढ़ें'}
            </button>
          </div>
        </div>
      )}
      {/* ==================== SAMYAK PURITY AUDIT MODAL ==================== */}
      {activePurityProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111] max-w-md w-full rounded-3xl border border-gray-200/50 dark:border-white/10 p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
            <button 
              type="button"
              onClick={() => setActivePurityProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer font-bold"
            >
              ✕
            </button>
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-widest text-[#FF6D00] uppercase block">
                🛡️ {lang === 'en' ? 'Samyak Purity Verification Audit' : 'सम्यक् शुद्धि एवं अहिंसा प्रमाण-पत्र'}
              </span>
              <h3 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                {activePurityProduct.title}
              </h3>
              <p className="text-[10px] text-amber-600 font-bold">
                Vendor: {activePurityProduct.storeName}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Daylight Milling Compliance */}
              <div className="flex gap-3 items-start p-3.5 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <span className="text-lg shrink-0 mt-0.5">☀️</span>
                <div className="space-y-1">
                  <h4 className="font-black text-gray-950 dark:text-amber-400">
                    {lang === 'en' ? 'Sunlight Milling Compliant (दिवाचर्या)' : 'दिवाचर्या मर्यादा अनुपालन'}
                  </h4>
                  <p className="text-gray-550 dark:text-zinc-400 font-semibold leading-normal">
                    {lang === 'en'
                      ? 'Verified to be manufactured, ground, and packed strictly between sunrise and sunset to avoid night micro-organism growth.'
                      : 'सत्यापित कि यह खाद्य सामग्री सूर्योदय के पश्चात और सूर्यास्त से पूर्व ही शुद्धता से बनाई और पैक की गई है।'}
                  </p>
                </div>
              </div>

              {/* Eco Ahimsa Packing */}
              <div className="flex gap-3 items-start p-3.5 bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 rounded-2xl">
                <span className="text-lg shrink-0 mt-0.5">📦</span>
                <div className="space-y-1">
                  <h4 className="font-black text-green-700 dark:text-green-400">
                    {lang === 'en' ? 'Ahimsa Eco Packaging' : 'अहिंसा पर्यावरण अनुकूल पैकिंग'}
                  </h4>
                  <p className="text-gray-550 dark:text-zinc-400 font-semibold leading-normal">
                    {lang === 'en'
                      ? 'Packed using 100% plastic-free organic paper wrappers and cotton ties. Free from synthetic chemical lining.'
                      : 'प्लास्टिक-मुक्त कागज के थैलों और सूती धागों का उपयोग। कृत्रिम रसायनों से सर्वथा रहित सुरक्षित पैकेजिंग।'}
                  </p>
                </div>
              </div>

              {/* No Root Vegetables or Impurities */}
              <div className="flex gap-3 items-start p-3.5 bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                <span className="text-lg shrink-0 mt-0.5">👤</span>
                <div className="space-y-1">
                  <h4 className="font-black text-blue-700 dark:text-blue-400">
                    {lang === 'en' ? 'Vetted & Approved (भक्ष्य प्रमाणीकरण)' : 'सत्यापित एवं स्वीकृत भक्ष्य वस्तु'}
                  </h4>
                  <p className="text-gray-550 dark:text-zinc-400 font-semibold leading-normal">
                    {lang === 'en'
                      ? 'Guaranteed free from root vegetables (onion, garlic, potato), synthetic colors, chemical preservatives, or night-ground ingredients.'
                      : 'जमींकंद (प्याज, लहसुन, आलू आदि), अप्राकृतिक रंगों, रासायनिक संरक्षकों अथवा अभक्ष्य पदार्थों से पूर्णतः रहित।'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`https://wa.me/${activePurityProduct.contactNo}?text=Jai%20Jinendra%20${activePurityProduct.storeName}%2C%20I%20am%20inquiring%20about%20the%20purity%20standards%20of%20"${encodeURIComponent(activePurityProduct.title)}".`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex-1 py-3 bg-[#FF6D00] hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={14} />
                <span>{lang === 'en' ? 'Inquire Direct' : 'सीधी शुद्धता जांचें'}</span>
              </a>
              <button
                type="button"
                onClick={() => setActivePurityProduct(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CUSTOMER REVIEWS DRAWER/SIDEBAR ==================== */}
      {activeReviewProduct && (
        <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-md flex justify-end animate-in fade-in duration-300">
          {/* Overlay click closer */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveReviewProduct(null)} />

          <div className="relative w-full max-w-md bg-white dark:bg-[#111] border-l border-gray-200/50 dark:border-white/10 shadow-2xl h-full flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest">{lang === 'en' ? 'LIVE CUSTOMER FEEDBACK' : 'श्रावक समीक्षा एवं रेटिंग'}</span>
                <h3 className="font-serif font-black text-base text-gray-900 dark:text-white line-clamp-1">{activeReviewProduct.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReviewProduct(null)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 transition-colors cursor-pointer text-xs font-black"
              >
                ✕ Close
              </button>
            </div>

            {/* Scrollable Reviews List and Add form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
              {reviewsLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="animate-spin text-[#FF6D00] mx-auto mb-2" size={24} />
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Syncing reviews data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    {lang === 'en' ? `Shravak Reviews (${reviews.length})` : `श्रावक समीक्षाएं (${reviews.length})`}
                  </span>

                  {reviews.length === 0 ? (
                    <p className="text-xs text-gray-500 font-bold italic py-4">No custom reviews yet. Be the first to share your pure experience!</p>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((rev, rIdx) => (
                        <div key={rIdx} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-black text-gray-900 dark:text-white">{rev.reviewerName}</span>
                            <span className="text-[10px] font-mono text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#FF6D00]">
                            <span>{"⭐️".repeat(rev.rating)}</span>
                            <span className="font-mono font-bold">({rev.rating}/5)</span>
                          </div>

                          {/* Verification chips */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rev.sunlightVerified && (
                              <span className="text-[8px] font-black bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded border border-amber-500/10">
                                ☀️ Daylight Verified
                              </span>
                            )}
                            {rev.plasticFreeVerified && (
                              <span className="text-[8px] font-black bg-green-500/10 text-green-600 px-2 py-0.5 rounded border border-green-500/10">
                                📦 Plastic-Free Packaging
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-650 dark:text-zinc-350 leading-relaxed font-semibold">
                            {rev.reviewText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Add Review Form */}
              <div className="border-t border-gray-100 dark:border-white/5 pt-6 space-y-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  {lang === 'en' ? 'ADD YOUR DEVI-CERTIFIED REVIEW' : 'अपनी समीक्षा जोड़ें'}
                </span>

                <form onSubmit={handleSubmitReview} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                      {lang === 'en' ? 'Reviewer Name' : 'समीक्षक का नाम'}
                    </label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g., Shantilal Jain' : 'उदा. शांतिलाल जैन'}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                      {lang === 'en' ? 'Star Rating' : 'रेटिंग स्टार'}
                    </label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>

                  {/* Verification Checkboxes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                      {lang === 'en' ? 'Tenet Auditing' : 'शुद्धता मापदंड'}
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-zinc-400 font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={revSunlightVerified}
                        onChange={(e) => setRevSunlightVerified(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 text-[#FF6D00] focus:ring-[#FF6D00]"
                      />
                      <span>{lang === 'en' ? 'I confirm this product has strict sunlight milling' : 'मैं पुष्टि करता हूँ कि सामग्री का निर्माण दिन के उजाले में हुआ है'}</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-zinc-400 font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={revPlasticFreeVerified}
                        onChange={(e) => setRevPlasticFreeVerified(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 text-[#FF6D00] focus:ring-[#FF6D00]"
                      />
                      <span>{lang === 'en' ? 'The packaging is environmental friendly / plastic free' : 'पैकेजिंग अहिंसक और पर्यावरण के अनुकूल है'}</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                      {lang === 'en' ? 'Your Review' : 'आपकी समीक्षा टिप्पणी'}
                    </label>
                    <textarea
                      required
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                      rows={3}
                      placeholder={lang === 'en' ? 'Explain water filtration compliance, freshness, or study readability...' : 'वस्तु की शुद्धता, शुद्ध पैकिंग अथवा पठन पठनीयता के बारे में साझा करें...'}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6D00] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 bg-[#FF6D00] hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {submittingReview && <Loader2 className="animate-spin" size={13} />}
                    <span>{lang === 'en' ? 'Submit Secure Review' : 'समीक्षा सबमिट करें'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PREMIUM DYNAMIC PRODUCT DETAILS MODAL ==================== */}
      {selectedProduct && (() => {
        const metadata = getProductMetadata(selectedProduct);
        return (
          <div className="fixed inset-0 z-[115] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Overlay click closer */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedProduct(null)} />

            <div className="relative w-full max-w-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-6 md:p-8 space-y-6 z-10 my-8 text-left max-h-[90vh] overflow-y-auto scrollbar-none">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 rounded-full transition-colors cursor-pointer text-xs font-black z-20"
              >
                ✕
              </button>

              {/* Product Intro Grid */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-full sm:w-1/3 aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 shrink-0">
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#FF6D00] uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-md">
                      {selectedProduct.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      ★ 5.0 (Verified)
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-lg md:text-xl text-gray-900 dark:text-white leading-tight">
                    {selectedProduct.title}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-mono font-black text-[#FF6D00]">₹{selectedProduct.price}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {lang === 'en' ? 'Taxes & packing included' : 'कर एवं सुरक्षित पैकिंग सहित'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Highlights Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-450">
                  {lang === 'en' ? 'Product highlights' : 'उत्पाद की मुख्य विशेषताएं'}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {metadata.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">{h.label}</span>
                      <span className="text-xs text-gray-800 dark:text-white font-black leading-tight block">{h.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Details Tabbed Layout */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-450 pb-2">
                    {lang === 'en' ? 'All details' : 'संपूर्ण विवरण'}
                  </h4>
                </div>

                {/* Tabs bar */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-gray-100 dark:border-white/5">
                  {[
                    { id: 'specifications', en: 'Specifications', hi: 'विवरण तालिका' },
                    { id: 'description', en: 'Description', hi: 'विवरण' },
                    { id: 'manufacturer', en: 'Manufacturer Info', hi: 'निर्माता जानकारी' },
                    { id: 'return', en: 'Return Policy', hi: 'वापसी नियम' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveDetailTab(tab.id as any)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                        activeDetailTab === tab.id 
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-zinc-900 dark:text-zinc-400"
                      )}
                    >
                      {lang === 'en' ? tab.en : tab.hi}
                    </button>
                  ))}
                </div>

                {/* Tab Contents */}
                <div className="min-h-[120px]">
                  {activeDetailTab === 'specifications' && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                      {metadata.specifications.map((spec, sIdx) => (
                        <div key={sIdx} className="border-b border-gray-100 dark:border-white/5 pb-2">
                          <span className="text-[9px] text-gray-400 font-bold block">{spec.name}</span>
                          <span className="text-xs text-gray-900 dark:text-white font-black block mt-0.5">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeDetailTab === 'description' && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-650 dark:text-zinc-350 leading-relaxed font-semibold">
                        {metadata.description}
                      </p>
                      {/* Sub-details explaining purity */}
                      <div className="bg-amber-500/10 dark:bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
                        ⚠️ {lang === 'en' 
                          ? 'Milled and packed under pure daylight limits. No animal fats, dyes, or harmful night-grinding procedures were involved.' 
                          : 'शुद्ध दिन के उजाले की मर्यादा में पिसा और पैक किया गया। किसी भी प्रकार के अभक्ष्य या कृत्रिम रसायनों का उपयोग नहीं किया गया है।'}
                      </div>
                    </div>
                  )}

                  {activeDetailTab === 'manufacturer' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold block">{lang === 'en' ? 'Brand Name' : 'ब्रांड का नाम'}</span>
                          <span className="text-xs text-gray-950 dark:text-white font-black block">{metadata.manufacturer.brand}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold block">{lang === 'en' ? 'Merchant Phone' : 'सम्पर्क नंबर'}</span>
                          <span className="text-xs text-gray-950 dark:text-white font-mono font-black block">{metadata.manufacturer.contact}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block">{lang === 'en' ? 'Origin Address' : 'निर्माता का पता'}</span>
                        <span className="text-xs text-gray-650 dark:text-zinc-400 font-semibold block mt-0.5 leading-normal">{metadata.manufacturer.address}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {metadata.manufacturer.daylightPacking && (
                          <span className="text-[9px] font-black bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-md border border-amber-500/10 flex items-center gap-1">
                            ☀️ Sunlight Processed
                          </span>
                        )}
                        {metadata.manufacturer.plasticFree && (
                          <span className="text-[9px] font-black bg-green-500/10 text-green-600 px-2.5 py-1 rounded-md border border-green-500/10 flex items-center gap-1">
                            🌱 100% Plastic Free
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {activeDetailTab === 'return' && (
                    <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-2">
                      <span className="text-[10px] font-black text-[#FF6D00] uppercase tracking-widest block">
                        🛡️ {lang === 'en' ? 'Samyak Sacred Exchange Rules' : 'सम्यक् विनिमय मर्यादा'}
                      </span>
                      <p className="text-xs text-gray-650 dark:text-zinc-350 leading-relaxed font-semibold">
                        {metadata.returnPolicy}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer Panel */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(selectedProduct);
                    }}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-gray-950 dark:text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <ShoppingCart size={14} />
                    <span>{lang === 'en' ? 'Add to Cart' : 'कार्ट में डालें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setCartOpen(true);
                      setCheckoutStep('shipping');
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 bg-[#FF6D00] hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle size={14} />
                    <span>{lang === 'en' ? 'Buy Now' : 'अभी खरीदें'}</span>
                  </button>
                </div>

                <a
                  href={`https://wa.me/${selectedProduct.contactNo}?text=Jai%20Jinendra%2C%20I%20am%20inquiring%20about%20the%20purity%20specifications%20of%20"${encodeURIComponent(selectedProduct.title)}"%20on%20Jainism%20GPT%20Store.`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <MessageCircle size={13} />
                  <span>{lang === 'en' ? 'Inquire Direct via WhatsApp' : 'सीधे व्हाट्सएप द्वारा जानकारी लें'}</span>
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
