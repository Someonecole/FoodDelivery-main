"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "bg"

interface Translations {
  // Header
  foodDelivery: string
  // Food Menu
  heroTitle: string
  heroSubtitle: string
  noMealsFound: string
  noMealsHint: string
  // Filter Bar
  searchPlaceholder: string
  filters: string
  dietaryPreferences: string
  sortBy: string
  activeFilters: string
  clearAll: string
  // Dietary options
  vegetarian: string
  vegan: string
  glutenFree: string
  dairyFree: string
  spicy: string
  // Sort options
  mostPopular: string
  highestRated: string
  priceLowHigh: string
  priceHighLow: string
  // Food Card
  viewDetails: string
  addToCart: string
  min: string
  // Cart
  yourCart: string
  item: string
  items: string
  cartEmpty: string
  cartEmptyHint: string
  continueShopping: string
  total: string
  proceedToCheckout: string
  // Checkout
  checkout: string
  deliveryInformation: string
  fullName: string
  email: string
  phone: string
  deliveryAddress: string
  city: string
  zipCode: string
  orderSummary: string
  deliveryFee: string
  placeOrder: string
  cartEmptyCheckout: string
  browseMenu: string
  // Meal Detail
  ingredients: string
  nutritionInfo: string
  calories: string
  protein: string
  carbs: string
  fat: string
  quantity: string
  addToCartAndReturn: string
  backToMenu: string
  // Order Tracking
  trackingYourOrder: string
  orderId: string
  estimatedDelivery: string
  orderConfirmed: string
  preparing: string
  onTheWay: string
  delivered: string
  thankYou: string
  enjoyMeal: string
  orderDelivered: string
  orderDeliveredDesc: string
  backToHome: string
}

const translations: Record<Language, Translations> = {
  en: {
    foodDelivery: "Food Delivery",
    heroTitle: "Delicious Meals Delivered to Your Door",
    heroSubtitle: "Browse our menu and find your perfect meal",
    noMealsFound: "No meals found",
    noMealsHint: "Try adjusting your filters or search query",
    searchPlaceholder: "Search for meals...",
    filters: "Filters",
    dietaryPreferences: "Dietary Preferences",
    sortBy: "Sort By",
    activeFilters: "Active filters:",
    clearAll: "Clear all",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    dairyFree: "Dairy Free",
    spicy: "Spicy",
    mostPopular: "Most Popular",
    highestRated: "Highest Rated",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    viewDetails: "View Details",
    addToCart: "Add to Cart",
    min: "min",
    yourCart: "Your Cart",
    item: "item",
    items: "items",
    cartEmpty: "Your cart is empty",
    cartEmptyHint: "Add some delicious food to get started!",
    continueShopping: "Continue Shopping",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
    checkout: "Checkout",
    deliveryInformation: "Delivery Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    deliveryAddress: "Delivery Address",
    city: "City",
    zipCode: "ZIP Code",
    orderSummary: "Order Summary",
    deliveryFee: "Delivery Fee",
    placeOrder: "Place Order",
    cartEmptyCheckout: "Your cart is empty",
    browseMenu: "Browse Menu",
    ingredients: "Ingredients",
    nutritionInfo: "Nutrition Information",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    quantity: "Quantity",
    addToCartAndReturn: "Add to Cart & Return to Menu",
    backToMenu: "Back to Menu",
    trackingYourOrder: "Tracking Your Order",
    orderId: "Order ID",
    estimatedDelivery: "Estimated Delivery",
    orderConfirmed: "Order Confirmed",
    preparing: "Preparing",
    onTheWay: "On the Way",
    delivered: "Delivered",
    thankYou: "Thank you for your order!",
    enjoyMeal: "Enjoy your meal!",
    orderDelivered: "Order Delivered!",
    orderDeliveredDesc: "Your food has arrived. Enjoy your meal!",
    backToHome: "Back to Home",
  },
  bg: {
    foodDelivery: "Доставка на храна",
    heroTitle: "Вкусни ястия, доставени до вратата ви",
    heroSubtitle: "Разгледайте менюто и намерете перфектното ястие",
    noMealsFound: "Няма намерени ястия",
    noMealsHint: "Опитайте да промените филтрите или търсенето",
    searchPlaceholder: "Търсене на ястия...",
    filters: "Филтри",
    dietaryPreferences: "Хранителни предпочитания",
    sortBy: "Сортиране",
    activeFilters: "Активни филтри:",
    clearAll: "Изчисти всички",
    vegetarian: "Вегетарианско",
    vegan: "Веган",
    glutenFree: "Без глутен",
    dairyFree: "Без млечни",
    spicy: "Люто",
    mostPopular: "Най-популярни",
    highestRated: "Най-високо оценени",
    priceLowHigh: "Цена: ниска към висока",
    priceHighLow: "Цена: висока към ниска",
    viewDetails: "Виж детайли",
    addToCart: "Добави в кошница",
    min: "мин",
    yourCart: "Вашата кошница",
    item: "продукт",
    items: "продукта",
    cartEmpty: "Кошницата ви е празна",
    cartEmptyHint: "Добавете вкусна храна, за да започнете!",
    continueShopping: "Продължи пазаруването",
    total: "Общо",
    proceedToCheckout: "Към плащане",
    checkout: "Плащане",
    deliveryInformation: "Информация за доставка",
    fullName: "Пълно име",
    email: "Имейл",
    phone: "Телефонен номер",
    deliveryAddress: "Адрес за доставка",
    city: "Град",
    zipCode: "Пощенски код",
    orderSummary: "Обобщение на поръчката",
    deliveryFee: "Такса доставка",
    placeOrder: "Поръчай",
    cartEmptyCheckout: "Кошницата ви е празна",
    browseMenu: "Разгледай менюто",
    ingredients: "Съставки",
    nutritionInfo: "Хранителна информация",
    calories: "Калории",
    protein: "Протеин",
    carbs: "Въглехидрати",
    fat: "Мазнини",
    quantity: "Количество",
    addToCartAndReturn: "Добави в кошница и се върни",
    backToMenu: "Обратно към менюто",
    trackingYourOrder: "Проследяване на поръчката",
    orderId: "Номер на поръчка",
    estimatedDelivery: "Очаквана доставка",
    orderConfirmed: "Поръчката потвърдена",
    preparing: "Приготвяне",
    onTheWay: "В пътя",
    delivered: "Доставена",
    thankYou: "Благодарим за поръчката!",
    enjoyMeal: "Приятно хранене!",
    orderDelivered: "Поръчката е доставена!",
    orderDeliveredDesc: "Храната ви пристигна. Приятно хранене!",
    backToHome: "Към началото",
  },
}

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bg")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "bg" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
