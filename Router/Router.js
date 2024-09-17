import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Route for 404 page
const route404 = new Route("404", "Page introuvable", "/pages/404.html");

// Function to get the route for a URL
const getRouteByUrl = (url) => {
    let currentRoute = allRoutes.find(route => route.url === url);
    return currentRoute || route404;
};

// Function to load and inject page content
const loadContentPage = async () => {
    const path = window.location.pathname;
    const route = getRouteByUrl(path);

    // Load HTML content from the route
    const response = await fetch(route.pathHtml);
    const html = await response.text();

    // Parse the HTML and extract content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract the main content and inject it into the main page
    const content = doc.querySelector("main").innerHTML;
    document.getElementById("main-page").innerHTML = content;

    // Inject JavaScript if needed
    if (route.pathJS) {
        const scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "module");
        scriptTag.setAttribute("src", route.pathJS);
        document.body.appendChild(scriptTag);
    }

    // Update the document title
    document.title = route.title + " - " + websiteName;
};

// Handle route events
const routeEvent = (event) => {
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    loadContentPage();
};

// Initialize routing and event listeners
window.addEventListener('popstate', loadContentPage);
window.route = routeEvent;
window.addEventListener('load', loadContentPage);
