import c1 from "@/assets/celeb-1.jpg";
import c2 from "@/assets/celeb-2.jpg";
import c3 from "@/assets/celeb-3.jpg";
import c4 from "@/assets/celeb-4.jpg";
import c5 from "@/assets/celeb-5.jpg";
import c6 from "@/assets/celeb-6.jpg";
import c7 from "@/assets/celeb-7.jpg";
import c8 from "@/assets/celeb-8.jpg";

export type Category = "Actor" | "Singer" | "DJ" | "Influencer" | "Comedian" | "Sports" | "Dancer";

export interface Celebrity {
  id: string;
  name: string;
  category: Category;
  image: string;
  bio: string;
  followers: string;
  popularity: number; // 0-100
  priceRange: number; // in lakhs ₹
  pastEvents: string[];
  tags: string[];
}

export const celebrities: Celebrity[] = [
  { id: "aria", name: "Aria Mehra", category: "Actor", image: c1, bio: "National-award winning actor with 12+ films across Hindi & Tamil cinema.", followers: "12.4M", popularity: 95, priceRange: 75, pastEvents: ["IIFA 2024", "Cannes Red Carpet", "Femina Awards"], tags: ["Bollywood", "Brand Face"] },
  { id: "kairo", name: "DJ Kairo", category: "DJ", image: c2, bio: "International festival headliner. Sets blend deep house with cinematic Indian textures.", followers: "3.2M", popularity: 82, priceRange: 35, pastEvents: ["Sunburn 2024", "Tomorrowland", "NH7 Weekender"], tags: ["EDM", "Festival"] },
  { id: "naya", name: "Naya Sterling", category: "Singer", image: c3, bio: "Multi-platinum vocalist with 8 chart-topping singles in the last two years.", followers: "8.9M", popularity: 90, priceRange: 60, pastEvents: ["MTV EMAs", "Royal Wedding Mumbai", "Coke Studio"], tags: ["Pop", "Live Band"] },
  { id: "riya", name: "Riya Kapoor", category: "Dancer", image: c4, bio: "Choreographer & performer. Known for cinematic stage productions and reality-TV judging.", followers: "15.1M", popularity: 92, priceRange: 50, pastEvents: ["Dance India Dance", "Diwali Royale", "Asian Games Opening"], tags: ["Dance", "Choreographer"] },
  { id: "rohit", name: "Rohit Vora", category: "Comedian", image: c5, bio: "Stand-up comedian with three Netflix specials and pan-India sold-out tours.", followers: "4.6M", popularity: 78, priceRange: 18, pastEvents: ["Comicstaan", "Netflix Special: Loud", "TEDx"], tags: ["Stand-up", "Host"] },
  { id: "ishita", name: "Ishita Rao", category: "Influencer", image: c6, bio: "Fashion & lifestyle creator. Top-25 most-followed Indian creator on Instagram.", followers: "9.7M", popularity: 85, priceRange: 22, pastEvents: ["Lakmé Fashion Week", "Vogue India Cover", "Dior Mumbai Launch"], tags: ["Fashion", "Lifestyle"] },
  { id: "varun", name: "Varun Saxena", category: "Actor", image: c7, bio: "Leading man — three back-to-back box office hits. Voted GQ Man of the Year 2025.", followers: "18.3M", popularity: 97, priceRange: 120, pastEvents: ["Filmfare 2025", "Brand Launch — Aurum", "GQ Awards"], tags: ["Bollywood", "A-list"] },
  { id: "kabir", name: "Kabir Singh", category: "Sports", image: c8, bio: "International cricketer & national icon. Featured brand ambassador for 6 global brands.", followers: "22.5M", popularity: 99, priceRange: 150, pastEvents: ["IPL Opening", "ICC Awards", "Adidas Global Launch"], tags: ["Cricket", "Brand Icon"] },
];

export const categories: Category[] = ["Actor", "Singer", "DJ", "Influencer", "Comedian", "Sports", "Dancer"];
