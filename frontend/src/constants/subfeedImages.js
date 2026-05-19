import c13Img from '../assets/c13.png';
import c19Img from '../assets/c19.png';
import nemaImg from '../assets/nema.png';

/**
 * Static image map for Subfeed Breaker outlet types.
 * Keys match the `value` field returned from options.outlet_type in the metadata API.
 */
export const subfeedImages = {
  C13: c13Img,
  C19: c19Img,
  NEMA_5_20R: nemaImg
};
