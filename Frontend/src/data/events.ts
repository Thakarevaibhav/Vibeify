import wedding from "@/assets/event-wedding.jpg";
import concert from "@/assets/event-concert.jpg";
import corporate from "@/assets/event-corporate.jpg";
import college from "@/assets/event-college.jpg";

export type EventCategory = "Wedding" | "Concert" | "Corporate" | "College Fest" | "Brand Launch" | "Private";

export interface VEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // ISO
  location: string;
  image: string;
  description: string;
  headliners: string[];
  status: "upcoming" | "past";
  attendance?: string;
}

export const events: VEvent[] = [
  // Upcoming
  { id: "echoverse", title: "Echoverse 2026", category: "Concert", date: "2026-06-14", location: "Mumbai", image: concert, description: "India's biggest open-air music festival returns with 20+ international and homegrown headliners.", headliners: ["Naya Sterling", "DJ Kairo"], status: "upcoming", attendance: "60,000" },
  { id: "aurum", title: "Aurum Watches Gala", category: "Brand Launch", date: "2026-05-02", location: "Dubai", image: corporate, description: "An exclusive black-tie unveiling of the Aurum Heritage collection in Dubai's Burj district.", headliners: ["Varun Saxena", "Ishita Rao"], status: "upcoming", attendance: "1,200" },
  { id: "sharma-khan", title: "The Sharma–Khan Affair", category: "Wedding", date: "2026-02-09", location: "Udaipur", image: wedding, description: "A 4-day royal wedding across three palaces with bespoke performances every night.", headliners: ["Naya Sterling", "Riya Kapoor"], status: "upcoming", attendance: "850" },
  { id: "umang", title: "Umang College Fest", category: "College Fest", date: "2026-03-22", location: "Delhi", image: college, description: "India's largest college fest — three nights, two stages, twenty thousand students.", headliners: ["DJ Kairo", "Rohit Vora"], status: "upcoming", attendance: "20,000" },

  // Past
  { id: "vca25", title: "Vibe Choice Awards 2025", category: "Concert", date: "2025-11-09", location: "Bengaluru", image: concert, description: "Our flagship awards night honouring the best of Indian creators, with cinematic live performances.", headliners: ["Aria Mehra", "Kabir Singh"], status: "past", attendance: "8,500" },
  { id: "infinity", title: "Infinity TechSummit Closing", category: "Corporate", date: "2025-09-18", location: "Hyderabad", image: corporate, description: "A high-impact closing night for India's largest enterprise technology conference.", headliners: ["Varun Saxena"], status: "past", attendance: "4,000" },
  { id: "patel-mehta", title: "The Patel–Mehta Wedding", category: "Wedding", date: "2025-12-22", location: "Jaipur", image: wedding, description: "A heritage-palace wedding with three live concerts and a celebrity baraat.", headliners: ["Naya Sterling", "Rohit Vora"], status: "past", attendance: "1,100" },
  { id: "vibe-iit", title: "VibeFest @ IIT Bombay", category: "College Fest", date: "2025-10-18", location: "Mumbai", image: college, description: "Two-night campus headline series featuring DJ Kairo and surprise guest sets.", headliners: ["DJ Kairo", "Ishita Rao"], status: "past", attendance: "18,000" },
];
