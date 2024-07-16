import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
new Route("/", "Accueil", "/pages/home.html"),
new Route("/services", "Nos Services", "/pages/services.html"),
new Route("/avis", "Avis", "/pages/avis.html"),
new Route("/connexion", "Connexion", "/pages/connexion.html"),
new Route("/contact", "Contact", "/pages/contact.html"),

];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia Zoo";