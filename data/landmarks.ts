import type { ArchitecturalLandmark } from "@/types";

/**
 * Images are served locally from `/public/architecture/*.jpg`.
 * The originals come from Wikimedia Commons (CC licensed) — see README.md
 * for attributions. Swap any file and the card will update automatically.
 */
export const architecturalLandmarks: ArchitecturalLandmark[] = [
  {
    id: "great-wall",
    name: "Великая Китайская стена",
    country: "Китай",
    city: "Пекин (участок Бадалин)",
    year: "VII век до н. э. — XVII век",
    description:
      "Серия укреплений протяжённостью более 21 000 км. Одно из крупнейших и старейших инженерных сооружений в истории.",
    interestingFact:
      "Вопреки мифу, стена почти не видна с орбиты невооружённым глазом — слишком узкая.",
    image: "/architecture/great-wall.jpg",
    latitude: 40.4319,
    longitude: 116.5704,
  },
  {
    id: "pyramids-giza",
    name: "Пирамиды Гизы",
    country: "Египет",
    city: "Гиза",
    year: "≈ 2560 г. до н. э.",
    description:
      "Единственное сохранившееся из семи чудес Древнего мира. Пирамида Хеопса более 3800 лет оставалась самой высокой постройкой на Земле.",
    interestingFact:
      "Грани пирамиды Хеопса ориентированы по сторонам света с точностью менее 0,05°.",
    image: "/architecture/pyramids-giza.jpg",
    latitude: 29.9792,
    longitude: 31.1342,
  },
  {
    id: "eiffel-tower",
    name: "Эйфелева башня",
    country: "Франция",
    city: "Париж",
    year: "1889",
    description:
      "Символ Парижа, построенный к Всемирной выставке. 324 метра стали и клёпаной конструкции.",
    interestingFact:
      "Летом башня «растёт» примерно на 15 см из-за теплового расширения металла.",
    image: "/architecture/eiffel-tower.jpg",
    latitude: 48.8584,
    longitude: 2.2945,
  },
  {
    id: "colosseum",
    name: "Колизей",
    country: "Италия",
    city: "Рим",
    year: "80 г.",
    description:
      "Крупнейший амфитеатр Римской империи, вмещавший до 50 000 зрителей. Символ инженерного гения античности.",
    interestingFact:
      "Арену можно было затопить и устраивать наумахии — имитации морских сражений.",
    image: "/architecture/colosseum.jpg",
    latitude: 41.8902,
    longitude: 12.4922,
  },
  {
    id: "taj-mahal",
    name: "Тадж-Махал",
    country: "Индия",
    city: "Агра",
    year: "1648",
    description:
      "Мавзолей из белого мрамора, построенный Шах-Джаханом в память о жене Мумтаз-Махал. Шедевр могольской архитектуры.",
    interestingFact:
      "Мрамор меняет оттенок в течение дня — от розового на рассвете до золотистого ночью при луне.",
    image: "/architecture/taj-mahal.jpg",
    latitude: 27.1751,
    longitude: 78.0421,
  },
  {
    id: "burj-khalifa",
    name: "Бурдж-Халифа",
    country: "ОАЭ",
    city: "Дубай",
    year: "2010",
    description:
      "Самое высокое здание в мире — 828 м и 163 этажа. Воплощение современных технологий небоскрёбов.",
    interestingFact:
      "С верхнего этажа закат можно увидеть дважды — поднявшись на лифте после наступления сумерек.",
    image: "/architecture/burj-khalifa.jpg",
    latitude: 25.1972,
    longitude: 55.2744,
  },
  {
    id: "statue-of-liberty",
    name: "Статуя Свободы",
    country: "США",
    city: "Нью-Йорк",
    year: "1886",
    description:
      "Подарок Франции к столетию независимости США. Медная фигура высотой 93 м вместе с постаментом.",
    interestingFact:
      "Внутри статуи — лестница на 354 ступени, ведущая к короне со смотровой площадкой.",
    image: "/architecture/statue-of-liberty.jpg",
    latitude: 40.6892,
    longitude: -74.0445,
  },
];

export const getLandmarkById = (id: string): ArchitecturalLandmark | undefined =>
  architecturalLandmarks.find((l) => l.id === id);
