import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { Breadcrumb } from "@/components/Breadcrumb"
import { RepairRequestForm } from "@/components/RepairRequestForm"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Icon from "@/components/ui/icon"
import { ChevronDown, AlertCircle } from "lucide-react"

interface Service { name: string; price: number; time?: string }
interface Model { name: string; services: Service[] }
interface Brand { brand: string; icon: string; color: string; models: Model[] }

const OTHER_BRAND: Brand = {
  brand: "Другое",
  icon: "Smartphone",
  color: "bg-gray-100 text-gray-600",
  models: [
    { name: "Другое устройство / Другая модель", services: [
      { name: "Диагностика устройства", price: 0, time: "30 мин" },
      { name: "Замена экрана", price: 2490, time: "1-2 ч" },
      { name: "Замена аккумулятора", price: 1490, time: "30 мин" },
      { name: "Ремонт разъёма зарядки", price: 1290, time: "1 ч" },
      { name: "Восстановление после воды", price: 2990, time: "1-2 д" },
      { name: "Замена камеры", price: 1990, time: "1-2 ч" },
      { name: "Замена задней крышки", price: 990, time: "30 мин" },
      { name: "Ремонт кнопок", price: 890, time: "30 мин" },
      { name: "Замена динамика / микрофона", price: 1190, time: "1 ч" },
      { name: "Пайка материнской платы", price: 3990, time: "1-3 д" },
      { name: "Восстановление данных", price: 2490, time: "1-3 д" },
    ]}
  ]
}

const catalog: Brand[] = [
  {
    brand: "iPhone",
    icon: "Smartphone",
    color: "bg-gray-900 text-white",
    models: [
      { name: "iPhone 16 Pro Max", services: [
        { name: "Замена дисплея OLED", price: 11990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 3990, time: "30-60 мин" },
        { name: "Замена задней панели", price: 5990, time: "2-3 ч" },
        { name: "Замена камеры (основной блок)", price: 7990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 2990, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 4990, time: "1-2 д" },
        { name: "Замена Face ID модуля", price: 8990, time: "2-3 д" },
        { name: "Замена SIM-лотка", price: 890, time: "15 мин" },
        { name: "Ремонт кнопок Action/Power", price: 2490, time: "1-2 ч" },
        { name: "Пайка материнской платы", price: 6990, time: "2-5 д" },
      ]},
      { name: "iPhone 16 Pro", services: [
        { name: "Замена дисплея OLED", price: 10990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 3490, time: "30-60 мин" },
        { name: "Замена задней панели", price: 5490, time: "2-3 ч" },
        { name: "Замена камеры", price: 6990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 2490, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 4490, time: "1-2 д" },
        { name: "Пайка материнской платы", price: 5990, time: "2-5 д" },
      ]},
      { name: "iPhone 16 / 16 Plus", services: [
        { name: "Замена дисплея OLED", price: 8990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2990, time: "30 мин" },
        { name: "Замена задней крышки", price: 4490, time: "1-2 ч" },
        { name: "Замена камеры", price: 5490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1990, time: "1 ч" },
        { name: "Восстановление после воды", price: 3990, time: "1-2 д" },
      ]},
      { name: "iPhone 15 Pro Max", services: [
        { name: "Замена дисплея OLED", price: 9990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 3490, time: "30-60 мин" },
        { name: "Замена задней крышки", price: 4990, time: "2-3 ч" },
        { name: "Замена камеры", price: 6490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 2490, time: "1 ч" },
        { name: "Восстановление после воды", price: 4490, time: "1-2 д" },
        { name: "Пайка материнской платы", price: 5990, time: "2-5 д" },
      ]},
      { name: "iPhone 15 Pro", services: [
        { name: "Замена дисплея OLED", price: 8990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2990, time: "30 мин" },
        { name: "Замена задней крышки", price: 4490, time: "2-3 ч" },
        { name: "Замена камеры", price: 5990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1990, time: "1 ч" },
        { name: "Восстановление после воды", price: 3990, time: "1-2 д" },
      ]},
      { name: "iPhone 15 / 15 Plus", services: [
        { name: "Замена дисплея OLED", price: 7490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2490, time: "30 мин" },
        { name: "Замена задней крышки", price: 3990, time: "1-2 ч" },
        { name: "Замена камеры", price: 4990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1790, time: "1 ч" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
      { name: "iPhone 14 Pro Max", services: [
        { name: "Замена дисплея OLED", price: 7990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2490, time: "30 мин" },
        { name: "Замена задней крышки", price: 4490, time: "2-3 ч" },
        { name: "Замена камеры", price: 5490, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 1990, time: "1 ч" },
        { name: "Восстановление после воды", price: 3990, time: "1-2 д" },
      ]},
      { name: "iPhone 14 Pro", services: [
        { name: "Замена дисплея OLED", price: 6990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2290, time: "30 мин" },
        { name: "Замена задней крышки", price: 3990, time: "2-3 ч" },
        { name: "Замена камеры", price: 4990, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 1790, time: "1 ч" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
      { name: "iPhone 14 / 14 Plus", services: [
        { name: "Замена дисплея OLED", price: 5990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1990, time: "30 мин" },
        { name: "Замена задней крышки", price: 2990, time: "1-2 ч" },
        { name: "Замена камеры", price: 3990, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 1490, time: "1 ч" },
        { name: "Восстановление после воды", price: 2990, time: "1-2 д" },
      ]},
      { name: "iPhone 13 Pro Max", services: [
        { name: "Замена дисплея OLED", price: 5490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1790, time: "30 мин" },
        { name: "Замена задней крышки", price: 2490, time: "1-2 ч" },
        { name: "Замена камеры", price: 3490, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 1290, time: "1 ч" },
        { name: "Восстановление после воды", price: 2790, time: "1-2 д" },
      ]},
      { name: "iPhone 13 / 13 Pro / mini", services: [
        { name: "Замена дисплея OLED", price: 4490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1490, time: "30 мин" },
        { name: "Замена задней крышки", price: 1990, time: "1-2 ч" },
        { name: "Замена камеры", price: 2990, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 1090, time: "1 ч" },
        { name: "Восстановление после воды", price: 2490, time: "1-2 д" },
      ]},
      { name: "iPhone 12 Pro Max", services: [
        { name: "Замена дисплея OLED", price: 3990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1490, time: "30 мин" },
        { name: "Замена задней крышки", price: 1790, time: "1-2 ч" },
        { name: "Замена камеры", price: 2790, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 990, time: "1 ч" },
        { name: "Восстановление после воды", price: 2290, time: "1-2 д" },
      ]},
      { name: "iPhone 12 / 12 Pro / mini", services: [
        { name: "Замена дисплея OLED", price: 3490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1290, time: "30 мин" },
        { name: "Замена задней крышки", price: 1590, time: "1-2 ч" },
        { name: "Замена камеры", price: 2490, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 890, time: "1 ч" },
        { name: "Восстановление после воды", price: 1990, time: "1-2 д" },
      ]},
      { name: "iPhone 11 Pro Max", services: [
        { name: "Замена дисплея OLED", price: 2990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1190, time: "30 мин" },
        { name: "Замена камеры", price: 2290, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 790, time: "1 ч" },
        { name: "Восстановление после воды", price: 1790, time: "1-2 д" },
      ]},
      { name: "iPhone 11 / 11 Pro", services: [
        { name: "Замена дисплея LCD/OLED", price: 2490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 990, time: "30 мин" },
        { name: "Замена камеры", price: 1990, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 690, time: "1 ч" },
        { name: "Восстановление после воды", price: 1590, time: "1-2 д" },
      ]},
      { name: "iPhone XS Max / XR / X", services: [
        { name: "Замена дисплея OLED/LCD", price: 2290, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 990, time: "30 мин" },
        { name: "Замена камеры", price: 1790, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 690, time: "1 ч" },
        { name: "Восстановление после воды", price: 1490, time: "1-2 д" },
      ]},
      { name: "iPhone SE (2022/2020)", services: [
        { name: "Замена дисплея LCD", price: 1990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 890, time: "30 мин" },
        { name: "Замена камеры", price: 1490, time: "1-2 ч" },
        { name: "Ремонт разъёма Lightning", price: 590, time: "1 ч" },
      ]},
    ],
  },
  {
    brand: "Samsung",
    icon: "Smartphone",
    color: "bg-blue-600 text-white",
    models: [
      { name: "Galaxy S25 Ultra", services: [
        { name: "Замена дисплея AMOLED", price: 16990, time: "2-3 ч" },
        { name: "Замена аккумулятора", price: 3490, time: "1 ч" },
        { name: "Замена камеры", price: 6990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 2490, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 4990, time: "1-2 д" },
        { name: "Замена задней крышки", price: 3990, time: "1-2 ч" },
        { name: "Замена S Pen", price: 1990, time: "15 мин" },
      ]},
      { name: "Galaxy S25 / S25+", services: [
        { name: "Замена дисплея AMOLED", price: 10990, time: "2-3 ч" },
        { name: "Замена аккумулятора", price: 2790, time: "1 ч" },
        { name: "Замена камеры", price: 4990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1990, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3990, time: "1-2 д" },
      ]},
      { name: "Galaxy S24 Ultra", services: [
        { name: "Замена дисплея AMOLED", price: 14990, time: "2-3 ч" },
        { name: "Замена аккумулятора", price: 3290, time: "1 ч" },
        { name: "Замена камеры", price: 6490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 2290, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 4490, time: "1-2 д" },
      ]},
      { name: "Galaxy S24 / S24+", services: [
        { name: "Замена дисплея AMOLED", price: 9490, time: "2-3 ч" },
        { name: "Замена аккумулятора", price: 2490, time: "1 ч" },
        { name: "Замена камеры", price: 4490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1790, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
      { name: "Galaxy S23 / S23+", services: [
        { name: "Замена дисплея AMOLED", price: 8490, time: "2-3 ч" },
        { name: "Замена аккумулятора", price: 2190, time: "1 ч" },
        { name: "Замена камеры", price: 3990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1490, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 2990, time: "1-2 д" },
      ]},
      { name: "Galaxy A55 / A54 / A53", services: [
        { name: "Замена дисплея AMOLED", price: 4490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1490, time: "1 ч" },
        { name: "Замена камеры", price: 2490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 990, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 2190, time: "1-2 д" },
      ]},
      { name: "Galaxy A35 / A34 / A33", services: [
        { name: "Замена дисплея", price: 3490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1290, time: "1 ч" },
        { name: "Замена камеры", price: 1990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 890, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 1990, time: "1-2 д" },
      ]},
      { name: "Galaxy A25 / A15 / A05", services: [
        { name: "Замена дисплея", price: 2490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 990, time: "30 мин" },
        { name: "Замена камеры", price: 1490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 690, time: "1 ч" },
      ]},
      { name: "Galaxy Z Fold 5 / Fold 6", services: [
        { name: "Замена внутреннего экрана", price: 27990, time: "3-5 д" },
        { name: "Замена внешнего экрана", price: 8990, time: "2-3 ч" },
        { name: "Замена аккумулятора", price: 4490, time: "2-3 ч" },
        { name: "Ремонт петли шарнира", price: 8990, time: "2-3 д" },
        { name: "Восстановление после воды", price: 5990, time: "1-3 д" },
      ]},
      { name: "Galaxy Z Flip 5 / Flip 6", services: [
        { name: "Замена внутреннего экрана", price: 19990, time: "3-5 д" },
        { name: "Замена внешнего экрана", price: 4990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 3490, time: "2-3 ч" },
        { name: "Ремонт петли шарнира", price: 6990, time: "2-3 д" },
      ]},
      { name: "Galaxy Note 20 Ultra / 10+", services: [
        { name: "Замена дисплея AMOLED", price: 6990, time: "2-3 ч" },
        { name: "Замена аккумулятора", price: 1990, time: "1 ч" },
        { name: "Замена S Pen / стилуса", price: 1490, time: "15 мин" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
    ],
  },
  {
    brand: "Xiaomi / Redmi / POCO",
    icon: "Smartphone",
    color: "bg-orange-500 text-white",
    models: [
      { name: "Xiaomi 15 / 15 Pro", services: [
        { name: "Замена дисплея AMOLED", price: 8490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2490, time: "1 ч" },
        { name: "Замена камеры", price: 4990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1490, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
      { name: "Xiaomi 14 Ultra", services: [
        { name: "Замена дисплея AMOLED", price: 9990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2490, time: "1 ч" },
        { name: "Замена камеры Leica", price: 5490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1590, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3790, time: "1-2 д" },
      ]},
      { name: "Xiaomi 14 / 13 / 12", services: [
        { name: "Замена дисплея AMOLED", price: 6990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1990, time: "1 ч" },
        { name: "Замена камеры", price: 3990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1290, time: "1 ч" },
        { name: "Восстановление после воды", price: 2990, time: "1-2 д" },
      ]},
      { name: "Redmi Note 13 Pro+ / Pro", services: [
        { name: "Замена дисплея AMOLED", price: 3990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1390, time: "30 мин" },
        { name: "Замена камеры", price: 2490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 990, time: "1 ч" },
        { name: "Восстановление после воды", price: 2190, time: "1-2 д" },
      ]},
      { name: "Redmi Note 13 / 12 / 11", services: [
        { name: "Замена дисплея AMOLED", price: 2990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1190, time: "30 мин" },
        { name: "Замена камеры", price: 1990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 790, time: "1 ч" },
        { name: "Восстановление после воды", price: 1790, time: "1-2 д" },
      ]},
      { name: "Redmi 13C / 13 / 12", services: [
        { name: "Замена дисплея", price: 1990, time: "1 ч" },
        { name: "Замена аккумулятора", price: 990, time: "30 мин" },
        { name: "Замена камеры", price: 1490, time: "1 ч" },
        { name: "Ремонт разъёма USB-C", price: 590, time: "1 ч" },
      ]},
      { name: "POCO X6 Pro / F6 Pro", services: [
        { name: "Замена дисплея AMOLED", price: 4490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1690, time: "1 ч" },
        { name: "Замена камеры", price: 2990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1090, time: "1 ч" },
        { name: "Восстановление после воды", price: 2490, time: "1-2 д" },
      ]},
      { name: "POCO M6 / M5 / C55", services: [
        { name: "Замена дисплея", price: 2490, time: "1 ч" },
        { name: "Замена аккумулятора", price: 1190, time: "30 мин" },
        { name: "Замена камеры", price: 1590, time: "1 ч" },
        { name: "Ремонт разъёма USB-C", price: 790, time: "1 ч" },
      ]},
    ],
  },
  {
    brand: "Huawei / Honor",
    icon: "Smartphone",
    color: "bg-red-600 text-white",
    models: [
      { name: "Huawei P60 Pro / P50 Pro", services: [
        { name: "Замена дисплея OLED", price: 8990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2490, time: "1 ч" },
        { name: "Замена камеры", price: 4490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1490, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
      { name: "Huawei Nova 11 / 10 / 9", services: [
        { name: "Замена дисплея OLED", price: 3990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1490, time: "1 ч" },
        { name: "Замена камеры", price: 2490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 990, time: "1 ч" },
      ]},
      { name: "Honor 200 Pro / 90 Pro", services: [
        { name: "Замена дисплея AMOLED", price: 4990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1690, time: "1 ч" },
        { name: "Замена камеры", price: 2990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1090, time: "1 ч" },
      ]},
      { name: "Honor X8b / X7b / X6b", services: [
        { name: "Замена дисплея", price: 2490, time: "1 ч" },
        { name: "Замена аккумулятора", price: 990, time: "30 мин" },
        { name: "Замена камеры", price: 1490, time: "1 ч" },
        { name: "Ремонт разъёма USB-C", price: 690, time: "1 ч" },
      ]},
    ],
  },
  {
    brand: "OPPO / OnePlus / Realme",
    icon: "Smartphone",
    color: "bg-green-600 text-white",
    models: [
      { name: "OnePlus 12 / 11 / 10 Pro", services: [
        { name: "Замена дисплея AMOLED", price: 7490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2290, time: "1 ч" },
        { name: "Замена камеры", price: 3990, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1490, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
      { name: "OPPO Reno 12 Pro / 11 Pro", services: [
        { name: "Замена дисплея AMOLED", price: 4490, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1490, time: "1 ч" },
        { name: "Замена камеры", price: 2490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 990, time: "1 ч" },
      ]},
      { name: "Realme 12 Pro+ / GT 6T", services: [
        { name: "Замена дисплея AMOLED", price: 3990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1290, time: "1 ч" },
        { name: "Замена камеры", price: 2190, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 890, time: "1 ч" },
      ]},
    ],
  },
  {
    brand: "Google Pixel",
    icon: "Smartphone",
    color: "bg-teal-600 text-white",
    models: [
      { name: "Pixel 9 Pro / 9 Pro XL", services: [
        { name: "Замена дисплея OLED", price: 9990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2990, time: "1 ч" },
        { name: "Замена камеры", price: 5490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1990, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3990, time: "1-2 д" },
      ]},
      { name: "Pixel 9 / Pixel 8 Pro", services: [
        { name: "Замена дисплея OLED", price: 7990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 2490, time: "1 ч" },
        { name: "Замена камеры", price: 4490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1690, time: "1-2 ч" },
        { name: "Восстановление после воды", price: 3490, time: "1-2 д" },
      ]},
      { name: "Pixel 7a / 7 / 6a", services: [
        { name: "Замена дисплея OLED", price: 5990, time: "1-2 ч" },
        { name: "Замена аккумулятора", price: 1990, time: "1 ч" },
        { name: "Замена камеры", price: 3490, time: "1-2 ч" },
        { name: "Ремонт разъёма USB-C", price: 1290, time: "1 ч" },
      ]},
    ],
  },
  OTHER_BRAND,
]

const commonIssues = [
  { icon: "📱", issue: "Треснул экран", from: 1990, time: "от 30 мин" },
  { icon: "🔋", issue: "Быстро садится батарея", from: 890, time: "30 мин" },
  { icon: "💧", issue: "Попала вода", from: 1490, time: "1-2 дня" },
  { icon: "📸", issue: "Не работает камера", from: 1490, time: "1-2 ч" },
  { icon: "🔌", issue: "Не заряжается", from: 590, time: "30-60 мин" },
  { icon: "🔇", issue: "Нет звука", from: 890, time: "1 ч" },
  { icon: "📡", issue: "Нет сети / Wi-Fi", from: 1990, time: "1-3 ч" },
  { icon: "🔑", issue: "Не работает кнопка", from: 590, time: "30 мин" },
]

export default function CalculatorPage() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [modelOpen, setModelOpen] = useState(false)

  const handleBrand = (b: Brand) => {
    setSelectedBrand(b)
    setSelectedModel(null)
    setSelectedService(null)
    setModelOpen(false)
  }

  const handleModel = (m: Model) => {
    setSelectedModel(m)
    setSelectedService(null)
    setModelOpen(false)
  }

  const handleService = (s: Service) => {
    setSelectedService(s)
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Калькулятор стоимости ремонта — iPro Барнаул"
        description="Рассчитайте стоимость ремонта iPhone, Samsung, Xiaomi и других смартфонов онлайн. Актуальные цены по Барнаулу."
      />
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-14 px-6">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[{ label: "Калькулятор ремонта" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Калькулятор стоимости ремонта
              </h1>
              <p className="text-gray-500 mt-3 text-lg">
                Выберите устройство и услугу — получите точную цену за секунды
              </p>
            </motion.div>
          </div>
        </section>

        {/* Популярные поломки */}
        <section className="bg-gray-50 py-8 px-6 border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Частые поломки и стоимость</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {commonIssues.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-sm font-semibold text-gray-800">{item.issue}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">от {item.from.toLocaleString("ru")} ₽</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">
              {/* Left: configurator */}
              <div>
                {/* Step 1: Brand */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="font-semibold text-gray-900">Выберите бренд</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {catalog.map((b) => (
                      <button
                        key={b.brand}
                        onClick={() => handleBrand(b)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-2xl border-2 text-sm font-medium transition-all text-left ${
                          selectedBrand?.brand === b.brand
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Icon name={b.icon} size={16} className="shrink-0" />
                        <span className="truncate">{b.brand}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Model */}
                <AnimatePresence>
                  {selectedBrand && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                        <h2 className="font-semibold text-gray-900">Выберите модель</h2>
                      </div>
                      {/* Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setModelOpen(!modelOpen)}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-sm text-gray-700 hover:border-blue-300 transition-all"
                        >
                          <span>{selectedModel?.name || "Выберите модель..."}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${modelOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {modelOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="absolute z-20 top-full mt-1 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-72 overflow-y-auto"
                            >
                              {selectedBrand.models.map((m) => (
                                <button
                                  key={m.name}
                                  onClick={() => handleModel(m)}
                                  className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                                    selectedModel?.name === m.name ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                  }`}
                                >
                                  {m.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Services */}
                <AnimatePresence>
                  {selectedModel && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                        <h2 className="font-semibold text-gray-900">Выберите услугу</h2>
                      </div>
                      <div className="flex flex-col gap-2">
                        {selectedModel.services.map((s) => (
                          <button
                            key={s.name}
                            onClick={() => handleService(s)}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-sm transition-all text-left ${
                              selectedService?.name === s.name
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <div>
                              <p className={`font-medium ${selectedService?.name === s.name ? "text-blue-700" : "text-gray-800"}`}>{s.name}</p>
                              {s.time && <p className="text-xs text-gray-400 mt-0.5">⏱ {s.time}</p>}
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              {s.price === 0 ? (
                                <span className="text-green-600 font-bold text-sm">Бесплатно</span>
                              ) : (
                                <span className={`font-bold ${selectedService?.name === s.name ? "text-blue-600" : "text-gray-900"}`}>
                                  от {s.price.toLocaleString("ru")} ₽
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Summary + Form */}
              <div className="lg:sticky lg:top-24 self-start">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Summary */}
                  <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <p className="text-blue-100 text-sm mb-1">Итого</p>
                    {selectedService ? (
                      <>
                        <p className="text-3xl font-bold mb-1">
                          {selectedService.price === 0 ? "Бесплатно" : `от ${selectedService.price.toLocaleString("ru")} ₽`}
                        </p>
                        <p className="text-blue-100 text-sm">{selectedBrand?.brand} {selectedModel?.name}</p>
                        <p className="text-white/90 text-sm font-medium">{selectedService.name}</p>
                        {selectedService.time && (
                          <p className="text-blue-200 text-xs mt-1">⏱ Время: {selectedService.time}</p>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-blue-100">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm">Выберите устройство и услугу</p>
                      </div>
                    )}
                  </div>

                  {/* Guarantees */}
                  <div className="flex border-b border-gray-100">
                    {[
                      { icon: "✓", text: "Гарантия 90 дней" },
                      { icon: "🚗", text: "Бесплатная доставка" },
                      { icon: "🎁", text: "5% бонусами" },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center text-center py-3 px-2 text-xs text-gray-500">
                        <span className="text-sm mb-0.5">{item.icon}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <div className="p-6">
                    <RepairRequestForm
                      deviceBrand={selectedBrand?.brand || ""}
                      deviceModel={selectedModel?.name || ""}
                      serviceName={selectedService?.name || ""}
                      servicePrice={selectedService?.price}
                      compact
                    />
                  </div>
                </div>

                {/* Info block */}
                <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Цены ориентировочные.</strong> Точная стоимость определяется после бесплатной диагностики. Диагностика — 0 ₽, даже если вы откажетесь от ремонта.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}
