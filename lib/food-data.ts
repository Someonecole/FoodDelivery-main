export type DietaryFilter = "vegetarian" | "vegan" | "gluten-free" | "dairy-free" | "spicy"
export type SortOption = "popular" | "rating" | "price-low" | "price-high"

export interface FoodProduct {
  id: string
  name: string
  description: string
  longDescription: string
  ingredients: string[]
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  prepTime: number
  dietary: DietaryFilter[]
}

export const foodProducts: FoodProduct[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella, tomato sauce, and basil",
    longDescription: "Our Margherita Pizza is a timeless classic that pays homage to the original Neapolitan tradition. Hand-stretched dough is topped with San Marzano tomato sauce, fresh buffalo mozzarella, fragrant basil leaves, and a drizzle of extra virgin olive oil. Baked to perfection in our stone oven, this pizza delivers an authentic Italian experience with every bite.",
    ingredients: ["Pizza dough", "San Marzano tomatoes", "Fresh buffalo mozzarella", "Fresh basil", "Extra virgin olive oil", "Sea salt", "Garlic"],
    nutritionInfo: { calories: 850, protein: 32, carbs: 98, fat: 36 },
    price: 14.99,
    image: "/margherita-pizza-with-fresh-basil.jpg",
    category: "Pizza",
    rating: 4.8,
    reviews: 245,
    prepTime: 25,
    dietary: ["vegetarian"],
  },
  {
    id: "2",
    name: "Spicy Thai Green Curry",
    description: "Aromatic green curry with vegetables, coconut milk, and jasmine rice",
    longDescription: "Transport your taste buds to Thailand with our authentic Green Curry. This aromatic dish features a homemade green curry paste simmered in rich coconut milk with tender vegetables, Thai eggplant, and bamboo shoots. Served over fragrant jasmine rice, it offers the perfect balance of heat, sweetness, and herbaceous flavors that Thai cuisine is famous for.",
    ingredients: ["Coconut milk", "Green curry paste", "Thai eggplant", "Bamboo shoots", "Bell peppers", "Thai basil", "Jasmine rice", "Kaffir lime leaves", "Fish sauce", "Palm sugar"],
    nutritionInfo: { calories: 680, protein: 14, carbs: 72, fat: 38 },
    price: 16.99,
    image: "/thai-green-curry-in-bowl.jpg",
    category: "Thai",
    rating: 4.7,
    reviews: 189,
    prepTime: 30,
    dietary: ["vegan", "gluten-free", "dairy-free", "spicy"],
  },
  {
    id: "3",
    name: "Classic Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and special sauce",
    longDescription: "Our signature Classic Beef Burger features a half-pound of premium ground beef, seasoned and grilled to your preferred doneness. Nestled in a toasted brioche bun with crisp lettuce, ripe tomato, red onion, pickles, and our house-made special sauce. This burger is a true American classic that never disappoints.",
    ingredients: ["Premium ground beef", "Brioche bun", "Lettuce", "Tomato", "Red onion", "Pickles", "Special sauce", "American cheese", "Butter"],
    nutritionInfo: { calories: 920, protein: 48, carbs: 52, fat: 58 },
    price: 12.99,
    image: "/gourmet-beef-burger-with-toppings.jpg",
    category: "Burgers",
    rating: 4.9,
    reviews: 412,
    prepTime: 20,
    dietary: [],
  },

  {
    id: "5",
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast, romaine lettuce, parmesan, and Caesar dressing",
    longDescription: "A timeless favorite, our Chicken Caesar Salad features tender grilled chicken breast sliced over crisp romaine lettuce hearts. Tossed with our house-made Caesar dressing, shaved Parmesan cheese, and golden garlic croutons. Each bite delivers the perfect combination of creamy, savory, and crunchy textures.",
    ingredients: ["Grilled chicken breast", "Romaine lettuce", "Parmesan cheese", "Caesar dressing", "Garlic croutons", "Lemon", "Black pepper", "Anchovy paste"],
    nutritionInfo: { calories: 480, protein: 42, carbs: 18, fat: 28 },
    price: 11.99,
    image: "/chicken-caesar-salad-plate.jpg",
    category: "Salads",
    rating: 4.5,
    reviews: 203,
    prepTime: 15,
    dietary: ["gluten-free"],
  },
  {
    id: "6",
    name: "Spicy Szechuan Noodles",
    description: "Stir-fried noodles with vegetables in spicy Szechuan sauce",
    longDescription: "Experience the bold flavors of Sichuan province with our Spicy Szechuan Noodles. Chewy wheat noodles are wok-tossed with crisp vegetables, garlic, and ginger in our signature Szechuan sauce featuring the famous numbing spice of Sichuan peppercorns. Topped with scallions and sesame seeds for an authentic Chinese experience.",
    ingredients: ["Wheat noodles", "Bok choy", "Bell peppers", "Szechuan peppercorns", "Chili oil", "Garlic", "Ginger", "Soy sauce", "Scallions", "Sesame seeds"],
    nutritionInfo: { calories: 620, protein: 16, carbs: 82, fat: 24 },
    price: 14.49,
    image: "/spicy-szechuan-noodles-in-bowl.jpg",
    category: "Chinese",
    rating: 4.7,
    reviews: 178,
    prepTime: 22,
    dietary: ["vegan", "vegetarian", "dairy-free", "spicy"],
  },
  {
    id: "7",
    name: "Grilled Salmon Bowl",
    description: "Fresh Atlantic salmon with brown rice, edamame, and teriyaki glaze",
    longDescription: "Indulge in our Grilled Salmon Bowl, featuring a generous portion of fresh Atlantic salmon fillet, perfectly grilled and glazed with our house-made teriyaki sauce. Served over nutty brown rice with steamed edamame, pickled ginger, cucumber ribbons, and a sprinkle of furikake. A healthy and satisfying meal that's rich in omega-3s.",
    ingredients: ["Atlantic salmon", "Brown rice", "Edamame", "Teriyaki sauce", "Pickled ginger", "Cucumber", "Furikake", "Sesame oil", "Green onions", "Nori"],
    nutritionInfo: { calories: 720, protein: 52, carbs: 58, fat: 32 },
    price: 18.99,
    image: "/grilled-salmon-rice-bowl.jpg",
    category: "Seafood",
    rating: 4.9,
    reviews: 267,
    prepTime: 28,
    dietary: ["gluten-free", "dairy-free"],
  },
  {
    id: "8",
    name: "Falafel Wrap",
    description: "Crispy falafel with hummus, tahini, fresh vegetables in pita bread",
    longDescription: "Our Falafel Wrap is a Mediterranean delight featuring freshly made, crispy-on-the-outside, tender-on-the-inside falafel balls. Wrapped in warm pita bread with creamy hummus, tangy tahini sauce, crunchy pickled turnips, fresh tomatoes, cucumbers, and a medley of fresh herbs. A satisfying plant-based meal packed with protein and flavor.",
    ingredients: ["Chickpeas", "Fresh herbs", "Pita bread", "Hummus", "Tahini", "Tomatoes", "Cucumbers", "Pickled turnips", "Red onion", "Parsley", "Garlic"],
    nutritionInfo: { calories: 520, protein: 18, carbs: 62, fat: 24 },
    price: 10.99,
    image: "/falafel-wrap-with-vegetables.jpg",
    category: "Mediterranean",
    rating: 4.6,
    reviews: 198,
    prepTime: 18,
    dietary: ["vegan", "vegetarian", "dairy-free"],
  },
  {
    id: "9",
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms and parmesan cheese",
    longDescription: "Our Mushroom Risotto is Italian comfort food at its finest. Arborio rice is slowly cooked to creamy perfection with a medley of wild mushrooms including porcini, cremini, and shiitake. Finished with aged Parmesan cheese, a touch of truffle oil, and fresh thyme. Each spoonful delivers the rich, earthy flavors that make this dish a timeless favorite.",
    ingredients: ["Arborio rice", "Porcini mushrooms", "Cremini mushrooms", "Shiitake mushrooms", "Parmesan cheese", "White wine", "Vegetable stock", "Butter", "Shallots", "Truffle oil", "Fresh thyme"],
    nutritionInfo: { calories: 680, protein: 18, carbs: 78, fat: 32 },
    price: 15.99,
    image: "/creamy-mushroom-risotto.jpg",
    category: "Italian",
    rating: 4.8,
    reviews: 223,
    prepTime: 35,
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "10",
    name: "Korean BBQ Tacos",
    description: "Marinated beef bulgogi with kimchi slaw in soft tortillas",
    longDescription: "A fusion sensation, our Korean BBQ Tacos bring together the best of Korean and Mexican cuisines. Tender beef bulgogi, marinated in our sweet and savory Korean sauce, is grilled to perfection and nestled in warm flour tortillas. Topped with tangy kimchi slaw, fresh cilantro, and a drizzle of sriracha mayo for the ultimate flavor explosion.",
    ingredients: ["Beef bulgogi", "Flour tortillas", "Kimchi", "Cabbage slaw", "Cilantro", "Sriracha mayo", "Sesame seeds", "Green onions", "Gochujang", "Soy sauce"],
    nutritionInfo: { calories: 580, protein: 32, carbs: 48, fat: 28 },
    price: 13.49,
    image: "/korean-bbq-tacos.jpg",
    category: "Fusion",
    rating: 4.8,
    reviews: 341,
    prepTime: 20,
    dietary: ["dairy-free", "spicy"],
  },
  {
    id: "11",
    name: "Pad Thai",
    description: "Classic Thai stir-fried rice noodles with tofu, peanuts, and lime",
    longDescription: "Our Pad Thai is a beloved Thai street food classic. Silky rice noodles are wok-fried with golden tofu, bean sprouts, and eggs in our authentic tamarind-based sauce. Garnished with crushed roasted peanuts, fresh lime wedges, and chili flakes on the side. The perfect balance of sweet, sour, and savory flavors in every bite.",
    ingredients: ["Rice noodles", "Tofu", "Eggs", "Bean sprouts", "Tamarind paste", "Fish sauce", "Palm sugar", "Crushed peanuts", "Lime", "Chili flakes", "Green onions"],
    nutritionInfo: { calories: 640, protein: 22, carbs: 76, fat: 28 },
    price: 14.99,
    image: "/pad-thai-noodles-with-peanuts.jpg",
    category: "Thai",
    rating: 4.7,
    reviews: 289,
    prepTime: 25,
    dietary: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
  },
  {
    id: "12",
    name: "Mediterranean Platter",
    description: "Hummus, baba ganoush, falafel, olives, and warm pita bread",
    longDescription: "Experience the vibrant flavors of the Mediterranean with our generous sharing platter. Featuring silky smooth hummus, smoky baba ganoush, crispy homemade falafel, marinated olives, stuffed grape leaves, and tangy pickled vegetables. Served with warm, pillowy pita bread for dipping. Perfect for sharing or enjoying as a complete meal.",
    ingredients: ["Hummus", "Baba ganoush", "Falafel", "Kalamata olives", "Stuffed grape leaves", "Pickled vegetables", "Pita bread", "Olive oil", "Za'atar", "Fresh mint"],
    nutritionInfo: { calories: 780, protein: 24, carbs: 82, fat: 42 },
    price: 16.49,
    image: "/mediterranean-mezze.png",
    category: "Mediterranean",
    rating: 4.9,
    reviews: 176,
    prepTime: 15,
    dietary: ["vegan", "vegetarian", "dairy-free"],
  },
]
