(function(window, document, sessionStorage){
  "use strict";

  var target_language;
  var language_dict = {
    "ENGLISH": {
      "WYSOKI POZIOM AKTORSTWA": "ACTRESS",
      "METR OSIEMDZIESIAT CZTERY": "1,84m",
      "O MNIE": "ABOUT ME",
      "FOTO": "PHOTO",
      "WIDEO": "VIDEO",
      "AUDIO": "AUDIO",
      "KONTAKT": "CONTACT",
      "LANGUAGE": "POLSKIE",
      "CV": "CV",
      "Temat": "Subject",
      "Wiadomość": "Message",
      "Wyślij": "Send",
      "Zapytania i wnioski rezerwacji": "Inquiries & Booking requests"
    },
    "POLSKIE": {
      "WYSOKI POZIOM AKTORSTWA": "WYSOKI POZIOM AKTORSTWA",
      "METR OSIEMDZIESIAT CZTERY": "METR OSIEMDZIESIAT CZTERY",
      "O MNIE": "O MNIE",
      "FOTO": "FOTO",
      "WIDEO": "WIDEO",
      "AUDIO": "AUDIO",
      "KONTAKT": "KONTAKT",
      "LANGUAGE": "ENGLISH",
      "CV": "CV",
      "Temat": "Temat",
      "Wiadomość": "Wiadomo&#347;&#263;",
      "Wyślij": "Wy&#347;lij",
      "Zapytania i wnioski rezerwacji": "Zapytania i wnioski rezerwacji"
    }
  };

  /* ================= MENU ======================== */
  /*    
    Toggle between adding and removing the "responsive" class to topnav 
    when the user clicks on the icon 
  */
  function page_swapResponsiveMenu() {
    var menu = document.querySelector(".custom-navigation-container ul"),
      has_class = menu.className;
    if (has_class) {
      menu.className = "";
    } else {
      menu.className = "custom-responsive";
    }
  }
  window.page_swapResponsiveMenu = page_swapResponsiveMenu;

  /* ================= CAROUSEL ======================== */
  /* 
    Launch the flickity carousel at the respective index 
  */
  function page_launchCarousel(launchImageIndex) {
    var wrapper = document.querySelector('.custom-carousel-wrapper'),
      flick,
      carousel;
  
    if (wrapper) {
      wrapper.className += " custom-carousel-wrapper-active";
      window.scroll(0,0);
      document.body.className = "custom-freeze-layout";
      if (flick === undefined) {
        carousel =  document.querySelector('.custom-image-carousel .carousel');
        flick = new Flickity( carousel, {
          "wrapAround": true, 
          "lazyLoad": true,
          "initialIndex": launchImageIndex || 0
        });
      }
    }
  }
  window.page_launchCarousel = page_launchCarousel;
  
  function page_hideCarousel() {
    var wrapper = document.querySelector('.custom-carousel-wrapper');

    document.body.className = "";
    wrapper.className = "custom-carousel-wrapper";
  }
  window.page_hideCarousel = page_hideCarousel;

  /* ================= TRANSLATION ======================== */

  /*
  Translate between English/Polish. Using http://i18next.com/ logic (not the
  full library)
  */
  function page_changeLanguage(my_defined_language) {
    var i,
      i_len, 
      l, 
      l_len, 
      element, 
      lookup, 
      translate_list, 
      target,
      element_language,
      target_language,
      element_list;

    if (my_defined_language === undefined) {
      element_language = document.querySelector("[data-i18n=LANGUAGE]");
      target_language = element_language.textContent;
    } else {
      target_language = my_defined_language;
    }

    sessionStorage.setItem("current_language", target_language);
    element_list = document.querySelectorAll("[data-i18n]");

    function translate(my_string) {
      return language_dict[target_language][my_string];    
    }
  
    for (i = 0, i_len = element_list.length; i < i_len; i += 1) {
      element = element_list[i];
      lookup = element.getAttribute("data-i18n");
  
      if (lookup) {
        translate_list = lookup.split(";");
  
        for (l = 0, l_len = translate_list.length; l < l_len; l += 1) {
          target = translate_list[l].split("]");
  
          switch (target[0]) {
            case "[placeholder":
            case "[alt":
            case "[title":
              element.setAttribute(target[0].substr(1), translate(target[1]));
              break;
            case "[value":
              has_breaks = element.previousSibling.textContent.match(/\n/g);
  
              // JQM inputs > this avoids calling checkboxRadio("refresh")!
              if (element.tagName === "INPUT") {
                switch (element.type) {
                case "submit":
                case "reset":
                case "button":
                  route_text = true;
                  break;
                }
              }
              if (route_text && (has_breaks || []).length === 0) {
                element.previousSibling.textContent = translate(target[1]);
              }
              element.value = translate(target[1]);
              break;
            case "[parent":
              element.parentNode.childNodes[0].textContent =
                  translate(target[1]);
              break;
            case "[node":
              element.childNodes[0].textContent = translate(target[1]);
              break;
            case "[last":
              // if null, append, if textnode replace, if span, appned
              if (element.lastChild && element.lastChild.nodeType === 3) {
                element.lastChild.textContent = translate(target[1]);
              } else {
                element.appendChild(document.createTextNode(translate(target[1])));
              }
              break;
            case "[html":
              element.innerHTML = translate(target[1]);
              break;
            default:
              // NOTE: be careful of emptying elements with children!
              //while (element.hasChildNodes()) {
              //  element.removeChild(element.lastChild);
              //}
              //element.appendChild(document.createTextNode(translate(translate_list[l])));
              //element.appendChild(document.createElement("span"));
              element.textContent = translate(translate_list[l]);
              break;
            }
          }
        }
      }
  }
  
  // expose on window
  window.page_changeLanguage = page_changeLanguage;

  // set initial language and language on loading page
  target_language = sessionStorage.getItem("current_language") || "POLSKIE";
  window.page_changeLanguage(target_language);


})(window, document, sessionStorage);