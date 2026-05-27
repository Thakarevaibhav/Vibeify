import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { Admin } from "./models/Admin";
import { Celebrity } from "./models/Celebrity";
import { Event } from "./models/Event";
import { Gallery } from "./models/Gallery";

async function seed() {
  await connectDB();

  // Admin
  const email = process.env.ADMIN_EMAIL || "admin@vibeify.in";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  const exists = await Admin.findOne({ email });
  if (!exists) {
    await Admin.create({ email, password: bcrypt.hashSync(password, 12), name: "Vibeify Admin" });
    console.log("✓ Admin created:", email);
  } else {
    console.log("  Admin already exists:", email);
  }

  // Celebrities
  const celebs = [
    { slug: "aria",   name: "Aria Mehra",      category: "Actor",     imageUrl: "/uploads/seeded/celeb-1.jpg",  bio: "National-award winning actor with 12+ films across Hindi & Tamil cinema.",               followers: "12.4M", popularity: 95, priceRange: 75,  pastEvents: ["IIFA 2024","Cannes Red Carpet","Femina Awards"],           tags: ["Bollywood","Brand Face"] },
    { slug: "kairo",  name: "DJ Kairo",         category: "DJ",        imageUrl: "/uploads/seeded/celeb-2.jpg",  bio: "International festival headliner. Sets blend deep house with cinematic Indian textures.",  followers: "3.2M",  popularity: 82, priceRange: 35,  pastEvents: ["Sunburn 2024","Tomorrowland","NH7 Weekender"],             tags: ["EDM","Festival"] },
    { slug: "naya",   name: "Naya Sterling",    category: "Singer",    imageUrl: "/uploads/seeded/celeb-3.jpg",  bio: "Multi-platinum vocalist with 8 chart-topping singles in the last two years.",             followers: "8.9M",  popularity: 90, priceRange: 60,  pastEvents: ["MTV EMAs","Royal Wedding Mumbai","Coke Studio"],           tags: ["Pop","Live Band"] },
    { slug: "riya",   name: "Riya Kapoor",      category: "Dancer",    imageUrl: "/uploads/seeded/celeb-4.jpg",  bio: "Choreographer & performer. Known for cinematic stage productions and reality-TV judging.",  followers: "15.1M", popularity: 92, priceRange: 50,  pastEvents: ["Dance India Dance","Diwali Royale","Asian Games Opening"],  tags: ["Dance","Choreographer"] },
    { slug: "rohit",  name: "Rohit Vora",       category: "Comedian",  imageUrl: "/uploads/seeded/celeb-5.jpg",  bio: "Stand-up comedian with three Netflix specials and pan-India sold-out tours.",              followers: "4.6M",  popularity: 78, priceRange: 18,  pastEvents: ["Comicstaan","Netflix Special: Loud","TEDx"],               tags: ["Stand-up","Host"] },
    { slug: "ishita", name: "Ishita Rao",       category: "Influencer",imageUrl: "/uploads/seeded/celeb-6.jpg",  bio: "Fashion & lifestyle creator. Top-25 most-followed Indian creator on Instagram.",          followers: "9.7M",  popularity: 85, priceRange: 22,  pastEvents: ["Lakmé Fashion Week","Vogue India Cover","Dior Mumbai Launch"], tags: ["Fashion","Lifestyle"] },
    { slug: "varun",  name: "Varun Saxena",     category: "Actor",     imageUrl: "/uploads/seeded/celeb-7.jpg",  bio: "Leading man — three back-to-back box office hits. Voted GQ Man of the Year 2025.",        followers: "18.3M", popularity: 97, priceRange: 120, pastEvents: ["Filmfare 2025","Brand Launch — Aurum","GQ Awards"],         tags: ["Bollywood","A-list"] },
    { slug: "kabir",  name: "Kabir Singh",      category: "Sports",    imageUrl: "/uploads/seeded/celeb-8.jpg",  bio: "International cricketer & national icon. Featured brand ambassador for 6 global brands.",  followers: "22.5M", popularity: 99, priceRange: 150, pastEvents: ["IPL Opening","ICC Awards","Adidas Global Launch"],          tags: ["Cricket","Brand Icon"] },
  ];
  let celebCount = 0;
  for (const c of celebs) {
    const r = await Celebrity.updateOne({ slug: c.slug }, { $setOnInsert: c }, { upsert: true });
    if (r.upsertedCount) celebCount++;
  }
  console.log(`✓ Celebrities seeded: ${celebCount} new`);

  // Events
  const events = [
    { slug: "echoverse",   title: "Echoverse 2026",              category: "Concert",      date: "2026-06-14", location: "Mumbai",    imageUrl: "/uploads/seeded/event-concert.jpg",   description: "India's biggest open-air music festival returns with 20+ international and homegrown headliners.",  headliners: ["Naya Sterling","DJ Kairo"],          status: "upcoming", attendance: "60,000" },
    { slug: "aurum",       title: "Aurum Watches Gala",          category: "Brand Launch", date: "2026-05-02", location: "Dubai",     imageUrl: "/uploads/seeded/event-corporate.jpg", description: "An exclusive black-tie unveiling of the Aurum Heritage collection in Dubai's Burj district.",        headliners: ["Varun Saxena","Ishita Rao"],         status: "upcoming", attendance: "1,200" },
    { slug: "sharma-khan", title: "The Sharma–Khan Affair",      category: "Wedding",      date: "2026-02-09", location: "Udaipur",   imageUrl: "/uploads/seeded/event-wedding.jpg",   description: "A 4-day royal wedding across three palaces with bespoke performances every night.",                headliners: ["Naya Sterling","Riya Kapoor"],       status: "upcoming", attendance: "850" },
    { slug: "umang",       title: "Umang College Fest",          category: "College Fest", date: "2026-03-22", location: "Delhi",     imageUrl: "/uploads/seeded/event-college.jpg",   description: "India's largest college fest — three nights, two stages, twenty thousand students.",                headliners: ["DJ Kairo","Rohit Vora"],             status: "upcoming", attendance: "20,000" },
    { slug: "vca25",       title: "Vibe Choice Awards 2025",     category: "Concert",      date: "2025-11-09", location: "Bengaluru", imageUrl: "/uploads/seeded/event-concert.jpg",   description: "Our flagship awards night honouring the best of Indian creators, with cinematic live performances.", headliners: ["Aria Mehra","Kabir Singh"],          status: "past",     attendance: "8,500" },
    { slug: "infinity",    title: "Infinity TechSummit Closing", category: "Corporate",    date: "2025-09-18", location: "Hyderabad", imageUrl: "/uploads/seeded/event-corporate.jpg", description: "A high-impact closing night for India's largest enterprise technology conference.",                   headliners: ["Varun Saxena"],                      status: "past",     attendance: "4,000" },
    { slug: "patel-mehta", title: "The Patel–Mehta Wedding",     category: "Wedding",      date: "2025-12-22", location: "Jaipur",    imageUrl: "/uploads/seeded/event-wedding.jpg",   description: "A heritage-palace wedding with three live concerts and a celebrity baraat.",                          headliners: ["Naya Sterling","Rohit Vora"],        status: "past",     attendance: "1,100" },
    { slug: "vibe-iit",    title: "VibeFest @ IIT Bombay",       category: "College Fest", date: "2025-10-18", location: "Mumbai",    imageUrl: "/uploads/seeded/event-college.jpg",   description: "Two-night campus headline series featuring DJ Kairo and surprise guest sets.",                        headliners: ["DJ Kairo","Ishita Rao"],             status: "past",     attendance: "18,000" },
  ];
  let eventCount = 0;
  for (const e of events) {
    const r = await Event.updateOne({ slug: e.slug }, { $setOnInsert: e }, { upsert: true });
    if (r.upsertedCount) eventCount++;
  }
  console.log(`✓ Events seeded: ${eventCount} new`);

  // Gallery — seed 2 items per event
  const allEvents = await Event.find();
  let galleryCount = 0;
  for (const [i, ev] of allEvents.entries()) {
    for (let j = 0; j < 2; j++) {
      const cat = ev.category === "Brand Launch" ? "Brand Launch" : ev.category as any;
      const r = await Gallery.updateOne(
        { imageUrl: ev.imageUrl, title: ev.title, sortOrder: i * 2 + j },
        { $setOnInsert: { imageUrl: ev.imageUrl, title: ev.title, category: cat, eventId: ev._id, sortOrder: i * 2 + j } },
        { upsert: true }
      );
      if (r.upsertedCount) galleryCount++;
    }
  }
  console.log(`✓ Gallery seeded: ${galleryCount} new`);

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
