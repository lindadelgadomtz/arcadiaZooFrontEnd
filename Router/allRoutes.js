import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
new Route("/", "Accueil", "/pages/home.html"),
new Route("/services", "Nos Services", "/pages/services.html"),
new Route("/avis", "Avis", "/pages/avis.html"),

];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia Zoo";