import { CityProfile } from "@/features/city-match/types";

export const citiesData: CityProfile[] = [
  {
    id: "beijing",
    name: "北京",
    country: "中国",
    description: "首都核心城市，文化资源密集，机会与竞争并存。",
    features: ["历史底蕴", "教育资源", "机会集中", "四季分明"],
    dimensionProfile: { lifestyle: 45, social: 30, environment: 78, pace: 68 },
  },
  {
    id: "shanghai",
    name: "上海",
    country: "中国",
    description: "国际化与精致生活并重的超大都市，节奏快但效率高。",
    features: ["国际化", "商业繁荣", "精致生活", "交通发达"],
    dimensionProfile: { lifestyle: 88, social: -8, environment: 96, pace: 78 },
  },
  {
    id: "shenzhen",
    name: "深圳",
    country: "中国",
    description: "创新与创业氛围强烈的年轻城市，发展速度快。",
    features: ["创新科技", "年轻活力", "效率导向", "机会密集"],
    dimensionProfile: { lifestyle: 96, social: -35, environment: 35, pace: 98 },
  },
  {
    id: "chengdu",
    name: "成都",
    country: "中国",
    description: "慢节奏与烟火气兼具的西部核心城市，社交氛围友好。",
    features: ["美食之都", "社交友好", "节奏舒缓", "休闲文化"],
    dimensionProfile: { lifestyle: 20, social: 60, environment: 20, pace: -70 },
  },
  {
    id: "xiamen",
    name: "厦门",
    country: "中国",
    description: "滨海宜居城市，气候舒适，节奏适中偏慢。",
    features: ["海滨风光", "宜居安静", "文艺氛围", "气候温和"],
    dimensionProfile: { lifestyle: 8, social: 18, environment: -62, pace: -46 },
  },
  {
    id: "new-york",
    name: "纽约",
    country: "美国",
    description: "机会密集的不夜城，适合高压高成长路径。",
    features: ["机会众多", "文化多元", "高竞争", "高密度生活"],
    dimensionProfile: { lifestyle: 74, social: 96, environment: 58, pace: 97 },
  },
];
