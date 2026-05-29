import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, Phone, MessageSquare, ShieldCheck, MapPin, 
  Clock, DollarSign, CheckCircle2, ChevronRight, Menu, 
  X, Scale, Info, Award, HelpCircle, Star, Search, Globe, ChevronDown,
  Activity, Box, ChevronUp, RefreshCw, Sparkles, Sliders, Check, AlertTriangle,
  FileText, Shield, Layers, Leaf, Timer, Clipboard, Eye, FileDown
} from 'lucide-react';

const customStyles = `
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes tesla-pulse {
    0%, 100% { border-color: rgba(232, 33, 39, 0.4); box-shadow: 0 0 10px rgba(232, 33, 39, 0.1); }
    50% { border-color: rgba(232, 33, 39, 0.9); box-shadow: 0 0 25px rgba(232, 33, 39, 0.4); }
  }
  @keyframes grid-travel {
    0% { background-position: 0 0; }
    100% { background-position: 40px 40px; }
  }
  @keyframes radar-pulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(3.5); opacity: 0; }
  }
  .tesla-grid-bg {
    background-image: 
      linear-gradient(rgba(10, 11, 13, 0.98), rgba(10, 11, 13, 0.99)),
      linear-gradient(rgba(232, 33, 39, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232, 33, 39, 0.02) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    animation: grid-travel 20s linear infinite;
  }
  .tesla-hud-glass {
    background: rgba(18, 19, 22, 0.85);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  }
  .tesla-red-glow {
    text-shadow: 0 0 12px rgba(232, 33, 39, 0.6);
  }
  .tesla-btn-red {
    background: #E82127;
    color: #ffffff;
    box-shadow: 0 4px 20px rgba(232, 33, 39, 0.4);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .tesla-btn-red:hover {
    background: #ff2b32;
    box-shadow: 0 6px 30px rgba(232, 33, 39, 0.7);
    transform: translateY(-2px);
  }
`;

const ALL_INDIA_RATES = {
  gujarat: {
    stateName: "Gujarat (गुजरात लोकल)",
    cities: {
      ahmedabad: { name: "Ahmedabad (अहमदाबाद)", fullLoad: 4500, partLoad: [{ label: "1-100 kg", price: 1500 }, { label: "100-500 kg", price: 2500 }, { label: "500-800 kg", price: 3500 }] },
      surat: { name: "Surat (सूरत)", fullLoad: 4000, partLoad: [{ label: "1-100 kg", price: 1200 }, { label: "100-500 kg", price: 2200 }, { label: "500-800 kg", price: 3200 }] },
      rajkot: { name: "Rajkot (राजकोट)", fullLoad: 7500, partLoad: [{ label: "1-100 kg", price: 2200 }, { label: "100-500 kg", price: 3800 }, { label: "500-800 kg", price: 4800 }] },
      anand: { name: "Anand (आनंद)", fullLoad: 2500, partLoad: [{ label: "1-100 kg", price: 800 }, { label: "100-500 kg", price: 1500 }, { label: "500-800 kg", price: 2200 }] },
      vapi: { name: "Vapi (वापी)", fullLoad: 6500, partLoad: [{ label: "1-100 kg", price: 2000 }, { label: "100-500 kg", price: 3500 }, { label: "500-800 kg", price: 5000 }] },
      jamnagar: { name: "Jamnagar (जामनगर)", fullLoad: 9500, partLoad: [{ label: "1-100 kg", price: 3000 }, { label: "100-500 kg", price: 5000 }, { label: "500-800 kg", price: 6800 }] }
    }
  },
  maharashtra: {
    stateName: "Maharashtra (महाराष्ट्र)",
    cities: {
      mumbai: { name: "Mumbai (मुंबई)", fullLoad: 8200, partLoad: [{ label: "1-100 kg", price: 2500 }, { label: "100-500 kg", price: 4000 }, { label: "500-800 kg", price: 5500 }] },
      pune: { name: "Pune (पुणे)", fullLoad: 11500, partLoad: [{ label: "1-100 kg", price: 3000 }, { label: "100-500 kg", price: 5000 }, { label: "500-800 kg", price: 7000 }] },
      nagpur: { name: "Nagpur (नागपुर)", fullLoad: 24000, partLoad: [{ label: "1-100 kg", price: 6000 }, { label: "100-500 kg", price: 11000 }, { label: "500-800 kg", price: 16000 }] },
      nagpur_metro: { name: "Nagpur Metro Area", fullLoad: 25500, partLoad: [{ label: "1-100 kg", price: 6500 }, { label: "100-500 kg", price: 12000 }, { label: "500-800 kg", price: 17500 }] }
    }
  },
  rajasthan: {
    stateName: "Rajasthan (राजस्थान)",
    cities: {
      jaipur: { name: "Jaipur (जयपुर)", fullLoad: 18000, partLoad: [{ label: "1-100 kg", price: 4500 }, { label: "100-500 kg", price: 7500 }, { label: "500-800 kg", price: 10500 }] },
      kota: { name: "Kota (कोटा)", fullLoad: 14000, partLoad: [{ label: "1-100 kg", price: 3800 }, { label: "100-500 kg", price: 6000 }, { label: "500-800 kg", price: 8500 }] },
      jodhpur: { name: "Jodhpur (जोधपुर)", fullLoad: 16500, partLoad: [{ label: "1-100 kg", price: 4200 }, { label: "100-500 kg", price: 6800 }, { label: "500-800 kg", price: 9500 }] }
    }
  },
  madhyaPradesh: {
    stateName: "Madhya Pradesh (मध्य प्रदेश)",
    cities: {
      indore: { name: "Indore (इंदौर)", fullLoad: 11000, partLoad: [{ label: "1-100 kg", price: 3000 }, { label: "100-500 kg", price: 5000 }, { label: "500-800 kg", price: 7000 }] },
      bhopal: { name: "Bhopal (भोपाल)", fullLoad: 14500, partLoad: [{ label: "1-100 kg", price: 3800 }, { label: "100-500 kg", price: 6200 }, { label: "500-800 kg", price: 8800 }] },
      ratlam: { name: "Ratlam (रतलाम)", fullLoad: 9000, partLoad: [{ label: "1-100 kg", price: 2500 }, { label: "100-500 kg", price: 4200 }, { label: "500-800 kg", price: 6000 }] }
    }
  },
  delhiNcr: {
    stateName: "Delhi NCR & North (दिल्ली व उत्तर भारत)",
    cities: {
      delhi: { name: "Delhi / Noida / Gurugram", fullLoad: 26000, partLoad: [{ label: "1-100 kg", price: 7000 }, { label: "100-500 kg", price: 12000 }, { label: "500-800 kg", price: 16500 }] },
      chandigarh: { name: "Chandigarh (चंडीगढ़)", fullLoad: 31000, partLoad: [{ label: "1-100 kg", price: 8500 }, { label: "100-500 kg", price: 14000 }, { label: "500-800 kg", price: 19000 }] },
      lucknow: { name: "Lucknow (लखनऊ)", fullLoad: 29000, partLoad: [{ label: "1-100 kg", price: 8000 }, { label: "100-500 kg", price: 13500 }, { label: "500-800 kg", price: 18000 }] }
    }
  },
  southIndia: {
    stateName: "South India (दक्षिण भारत)",
    cities: {
      bengaluru: { name: "Bengaluru (बेंगलुरु)", fullLoad: 38000, partLoad: [{ label: "1-100 kg", price: 9500 }, { label: "100-500 kg", price: 15500 }, { label: "500-800 kg", price: 23000 }] },
      hyderabad: { name: "Hyderabad (हैदराबाद)", fullLoad: 34000, partLoad: [{ label: "1-100 kg", price: 8500 }, { label: "100-500 kg", price: 13500 }, { label: "500-800 kg", price: 19500 }] },
      chennai: { name: "Chennai (चेन्नई)", fullLoad: 41000, partLoad: [{ label: "1-100 kg", price: 10000 }, { label: "100-500 kg", price: 17000 }, { label: "500-800 kg", price: 24500 }] }
    }
  },
  eastIndia: {
    stateName: "East India (पूर्वी भारत)",
    cities: {
      kolkata: { name: "Kolkata (कोलकाता)", fullLoad: 48000, partLoad: [{ label: "1-100 kg", price: 12500 }, { label: "100-500 kg", price: 21000 }, { label: "500-800 kg", price: 29000 }] },
      patna: { name: "Patna (पटना)", fullLoad: 39000, partLoad: [{ label: "1-100 kg", price: 11000 }, { label: "100-500 kg", price: 18000 }, { label: "500-800 kg", price: 24000 }] },
      bhubaneswar: { name: "Bhubaneswar (भुवनेश्वर)", fullLoad: 42000, partLoad: [{ label: "1-100 kg", price: 11500 }, { label: "100-500 kg", price: 19000 }, { label: "500-800 kg", price: 26000 }] }
    }
  }
};

const TRANSLATIONS = {
  hi: {
    heroTitle: "भारत का सबसे भरोसेमंद 'नीरज ट्रांसपोर्ट' सिस्टम",
    heroSub: "वडोदरा से ऑल इंडिया - सुरक्षित, बीमित और समय पर डिलीवरी! आपका विश्वसनीय कॉर्पोरेट ट्रांसपोर्ट साझीदार जिसके साथ आपका माल हमेशा १००% सुरक्षित रहता है।",
    statsTitle: "हमारे लाइव परिचालन आंकड़े",
    routeSectionTitle: "लाइव ऑल इंडिया किराया एवं सुरक्षा कवच कैलकुलेटर",
    routeSectionDesc: "वडोदरा (GIDC) से भारत के किसी भी राज्य के लिए रीयल-टाइम किराया और अतिरिक्त सुरक्षा कवच जोड़कर बुकिंग करें।",
    whyChooseUs: "हमारे साथ ही साझेदारी क्यों करें?",
    runningRecords: "15 लाख+ किलोमीटर कॉर्पोरेट रनिंग रिकॉर्ड",
    uydamVerified: "एमएसएमई उद्यम पंजीकृत",
    gstVerified: "जीएसटी इनवॉइस सक्षम",
    terms: "नियम एवं शर्तें",
    footerText: "वडोदरा गुजरात से ऑल इंडिया तक, आपका भरोसेमंद रणनीतिक ट्रांसपोर्ट साझीदार।"
  },
  en: {
    heroTitle: "INDIA'S MOST TRUSTED NEERAJ TRANSPORT",
    heroSub: "Vadodara to All India - Secure, Insured & On-Time Delivery! Your dedicated B2B logistics and cargo moving partner engineered for high-value risk mitigation.",
    statsTitle: "Our Live Fleet Metrics",
    routeSectionTitle: "Live All India Freight Matrix & Cargo Shield Engine",
    routeSectionDesc: "Calculate guaranteed rates from Vadodara GIDC to major economic hubs pan-India with integrated insurance & premium security shield.",
    whyChooseUs: "Why Strategic Corporate Partnership?",
    runningRecords: "1.5 Million+ Kilometers Corporate Experience",
    uydamVerified: "MSME Udyam Registered",
    gstVerified: "GST Invoices Compliant",
    terms: "Terms & Conditions",
    footerText: "Strategic logistics solutions connecting Vadodara GIDC to pan-India hubs."
  }
};

const FLEET_SLIDES = [
  { name: "TATA ACE (छोटा हाथी)", capacity: "850 Kg Payload", dimension: "7.2 Ft x 4.8 Ft x 4.5 Ft", bestFor: "Local GIDC raw items, cartons, single room shifting", speedRating: "Excellent narrow lane navigation" },
  { name: "BOLERO PICKUP (1.5 TON)", capacity: "1500 Kg Payload", dimension: "8.5 Ft x 5.2 Ft x 5.0 Ft", bestFor: "Industrial components, market goods, 1-2 BHK household shifting", speedRating: "High stable speeds over national highway lines" },
  { name: "EICHER 14FT TEMPO", capacity: "4500 Kg Payload", dimension: "14 Ft x 6.5 Ft x 7.0 Ft", bestFor: "Heavy GIDC machinery, retail cargo batches, office items shifting", speedRating: "Multi-axle dynamic highway balance" },
  { name: "HEAVY TRUCK (CLOSED BOX / OPEN)", capacity: "9000 Kg to 15000 Kg", dimension: "19 Ft to 22 Ft Cargo Deck", bestFor: "Bulk logistics, heavy-duty industrial shipping, large factory contracts", speedRating: "Heavy payload inter-state hauling" }
];

const PACKERS_SLIDES = [
  { title: "1 BHK Shifting Package (१ BHK शिफ्टिंग)", icon: "🏠", capacity: "Tata Ace / Bolero Pickup Assigned", price: 4500, desc: "Best for small apartments and young professionals. Includes loading, transit, and unloading safely.", features: ["3 Professional packers included", "Standard bubble protection wrapping", "Local Vadodara prompt delivery lines"] },
  { title: "2 BHK Premium Relocation (२ BHK प्रीमियम शिफ्टिंग)", icon: "🏡", capacity: "Bolero Pickup / 1.5 Ton capacity", price: 7800, desc: "Complete house relocation package with robust scratch-proof carpet layering and furniture assembly.", features: ["4 Expert Packers and movers assigned", "Double layer bubble protective shields", "Detailed glass & electronic secure boxes"] },
  { title: "3 BHK / Villa Grand Shift (३ BHK / विला भव्य शिफ्टिंग)", icon: "🏰", capacity: "Eicher 14ft heavy-duty container", price: 12500, desc: "Heavy household shifting. Completely hassle-free with custom wooden crates for expensive items.", features: ["6 Dedicated loading professionals", "Multi-layered protective covers on beds/sofas", "Includes dismantling and final floor placement"] },
  { title: "Corporate & GIDC Office Relocation (कॉर्पोरेट ऑफिस शिफ्ट)", icon: "🏢", capacity: "Multiple heavy-duty fleets deployed", price: 18000, desc: "Strategic warehouse and office asset shifting. Designed for zero-downtime corporate logistics.", features: ["Lashing straps for secure computer servers", "E-Way Bill & GST legal clearance ready", "Off-hours dynamic loading support (24/7)"] }
];

const playHapticBeep = (freq = 800, type = "sine", duration = 0.08) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Fail silently if browser audio context blocked
  }
};

export default function App() {
  const [lang, setLang] = useState('en'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Dynamic Route Selector
  const [selectedState, setSelectedState] = useState('gujarat');
  const [selectedCity, setSelectedCity] = useState('ahmedabad');
  const [loadType, setLoadType] = useState('part'); 
  const [weightIndex, setWeightIndex] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(1500);

  // Trust add-ons mapping directly to rates to satisfy corporate standards
  const [insuranceShield, setInsuranceShield] = useState(true); 
  const [waterproofTarp, setWaterproofTarp] = useState(true); 
  const [lashingStraps, setLashingStraps] = useState(false);

  // Packers & Movers Slider State
  const [packerSlideIdx, setPackerSlideIdx] = useState(0);
  const [packerPackingTier, setPackerPackingTier] = useState('premium'); 
  const [packerIsLocal, setPackerIsLocal] = useState(true);

  // Active state tab for the state rate chart database
  const [activeChartState, setActiveChartState] = useState('gujarat');

  // Cargo Space Fitment simulator state
  const [cargoItems, setCargoItems] = useState({ boxes: 0, beds: 0, fridges: 0, sofas: 0, machines: 0 });
  const [totalOccupancy, setTotalOccupancy] = useState(0);

  // Live Simulated GPS Tracker states
  const [vehicleNo, setVehicleNo] = useState('GJ-24-XX-4309');
  const [gpsData, setGpsData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [simulatedSpeed, setSimulatedSpeed] = useState(62);

  // Smart Budget Bargain State
  const [userBudget, setUserBudget] = useState('');
  const [bargainResponse, setBargainResponse] = useState(null);

  // Interactive Fleet Slider active index
  const [activeFleetIdx, setActiveFleetIdx] = useState(0);

  // Interactive Route Distance Slider state (kms from Vadodara GIDC)
  const [selectedDistanceKms, setSelectedDistanceKms] = useState(280);

  // Callback lead form
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', source: 'Vadodara (वडोदरा)', destination: 'All India', goodsType: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Simulated running statistics odometer
  const [odometerKms, setOdometerKms] = useState(1534098);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const kmTimer = setInterval(() => {
      setOdometerKms(prev => prev + 1);
    }, 4500);
    return () => clearInterval(kmTimer);
  }, []);

  useEffect(() => {
    let speedTimer;
    if (gpsData) {
      speedTimer = setInterval(() => {
        setSimulatedSpeed(prev => {
          const change = Math.floor(Math.random() * 5) - 2; 
          const next = prev + change;
          return next > 75 ? 70 : next < 45 ? 52 : next;
        });
      }, 3000);
    }
    return () => clearInterval(speedTimer);
  }, [gpsData]);

  // Pricing math calculator
  useEffect(() => {
    try {
      const stateData = ALL_INDIA_RATES[selectedState];
      if (stateData && stateData.cities[selectedCity]) {
        const cityData = stateData.cities[selectedCity];
        let basePrice = 0;
        if (loadType === 'full') {
          basePrice = cityData.fullLoad;
        } else {
          const partRate = cityData.partLoad[weightIndex];
          basePrice = partRate ? partRate.price : 0;
        }

        if (insuranceShield) basePrice += 450;
        if (waterproofTarp) basePrice += 350;
        if (lashingStraps) basePrice += 200;

        setCalculatedPrice(basePrice);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedState, selectedCity, loadType, weightIndex, insuranceShield, waterproofTarp, lashingStraps]);

  // Volume fitment calculations
  useEffect(() => {
    const occupied = (cargoItems.boxes * 6) + (cargoItems.beds * 25) + (cargoItems.fridges * 15) + (cargoItems.sofas * 22) + (cargoItems.machines * 35);
    setTotalOccupancy(Math.min(occupied, 150));
  }, [cargoItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const updateCargoQty = (item, op) => {
    playHapticBeep(op === 'add' ? 950 : 700, "sine");
    setCargoItems(prev => {
      const current = prev[item];
      const next = op === 'add' ? current + 1 : Math.max(0, current - 1);
      return { ...prev, [item]: next };
    });
  };

  const handleStateChange = (stateKey) => {
    playHapticBeep(650, "square");
    setSelectedState(stateKey);
    const firstCity = Object.keys(ALL_INDIA_RATES[stateKey].cities)[0];
    setSelectedCity(firstCity);
    setWeightIndex(0);
  };

  const handleGPSLookup = (e) => {
    e.preventDefault();
    if (!vehicleNo.trim()) return;
    playHapticBeep(1200, "triangle", 0.2);
    setIsTracking(true);
    setGpsData(null);
    
    setTimeout(() => {
      setIsTracking(false);
      setGpsData({
        number: vehicleNo.toUpperCase(),
        driver: "Ram Manoj Singh (Highway Master Pilot)",
        driverPhone: "+916353723567",
        ignition: "ON (HIGHWAY ACTIVE VECTOR)",
        route: "Vadodara GIDC Makarpura Terminal -> Pan-India Network Link",
        coordinates: "22.2587° N, 73.1938° E",
        signal: "EXCELLENT (4G SAT UPLINK)",
        progress: 72,
        milestones: [
          { location: "Vadodara GIDC Terminal (Makarpura)", time: "10:30 AM", passed: true },
          { location: "Bharuch Narmada Bridge Bypass", time: "01:15 PM", passed: true },
          { location: "Surat Ring Road Intersection", time: "04:30 PM", passed: true },
          { location: "Vapi Highway Border Toll", time: "07:15 PM", passed: true, current: true },
          { location: "Assigned Delivery Terminal", time: "Pending", passed: false }
        ]
      });
      showToast("Satellite GPS Signal Locked Successfully!");
    }, 1500);
  };

  const handleBargainSubmit = (e) => {
    e.preventDefault();
    const parsedBudget = parseFloat(userBudget);
    if (isNaN(parsedBudget) || parsedBudget <= 0) return;
    playHapticBeep(850, "sine", 0.15);

    const currentStandardRate = calculatedPrice;
    const diff = currentStandardRate - parsedBudget;
    const percentDiff = (diff / currentStandardRate) * 100;

    if (percentDiff <= 0) {
      setBargainResponse({
        accepted: true,
        text: lang === 'hi' 
          ? "बधाई हो! आपका प्रस्तावित बजट हमारे मानकों के अनुकूल है। गाड़ी सीधे बुक करें।" 
          : "Excellent! Your target budget aligns with our standard. Proceed to lock reservation.",
        deal: parsedBudget
      });
    } else if (percentDiff <= 15) {
      const middleDeal = Math.round(parsedBudget + (diff * 0.4));
      setBargainResponse({
        accepted: true,
        text: lang === 'hi'
          ? `नीरज भाई का विशेष काउंटर ऑफर! चलिए आधे रास्ते मिलकर ₹${middleDeal} में डील लॉक करते हैं!`
          : `Special concession applied! Let's lock the deal mid-way at ₹${middleDeal} for high premium safety.`,
        deal: middleDeal
      });
    } else {
      const optimalDiscount = Math.round(currentStandardRate * 0.9);
      setBargainResponse({
        accepted: false,
        text: lang === 'hi'
          ? `यह बजट काफी कम है भाई जी। लेकिन चिंता न करें, हम सीधे बात करके आपके अनुकूल सर्वोत्तम कॉर्पोरेट दर तय करेंगे!`
          : `This target falls below standard haul costs. Let's discuss directly. We offer premium safety that standard transporters cannot match.`,
        deal: optimalDiscount
      });
    }
  };

  const handleWhatsAppBooking = (type, customDetails = '') => {
    playHapticBeep(1000, "sine");
    let message = '';
    const shieldStatus = `Insurance: ${insuranceShield ? 'YES' : 'NO'}, Tarpaulin: ${waterproofTarp ? 'YES' : 'NO'}, Belts: ${lashingStraps ? 'YES' : 'NO'}`;
    
    if (type === 'calculator') {
      const cityName = ALL_INDIA_RATES[selectedState]?.cities[selectedCity]?.name || selectedCity;
      const stateName = ALL_INDIA_RATES[selectedState]?.stateName || selectedState;
      const loadText = loadType === 'full' ? 'Full Load (फुल लोड)' : 'Part Load (पार्ट लोड)';
      message = `[NEERAJ TRANSPORT HAULAGE REQUEST]\n\n📍 FROM: Vadodara (वडोदरा)\n📍 TO: ${cityName} (${stateName})\n📦 TYPE: ${loadText}\n🛡️ SHIELD: ${shieldStatus}\n💵 QUOTE: ₹${calculatedPrice}/-\n\nHi Neeraj Ji, please reserve this route vector for our shipment. Audit Ref: "WhatsApp Image 2026-05-17 at 09.02.48.jpeg"`;
    } else if (type === 'packers') {
      const activePacker = PACKERS_SLIDES[packerSlideIdx];
      let packingMult = packerPackingTier === 'ultra' ? 1.5 : packerPackingTier === 'premium' ? 1.25 : 1.0;
      let finalPackerPrice = Math.round(activePacker.price * packingMult + (packerIsLocal ? 0 : 8000));
      
      message = `[NEERAJ PACKERS & MOVERS REQUEST]\n\n📍 FROM: Vadodara (वडोदरा)\n🏡 PACKAGE: ${activePacker.title}\n📦 PACKING TIER: ${packerPackingTier.toUpperCase()}\n🔄 SCOPE: ${packerIsLocal ? 'Local Shifting within Vadodara' : 'Outstation Interstate Shifting'}\n💵 ESTIMATED COST: ₹${finalPackerPrice}/-\n\nHi Neeraj Ji, please initiate packing checklist. Audit Ref: "Neeraj Tempo Service Corporate Proposal.pdf"`;
    } else if (type === 'negotiator') {
      message = `[NEERAJ CONCESSION CONTRACT]\n\nRoute: Vadodara -> ${ALL_INDIA_RATES[selectedState]?.cities[selectedCity]?.name || selectedCity}\n💼 Proposed Deal: ₹${customDetails}/-\n\nHi Neeraj Ji, confirming the counter-offer rate. Let's lock this order.`;
    } else if (type === 'fitter') {
      message = `[NEERAJ SPACE ESTIMATOR MATRIX]\n\n📊 Volumetric Cargo Volume: ${totalOccupancy}%\n📦 Boxes: ${cargoItems.boxes}, Beds: ${cargoItems.beds}, Fridges: ${cargoItems.fridges}, Sofas: ${cargoItems.sofas}, Machines: ${cargoItems.machines}\n\nHi Neeraj Ji, please assign appropriate SCV/Pickup capacity for this volume.`;
    } else if (type === 'distance') {
      message = `[NEERAJ DISTANCE CONTRACT INQUIRY]\n\n📏 Selected Distance: ${selectedDistanceKms} KM\n📍 Estimated Haulage: Vadodara Radial Sector\n\nHi Neeraj Ji, please share corporate rates for this radial distance contract.`;
    }
    window.open(`https://wa.me/916353723567?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    playHapticBeep(1100, "square", 0.3);
    setFormSubmitted(true);
    setTimeout(() => {
      const message = `[LOGISTICS LEAD CAPTURED]\n\n👤 Name: ${callbackForm.name}\n📞 Phone: ${callbackForm.phone}\n📍 Route: ${callbackForm.source} -> ${callbackForm.destination}\n📦 Cargo: ${callbackForm.goodsType}`;
      window.open(`https://wa.me/916353723567?text=${encodeURIComponent(message)}`, '_blank');
      setFormSubmitted(false);
      setCallbackForm({ name: '', phone: '', source: 'Vadodara (वडोदरा)', destination: 'All India', goodsType: '' });
      showToast("Redirecting to Dispatch Officer via WhatsApp...");
    }, 1200);
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || '';
  };

  return (
    <div className="min-h-screen tesla-grid-bg text-slate-100 font-sans selection:bg-[#E82127] selection:text-white overflow-x-hidden pb-20 sm:pb-0">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#121316] border-2 border-[#E82127] text-white py-3 px-6 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Activity className="h-5 w-5 text-[#E82127] animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Top micro banner */}
      <div className="bg-[#0c0d10] border-b border-[#E82127]/20 text-slate-400 text-xs py-2 px-4 relative z-50 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E82127] animate-pulse inline-block" />
            SECURE VEHICLES CONNECTED [ON]
          </span>
          <span className="hidden md:inline border-l border-white/10 pl-4 font-mono text-[10px]">
            ALL INDIA TRANSIT HUB: ONLINE
          </span>
          <span className="hidden lg:inline text-[#E82127] font-mono font-bold">
            🛡️ INSURANCE CARGO SHIELD: UP TO ₹10 LAKHS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono">
            GSTIN: 24IAMPK5306P1Z5
          </span>
          <span className="bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono">
            UDYAM-GJ-24-0182950
          </span>
          <button 
            onClick={() => {
              playHapticBeep(900, "sine", 0.05);
              setLang(lang === 'hi' ? 'en' : 'hi');
            }} 
            className="flex items-center gap-1.5 bg-[#E82127] text-white px-3 py-1 rounded font-black text-xs hover:bg-[#ff2b32] transition-all"
          >
            {lang === 'hi' ? "ENGLISH" : "हिन्दी"}
          </button>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0A0B0D]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white/5 border border-[#E82127]/30 rounded-lg flex items-center justify-center overflow-hidden">
                <Truck className="h-6 w-6 text-[#E82127]" />
                <div className="absolute inset-0 bg-[#E82127]/10 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-widest uppercase">NEERAJ TRANSPORT</h1>
                <p className="text-[9px] text-[#E82127] font-mono tracking-widest uppercase font-black">INDIA'S MOST TRUSTED TRANSIT HUB</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-widest font-mono">
              <a href="#freight-calculator" className="hover:text-white text-slate-400 transition-colors uppercase">1. Live Freight Calculator</a>
              <a href="#compliance-vault" className="hover:text-white text-slate-400 transition-colors uppercase">2. Document Compliance</a>
              <a href="#gps-tracking" className="hover:text-white text-slate-400 transition-colors uppercase">3. GPS Live Tracker</a>
              <a href="#packers-movers-block" className="hover:text-[#E82127] text-slate-300 transition-colors uppercase flex items-center gap-1"><Sparkles className="h-3 w-3 text-[#E82127]"/> 4. Packers Movers</a>
              <a href="#contact" className="hover:text-white text-slate-400 transition-colors uppercase">5. Contacts</a>
            </nav>

            <div className="hidden sm:flex items-center gap-3">
              <a 
                href="tel:+916353723567" 
                onClick={() => playHapticBeep(1000, "sine")}
                className="tesla-btn-red px-5 py-2.5 rounded-lg text-xs font-mono font-extrabold tracking-widest uppercase flex items-center gap-2"
              >
                <Phone className="h-4.5 w-4.5 text-white animate-pulse" /> Call Dispatch Desk
              </a>
            </div>

            <div className="lg:hidden">
              <button 
                onClick={() => {
                  playHapticBeep(700, "sine");
                  setIsMenuOpen(!isMenuOpen);
                }} 
                className="text-slate-300 hover:text-white focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#0A0B0D] border-t border-white/5 py-4 px-6 space-y-3 font-mono text-xs font-bold uppercase tracking-wider">
            <a href="#freight-calculator" onClick={() => setIsMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Live Haulage Rates</a>
            <a href="#compliance-vault" onClick={() => setIsMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Audit Certification</a>
            <a href="#gps-tracking" onClick={() => setIsMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Live Vehicle GPS</a>
            <a href="#packers-movers-block" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#E82127]">Packers & Movers Slide</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Direct Contacts</a>
            <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
              <a href="tel:+916353723567" className="bg-[#121316] text-white text-center py-3 rounded-lg border border-white/10 font-bold">Call</a>
              <a href="https://wa.me/916353723567" className="bg-emerald-600 text-white text-center py-3 rounded-lg font-bold">WhatsApp</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Presentation */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E82127]/10 border border-[#E82127]/30 text-[#E82127] font-mono px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-black">
                <Sparkles className="h-3 w-3 text-[#E82127] animate-spin" /> Next-Gen Corporate Freight Fleet
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
                {t('heroTitle')} <br />
                <span className="text-[#E82127] tesla-red-glow font-extrabold">SAFE. FAST. AUDIT-READY.</span>
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {t('heroSub')} We connect GIDC hubs with state-of-the-art logistics technology, GPS tracking, and corporate credit options.
              </p>

              {/* Dynamic Odometer Panel */}
              <div className="bg-[#121316]/90 border border-white/5 p-4 rounded-xl flex items-center justify-between max-w-md">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Total Verified Fleet Distance</p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-widest mt-1">
                    {odometerKms.toLocaleString()} KM
                  </p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] px-2.5 py-1 rounded font-mono font-black uppercase">
                  Active Odometer
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a 
                  href="#freight-calculator" 
                  onClick={() => playHapticBeep(850, "sine", 0.05)}
                  className="tesla-btn-red text-center py-4 px-8 rounded-xl font-mono text-xs font-bold uppercase tracking-widest"
                >
                  Calculate Haulage Rates <ChevronRight className="h-4 w-4 inline ml-1" />
                </a>
                <a 
                  href="tel:+916353723567" 
                  onClick={() => playHapticBeep(1000, "sine")}
                  className="bg-white/5 hover:bg-white/10 text-white text-center py-4 px-8 rounded-xl border border-white/10 font-mono text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Direct Call Officer
                </a>
              </div>
            </div>

            {/* Quick Callback Card with verification focus */}
            <div className="lg:col-span-5">
              <div className="tesla-hud-glass p-6 rounded-2xl border-2 border-[#E82127]/20 relative">
                <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold">
                  24/7 ONLINE
                </div>
                
                <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono mb-1">Instant Callback Dispatch</h3>
                <p className="text-xs text-slate-400 mb-6">Let Neeraj Yadav's logistics team call you right back in 10 minutes.</p>

                <form onSubmit={handleCallbackSubmit} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Logistics / Manager Name</label>
                    <input 
                      type="text" 
                      required
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#E82127] outline-none transition-all"
                      placeholder="e.g., Rajesh Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Mobile Contact Phone</label>
                    <input 
                      type="tel" 
                      required
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#E82127] outline-none transition-all"
                      placeholder="e.g., 6353723567"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Source Hub</label>
                      <input 
                        type="text" 
                        value={callbackForm.source}
                        onChange={(e) => setCallbackForm({ ...callbackForm, source: e.target.value })}
                        className="w-full bg-[#0c0d10] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#E82127] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Destination Hub</label>
                      <input 
                        type="text" 
                        value={callbackForm.destination}
                        onChange={(e) => setCallbackForm({ ...callbackForm, destination: e.target.value })}
                        className="w-full bg-[#0c0d10] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#E82127] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#E82127] hover:bg-[#ff2b32] text-white font-black py-3 rounded-lg uppercase tracking-widest text-[10px]"
                  >
                    {formSubmitted ? "Sending WhatsApp Dispatch Signal..." : "Submit Dispatch Request"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* State-by-State Rate Finder Matrix */}
      <section id="freight-calculator" className="py-20 border-b border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-[#E82127] font-mono text-[10px] tracking-widest uppercase font-black bg-[#E82127]/10 px-3.5 py-1.5 rounded-full border border-[#E82127]/20 inline-block">
              ACTIVE CALCULATOR CORE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-4">
              {t('routeSectionTitle')}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto mt-2 font-mono">
              {t('routeSectionDesc')} Custom structured around compliant haulage parameters matching GIDC schedules.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Interactive Selector Board */}
            <div className="lg:col-span-6 bg-[#121316] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-2 border-b border-white/5 pb-3">
                  <Sliders className="h-4.5 w-4.5 text-[#E82127]" /> 1. Configure Haulage Parameters
                </h3>

                {/* State Dropdown */}
                <div className="space-y-1 font-mono text-xs">
                  <label className="text-slate-400 block font-bold">Select Target State</label>
                  <div className="relative">
                    <select 
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-[#0c0d10] border border-white/10 rounded-lg py-3 px-4 text-white font-bold focus:border-[#E82127] outline-none cursor-pointer appearance-none"
                    >
                      {Object.keys(ALL_INDIA_RATES).map(key => (
                        <option key={key} value={key}>{ALL_INDIA_RATES[key].stateName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                {/* City Dropdown */}
                <div className="space-y-1 font-mono text-xs">
                  <label className="text-slate-400 block font-bold">Select Destination GIDC / City Hub</label>
                  <div className="relative">
                    <select 
                      value={selectedCity}
                      onChange={(e) => {
                        playHapticBeep(600, "sine");
                        setSelectedCity(e.target.value);
                        setWeightIndex(0);
                      }}
                      className="w-full bg-[#0c0d10] border border-white/10 rounded-lg py-3 px-4 text-white font-bold focus:border-[#E82127] outline-none cursor-pointer appearance-none"
                    >
                      {Object.keys(ALL_INDIA_RATES[selectedState].cities).map(cityKey => (
                        <option key={cityKey} value={cityKey}>{ALL_INDIA_RATES[selectedState].cities[cityKey].name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                {/* Load Selection */}
                <div className="space-y-2 font-mono text-xs">
                  <label className="text-slate-400 block font-bold">Load Allocation Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button" 
                      onClick={() => { playHapticBeep(800, "sine"); setLoadType('part'); }}
                      className={`py-3.5 px-4 rounded-lg border font-bold text-center transition-all ${loadType === 'part' ? 'border-[#E82127] bg-[#E82127]/10 text-white shadow-lg shadow-[#E82127]/10' : 'border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      Part Load (पार्ट लोड)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { playHapticBeep(850, "sine"); setLoadType('full'); }}
                      className={`py-3.5 px-4 rounded-lg border font-bold text-center transition-all ${loadType === 'full' ? 'border-[#E82127] bg-[#E82127]/10 text-white shadow-lg shadow-[#E82127]/10' : 'border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      Full Load (फुल लोड)
                    </button>
                  </div>
                </div>

                {/* Weight selection */}
                {loadType === 'part' && (
                  <div className="space-y-2 font-mono text-xs">
                    <label className="text-slate-400 block font-bold">Weight Class Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ALL_INDIA_RATES[selectedState].cities[selectedCity].partLoad.map((p, idx) => (
                        <button 
                          key={idx}
                          type="button" 
                          onClick={() => { playHapticBeep(900, "sine"); setWeightIndex(idx); }}
                          className={`py-3 px-2 rounded-lg border font-bold text-center text-[10px] transition-all ${weightIndex === idx ? 'border-[#E82127] bg-[#E82127]/10 text-white' : 'border-white/5 text-slate-500 hover:border-white/10'}`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust security armor selectors */}
                <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
                  <label className="text-slate-400 block font-bold mb-1">2. Add Cargo Shield Layers</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="bg-[#0c0d10] p-2.5 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer">
                      <span className="text-[10px]">Insured (+₹450)</span>
                      <input 
                        type="checkbox" 
                        checked={insuranceShield} 
                        onChange={(e) => { playHapticBeep(1100, "sine"); setInsuranceShield(e.target.checked); }}
                        className="accent-[#E82127]"
                      />
                    </label>
                    <label className="bg-[#0c0d10] p-2.5 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer">
                      <span className="text-[10px]">Dual Tarp (+₹350)</span>
                      <input 
                        type="checkbox" 
                        checked={waterproofTarp} 
                        onChange={(e) => { playHapticBeep(1100, "sine"); setWaterproofTarp(e.target.checked); }}
                        className="accent-[#E82127]"
                      />
                    </label>
                    <label className="bg-[#0c0d10] p-2.5 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer">
                      <span className="text-[10px]">Lash Straps (+₹200)</span>
                      <input 
                        type="checkbox" 
                        checked={lashingStraps} 
                        onChange={(e) => { playHapticBeep(1100, "sine"); setLashingStraps(e.target.checked); }}
                        className="accent-[#E82127]"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Dynamic Rate Printout */}
              <div className="mt-6 bg-[#0c0d10] p-5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-slate-500 font-mono uppercase font-bold tracking-wider">Estimated Basic Haulage</p>
                    <p className="text-3xl font-black text-yellow-400 font-mono">₹{calculatedPrice.toLocaleString('en-IN')}/-</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="inline-block bg-[#E82127]/10 border border-[#E82127]/30 text-[#E82127] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      Calculated Rate
                    </span>
                    <p className="text-[9px] text-slate-500 mt-1">Excludes state highway tolls</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleWhatsAppBooking('calculator')}
                  className="w-full bg-[#E82127] hover:bg-[#ff2b32] text-white font-mono font-black text-xs py-3 rounded-lg uppercase tracking-widest mt-4 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> Secure This Route Allocation
                </button>
              </div>
            </div>

            {/* Smart Interactive Map and ESG carbon tracker */}
            <div className="lg:col-span-6 bg-[#121316] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <span className="flex items-center gap-2"><Globe className="h-4.5 w-4.5 text-blue-400" /> Route Diagnostics Matrix</span>
                  <span className="text-emerald-400 font-black tracking-widest">[RADAR ONLINE]</span>
                </h3>

                {/* SVG Visual Radar Graph / Map representing real-time hubs */}
                <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[180px]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#112211_0%,transparent_70%)] opacity-20"></div>
                  
                  {/* Glowing Radar Sweep Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-emerald-500/20 rounded-full">
                    <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                  </div>

                  <div className="relative z-10 text-center space-y-2 font-mono">
                    <Globe className="h-10 w-10 text-emerald-400 mx-auto animate-pulse" />
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">
                      Vadodara Terminal to {ALL_INDIA_RATES[selectedState]?.cities[selectedCity]?.name || 'Hub'}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Coordinates: 22.25° N, 73.19° E | Carrier Band: 4G SAT UPLINK
                    </p>
                    <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg inline-block text-[10px]">
                      <span className="text-slate-400">Assigned Speed Priority:</span> <strong className="text-emerald-400 uppercase">Highway Green Vector</strong>
                    </div>
                  </div>
                </div>

                {/* Smart Concession Negotiator (Apna Budget Bato widget) */}
                <div className="mt-4 bg-[#0c0d10] border border-white/5 p-4 rounded-xl relative">
                  <div className="absolute top-2 right-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-[8px] px-2 py-0.5 rounded uppercase font-black">
                    Interactive Engine
                  </div>
                  <h4 className="text-xs font-black text-white uppercase font-mono tracking-wider mb-1">"Your Custom Budget" (अपना बजट बताएं)</h4>
                  <p className="text-[10px] text-slate-400 mb-3">Does your corporate accounting specify different target costs? Challenge the rate below:</p>

                  <form onSubmit={handleBargainSubmit} className="flex gap-2 font-mono text-xs">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <input 
                        type="number" 
                        required
                        value={userBudget}
                        onChange={(e) => {
                          setUserBudget(e.target.value);
                          setBargainResponse(null);
                        }}
                        placeholder="Target Price"
                        className="w-full bg-[#121316] border border-white/10 rounded-lg py-2 pl-7 pr-3 text-white outline-none focus:border-[#E82127]"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black px-4 rounded-lg uppercase tracking-wider text-[10px]"
                    >
                      Audit
                    </button>
                  </form>

                  {bargainResponse && (
                    <div className="mt-3 bg-[#121316] p-3 rounded-lg border border-white/5 font-mono text-[10px] space-y-2 animate-fadeIn">
                      <p className="text-slate-300 font-bold leading-relaxed">{bargainResponse.text}</p>
                      <div className="flex justify-between items-center border-t border-white/5 pt-2">
                        <span className="text-slate-500">Special Negotiated Rate:</span>
                        <strong className="text-emerald-400 text-sm">₹{bargainResponse.deal.toLocaleString('en-IN')}/-</strong>
                      </div>
                      <button 
                        onClick={() => handleWhatsAppBooking('negotiator', bargainResponse.deal)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded uppercase text-[9px] tracking-widest"
                      >
                        Accept Custom Negotiated Quote
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Unique Feature: ESG Green Transit CO2 Saving estimate */}
              <div className="mt-4 bg-emerald-950/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
                <Leaf className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0 animate-pulse" />
                <div className="font-mono text-xs">
                  <h5 className="font-extrabold text-emerald-400 uppercase tracking-widest">ESG Green Logistics Certificate</h5>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">
                    By choosing Neeraj Transport's streamlined consolidated highway networks, you save approximately <strong className="text-white">12.8 Kg of CO₂</strong> per payload distance metric against standard multi-transit providers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Odometer distance slider */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              <span className="text-[#E82127] font-mono text-[10px] tracking-widest uppercase font-black">
                Interactive Radius Contracts
              </span>
              <h2 className="text-2xl font-black uppercase text-white">
                Calculate Custom Mileage Radial Rates
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Select custom distances for factory-to-warehouse loops using our slider. Excellent for multi-site GIDC logistics.
              </p>

              <div className="bg-[#121316] p-6 rounded-xl border border-white/5 font-mono">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-slate-400 uppercase font-black">Contract Haulage Radius:</span>
                  <span className="text-lg font-black text-white">{selectedDistanceKms} KM</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1200" 
                  value={selectedDistanceKms}
                  onChange={(e) => {
                    playHapticBeep(750, "sine", 0.05);
                    setSelectedDistanceKms(parseInt(e.target.value));
                  }}
                  className="w-full h-1.5 bg-[#0c0d10] rounded-lg appearance-none cursor-pointer accent-[#E82127] mb-4"
                />
                <div className="flex justify-between text-[9px] text-slate-500 uppercase">
                  <span>Local Loop (50 KM)</span>
                  <span>Interstate Transit (1200 KM)</span>
                </div>
              </div>
            </div>

            {/* Simulated contract terms output block */}
            <div className="bg-[#121316]/80 p-6 rounded-2xl border border-white/5 font-mono text-xs text-slate-300 flex flex-col justify-between h-full min-h-[220px]">
              <div className="space-y-3">
                <h4 className="text-white font-black uppercase tracking-wider text-xs border-b border-white/5 pb-2">Radial Concession Terms</h4>
                <p>📏 Sector: Vadodara Radial Logistics Loop</p>
                <p>📦 Standard Payload Limit: Bolero Pick-up Class Configured</p>
                <p>💵 Estimated Bulk Contract Price: <strong className="text-yellow-400 text-base">₹{(selectedDistanceKms * 28 + 1200).toLocaleString('en-IN')}/-</strong></p>
              </div>

              <button 
                onClick={() => handleWhatsAppBooking('distance')}
                className="w-full bg-[#E82127] hover:bg-[#ff2b32] text-white font-black py-3 rounded-lg uppercase tracking-widest text-[10px] mt-4"
              >
                Inquire Radial Contract Options
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Futuristic live GPS dashboard */}
      <section id="gps-tracking" className="py-20 border-b border-white/5 bg-[#050608]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase font-black bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-400/20 inline-block">
              LIVE TELEMETRY HUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-4">
              Pan-India Real-Time GPS Tracker
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto mt-2 font-mono">
              Direct verification of dispatch lines. Enter any vehicle registration number to simulate real-time highway diagnostics.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-[#121316] rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 font-mono text-[8px] px-3 py-1 rounded-bl-lg uppercase tracking-widest font-black">
              Active Satellite Stream
            </div>

            <form onSubmit={handleGPSLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-[#0c0d10] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
                <Search className="h-5 w-5 text-slate-500 animate-pulse" />
                <input 
                  type="text" 
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g., GJ-24-XX-4309"
                  className="bg-transparent border-none outline-none text-white font-bold font-mono tracking-wider w-full placeholder-slate-700 text-xs sm:text-sm"
                />
              </div>
              <button 
                type="submit"
                className="tesla-btn-red px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5"
              >
                {isTracking ? 'Locking Satellite...' : 'Initiate Live Tracking'}
              </button>
            </form>

            <p className="text-[10px] text-slate-500 mt-2 font-mono text-center uppercase tracking-wider">
              Simulation works for all fleet records. Demo input: <strong className="text-yellow-400">GJ-24-XX-4309</strong>
            </p>

            {gpsData && (
              <div className="mt-8 border-t border-white/5 pt-8 space-y-6 animate-fadeIn">
                
                {/* Visual Dashboard Dials */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0c0d10] border border-white/5 p-4 rounded-xl text-center font-mono">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Live Speed</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1 animate-pulse">{simulatedSpeed} KM/H</p>
                    <span className="text-[8px] text-slate-600 block mt-0.5">HIGHWAY STABLE</span>
                  </div>
                  <div className="bg-[#0c0d10] border border-white/5 p-4 rounded-xl text-center font-mono">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Ignition Status</p>
                    <p className="text-lg font-black text-emerald-400 mt-1 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> ON
                    </p>
                    <span className="text-[8px] text-slate-600 block mt-0.5">ACTIVE DRIVE ENGINE</span>
                  </div>
                  <div className="bg-[#0c0d10] border border-white/5 p-4 rounded-xl text-center font-mono col-span-2">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Satellite Signal Lock</p>
                    <p className="text-xs font-bold text-white mt-2 uppercase tracking-wide">{gpsData.signal}</p>
                    <span className="text-[8px] text-slate-600 block mt-0.5">STABLE 4G TRANSIT MATRIX</span>
                  </div>
                </div>

                {/* Road milestones progress line */}
                <div className="relative pl-6 space-y-6 border-l border-white/10 font-mono text-xs">
                  {gpsData.milestones.map((m, idx) => (
                    <div key={idx} className="relative">
                      <span className={`absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full border-2 ${m.current ? 'bg-[#E82127] border-[#0A0B0D] animate-ping scale-110' : m.passed ? 'bg-emerald-500 border-[#0A0B0D]' : 'bg-slate-800 border-transparent'}`} />
                      <div>
                        <h4 className={`font-black ${m.current ? 'text-[#E82127] tesla-red-glow' : m.passed ? 'text-white' : 'text-slate-500'}`}>
                          {m.location}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Timestamp Checklist: {m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Driver information card */}
                <div className="bg-[#0c0d10] p-4 rounded-xl border border-white/5 flex items-center justify-between font-mono text-xs">
                  <div>
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Assigned Fleet Master Pilot</p>
                    <p className="text-sm font-black text-white mt-1">{gpsData.driver}</p>
                  </div>
                  <a 
                    href={`tel:${gpsData.driverPhone}`} 
                    onClick={() => playHapticBeep(1000, "sine")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded text-[10px] uppercase tracking-wider"
                  >
                    Contact Pilot Cab
                  </a>
                </div>

              </div>
            )}

          </div>
        </div>
      </section>

      {/* Document compliance vault section */}
      <section id="compliance-vault" className="py-20 border-b border-white/5 bg-[#0A0B0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[#E82127] font-mono text-[10px] tracking-widest uppercase font-black">
                Interactive Document Verification Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                Legal & Audit Compliance Vault
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Corporate legal departments require rigid transparency. We maintain real-time certified duplicates of our business paperwork directly accessible online.
              </p>

              <div className="space-y-4 font-mono text-xs">
                
                {/* Document Item 1: Proposal */}
                <div className="bg-[#121316] p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-[#E82127]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-[#E82127]" />
                    <div>
                      <p className="font-extrabold text-white text-[11px]">"Neeraj Tempo Service Corporate Proposal.pdf"</p>
                      <p className="text-[9px] text-slate-500">Document Type: Certified PDF Proposal Portfolio</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded font-black uppercase">
                    ACTIVE SOURCE
                  </span>
                </div>

                {/* Document Item 2: Rate banner */}
                <div className="bg-[#121316] p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-[#E82127]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Layers className="h-6 w-6 text-[#E82127]" />
                    <div>
                      <p className="font-extrabold text-white text-[11px]">"WhatsApp Image 2026-05-17 at 09.02.48.jpeg"</p>
                      <p className="text-[9px] text-slate-500">Document Type: Verified Pricing Matrix & Rate Sheet</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded font-black uppercase">
                    ACTIVE SOURCE
                  </span>
                </div>

              </div>
            </div>

            {/* Compliance Stats Display Card */}
            <div className="lg:col-span-6 bg-[#121316] border border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(232,33,39,0.03)_100%)]"></div>
              
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                <span>Compliance Verification Status</span>
                <span className="text-emerald-400">[AUDITED]</span>
              </h3>

              <ul className="space-y-4 font-mono text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="text-white block text-[11px] uppercase">MSME Udyam Verified Agency</strong>
                    <p className="text-[10px] text-slate-500 mt-0.5">Udyam Registration Number: UDYAM-GJ-24-0182950 verified at all state border crossings.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="text-white block text-[11px] uppercase">GST Invoices & Transport ID Compliant</strong>
                    <p className="text-[10px] text-slate-500 mt-0.5">GST ID: 24IAMPK5306P1Z5. Full B2B input tax credits immediately reclaimable by factory audits.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="text-white block text-[11px] uppercase">Highway Super-Pilot Policy</strong>
                    <p className="text-[10px] text-slate-500 mt-0.5">Every driver completes police background checks, drug analysis, and speed-limit qualification schedules.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Database State-wise Static Chart for Fast Lookup */}
      <section className="py-20 border-b border-white/5 bg-[#050608]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="text-[#E82127] font-mono text-[10px] tracking-widest uppercase font-black">
              Corporate Reference Matrix
            </span>
            <h2 className="text-2xl font-black uppercase text-white mt-3">
              Certified Rate Matrices
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto mt-2 font-mono">
              Quickly filter pan-India base prices across active industrial terminals. Select state tab to view base data.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8 font-mono text-[10px] font-bold">
            {Object.keys(ALL_INDIA_RATES).map(stateKey => (
              <button 
                key={stateKey}
                onClick={() => { playHapticBeep(900, "sine", 0.05); setActiveChartState(stateKey); }}
                className={`px-4 py-2.5 rounded-lg border transition-all ${activeChartState === stateKey ? 'border-[#E82127] bg-[#E82127]/10 text-white' : 'border-white/5 bg-[#121316] text-slate-400 hover:border-white/10'}`}
              >
                {ALL_INDIA_RATES[stateKey].stateName}
              </button>
            ))}
          </div>

          <div className="bg-[#121316] p-6 rounded-2xl border border-white/5 font-mono">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(ALL_INDIA_RATES[activeChartState].cities).map(cityKey => {
                const city = ALL_INDIA_RATES[activeChartState].cities[cityKey];
                return (
                  <div key={cityKey} className="bg-[#0c0d10] p-4 rounded-xl border border-white/5 relative">
                    <h4 className="text-white font-extrabold text-xs flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                      <MapPin className="h-4 w-4 text-[#E82127]" /> {city.name}
                    </h4>

                    <div className="space-y-1.5 text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Full Load Standard:</span>
                        <strong className="text-emerald-400">₹{city.fullLoad.toLocaleString('en-IN')}/-</strong>
                      </div>
                      <div className="pt-1 border-t border-white/5 text-slate-500 text-[9px] uppercase font-bold mb-1">
                        Part Load Categories:
                      </div>
                      {city.partLoad.map((pl, pIdx) => (
                        <div key={pIdx} className="flex justify-between">
                          <span>{pl.label}:</span>
                          <strong className="text-white">₹{pl.price.toLocaleString('en-IN')}/-</strong>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        const msg = `Hi Neeraj Ji, inquiring about shipment to ${city.name} under Active Rate Matrix database code.`;
                        window.open(`https://wa.me/916353723567?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 text-white py-1.5 rounded text-[9px] font-black uppercase mt-3 transition-colors tracking-wider"
                    >
                      Book This Terminal Hub
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Packers & Movers Section (Positioned Lower down the page as requested) */}
      <section id="packers-movers-block" className="py-20 border-b border-white/5 bg-[#0c0d10] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-[#E82127] font-mono text-[10px] tracking-widest uppercase font-black bg-[#E82127]/10 px-3.5 py-1.5 rounded-full border border-[#E82127]/20 inline-block">
              VADODARA LOCAL & ALL-INDIA PACKING SOLUTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-4">
              Step-by-Step Packing & Relocation Slider
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto mt-2 font-mono">
              Domestic home shifting or corporate warehouse relocation. Slide through premium configured packaging specs below.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            
            {/* Active Packers Card with sliding mechanism */}
            <div className="bg-[#121316] rounded-3xl border border-white/5 p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
              
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl animate-bounce inline-block">{PACKERS_SLIDES[packerSlideIdx].icon}</span>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                      {PACKERS_SLIDES[packerSlideIdx].title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest mt-0.5">
                      {PACKERS_SLIDES[packerSlideIdx].capacity}
                    </p>
                  </div>
                </div>
                
                {/* Manual Slider Navigation controllers */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      playHapticBeep(650, "sine");
                      setPackerSlideIdx(prev => Math.max(0, prev - 1));
                    }}
                    disabled={packerSlideIdx === 0}
                    className="p-2 bg-[#0c0d10] border border-white/10 rounded-lg text-white hover:border-[#E82127] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    &larr; Prev
                  </button>
                  <span className="font-mono text-xs font-black text-[#E82127] px-2">
                    {packerSlideIdx + 1} / {PACKERS_SLIDES.length}
                  </span>
                  <button 
                    onClick={() => {
                      playHapticBeep(700, "sine");
                      setPackerSlideIdx(prev => Math.min(PACKERS_SLIDES.length - 1, prev + 1));
                    }}
                    disabled={packerSlideIdx === PACKERS_SLIDES.length - 1}
                    className="p-2 bg-[#0c0d10] border border-white/10 rounded-lg text-white hover:border-[#E82127] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>

              {/* Slider description and checklist specs */}
              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2 font-mono text-xs text-slate-300 leading-relaxed">
                    <p className="font-bold text-white uppercase text-xs">Overview Description</p>
                    <p>{PACKERS_SLIDES[packerSlideIdx].desc}</p>
                  </div>

                  {/* Pricing tier checkboxes */}
                  <div className="space-y-2 font-mono text-xs pt-4 border-t border-white/5">
                    <label className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">Select Packaging Material Quality</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['standard', 'premium', 'ultra'].map((tier) => (
                        <button 
                          key={tier}
                          type="button" 
                          onClick={() => { playHapticBeep(850, "sine"); setPackerPackingTier(tier); }}
                          className={`py-2 px-1 rounded border text-[9px] font-black text-center uppercase tracking-wider transition-all ${packerPackingTier === tier ? 'border-[#E82127] bg-[#E82127]/10 text-white' : 'border-white/5 text-slate-500'}`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#0c0d10] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] text-slate-500 font-mono uppercase font-black tracking-widest mb-3">Included Relocation Checklist</h4>
                    <ul className="space-y-2 font-mono text-xs text-slate-300">
                      {PACKERS_SLIDES[packerSlideIdx].features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Shifting destination scope selector */}
                  <div className="mt-4 pt-4 border-t border-white/5 font-mono text-xs">
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => { playHapticBeep(800, "sine"); setPackerIsLocal(true); }}
                        className={`flex-1 py-2 text-center rounded border text-[9px] font-bold uppercase transition-all ${packerIsLocal ? 'border-[#E82127] bg-[#E82127]/10 text-white' : 'border-white/5 text-slate-500'}`}
                      >
                        Within Vadodara
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { playHapticBeep(850, "sine"); setPackerIsLocal(false); }}
                        className={`flex-1 py-2 text-center rounded border text-[9px] font-bold uppercase transition-all ${!packerIsLocal ? 'border-[#E82127] bg-[#E82127]/10 text-white' : 'border-white/5 text-slate-500'}`}
                      >
                        Outstation Interstate
                      </button>
                    </div>

                    <div className="mt-4 flex justify-between items-center bg-[#121316] p-3 rounded-lg">
                      <span className="text-[10px] text-slate-500 uppercase font-black">Estimated Contract Tariff</span>
                      <strong className="text-emerald-400 text-sm">
                        ₹{Math.round(
                          PACKERS_SLIDES[packerSlideIdx].price * 
                          (packerPackingTier === 'ultra' ? 1.5 : packerPackingTier === 'premium' ? 1.25 : 1.0) + 
                          (packerIsLocal ? 0 : 8000)
                        ).toLocaleString('en-IN')}/-
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Shifting WhatsApp Signal trigger */}
              <button 
                onClick={() => handleWhatsAppBooking('packers')}
                className="w-full bg-[#E82127] hover:bg-[#ff2b32] text-white font-mono font-black text-xs py-3.5 rounded-xl uppercase tracking-widest mt-6 flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" /> Schedule This Relocation Contract
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#050608] border-t border-white/5 text-slate-500 py-16 font-mono text-[10px] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 pb-12 border-b border-white/5">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-[#E82127] p-2 rounded text-white">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">NEERAJ TRANSPORT</h3>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-sm text-[11px]">
                {t('footerText')} Makarpura GIDC Area, opposing Nirmal Hotel, Tarsali Bypass lines, Vadodara, Gujarat - 390014.
              </p>
              <div className="space-y-2 text-slate-400 text-xs font-bold">
                <p>HELPLINE_1: +91 63537 23567 (Neeraj Kumar Yadav)</p>
                <p>HELPLINE_2: +91 91200 07195 (All India dispatch terminal)</p>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <h4 className="text-white font-black uppercase text-xs tracking-wider mb-4">Official Verification Source Documents</h4>
                <div className="grid grid-cols-2 gap-4 text-slate-400 text-xs font-bold">
                  <div>
                    <p className="text-[#E82127]">Compliance File 1:</p>
                    <p className="text-slate-500 text-[10px]">"Neeraj Tempo Service Corporate Proposal.pdf"</p>
                  </div>
                  <div>
                    <p className="text-[#E82127]">Compliance File 2:</p>
                    <p className="text-slate-500 text-[10px]">"WhatsApp Image 2026-05-17 at 09.02.48.jpeg"</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#121316] p-4 rounded-xl border border-white/5 flex items-center gap-3 mt-6">
                <Shield className="h-5 w-5 text-[#E82127]" />
                <p className="text-slate-400 text-[9px] uppercase tracking-wider font-extrabold leading-relaxed">
                  All systems certified, insured, and verified. "With Trust, We Grow Together."
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-[9px] uppercase font-black text-slate-600 gap-4">
            <p>© {new Date().getFullYear()} Neeraj Transport. Verified compliance registries. All rights reserved.</p>
            <div className="flex gap-4">
              <span>UDYAM-GJ-24-0182950</span>
              <span>•</span>
              <span>GSTIN: 24IAMPK5306P1Z5</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d10]/95 backdrop-blur-md border-t border-white/5 p-3 flex sm:hidden gap-2 shadow-2xl justify-stretch">
        <a 
          href="tel:+916353723567" 
          onClick={() => playHapticBeep(1100, "sine")}
          className="flex-1 bg-[#E82127] text-white font-mono font-black py-3.5 px-2 rounded-xl text-center flex items-center justify-center gap-1 text-xs"
        >
          <Phone className="h-4 w-4 text-white animate-pulse" /> Call Dispatch Desk
        </a>
        <a 
          href="https://wa.me/916353723567" 
          onClick={() => playHapticBeep(1000, "sine")}
          className="flex-1 bg-emerald-600 text-white font-mono font-black py-3.5 px-2 rounded-xl text-center flex items-center justify-center gap-1 text-xs"
        >
          <MessageSquare className="h-4 w-4" /> Book WhatsApp
        </a>
      </div>

    </div>
  );
}