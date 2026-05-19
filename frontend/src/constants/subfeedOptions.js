import c13Img from '../assets/c13.png';
import c19Img from '../assets/c19.png';
import nemaImg from '../assets/nema.png';

export const subfeedOptions = [
  {
    type: "C13",
    label: "C13 (IEC 60320)",
    maxQuantity: 24,
    image: c13Img,
    features: ["standard", "lockable", "fused"]
  },
  {
    type: "C19",
    label: "C19 (IEC 60320)",
    maxQuantity: 16,
    image: c19Img,
    features: ["standard", "lockable", "fused"]
  },
  {
    type: "NEMA_5_20R",
    label: "NEMA 5-20R",
    maxQuantity: 12,
    image: nemaImg,
    features: ["standard"]
  }
];
