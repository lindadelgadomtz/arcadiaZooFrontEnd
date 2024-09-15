document.addEventListener("DOMContentLoaded", () => {
    // Show or hide elements based on user roles and connection status
    showAndHideElementsForRoles();
  
    // Update "Mon Espace" link based on role
    updateMonEspaceLink();
  });
  
  const tokenCookieName = "accesstoken";
  const roleCookieName = "role";
  const userIdCookieName = 'userId'
  const signoutBtn = document.getElementById("signout-btn");
  const apiUrl = "https://arcadiazoo-backend-03da514839c5.herokuapp.com/api/";
  
  signoutBtn.addEventListener("click", signout);
  
  function getRole(){
      return getCookie(roleCookieName);
  }
  
  function signout(){
      eraseCookie(tokenCookieName);
      eraseCookie(roleCookieName);
      showAndHideElementsForRoles();
      window.location.replace("/");
  }
  
  function setToken(token) {
      console.log("Setting token:", token); // Log setting token
      setCookie(tokenCookieName, token, 7);
  }
  
  function getToken() {
      return getCookie(tokenCookieName);
  }
  
  function setCookie(name, value, days) {
      console.log("Setting cookie:", name, value); // Log setting cookie
      let expires = "";
      if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
      console.log("Cookie set:", document.cookie); // Confirm cookie set and log all cookies
  }
  
  function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
  }
  
  function eraseCookie(name) {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  
  function isConnected() {
      return getToken() !== null;
  }
  
  function showAndHideElementsForRoles() {
      const userConnected = isConnected();
      const role = getRole();
      
      let allElementsToEdit = document.querySelectorAll('[data-show]');
      console.log(allElementsToEdit);
  
      allElementsToEdit.forEach(element => {
          // Reset class for all elements to make sure they start in default state
          element.classList.remove("d-none");
          const roles = element.dataset.show.split(',');
  
          switch (element.dataset.show) {
              case 'disconnected':
                  if (userConnected) {
                      element.classList.add("d-none");
                  }
                  break;
              case 'connected':
                  if (!userConnected) {
                      element.classList.add("d-none");
                  }
                  break;
              case 'admin':
                  if (!userConnected || role !== "ROLE_MANAGER") {
                      element.classList.add("d-none");
                  }
                  break;
              case 'employee':
                  if (!userConnected || role !== "ROLE_EMPLOYEE") {
                      element.classList.add("d-none");
                  }
                  break;
              case 'veterinaire':
                  if (!userConnected || role !== "ROLE_VETERINAIRE") {
                      element.classList.add("d-none");
                  }
                  break;
          }
      });
  }
  
  function updateMonEspaceLink() {
      const userRole = getRole(); // Get user role from cookies
      console.log("userRole=", userRole);
      // Update "Mon Espace" link based on role
      const monEspaceLink = document.getElementById("monEspaceLink");
      if (monEspaceLink) {
          if (isConnected()) {
              switch (userRole)

               {
                  case 'ROLE_VETERINAIRE':
                      monEspaceLink.href = '/veterinaire'; // Link to the veterinarian page
                      break;
                  case 'ROLE_EMPLOYEE':
                      monEspaceLink.href = '/employee'; // Link to the employee page
                      break;
                  case 'ROLE_MANAGER':
                      monEspaceLink.href = '/administrateur'; // Link to the administrator page
                      break;
                  default:
                      monEspaceLink.href = '/connexion'; // Default or fallback
                      break;
              }
          } else {
              monEspaceLink.classList.add("d-none"); // Hide link if not connected
          }
      }
  }
  



// const tokenCookieName = "accesstoken";
// const roleCookieName = "role";
// const userIdCookieName = 'userId'
// const signoutBtn = document.getElementById("signout-btn");
// const apiUrl = "https://arcadiazoo-backend-03da514839c5.herokuapp.com/api/";

// signoutBtn.addEventListener("click", signout);

// function getRole(){
//     return getCookie(roleCookieName);
// }

// function signout(){
//     eraseCookie(tokenCookieName);
//     eraseCookie(roleCookieName);
//     showAndHideElementsForRoles();
//     window.location.reload();
// }

// function setToken(token) {
//     console.log("Setting token:", token); // Log setting token
//     setCookie(tokenCookieName, token, 7);
// }

// function getToken() {
//     return getCookie(tokenCookieName);
// }

// function setCookie(name, value, days) {
//     console.log("Setting cookie:", name, value); // Log setting cookie
//     let expires = "";
//     if (days) {
//         const date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = "; expires=" + date.toUTCString();
//     }
//     document.cookie = name + "=" + (value || "") + expires + "; path=/";
//     console.log("Cookie set:", document.cookie); // Confirm cookie set and log all cookies
// }

// function getCookie(name) {
//     var nameEQ = name + "=";
//     var ca = document.cookie.split(';');
//     for (var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') c = c.substring(1, c.length);
//         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
//     }
//     return null;
// }

// function eraseCookie(name) {
//     document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
// }

// function isConnected() {
//     return getToken() !== null;
// }

// /*
// disconnected
// connected (admin ou vet ou employe)
//     -admin
//     -vet
//     -employe

//     */


//     function showAndHideElementsForRoles() {
//         const userConnected = isConnected();
//         const role = getRole();
    
//         let allElementsToEdit = document.querySelectorAll('[data-show]');
//         console.log(allElementsToEdit)
    
//         allElementsToEdit.forEach(element => {
//             // Reset class for all elements to make sure they start in default state
//             element.classList.remove("d-none");
//             const roles = element.dataset.show.split(',');

    
//             switch (element.dataset.show) {
//                 case 'disconnected':
//                     if (userConnected) {
//                         element.classList.add("d-none");
//                     }
//                     break;
//                 case 'connected':
//                     if (!userConnected) {
//                         element.classList.add("d-none");
//                     }
//                     break;
//                 case 'admin':
//                     if (!userConnected || role !== "ROLE_MANAGER") {
//                         element.classList.add("d-none");
//                     }
//                     break;
//                 case 'employe':
//                     if (!userConnected || role !== "ROLE_EMPLOYEE") {
//                         element.classList.add("d-none");
//                     }
//                     break;
//                 case 'veterinaire':
//                     if (!userConnected || role !== "ROLE_VETERINAIRE") {
//                         element.classList.add("d-none");
//                     }
//                     break;
//             }
//         });
//     }
    
//     document.addEventListener("DOMContentLoaded", showAndHideElementsForRoles);

//     document.addEventListener("DOMContentLoaded", () => {
//         // Simulate fetching the user role. In a real application, this might come from a session or API call.
//         const userRole = getUserRole(); // Function to get the user role (e.g., from a cookie or API).
      
//         // Update "Mon Espace" link based on role.
//         const monEspaceLink = document.getElementById("monEspaceLink");
//         if (monEspaceLink) {
//           switch (userRole) {
//             case 'veterinaire':
//               monEspaceLink.href = '/veterinaire'; // Link to the veterinarian page
//               break;
//             case 'employee':
//               monEspaceLink.href = '/employee'; // Link to the employee page
//               break;
//             case 'administrateur':
//               monEspaceLink.href = '/administrateur'; // Link to the administrator page
//               break;
//             default:
//               monEspaceLink.href = '/connexion'; // Redirect to login or default page
//               break;
//           }
//         }
//       });
//       function getUserRole() {
//         const cookies = document.cookie.split(';');
//         const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='));
//         return roleCookie ? roleCookie.split('=')[1] : 'default';
//       }      