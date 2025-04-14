import { PointOfInterest } from "../types/map";

// Sample point of interest data
export const pointsOfInterest: PointOfInterest[] = [
  {
    id: "1",
    title: "Nuenen",
    description:
      "The village where Vincent van Gogh lived and worked from 1883 to 1885. Today, it features many references to the famous painter.",
    coordinate: {
      latitude: 51.4583,
      longitude: 5.5583,
    },
    image:
      "https://images.unsplash.com/photo-1550686041-366ad85a1355?q=80&w=600&auto=format",
    category: "historical",
  },
  {
    id: "2",
    title: "Eindhoven - Philips Museum",
    description:
      "A museum dedicated to the history of Philips and its technological innovations, located in the first factory of Philips in the center of Eindhoven.",
    coordinate: {
      latitude: 51.4382,
      longitude: 5.4784,
    },
    image:
      "https://images.unsplash.com/photo-1564565562150-46c2e7938b3d?q=80&w=600&auto=format",
    category: "museum",
  },
  {
    id: "3",
    title: "Helmond Castle",
    description:
      "One of the largest moated castles in the Netherlands, dating back to the 14th century. Now houses the Museum Helmond.",
    coordinate: {
      latitude: 51.4826,
      longitude: 5.6552,
    },
    image:
      "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=600&auto=format",
    category: "historical",
  },
];
