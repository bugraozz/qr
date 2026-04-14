export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  badge?: string
  isPopular?: boolean
}

export interface MenuCategory {
  id: string
  name: string
  icon: string
  image: string
  items: MenuItem[]
}

export const menuCategories: MenuCategory[] = [
  {
    id: "sicak-icecekler",
    name: "Sicak Icecekler",
    icon: "coffee",
    image: "/images/hot-drinks.jpg",
    items: [
      {
        id: "turk-kahvesi",
        name: "Turk Kahvesi",
        description: "Geleneksel yontemle pisirilmis, ince cekilmis ozel harman",
        price: 65,
        isPopular: true,
      },
      {
        id: "espresso",
        name: "Espresso",
        description: "Tek shot, yogun ve kremali espresso",
        price: 55,
      },
      {
        id: "double-espresso",
        name: "Double Espresso",
        description: "Cift shot espresso, ekstra yogun aroma",
        price: 70,
      },
      {
        id: "americano",
        name: "Americano",
        description: "Espresso ve sicak su, yumusak tat",
        price: 65,
      },
      {
        id: "latte",
        name: "Caffe Latte",
        description: "Espresso, buharla isitilmis sut ve ince sut kopugu",
        price: 80,
        isPopular: true,
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Espresso, sut ve yogun sut kopugu",
        price: 80,
      },
      {
        id: "flat-white",
        name: "Flat White",
        description: "Cift shot espresso ve kadifemsi sut",
        price: 85,
      },
      {
        id: "mocha",
        name: "Mocha",
        description: "Espresso, cikolata sosu ve buharlanmis sut",
        price: 90,
      },
      {
        id: "chai-latte",
        name: "Chai Latte",
        description: "Baharatli cay konsantresi ve kremali sut",
        price: 75,
      },
      {
        id: "sicak-cikolata",
        name: "Sicak Cikolata",
        description: "Belcika cikolatasi ile hazirlanan ozel recete",
        price: 85,
        badge: "Ozel",
      },
      {
        id: "cay",
        name: "Demlik Cay",
        description: "Rize'den ozel secilmis yapraklar, iki kisilik demlik",
        price: 40,
      },
      {
        id: "bitki-cayi",
        name: "Bitki Cayi",
        description: "Ihlamur, adacayi, papatya veya nane-limon",
        price: 50,
      },
      {
        id: "filtre-kahve",
        name: "Filtre Kahve",
        description: "Gunluk taze ogutulmus cekirdeklerle demlenir",
        price: 70,
        isPopular: true,
      },
    ],
  },
  {
    id: "soguk-icecekler",
    name: "Soguk Icecekler",
    icon: "glass-water",
    image: "/images/cold-drinks.jpg",
    items: [
      {
        id: "iced-latte",
        name: "Iced Latte",
        description: "Soguk sut, buz ve espresso shot",
        price: 90,
        isPopular: true,
      },
      {
        id: "iced-americano",
        name: "Iced Americano",
        description: "Buzlu su ve espresso, ferahlatici lezzet",
        price: 75,
      },
      {
        id: "cold-brew",
        name: "Cold Brew",
        description: "18 saat soguk demlenmis, puruzsuz ve aroma dolu",
        price: 95,
        badge: "Yeni",
      },
      {
        id: "frappe",
        name: "Frappe",
        description: "Buzlu, kopuklu ve serinletici kahve icecegi",
        price: 85,
      },
      {
        id: "iced-mocha",
        name: "Iced Mocha",
        description: "Buzlu espresso, cikolata ve soguk sut",
        price: 95,
      },
      {
        id: "limonata",
        name: "Ev Yapimi Limonata",
        description: "Taze sikilmis limon, nane ve bal",
        price: 60,
        isPopular: true,
      },
      {
        id: "smoothie",
        name: "Meyve Smoothie",
        description: "Mevsim meyveleri, yoğurt ve bal",
        price: 80,
      },
      {
        id: "buzlu-cay",
        name: "Buzlu Cay",
        description: "Seftali veya limon aromali, ev yapimi",
        price: 55,
      },
    ],
  },
  {
    id: "kahvalti",
    name: "Kahvalti",
    icon: "egg",
    image: "/images/breakfast.jpg",
    items: [
      {
        id: "serpme-kahvalti",
        name: "Serpme Kahvalti",
        description: "Peynir cesitleri, zeytin, bal, kaymak, recel, yumurta, simit ve taze ekmek (2 kisilik)",
        price: 320,
        isPopular: true,
        badge: "En Cok Satan",
      },
      {
        id: "kahvalti-tabagi",
        name: "Kahvalti Tabagi",
        description: "Beyaz peynir, kasar, zeytin, domates, salatalik, yumurta, bal ve ekmek",
        price: 180,
      },
      {
        id: "menemen",
        name: "Menemen",
        description: "Domates, biber ve yumurta ile geleneksel tarif, yaninda ekmek",
        price: 120,
        isPopular: true,
      },
      {
        id: "avocado-toast",
        name: "Avocado Toast",
        description: "Ezilmis avokado, cherry domates, feta ve eksi mayali ekmek",
        price: 140,
        badge: "Populer",
      },
      {
        id: "french-toast",
        name: "French Toast",
        description: "Tarifimize ozel, mevsim meyveleri, akca agac surubu ve krema",
        price: 130,
      },
      {
        id: "omlet",
        name: "Karisik Omlet",
        description: "Mantar, peynir, biber ve domates ile dolu omlet",
        price: 110,
      },
    ],
  },
  {
    id: "atistirmalik",
    name: "Atistirmaliklar",
    icon: "sandwich",
    image: "/images/snacks.jpg",
    items: [
      {
        id: "club-sandwich",
        name: "Club Sandwich",
        description: "Tavuk, pastirma, marul, domates ve mayonez, patates kizartmasi ile",
        price: 160,
        isPopular: true,
      },
      {
        id: "tost",
        name: "Karisik Tost",
        description: "Kasar, sucuk, domates ve biber ile cıtır tost",
        price: 90,
      },
      {
        id: "wrap",
        name: "Tavuklu Wrap",
        description: "Izgara tavuk, marul, domates, sos ve lavaş",
        price: 130,
      },
      {
        id: "salata",
        name: "Sezar Salata",
        description: "Marul, parmesan, kruton ve ozel sezar sosu ile",
        price: 120,
      },
      {
        id: "makarna",
        name: "Fettuccine Alfredo",
        description: "Kremali parmesan sosu ve mantar",
        price: 140,
      },
      {
        id: "patates",
        name: "Truffle Patates",
        description: "Citir patates, truffle yagi ve parmesan",
        price: 100,
        badge: "Favorimiz",
      },
    ],
  },
  {
    id: "tatlilar",
    name: "Tatlilar",
    icon: "cake",
    image: "/images/desserts.jpg",
    items: [
      {
        id: "tiramisu",
        name: "Tiramisu",
        description: "Klasik Italyan tarifi, mascarpone ve espresso ile",
        price: 120,
        isPopular: true,
      },
      {
        id: "cheesecake",
        name: "San Sebastian Cheesecake",
        description: "Kremali ve yanık yuzeylu, mevsim meyveleri ile",
        price: 130,
        isPopular: true,
        badge: "Imza",
      },
      {
        id: "brownie",
        name: "Sicak Brownie",
        description: "Cikolata parcali brownie, vanilya dondurmasi ile",
        price: 110,
      },
      {
        id: "sufle",
        name: "Cikolata Sufle",
        description: "Sicak akan cikolata, vanilya dondurmasi esliginde",
        price: 120,
        badge: "Ozel",
      },
      {
        id: "waffle",
        name: "Belcika Waffle",
        description: "Citir waffle, mevsim meyveleri, cikolata sosu ve krema",
        price: 110,
      },
      {
        id: "magnolia",
        name: "Magnolia",
        description: "Kremali puding, biskuvi tabani ve karamel sos",
        price: 90,
      },
      {
        id: "kunefe",
        name: "Kunefe",
        description: "Hatay usulu, antep fistigi ve kaymak ile",
        price: 140,
        isPopular: true,
      },
    ],
  },
]
