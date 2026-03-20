import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

const url = (img: string | { src: string }) => (typeof img === "string" ? img : img.src);

L.Icon.Default.mergeOptions({
  iconUrl: url(icon),
  iconRetinaUrl: url(iconRetina),
  shadowUrl: url(shadow)
});
