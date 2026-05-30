export const terrains = [
  {
    id: 1,
    name: "الملعب الألفا",
    type: "5 ضد 5",
    size: "25×45 م",
    price: 150,
    currency: "درهم / ساعة",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80",
    features: ["إضاءة LED", "عشب الجيل 5", "حراسة"],
  },
  {
    id: 2,
    name: "الملعب بيتا",
    type: "7 ضد 7",
    size: "35×55 م",
    price: 200,
    currency: "درهم / ساعة",
    image: "https://cdn.rents.ma/storage/listinglarge/football/football-for-rent_67dc94134e9f5.webp",
    features: ["إضاءة LED", "تصوير", "غرف تبديل"],
  },
  {
    id: 3,
    name: "الملعب غاما",
    type: "11 ضد 11",
    size: "68×105 م",
    price: 350,
    currency: "درهم / ساعة",
    image: "https://cdn.rents.ma/storage/listinglarge/football/football-for-rent_67dc9413a9e87.webp",
    features: ["مغطى", "مدرجات", "كافيتيريا"],
  },
];

// Generate time slots for today
const today = new Date();
export function generateSlots(terrainId) {
  const hours = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
  const now = today.getHours();
  return hours.map((h) => ({
    id: `${terrainId}-${h}`,
    hour: h,
    label: `${String(h).padStart(2,"0")}:00`,
    available: h > now && Math.random() > 0.35,
  }));
}