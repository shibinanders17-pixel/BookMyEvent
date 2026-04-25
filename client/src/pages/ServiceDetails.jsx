
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const serviceData = [
  {
    id: 1,
    icon: "📸",
    title: "Photography",
    subtitle: "Capture Every Moment",
    desc: "Award-winning photographers who tell your love story through breathtaking imagery.",
    longDesc: "Our professional photographers bring years of experience capturing Tamil weddings. We use the latest Canon & Sony mirrorless cameras. Every shoot includes online gallery delivery and edited high-resolution images.",
    highlights: ["HD & 4K Coverage", "Same Day Edits", "Online Gallery", "Drone Shots", "2 Photographers", "500+ Edited Photos"],
    rating: 4.9, reviews: 238,
    styles: [
      {
        id: 1, name: "Candid & Natural", desc: "Real emotions, unposed moments", price: 15000,
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
        specs: [
          { label: "Coverage", value: "Full Day (8 hrs)" },
          { label: "Photographers", value: "2 Professionals" },
          { label: "Edited Photos", value: "500+" },
          { label: "Delivery", value: "7 Days" },
          { label: "Drone Shots", value: "Included" },
          { label: "Online Gallery", value: "Yes, 1 Year Access" },
        ]
      },
      {
        id: 2, name: "Traditional Posed", desc: "Classic family & couple portraits", price: 12000,
        img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
        specs: [
          { label: "Coverage", value: "Full Day (8 hrs)" },
          { label: "Photographers", value: "1 Professional" },
          { label: "Edited Photos", value: "300+" },
          { label: "Delivery", value: "5 Days" },
          { label: "Drone Shots", value: "Not Included" },
          { label: "Online Gallery", value: "Yes, 6 Months" },
        ]
      },
      {
        id: 3, name: "Cinematic Dark", desc: "Moody, dramatic lighting", price: 18000,
        img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600",
        specs: [
          { label: "Coverage", value: "Full Day (8 hrs)" },
          { label: "Photographers", value: "2 Professionals" },
          { label: "Edited Photos", value: "600+" },
          { label: "Delivery", value: "10 Days" },
          { label: "Drone Shots", value: "Included" },
          { label: "Studio Lighting", value: "Professional Setup" },
        ]
      },
      {
        id: 4, name: "Outdoor Natural", desc: "Golden hour, garden settings", price: 14000,
        img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
        specs: [
          { label: "Coverage", value: "Half Day (4 hrs)" },
          { label: "Photographers", value: "2 Professionals" },
          { label: "Edited Photos", value: "400+" },
          { label: "Delivery", value: "7 Days" },
          { label: "Location", value: "Outdoor / Garden" },
          { label: "Golden Hour", value: "Included" },
        ]
      },
      {
        id: 5, name: "Pre-Wedding Shoot", desc: "Romantic couple shoot", price: 10000,
        img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600",
        specs: [
          { label: "Duration", value: "4 hrs" },
          { label: "Photographers", value: "1 Professional" },
          { label: "Edited Photos", value: "150+" },
          { label: "Delivery", value: "5 Days" },
          { label: "Locations", value: "Up to 2" },
          { label: "Outfit Changes", value: "2 Allowed" },
        ]
      },
      {
        id: 6, name: "Aerial / Drone", desc: "Stunning bird-eye view shots", price: 20000,
        img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600",
        specs: [
          { label: "Coverage", value: "Full Day (8 hrs)" },
          { label: "Drone Pilot", value: "Licensed FAA Pilot" },
          { label: "Edited Photos", value: "300+ Aerial" },
          { label: "Video Clips", value: "10+ Aerial Clips" },
          { label: "Delivery", value: "10 Days" },
          { label: "Resolution", value: "4K Ultra HD" },
        ]
      },
    ],
  },
  {
    id: 2,
    icon: "🎵",
    title: "DJ & Music",
    subtitle: "Set The Mood",
    desc: "Professional DJs with premium sound systems. Live bands & orchestras available.",
    longDesc: "Our DJs are trained professionals with 5+ years experience. We bring JBL/Bose premium speakers, LED rigs, and fog machines. From Nadaswaram to EDM — we cover it all.",
    highlights: ["Live Band Option", "Custom Playlists", "LED Setup", "MC Services", "Fog Machine", "Premium Sound"],
    rating: 4.8, reviews: 184,
    styles: [
      {
        id: 1, name: "EDM & Bollywood", desc: "High energy dance floor vibes", price: 15000,
        img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600",
        specs: [
          { label: "Duration", value: "6 hrs" },
          { label: "DJ Setup", value: "Pioneer CDJ + Mixer" },
          { label: "Sound System", value: "JBL 2000W" },
          { label: "LED Lights", value: "Full Rig Included" },
          { label: "Fog Machine", value: "Included" },
          { label: "MC", value: "Included" },
        ]
      },
      {
        id: 2, name: "Tamil Hits Mix", desc: "Latest & classic Tamil songs", price: 12000,
        img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600",
        specs: [
          { label: "Duration", value: "5 hrs" },
          { label: "DJ Setup", value: "Professional Mixer" },
          { label: "Sound System", value: "Bose 1500W" },
          { label: "Playlist", value: "Custom Tamil List" },
          { label: "LED Lights", value: "Basic Setup" },
          { label: "MC", value: "Optional Add-on" },
        ]
      },
      {
        id: 3, name: "Live Band", desc: "Live instruments + vocalist", price: 25000,
        img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600",
        specs: [
          { label: "Duration", value: "3 hrs" },
          { label: "Band Members", value: "5 Musicians" },
          { label: "Instruments", value: "Guitar, Keys, Drums, Bass" },
          { label: "Vocalist", value: "1 Male + 1 Female" },
          { label: "Sound System", value: "Professional PA" },
          { label: "Genres", value: "Tamil, Hindi, English" },
        ]
      },
      {
        id: 4, name: "Acoustic / Soft", desc: "Calm romantic background music", price: 10000,
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600",
        specs: [
          { label: "Duration", value: "4 hrs" },
          { label: "Setup", value: "Acoustic Guitar + Keys" },
          { label: "Volume", value: "Background Level" },
          { label: "Vocalist", value: "1 Included" },
          { label: "Suitable For", value: "Dinner / Reception" },
          { label: "Playlist", value: "Custom on Request" },
        ]
      },
      {
        id: 5, name: "Nadaswaram", desc: "Traditional Tamil wedding music", price: 8000,
        img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
        specs: [
          { label: "Duration", value: "3 hrs" },
          { label: "Artists", value: "2 Nadaswaram Players" },
          { label: "Thavil", value: "1 Player Included" },
          { label: "Suitable For", value: "Muhurtham / Ceremony" },
          { label: "Traditional Songs", value: "50+ Repertoire" },
          { label: "Attire", value: "Traditional Dress" },
        ]
      },
      {
        id: 6, name: "Full LED DJ Setup", desc: "DJ + full LED light show", price: 20000,
        img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600",
        specs: [
          { label: "Duration", value: "8 hrs" },
          { label: "LED Wall", value: "Full Backdrop Included" },
          { label: "Moving Heads", value: "8 Units" },
          { label: "Laser Show", value: "Included" },
          { label: "Sound System", value: "JBL 3000W" },
          { label: "Fog + Haze", value: "Included" },
        ]
      },
    ],
  },
  {
    id: 3,
    icon: "🌸",
    title: "Decoration",
    subtitle: "Design Your Dream",
    desc: "From intimate floral setups to grand mandap decorations — we bring your vision to life.",
    longDesc: "Our decoration team of 15+ artists sources fresh flowers daily. From traditional marigold to modern minimalist — every vision executed flawlessly.",
    highlights: ["Fresh Flowers Daily", "Mandap Setup", "LED Lighting", "Theme Decor", "Table Settings", "Stage Design"],
    rating: 4.9, reviews: 312,
    styles: [
      {
        id: 1, name: "Royal Marigold", desc: "Traditional Tamil marigold theme", price: 25000,
        img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        specs: [
          { label: "Flowers Used", value: "Fresh Marigold + Roses" },
          { label: "Mandap", value: "Traditional Setup" },
          { label: "Stage Decor", value: "Full Backdrop" },
          { label: "Table Settings", value: "10 Tables" },
          { label: "Entrance Decor", value: "Flower Arch Included" },
          { label: "Setup Time", value: "1 Day Before" },
        ]
      },
      {
        id: 2, name: "Floral Fantasy", desc: "All-fresh flowers luxury setup", price: 40000,
        img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
        specs: [
          { label: "Flowers Used", value: "Imported + Local Fresh" },
          { label: "Mandap", value: "Premium Floral Canopy" },
          { label: "Stage Decor", value: "360° Floral Backdrop" },
          { label: "Table Settings", value: "20 Tables" },
          { label: "Centerpieces", value: "Custom Floral" },
          { label: "Setup Time", value: "2 Days Before" },
        ]
      },
      {
        id: 3, name: "White & Gold", desc: "Elegant modern white theme", price: 35000,
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
        specs: [
          { label: "Color Theme", value: "White + Gold" },
          { label: "Flowers", value: "White Roses + Lilies" },
          { label: "Mandap", value: "Gold Frame Setup" },
          { label: "Draping", value: "White Fabric Draping" },
          { label: "LED Lights", value: "Warm Gold Lights" },
          { label: "Table Settings", value: "15 Tables" },
        ]
      },
      {
        id: 4, name: "LED Wonderland", desc: "Full LED light decoration", price: 30000,
        img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
        specs: [
          { label: "LED Coverage", value: "Full Venue" },
          { label: "LED Types", value: "Fairy + Strip + Spotlights" },
          { label: "Color Options", value: "Custom RGB" },
          { label: "Stage Lighting", value: "Moving Heads" },
          { label: "Flowers", value: "Minimal Accent" },
          { label: "Power Setup", value: "Included" },
        ]
      },
      {
        id: 5, name: "Bohemian Garden", desc: "Outdoor garden boho style", price: 28000,
        img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600",
        specs: [
          { label: "Style", value: "Outdoor Boho" },
          { label: "Materials", value: "Macrame + Pampas Grass" },
          { label: "Flowers", value: "Wildflowers + Greenery" },
          { label: "Seating", value: "Rustic Setup" },
          { label: "Fairy Lights", value: "String Lights Included" },
          { label: "Suitable For", value: "Garden / Terrace Venue" },
        ]
      },
      {
        id: 6, name: "Pink & Roses", desc: "Romantic rose-themed setup", price: 32000,
        img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600",
        specs: [
          { label: "Color Theme", value: "Blush Pink + White" },
          { label: "Flowers", value: "Fresh Roses (2000+)" },
          { label: "Mandap", value: "Rose Canopy" },
          { label: "Photo Booth", value: "Rose Wall Included" },
          { label: "Table Settings", value: "15 Tables" },
          { label: "Petals", value: "Aisle Petal Setup" },
        ]
      },
    ],
  },
  {
    id: 4,
    icon: "🍽️",
    title: "Catering",
    subtitle: "Flavours That Wow",
    desc: "Multi-cuisine catering from traditional Tamil Sadhya to continental buffets.",
    longDesc: "FSSAI-certified kitchen with 8+ years experience. Fresh locally sourced ingredients, 20+ trained chefs. Live counters and custom menus available.",
    highlights: ["FSSAI Certified", "Multi-Cuisine", "Live Counters", "Custom Menu", "Hygienic Kitchen", "50+ Items"],
    rating: 4.7, reviews: 421,
    styles: [
      {
        id: 1, name: "Tamil Sadhya", desc: "Traditional banana leaf feast", price: 350,
        img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600",
        specs: [
          { label: "Price", value: "₹350 per plate" },
          { label: "Min Order", value: "50 Plates" },
          { label: "Items", value: "15+ Traditional Items" },
          { label: "Served On", value: "Banana Leaf" },
          { label: "Includes", value: "Rice, Curries, Payasam" },
          { label: "Service Staff", value: "1 per 25 guests" },
        ]
      },
      {
        id: 2, name: "North Indian Buffet", desc: "Paneer, biryani, naan & more", price: 450,
        img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
        specs: [
          { label: "Price", value: "₹450 per plate" },
          { label: "Min Order", value: "100 Plates" },
          { label: "Items", value: "20+ Items" },
          { label: "Includes", value: "Biryani, Paneer, Naan, Dal" },
          { label: "Desserts", value: "Gulab Jamun + Ice Cream" },
          { label: "Service Style", value: "Buffet Counter" },
        ]
      },
      {
        id: 3, name: "Continental", desc: "International cuisine buffet", price: 700,
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
        specs: [
          { label: "Price", value: "₹700 per plate" },
          { label: "Min Order", value: "50 Plates" },
          { label: "Items", value: "25+ Items" },
          { label: "Includes", value: "Pasta, Pizza, Grills, Salads" },
          { label: "Desserts", value: "Pastries + Mousse" },
          { label: "Welcome Drink", value: "Mocktails Included" },
        ]
      },
      {
        id: 4, name: "Live Counter", desc: "Dosa, chaat, pasta live stations", price: 600,
        img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
        specs: [
          { label: "Price", value: "₹600 per plate" },
          { label: "Min Order", value: "75 Plates" },
          { label: "Live Stations", value: "3 Stations" },
          { label: "Station Options", value: "Dosa, Chaat, Pasta" },
          { label: "Chef Per Station", value: "1 Dedicated Chef" },
          { label: "Customizable", value: "Yes" },
        ]
      },
      {
        id: 5, name: "Veg Premium", desc: "Premium veg multi-cuisine", price: 500,
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        specs: [
          { label: "Price", value: "₹500 per plate" },
          { label: "Min Order", value: "50 Plates" },
          { label: "Items", value: "18+ Veg Items" },
          { label: "Jain Option", value: "Available" },
          { label: "Desserts", value: "3 Varieties" },
          { label: "Welcome Drink", value: "Included" },
        ]
      },
      {
        id: 6, name: "Non-Veg Special", desc: "Full non-veg with seafood", price: 650,
        img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
        specs: [
          { label: "Price", value: "₹650 per plate" },
          { label: "Min Order", value: "75 Plates" },
          { label: "Items", value: "20+ Items" },
          { label: "Includes", value: "Chicken, Mutton, Seafood" },
          { label: "Biryani", value: "Dum Biryani Included" },
          { label: "Desserts", value: "2 Varieties" },
        ]
      },
    ],
  },
  {
    id: 5,
    icon: "🏨",
    title: "Venue Booking",
    subtitle: "Find Your Perfect Space",
    desc: "Curated venues across Coimbatore — from garden settings to grand banquet halls.",
    longDesc: "100+ venue partnerships across Coimbatore, Tirupur, Erode, Salem. Expert shortlisting, negotiation, and paperwork handled. Site visits in 24 hours.",
    highlights: ["100+ Venues", "Price Match", "Site Visit", "AC & Non-AC", "Parking", "Catering Allowed"],
    rating: 4.8, reviews: 156,
    styles: [
      {
        id: 1, name: "Grand Banquet Hall", desc: "AC hall for 300–500 guests", price: 60000,
        img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
        specs: [
          { label: "Capacity", value: "300–500 Guests" },
          { label: "AC", value: "Full AC Hall" },
          { label: "Parking", value: "200+ Vehicles" },
          { label: "Booking Days", value: "2 Days Included" },
          { label: "Catering", value: "Outside Allowed" },
          { label: "Green Room", value: "2 Rooms" },
        ]
      },
      {
        id: 2, name: "Garden Venue", desc: "Open-air garden setting", price: 35000,
        img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        specs: [
          { label: "Capacity", value: "150–250 Guests" },
          { label: "Type", value: "Open Air Garden" },
          { label: "Parking", value: "100+ Vehicles" },
          { label: "Booking Days", value: "1 Day" },
          { label: "Catering", value: "Outside Allowed" },
          { label: "Power Backup", value: "Generator Included" },
        ]
      },
      {
        id: 3, name: "Beach / Resort", desc: "Scenic resort venue", price: 80000,
        img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
        specs: [
          { label: "Capacity", value: "100–300 Guests" },
          { label: "Location", value: "Resort / Beach Side" },
          { label: "Accommodation", value: "Rooms Available" },
          { label: "Booking Days", value: "2 Days" },
          { label: "Catering", value: "In-house Preferred" },
          { label: "Swimming Pool", value: "Access Included" },
        ]
      },
      {
        id: 4, name: "Heritage / Palace", desc: "Royal heritage property", price: 100000,
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
        specs: [
          { label: "Capacity", value: "200–400 Guests" },
          { label: "Type", value: "Heritage Building" },
          { label: "Rooms", value: "10+ Rooms" },
          { label: "Booking Days", value: "3 Days" },
          { label: "Exclusivity", value: "Full Property" },
          { label: "Decor Permission", value: "Full Permission" },
        ]
      },
      {
        id: 5, name: "Rooftop Venue", desc: "Terrace with city view", price: 45000,
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
        specs: [
          { label: "Capacity", value: "100–200 Guests" },
          { label: "Type", value: "Open Rooftop" },
          { label: "View", value: "City Skyline" },
          { label: "Booking Days", value: "1 Day" },
          { label: "Weather Backup", value: "Tent Available" },
          { label: "Catering", value: "Outside Allowed" },
        ]
      },
      {
        id: 6, name: "Temple / Traditional", desc: "Traditional marriage hall", price: 25000,
        img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600",
        specs: [
          { label: "Capacity", value: "100–300 Guests" },
          { label: "Type", value: "Marriage Hall" },
          { label: "AC", value: "Available" },
          { label: "Muhurtham Support", value: "Yes" },
          { label: "Booking Days", value: "1 Day" },
          { label: "Catering Kitchen", value: "In-house Available" },
        ]
      },
    ],
  },
  {
    id: 6,
    icon: "💄",
    title: "Makeup Artist",
    subtitle: "Look Absolutely Stunning",
    desc: "Celebrity makeup artists — airbrush, HD, and traditional bridal looks.",
    longDesc: "10+ certified artists trained in Chennai & Mumbai. MAC, Charlotte Tilbury, Kryolan products. Every bridal package includes trial session, hair styling, and saree draping.",
    highlights: ["MAC Products", "Trial Session", "Hair Styling", "Saree Draping", "Airbrush", "Home Visit"],
    rating: 4.9, reviews: 98,
    styles: [
      {
        id: 1, name: "Traditional Bridal", desc: "Classic Tamil bridal look", price: 10000,
        img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
        specs: [
          { label: "Makeup Type", value: "Traditional Tamil" },
          { label: "Products", value: "MAC + Kryolan" },
          { label: "Hair Styling", value: "Included" },
          { label: "Saree Draping", value: "Included" },
          { label: "Trial Session", value: "1 Session" },
          { label: "Home Visit", value: "Available" },
        ]
      },
      {
        id: 2, name: "HD Bridal", desc: "Flawless HD camera-ready look", price: 15000,
        img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600",
        specs: [
          { label: "Makeup Type", value: "HD Professional" },
          { label: "Products", value: "Charlotte Tilbury + MAC" },
          { label: "Hair Styling", value: "Full Bridal Style" },
          { label: "Saree Draping", value: "Included" },
          { label: "Trial Session", value: "1 Session" },
          { label: "Touch-up Kit", value: "Provided" },
        ]
      },
      {
        id: 3, name: "Airbrush Bridal", desc: "Celebrity-grade airbrush finish", price: 25000,
        img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600",
        specs: [
          { label: "Makeup Type", value: "Airbrush Professional" },
          { label: "Products", value: "Temptu + Charlotte Tilbury" },
          { label: "Hair Styling", value: "Celebrity Styling" },
          { label: "Saree Draping", value: "Included" },
          { label: "Trial Sessions", value: "2 Sessions" },
          { label: "All-Day Touch-up", value: "Artist Stays" },
        ]
      },
      {
        id: 4, name: "Dewy & Natural", desc: "Fresh glowing natural look", price: 8000,
        img: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600",
        specs: [
          { label: "Makeup Type", value: "Natural / Dewy" },
          { label: "Products", value: "Premium Organic" },
          { label: "Hair Styling", value: "Included" },
          { label: "Finish", value: "Glowing Skin" },
          { label: "Duration", value: "2 hrs" },
          { label: "Home Visit", value: "Available" },
        ]
      },
      {
        id: 5, name: "Smokey Glam", desc: "Bold dramatic evening look", price: 7000,
        img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600",
        specs: [
          { label: "Makeup Type", value: "Smokey / Glam" },
          { label: "Products", value: "MAC + NYX" },
          { label: "Hair Styling", value: "Included" },
          { label: "Eyelashes", value: "Premium Lashes" },
          { label: "Duration", value: "1.5 hrs" },
          { label: "Suitable For", value: "Reception / Party" },
        ]
      },
      {
        id: 6, name: "Saree + Full Glam", desc: "Makeup + saree draping combo", price: 12000,
        img: "https://images.unsplash.com/photo-1583241800698-e8ab01830a22?w=600",
        specs: [
          { label: "Includes", value: "Makeup + Saree Draping" },
          { label: "Makeup Type", value: "Full Glam Bridal" },
          { label: "Saree Styles", value: "Tamilian / Nivi / Gujarati" },
          { label: "Hair Styling", value: "Included" },
          { label: "Duration", value: "3 hrs" },
          { label: "Home Visit", value: "Included" },
        ]
      },
    ],
  },
  {
    id: 7,
    icon: "🌿",
    title: "Mehendi Artist",
    subtitle: "Art On Your Hands",
    desc: "Intricate bridal mehendi — Arabic, Rajasthani, Indo-Arabic styles.",
    longDesc: "8+ years experience. 100% natural organic paste. Deep dark color guaranteed. Home visit included for all bridal packages.",
    highlights: ["Organic Paste", "Deep Dark Color", "Home Visit", "Arabic Style", "Portrait Mehendi", "Quick Dry"],
    rating: 4.8, reviews: 143,
    styles: [
      {
        id: 1, name: "Arabic Style", desc: "Bold floral Arabic patterns", price: 3000,
        img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600",
        specs: [
          { label: "Coverage", value: "Both Hands" },
          { label: "Style", value: "Arabic Floral" },
          { label: "Paste Type", value: "100% Organic" },
          { label: "Color", value: "Dark Brown-Black" },
          { label: "Dry Time", value: "30 Minutes" },
          { label: "Home Visit", value: "Included" },
        ]
      },
      {
        id: 2, name: "Rajasthani Bridal", desc: "Dense full-hand Rajasthani", price: 5000,
        img: "https://images.unsplash.com/photo-1601924921557-45c6a3e29f66?w=600",
        specs: [
          { label: "Coverage", value: "Hands + Feet" },
          { label: "Style", value: "Dense Rajasthani" },
          { label: "Paste Type", value: "Organic + Fragrant" },
          { label: "Duration", value: "3–4 hrs" },
          { label: "Artists", value: "2 Artists" },
          { label: "Home Visit", value: "Included" },
        ]
      },
      {
        id: 3, name: "Indo-Arabic Fusion", desc: "Mix of both styles", price: 4000,
        img: "https://images.unsplash.com/photo-1571172964533-f8be5ddfc72a?w=600",
        specs: [
          { label: "Coverage", value: "Both Hands + Wrist" },
          { label: "Style", value: "Indo-Arabic Fusion" },
          { label: "Duration", value: "2–3 hrs" },
          { label: "Paste Type", value: "Organic" },
          { label: "Color", value: "Deep Dark" },
          { label: "Home Visit", value: "Included" },
        ]
      },
      {
        id: 4, name: "Portrait Mehendi", desc: "Bride & groom portrait design", price: 7000,
        img: "https://images.unsplash.com/photo-1596704017245-ec4c5d8bde15?w=600",
        specs: [
          { label: "Coverage", value: "Full Hands + Arms" },
          { label: "Special Feature", value: "Couple Portrait" },
          { label: "Duration", value: "5–6 hrs" },
          { label: "Artists", value: "Senior Artist" },
          { label: "Paste Type", value: "Premium Organic" },
          { label: "Home Visit", value: "Included" },
        ]
      },
      {
        id: 5, name: "Minimalist Modern", desc: "Simple elegant patterns", price: 2000,
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
        specs: [
          { label: "Coverage", value: "One Hand or Both" },
          { label: "Style", value: "Minimalist Lines" },
          { label: "Duration", value: "45 min – 1 hr" },
          { label: "Paste Type", value: "Organic" },
          { label: "Suitable For", value: "Bridesmaids / Party" },
          { label: "Home Visit", value: "Available" },
        ]
      },
      {
        id: 6, name: "Full Arm Bridal", desc: "Hands + arms full coverage", price: 8000,
        img: "https://images.unsplash.com/photo-1583391734000-5af0b2f0f6b3?w=600",
        specs: [
          { label: "Coverage", value: "Hands + Full Arms + Feet" },
          { label: "Duration", value: "6–7 hrs" },
          { label: "Artists", value: "2 Senior Artists" },
          { label: "Paste Type", value: "Premium Organic" },
          { label: "Touch-up", value: "Next Day Included" },
          { label: "Home Visit", value: "Included" },
        ]
      },
    ],
  },
  {
    id: 8,
    icon: "👑",
    title: "Wedding Planner",
    subtitle: "Your Personal Coordinator",
    desc: "End-to-end wedding planning — vendor management, budgeting, day coordination.",
    longDesc: "200+ Tamil weddings planned. Dedicated planner, wedding portal, 24/7 WhatsApp support. Average 20% savings through vendor partnerships.",
    highlights: ["Dedicated Planner", "Budget Tracker", "Vendor Network", "24/7 Support", "Wedding Portal", "Day Coordination"],
    rating: 4.9, reviews: 87,
    styles: [
      {
        id: 1, name: "Full Wedding Planning", desc: "Complete A–Z planning", price: 75000,
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
        specs: [
          { label: "Planning Duration", value: "3–12 Months" },
          { label: "Dedicated Planner", value: "1 Senior Planner" },
          { label: "Vendors Managed", value: "All Vendors" },
          { label: "Meetings", value: "Unlimited" },
          { label: "Day Coordination", value: "Full Team" },
          { label: "Wedding Portal", value: "Included" },
        ]
      },
      {
        id: 2, name: "Day Coordination Only", desc: "Only wedding day management", price: 15000,
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
        specs: [
          { label: "Service", value: "Wedding Day Only" },
          { label: "Coordinators", value: "2 on Site" },
          { label: "Timeline", value: "Custom Schedule" },
          { label: "Vendor Liaison", value: "Included" },
          { label: "Pre-Meeting", value: "2 Planning Calls" },
          { label: "Emergency Support", value: "24/7" },
        ]
      },
      {
        id: 3, name: "Vendor Management", desc: "Find & manage all vendors", price: 25000,
        img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        specs: [
          { label: "Vendors", value: "All Categories" },
          { label: "Negotiation", value: "Included" },
          { label: "Contracts", value: "Reviewed" },
          { label: "Meetings", value: "10 Included" },
          { label: "Savings", value: "Avg 15–20%" },
          { label: "Support", value: "WhatsApp 24/7" },
        ]
      },
      {
        id: 4, name: "Budget Planning", desc: "Optimize your wedding budget", price: 10000,
        img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
        specs: [
          { label: "Budget Analysis", value: "Detailed Report" },
          { label: "Category Breakdown", value: "All Sections" },
          { label: "Savings Tips", value: "Personalized" },
          { label: "Sessions", value: "3 Planning Sessions" },
          { label: "Vendor Discounts", value: "Network Access" },
          { label: "Tracker", value: "Excel + Portal" },
        ]
      },
      {
        id: 5, name: "Destination Wedding", desc: "Outstation wedding planning", price: 100000,
        img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
        specs: [
          { label: "Locations", value: "Pan India" },
          { label: "Team", value: "2 Planners" },
          { label: "Guest Management", value: "Travel + Stay" },
          { label: "Local Vendors", value: "Managed" },
          { label: "Duration", value: "3-Day Events" },
          { label: "Logistics", value: "Full Support" },
        ]
      },
      {
        id: 6, name: "Honeymoon Planning", desc: "Post-wedding travel package", price: 20000,
        img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600",
        specs: [
          { label: "Destinations", value: "Domestic + International" },
          { label: "Duration", value: "5–14 Days" },
          { label: "Includes", value: "Hotel + Flight" },
          { label: "Activities", value: "Curated Experiences" },
          { label: "Budget Options", value: "All Ranges" },
          { label: "Support", value: "24/7 Travel Helpline" },
        ]
      },
    ],
  },
  {
    id: 9,
    icon: "💌",
    title: "Invitation Cards",
    subtitle: "First Impressions Matter",
    desc: "Stunning physical & digital wedding invitations — traditional to modern designs.",
    longDesc: "Bespoke invitations — Tamil Kolam, modern minimalist, gold-embossed cards. Animated e-invites for WhatsApp. 3–5 day delivery across Tamil Nadu.",
    highlights: ["Custom Design", "Tamil & English", "WhatsApp E-Invites", "Fast Delivery", "Gold Embossing", "Animated"],
    rating: 4.7, reviews: 201,
    styles: [
      {
        id: 1, name: "Royal Gold", desc: "Gold-embossed luxury card", price: 8000,
        img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600",
        specs: [
          { label: "Quantity", value: "100 Cards" },
          { label: "Size", value: "A5 (14.8 × 21 cm)" },
          { label: "Paper", value: "300 GSM Matt" },
          { label: "Finish", value: "Gold Foil Embossing" },
          { label: "Language", value: "Tamil + English" },
          { label: "Delivery", value: "5 Days" },
        ]
      },
      {
        id: 2, name: "Traditional Tamil", desc: "Kolam & temple motif design", price: 5000,
        img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600",
        specs: [
          { label: "Quantity", value: "100 Cards" },
          { label: "Size", value: "A5 (14.8 × 21 cm)" },
          { label: "Paper", value: "250 GSM Glossy" },
          { label: "Design", value: "Kolam + Temple Motif" },
          { label: "Language", value: "Tamil + English" },
          { label: "Delivery", value: "4 Days" },
        ]
      },
      {
        id: 3, name: "Minimalist Modern", desc: "Clean elegant typography", price: 4000,
        img: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=600",
        specs: [
          { label: "Quantity", value: "100 Cards" },
          { label: "Size", value: "DL (10 × 21 cm)" },
          { label: "Paper", value: "300 GSM Matte White" },
          { label: "Design", value: "Clean Typography" },
          { label: "Language", value: "English" },
          { label: "Delivery", value: "3 Days" },
        ]
      },
      {
        id: 4, name: "Floral Pastel", desc: "Soft floral watercolor design", price: 5500,
        img: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600",
        specs: [
          { label: "Quantity", value: "100 Cards" },
          { label: "Size", value: "A5 (14.8 × 21 cm)" },
          { label: "Paper", value: "280 GSM Soft Touch" },
          { label: "Design", value: "Watercolor Florals" },
          { label: "Language", value: "Tamil + English" },
          { label: "Delivery", value: "4 Days" },
        ]
      },
      {
        id: 5, name: "Animated E-Invite", desc: "WhatsApp animated digital card", price: 2000,
        img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600",
        specs: [
          { label: "Format", value: "MP4 Video / GIF" },
          { label: "Duration", value: "15–30 seconds" },
          { label: "Resolution", value: "1080p HD" },
          { label: "Music", value: "Background Music" },
          { label: "Sharing", value: "WhatsApp Ready" },
          { label: "Delivery", value: "2 Days" },
        ]
      },
      {
        id: 6, name: "Royal Velvet Box", desc: "Premium box card with inserts", price: 15000,
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
        specs: [
          { label: "Quantity", value: "50 Box Sets" },
          { label: "Includes", value: "Box + Card + Inserts" },
          { label: "Material", value: "Velvet Box" },
          { label: "Extras", value: "Dry Fruits / Sweets Insert" },
          { label: "Personalization", value: "Full Custom" },
          { label: "Delivery", value: "7 Days" },
        ]
      },
    ],
  },
  {
    id: 10,
    icon: "🐴",
    title: "Baraat Decoration",
    subtitle: "Grand Entry Awaits",
    desc: "Royal entry with decorated horses, vintage cars, and flower vehicles.",
    longDesc: "Unforgettable groom entries — white horses, vintage cars, classic bikes, flower-vehicles. Band party, DJ on wheels, dhol players, crowd coordination.",
    highlights: ["Decorated Horse", "Vintage Cars", "Band Party", "Dhol Players", "DJ on Wheels", "Coordination"],
    rating: 4.6, reviews: 62,
    styles: [
      {
        id: 1, name: "White Horse Entry", desc: "Decorated white horse procession", price: 15000,
        img: "https://images.unsplash.com/photo-1596416836902-af5b00f01be3?w=600",
        specs: [
          { label: "Horse", value: "1 White Horse" },
          { label: "Decoration", value: "Full Flower Decor" },
          { label: "Mahout", value: "Experienced Handler" },
          { label: "Band Party", value: "10 Members" },
          { label: "Duration", value: "1.5 hrs" },
          { label: "Area", value: "Coimbatore + 50km" },
        ]
      },
      {
        id: 2, name: "Vintage Car Entry", desc: "Classic decorated vintage car", price: 12000,
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
        specs: [
          { label: "Car", value: "1 Vintage Car" },
          { label: "Decoration", value: "Full Flower Decor" },
          { label: "Driver", value: "Professional" },
          { label: "Ribbon", value: "Just Married Setup" },
          { label: "Duration", value: "3 hrs" },
          { label: "Distance", value: "Up to 100km" },
        ]
      },
      {
        id: 3, name: "Flower Chariot", desc: "Floral chariot grand entry", price: 20000,
        img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
        specs: [
          { label: "Chariot", value: "Fully Decorated" },
          { label: "Flowers", value: "2000+ Fresh Flowers" },
          { label: "Theme", value: "Royal / Temple" },
          { label: "Band Party", value: "15 Members" },
          { label: "Duration", value: "2 hrs" },
          { label: "LED Lights", value: "Night Lighting" },
        ]
      },
      {
        id: 4, name: "DJ Truck Baraat", desc: "DJ on wheels with lights", price: 18000,
        img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600",
        specs: [
          { label: "DJ Truck", value: "Full Setup Truck" },
          { label: "Sound", value: "2000W System" },
          { label: "LED Lights", value: "Full Rig" },
          { label: "DJ", value: "Professional DJ" },
          { label: "Duration", value: "2 hrs Procession" },
          { label: "Dhol", value: "2 Players" },
        ]
      },
      {
        id: 5, name: "Elephant Entry", desc: "Royal elephant procession", price: 35000,
        img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
        specs: [
          { label: "Elephant", value: "1 Decorated Elephant" },
          { label: "Mahout", value: "Certified Handler" },
          { label: "Decoration", value: "Traditional Ornaments" },
          { label: "Band Party", value: "20 Members" },
          { label: "Permits", value: "Arranged" },
          { label: "Duration", value: "1 hr" },
        ]
      },
      {
        id: 6, name: "Full Grand Baraat", desc: "Horse + car + band + DJ combo", price: 45000,
        img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        specs: [
          { label: "Includes", value: "Horse + Vintage Car" },
          { label: "Band Party", value: "20 Members" },
          { label: "DJ Truck", value: "Included" },
          { label: "Dhol Players", value: "4 Players" },
          { label: "Flower Shower", value: "Drone Petal Drop" },
          { label: "Duration", value: "3 hrs Full Procession" },
        ]
      },
    ],
  },
  {
    id: 11,
    icon: "🎬",
    title: "Videography",
    subtitle: "Relive Every Moment",
    desc: "Cinematic 4K wedding films with drone footage and highlight reels.",
    longDesc: "Sony FX3, DJI drones, professional stabilizers. Every package includes highlight reel, full ceremony recording, color-graded edit. Films delivered in 2 weeks.",
    highlights: ["4K Cinematic", "Drone Footage", "Highlight Reel", "Color Grading", "2 Week Delivery", "Online Link"],
    rating: 4.8, reviews: 176,
    styles: [
      {
        id: 1, name: "Cinematic Film", desc: "Bollywood-style cinematic edit", price: 20000,
        img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600",
        specs: [
          { label: "Coverage", value: "Full Day (8 hrs)" },
          { label: "Camera", value: "Sony FX3 4K" },
          { label: "Videographers", value: "2" },
          { label: "Highlight Reel", value: "5 Minutes" },
          { label: "Full Film", value: "30–45 Minutes" },
          { label: "Delivery", value: "14 Days" },
        ]
      },
      {
        id: 2, name: "Documentary Style", desc: "Real, unscripted storytelling", price: 15000,
        img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
        specs: [
          { label: "Coverage", value: "Full Day" },
          { label: "Style", value: "Raw Documentary" },
          { label: "Videographers", value: "1" },
          { label: "Highlight Reel", value: "3 Minutes" },
          { label: "Full Film", value: "60+ Minutes" },
          { label: "Delivery", value: "10 Days" },
        ]
      },
      {
        id: 3, name: "Drone Aerial Film", desc: "Stunning aerial wedding film", price: 25000,
        img: "https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=600",
        specs: [
          { label: "Drone", value: "DJI Mavic 3 Pro" },
          { label: "Drone Pilot", value: "Licensed" },
          { label: "Resolution", value: "4K / 5.1K" },
          { label: "Aerial Clips", value: "20+" },
          { label: "Combined Film", value: "Ground + Aerial" },
          { label: "Delivery", value: "14 Days" },
        ]
      },
      {
        id: 4, name: "Instagram Reels", desc: "Short reels for social media", price: 8000,
        img: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600",
        specs: [
          { label: "Reels Delivered", value: "5 Reels" },
          { label: "Duration Each", value: "30–60 seconds" },
          { label: "Format", value: "9:16 Vertical" },
          { label: "Music", value: "Trending Tracks" },
          { label: "Captions", value: "Included" },
          { label: "Delivery", value: "5 Days" },
        ]
      },
      {
        id: 5, name: "Full Coverage", desc: "Complete ceremony recording", price: 18000,
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
        specs: [
          { label: "Coverage", value: "Full Day (10 hrs)" },
          { label: "Cameras", value: "3 Angles" },
          { label: "Muhurtham", value: "Dedicated Close-up" },
          { label: "Full Film", value: "2+ Hours" },
          { label: "Highlight", value: "5 Min Reel" },
          { label: "Delivery", value: "14 Days" },
        ]
      },
      {
        id: 6, name: "Premium Package", desc: "Film + reels + drone combo", price: 35000,
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
        specs: [
          { label: "Includes", value: "Film + Reels + Drone" },
          { label: "Videographers", value: "3 Team" },
          { label: "Highlight Reel", value: "8 Minutes" },
          { label: "Instagram Reels", value: "5 Included" },
          { label: "Drone Coverage", value: "Full Day" },
          { label: "Delivery", value: "14 Days" },
        ]
      },
    ],
  },
  {
    id: 12,
    icon: "🎂",
    title: "Wedding Cake",
    subtitle: "Sweet Celebrations",
    desc: "Custom designed multi-tier wedding cakes by master bakers.",
    longDesc: "6+ years baking premium cakes. Belgian chocolate, fresh cream, organic ingredients. Eggless always available. Free delivery + setup in Coimbatore.",
    highlights: ["Belgian Chocolate", "Eggless Available", "Custom Design", "Free Delivery", "Theme Matching", "Tasting Session"],
    rating: 4.8, reviews: 119,
    styles: [
      {
        id: 1, name: "Floral White Cake", desc: "Elegant white fondant floral", price: 6000,
        img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600",
        specs: [
          { label: "Tiers", value: "3 Tier" },
          { label: "Weight", value: "3 kg" },
          { label: "Serves", value: "30–40 People" },
          { label: "Flavour", value: "Vanilla / Strawberry" },
          { label: "Eggless", value: "Available" },
          { label: "Delivery", value: "Free in Coimbatore" },
        ]
      },
      {
        id: 2, name: "Rustic Naked Cake", desc: "Natural rustic buttercream", price: 4500,
        img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
        specs: [
          { label: "Tiers", value: "2 Tier" },
          { label: "Weight", value: "2 kg" },
          { label: "Serves", value: "20–25 People" },
          { label: "Flavour", value: "Chocolate / Vanilla" },
          { label: "Topping", value: "Fresh Fruits" },
          { label: "Eggless", value: "Available" },
        ]
      },
      {
        id: 3, name: "Gold Drip Cake", desc: "Luxury gold drip design", price: 8000,
        img: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600",
        specs: [
          { label: "Tiers", value: "3 Tier" },
          { label: "Weight", value: "4 kg" },
          { label: "Serves", value: "40–50 People" },
          { label: "Flavour", value: "Dark Chocolate" },
          { label: "Finish", value: "Edible Gold Drip" },
          { label: "Eggless", value: "Available" },
        ]
      },
      {
        id: 4, name: "Floral 3-Tier", desc: "3-tier fresh flower cake", price: 10000,
        img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600",
        specs: [
          { label: "Tiers", value: "3 Tier" },
          { label: "Weight", value: "5 kg" },
          { label: "Serves", value: "50–60 People" },
          { label: "Topping", value: "Fresh Edible Flowers" },
          { label: "Flavour", value: "Red Velvet / Vanilla" },
          { label: "Tasting Session", value: "Included" },
        ]
      },
      {
        id: 5, name: "Traditional Sweet", desc: "Traditional Indian sweet cake", price: 3500,
        img: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600",
        specs: [
          { label: "Tiers", value: "1 Tier" },
          { label: "Weight", value: "2 kg" },
          { label: "Serves", value: "20 People" },
          { label: "Flavour", value: "Kesar / Badam" },
          { label: "Eggless", value: "Always" },
          { label: "Delivery", value: "Free" },
        ]
      },
      {
        id: 6, name: "Royal 5-Tier", desc: "Grand 5-tier luxury cake", price: 18000,
        img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600",
        specs: [
          { label: "Tiers", value: "5 Tier" },
          { label: "Weight", value: "10 kg" },
          { label: "Serves", value: "100–120 People" },
          { label: "Flavours", value: "4 Different Flavours" },
          { label: "Design", value: "Custom Theme" },
          { label: "Setup", value: "Baker Comes & Sets Up" },
        ]
      },
    ],
  },
];

const STEPS = ["Choose Style", "Your Details", "Confirm"];

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = serviceData.find((s) => s.id === parseInt(id));

  // Services that support quantity input
  const QUANTITY_SERVICES = {
    12: { label: "Number of Cakes", min: 1, unit: "cakes" },
    9:  { label: "Number of Cards", min: 100, unit: "cards" },
    4:  { label: "Number of Plates", min: 50, unit: "plates" },
  };
  const isQuantityService = !!QUANTITY_SERVICES[service.id];
  const qtyConfig = QUANTITY_SERVICES[service.id];

  const { addToCart, cartItems: globalCart } = useCart();

  const [expandedStyle, setExpandedStyle] = useState(null); // which card is expanded
  const [quantities, setQuantities] = useState({}); // { styleId: qty } for quantity services
  const [addedStyles, setAddedStyles] = useState({}); // { styleId: true } for feedback

  const getQty = (styleId) => quantities[styleId] || qtyConfig?.min || 1;

  const isInGlobalCart = (styleId) =>
    globalCart.some(i => i.serviceId === service.id && i.styleId === styleId);

  const handleAddToCart = (style) => {
    const qty = isQuantityService ? getQty(style.id) : 1;
    addToCart({
      serviceId: service.id,
      serviceTitle: service.title,
      serviceIcon: service.icon,
      styleId: style.id,
      styleName: style.name,
      styleImg: style.img,
      price: style.price,
      quantity: qty,
      unit: qtyConfig?.unit || "",
    });
    setAddedStyles(prev => ({ ...prev, [style.id]: true }));
    setTimeout(() => setAddedStyles(prev => ({ ...prev, [style.id]: false })), 2000);
  };

  // Keep old step flow for direct booking
  const [step, setStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", date: "", venue: "", guests: "", message: "" });
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(false);

  const totalPrice = selectedStyle
    ? isQuantityService ? selectedStyle.price * getQty(selectedStyle.id) : selectedStyle.price
    : 0;

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#0f0a1e" }}>
        <p className="text-5xl mb-4">😕</p>
        <p className="text-white text-xl mb-4">Service not found!</p>
        <button onClick={() => navigate("/services")}
          className="px-6 py-2 rounded-full text-white font-bold"
          style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
          Back to Services
        </button>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 0 && !selectedStyle) { setError("Please select a style!"); return; }
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.email || !formData.date) {
        setError("Please fill all required fields!"); return;
      }
      if (formData.phone.length !== 10) { setError("Enter valid 10 digit phone number!"); return; }
    }
    setError("");
    setStep(step + 1);
  };

  const handleConfirm = () => {
    console.log("Booking:", { service: service.title, style: selectedStyle, quantity: isQuantityService ? getQty(selectedStyle.id) : 1, totalPrice, ...formData });
    setBooked(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (booked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#0f0a1e" }}>
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Booking Confirmed!</h1>
        <p style={{ color: "rgba(255,255,255,0.6)" }} className="mb-2">Thank you, <span className="text-white font-bold">{formData.name}</span>!</p>
        <p style={{ color: "rgba(255,255,255,0.6)" }} className="mb-8">We'll contact you on <span className="text-white font-bold">{formData.phone}</span> within 2 hours.</p>
        <div className="p-6 rounded-3xl mb-8 text-left w-full max-w-md"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.2)" }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#d4af37", letterSpacing: "0.2em" }}>Booking Summary</p>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: "Service", value: service.title },
              { label: "Style", value: selectedStyle?.name },
              { label: "Date", value: formData.date },
              { label: "Guests", value: formData.guests || "—" },
              { label: "Venue", value: formData.venue || "—" },
              { label: "Price", value: `₹${selectedStyle?.price.toLocaleString()}` },
            ].map((item, i) => (
              <div key={i} className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                <span className={`font-semibold ${item.label === "Price" ? "text-xl" : "text-white"}`}
                  style={item.label === "Price" ? { color: "#d4af37" } : {}}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => navigate("/")}
          className="px-8 py-3 rounded-full font-bold text-white"
          style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
          Back to Home 🏠
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0f0a1e" }}>

      {/* Hero */}
      <div className="relative py-14 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 100%)" }}>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url(${service.styles[0].img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(25px)" }} />
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-3">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #d4af37)" }} />
            <span className="mx-3 text-2xl">{service.icon}</span>
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #d4af37)" }} />
          </div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>{service.subtitle}</p>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>{service.title}</h1>
          <p className="max-w-xl mx-auto text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>{service.desc}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,175,55,0.25)" }}>
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-white text-sm font-bold">{service.rating}</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>({service.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {i > 0 && <div className="flex-1 h-px" style={{ background: i <= step ? "#c084fc" : "rgba(255,255,255,0.1)" }} />}
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                  style={{
                    background: i < step ? "linear-gradient(135deg, #c084fc, #f472b6)" : i === step ? "rgba(192,132,252,0.2)" : "rgba(255,255,255,0.05)",
                    border: i === step ? "2px solid #c084fc" : i < step ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: i <= step ? "#fff" : "rgba(255,255,255,0.3)",
                  }}>
                  {i < step ? "✓" : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className="flex-1 h-px" style={{ background: i < step ? "#c084fc" : "rgba(255,255,255,0.1)" }} />}
              </div>
              <p className="text-xs mt-2 font-medium" style={{ color: i === step ? "#c084fc" : "rgba(255,255,255,0.35)" }}>{s}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm text-center"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* STEP 0 — Choose Style */}
        {step === 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>Choose Your Style</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Pick the style that matches your vision ✨</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {service.styles.map((style) => {
                const isSelected = selectedStyle?.id === style.id;
                const isExpanded = expandedStyle === style.id;
                const inCart = isInGlobalCart(style.id);
                const justAdded = addedStyles[style.id];
                const qty = getQty(style.id);
                return (
                  <div key={style.id}
                    className="rounded-3xl overflow-hidden transition-all duration-300"
                    style={{
                      border: isExpanded ? "2px solid #c084fc" : inCart ? "2px solid #d4af37" : "1px solid rgba(255,255,255,0.07)",
                      boxShadow: isExpanded ? "0 0 30px rgba(192,132,252,0.25)" : "none",
                      background: "rgba(255,255,255,0.03)",
                    }}>

                    {/* Card Header — always visible, click to expand */}
                    <div className="relative h-44 overflow-hidden cursor-pointer"
                      onClick={() => setExpandedStyle(isExpanded ? null : style.id)}>
                      <img src={style.img} alt={style.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{ transform: isExpanded ? "scale(1.05)" : "scale(1)" }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.9) 0%, transparent 50%)" }} />

                      {/* In cart badge */}
                      {inCart && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                          style={{ background: "rgba(212,175,55,0.9)", color: "#000" }}>
                          🛒 In Cart
                        </div>
                      )}

                      {/* Expand indicator */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-transform duration-300"
                        style={{ background: "rgba(255,255,255,0.15)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                        ▾
                      </div>

                      <div className="absolute bottom-3 left-4">
                        <p className="text-white font-bold text-lg">{style.name}</p>
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{style.desc}</p>
                      </div>

                      {/* Price always visible */}
                      <div className="absolute bottom-3 right-4">
                        <p className="font-bold text-lg" style={{ color: "#d4af37" }}>₹{style.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="p-4">
                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {style.specs.map((spec, si) => (
                            <div key={si} className="p-2 rounded-xl"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{spec.label}</p>
                              <p className="text-xs font-semibold text-white">{spec.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Quantity input for Cake / Invitation / Catering */}
                        {isQuantityService && (
                          <div className="mb-4 p-4 rounded-2xl" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                            <p className="text-sm font-bold text-white mb-3">{qtyConfig.label}</p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setQuantities(prev => ({ ...prev, [style.id]: Math.max(qtyConfig.min, (prev[style.id] || qtyConfig.min) - (service.id === 4 ? 10 : 1)) }))}
                                className="w-9 h-9 rounded-full font-bold flex items-center justify-center"
                                style={{ background: "rgba(239,68,68,0.2)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)" }}>−</button>
                              <input
                                type="number"
                                value={qty}
                                min={qtyConfig.min}
                                onChange={e => setQuantities(prev => ({ ...prev, [style.id]: Math.max(qtyConfig.min, parseInt(e.target.value) || qtyConfig.min) }))}
                                className="flex-1 text-center text-white text-lg font-bold py-2 rounded-xl outline-none"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.3)" }}
                              />
                              <button
                                onClick={() => setQuantities(prev => ({ ...prev, [style.id]: (prev[style.id] || qtyConfig.min) + (service.id === 4 ? 10 : 1) }))}
                                className="w-9 h-9 rounded-full font-bold flex items-center justify-center"
                                style={{ background: "rgba(192,132,252,0.2)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.4)" }}>+</button>
                            </div>
                            <div className="flex justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
                              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>₹{style.price.toLocaleString()} × {qty} {qtyConfig.unit}</p>
                              <p className="font-bold" style={{ color: "#d4af37" }}>₹{(style.price * qty).toLocaleString()}</p>
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3">
                          {/* Add to Cart */}
                          <button
                            onClick={() => handleAddToCart(style)}
                            className="flex-1 py-3 rounded-2xl font-bold text-white transition hover:opacity-90"
                            style={{ background: justAdded ? "rgba(34,197,94,0.8)" : inCart ? "rgba(212,175,55,0.3)" : "rgba(192,132,252,0.2)", border: inCart ? "1px solid #d4af37" : "1px solid rgba(192,132,252,0.4)", color: inCart ? "#d4af37" : "#c084fc" }}>
                            {justAdded ? "✓ Added!" : inCart ? "🛒 Update Cart" : "+ Add to Cart"}
                          </button>

                          {/* Book Now directly */}
                          <button
                            onClick={() => { setSelectedStyle(style); setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="flex-1 py-3 rounded-2xl font-bold text-white transition hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                            Book Now →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Highlights */}
            <div className="p-5 rounded-2xl mb-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.1)" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#d4af37", letterSpacing: "0.2em" }}>All styles include</p>
              <div className="flex flex-wrap gap-2">
                {service.highlights.map((h, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(192,132,252,0.08)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                    ✦ {h}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg transition hover:opacity-90"
              style={{ background: selectedStyle ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(255,255,255,0.06)", cursor: selectedStyle ? "pointer" : "not-allowed" }}>
              {selectedStyle ? `Continue with "${selectedStyle.name}" →` : "Select a style to continue"}
            </button>
          </div>
        )}

        {/* STEP 1 — Details */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>Your Details</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Fill in your event details 📋</p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl mb-6"
              style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)" }}>
              <img src={selectedStyle?.img} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-white font-bold">{selectedStyle?.name}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{service.title}</p>
              </div>
              <p className="font-bold text-xl ml-4" style={{ color: "#d4af37" }}>₹{selectedStyle?.price.toLocaleString()}</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Full Name *", name: "name", type: "text", placeholder: "Enter your full name" },
                { label: "Phone Number *", name: "phone", type: "tel", placeholder: "10 digit phone number" },
                { label: "Email Address *", name: "email", type: "email", placeholder: "Enter your email" },
                { label: "Event Date *", name: "date", type: "date", placeholder: "" },
                { label: "Venue / Location", name: "venue", type: "text", placeholder: "Enter event venue or city" },
                { label: "Number of Guests", name: "guests", type: "number", placeholder: "Approx guest count" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium block mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{field.label}</label>
                  <input type={field.type} name={field.name} value={formData[field.name]}
                    onChange={handleChange} placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl outline-none transition text-white"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={e => e.target.style.borderColor = "#c084fc"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium block mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Special Requirements</label>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="Any special requests..."
                  rows={3} className="w-full px-4 py-3 rounded-xl outline-none text-white resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => e.target.style.borderColor = "#c084fc"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(0)}
                className="flex-1 py-4 rounded-2xl font-bold transition"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                ← Back
              </button>
              <button onClick={handleNext}
                className="w-2/3 py-4 rounded-2xl font-bold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                Review Booking →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Confirm */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>Review & Confirm</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Double-check your booking details 🎯</p>
            </div>

            <div className="p-6 rounded-3xl mb-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.2)" }}>
              <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#d4af37", letterSpacing: "0.2em" }}>Booking Summary</p>

              <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <img src={selectedStyle?.img} alt="" className="w-20 h-16 rounded-xl object-cover" />
                <div>
                  <p className="text-white font-bold text-lg">{service.title}</p>
                  <p style={{ color: "#c084fc" }}>{selectedStyle?.name}</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{selectedStyle?.desc}</p>
                </div>
              </div>

              {/* Specs quick view */}
              <div className="grid grid-cols-3 gap-2 mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {selectedStyle?.specs.slice(0, 3).map((spec, i) => (
                  <div key={i} className="p-2 rounded-xl text-center"
                    style={{ background: "rgba(192,132,252,0.08)" }}>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{spec.label}</p>
                    <p className="text-xs font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Name", value: formData.name },
                  { label: "Phone", value: formData.phone },
                  { label: "Email", value: formData.email },
                  { label: "Date", value: formData.date },
                  { label: "Venue", value: formData.venue || "—" },
                  { label: "Guests", value: formData.guests || "—" },
                ].map((item, i) => (
                  <div key={i}>
                    <p style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-5 rounded-2xl mb-6"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Total Amount</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Final price confirmed after our call</p>
              </div>
              <p className="text-3xl font-extrabold" style={{ color: "#d4af37" }}>₹{selectedStyle?.price.toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl font-bold transition"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                ← Edit
              </button>
              <button onClick={handleConfirm}
                className="w-2/3 py-4 rounded-2xl font-bold text-white text-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                Confirm Booking 🚀
              </button>
            </div>
          </div>
        )}
      </div>

      <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 text-2xl hover:scale-110 transition"
        style={{ background: "#25D366" }} title="Chat on WhatsApp">
        💬
      </a>
    </div>
  );
};

export default ServiceDetail;