import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
new Route("/", "Accueil", "/pages/home.html"),
new Route("/services", "Nos Services", "/pages/services.html", "/js/auth/services.js"),
new Route("/avis", "Avis", "/pages/avis.html", "/js/auth/avis.js" ),
new Route("/connexion", "Connexion", "/pages/connexion.html", "/js/auth/connexion.js"),
new Route("/contact", "Contact", "/pages/contact.html"),
new Route("/habitats", "Habitats", "/pages/habitats.html", "/js/auth/habitats.js"),
new Route("/horaires", "Nos horaires", "/pages/horaires.html"),
new Route("/animaux", "Nos animaux", "/pages/animaux.html"),
new Route("/administrateur", "Administrateur", "/pages/administrateur.html", "/js/auth/registration.js"),
new Route("/employee", "Employee", "/pages/employee.html"),

];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia Zoo";