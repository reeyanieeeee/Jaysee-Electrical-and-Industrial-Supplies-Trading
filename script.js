/* burger */
 function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';
}

function selectLink(el) {
  document.querySelectorAll('.dropdown-menu a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  setTimeout(() => {
    document.getElementById('dropdownMenu').style.display = 'none';
  }, 150);
}

document.addEventListener('click', function(e) {
  const menu = document.getElementById('dropdownMenu');
  const btn = document.getElementById('hamburgerBtn');
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.style.display = 'none';
  }
});

// CAROUSEL 
const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const cardsContainer = document.getElementById("cards");

let index = 0;
let duration = 4000;
let timerInterval;

function updateCarousel() {
  if (!cards.length) return;

  cards.forEach((card, i) => {
    card.classList.remove("active");
    if (dots[i]) dots[i].classList.remove("active");

    const timer = card.querySelector(".timer");
    if (timer) {
      timer.style.background =
        "conic-gradient(#ffb000 0deg, transparent 0deg)";
    }
  });

  if (cards[index]) cards[index].classList.add("active");
  if (dots[index]) dots[index].classList.add("active");

  if (cardsContainer && cards[0]) {
    const cardWidth = cards[0].offsetWidth + 20;
    const offset = (index - Math.floor(cards.length / 2)) * cardWidth;
    cardsContainer.style.transform = `translateX(${-offset}px)`;
  }

  startTimer();
}

function nextSlide() {
  if (!cards.length) return;
  index = (index + 1) % cards.length;
  updateCarousel();
}

function prevSlide() {
  if (!cards.length) return;
  index = (index - 1 + cards.length) % cards.length;
  updateCarousel();
}

if (cards.length) {
  updateCarousel();

  if (nextBtn) nextBtn.onclick = nextSlide;
  if (prevBtn) prevBtn.onclick = prevSlide;
}

// TIMER
function startTimer() {
  if (!cards.length) return;

  clearInterval(timerInterval);

  let start = Date.now();
  const activeCard = cards[index];
  if (!activeCard) return;

  const timer = activeCard.querySelector(".timer");
  if (!timer) return;

  timerInterval = setInterval(() => {
    let elapsed = Date.now() - start;
    let progress = (elapsed / duration) * 360;

    timer.style.background =
      `conic-gradient(#f4b400 ${progress}deg, transparent ${progress}deg)`;

    if (elapsed >= duration) {
      clearInterval(timerInterval);
      nextSlide();
    }
  }, 50);
}

// SEARCH BAR
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');

if (searchInput) {
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      runSearch();
    }
  });
}

if (searchBtn) {
  searchBtn.addEventListener('click', runSearch);
}

function runSearch() {
  const searchField = document.querySelector('#search-input');

  if (!searchField) return;

  const searchTerm = searchField.value.trim().toLowerCase();
  const allItems = document.querySelectorAll('.sidebar-list > li');

  let visibleCount = 0;

  allItems.forEach(li => {
    const mainLabel = li.querySelector('.item-label span');
    const popupItems = li.querySelectorAll('.popup-items li');
    const checkbox = li.querySelector('.pop-trigger');

    let match = false;

    // Main category match
    if (
      mainLabel &&
      mainLabel.textContent.toLowerCase().includes(searchTerm)
    ) {
      match = true;
    }

    // Sub-item match
    popupItems.forEach(item => {
      if (
        item.textContent.toLowerCase().includes(searchTerm)
      ) {
        match = true;
      }
    });

    // Empty search = show all
    if (searchTerm === '') {
      li.style.display = '';
      if (checkbox) checkbox.checked = false;
      visibleCount++;
      return;
    }

    if (match) {
      li.style.display = '';
      visibleCount++;

      // Open matching category automatically
      if (checkbox && popupItems.length > 0) {
        checkbox.checked = true;
      }
    } else {
      li.style.display = 'none';
      if (checkbox) checkbox.checked = false;
    }
  });

  let noResult = document.getElementById('no-result');

  if (!noResult) {
    noResult = document.createElement('li');
    noResult.id = 'no-result';
    noResult.textContent = 'No results found.';
    noResult.style.color = '#999';
    noResult.style.padding = '10px';
    noResult.style.listStyle = 'none';

    const list = document.querySelector('.sidebar-list');
    if (list) list.appendChild(noResult);
  }

  noResult.style.display =
    visibleCount === 0 && searchTerm !== ''
      ? 'block'
      : 'none';
}
 
/*SIDEBAR*/ 
const checkboxes = document.querySelectorAll('.pop-trigger'); 
 
   checkboxes.forEach(checkbox => { 
       checkbox.addEventListener('change', function() { 
           if (this.checked) { 
               checkboxes.forEach(other => { 
                   if (other !== this) { 
                       other.checked = false; 
                   } 
                    const popup = this.nextElementSibling.nextElementSibling; 
                     if (popup) { 
                       popup.scrollTop = 0; 
                       } 
               }); 
           } 
       }); 
   }); 
 
   document.addEventListener('click', function(event) { 
       const sidebar = document.querySelector('.sidebar'); 
       if (sidebar && !sidebar.contains(event.target)) { 
           checkboxes.forEach(cb => cb.checked = false); 
       } 
   }); 

// CONTACT FORM 
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const popup = document.getElementById("successPopup");
    const closePopup = document.getElementById("closePopup");

    const fields = [
        {
            input: nameInput,
            error: nameInput.nextElementSibling
        },
        {
            input: emailInput,
            error: emailInput.nextElementSibling
        },
        {
            input: messageInput,
            error: messageInput.nextElementSibling
        }
    ];

    emailjs.init("CEyCAVLWm4dRSm6fg");

    // NO NUMBERS IN NAME 
    nameInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
    });

    // REMOVE ERROR WHEN TYPING 
    fields.forEach(field => {

        field.input.addEventListener("input", () => {

            if (field.input.value.trim() !== "") {
                field.input.classList.remove("error");
                field.error.classList.remove("show");
            }

        });

    });

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        let valid = true;

        // RESET
        fields.forEach(field => {
            field.input.classList.remove("error");
            field.error.classList.remove("show");
        });

        // EMPTY CHECK 
        fields.forEach(field => {

            if (field.input.value.trim() === "") {

                field.input.classList.add("error");
                field.error.classList.add("show");

                valid = false;
            }

        });

        if (!valid) return;

        // EMAIL FORMAT 
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(emailInput.value.trim())) {

            emailInput.classList.add("error");
            emailInput.nextElementSibling.textContent =
                "Please enter a valid email address.";
            emailInput.nextElementSibling.classList.add("show");

            return;
        }

        //SEND EMAIL 
        emailjs.send("service_ayotvjj", "template_1b26lil", {
            from_name: nameInput.value,
            from_email: emailInput.value,
            message: messageInput.value
        })

        .then(function () {

            form.reset();

            // SHOW SUCCESS POPUP 
            popup.classList.add("show");

        })

        .catch(function (error) {

            console.error(error);

        });

    });

    // CLOSE POPUP
    closePopup.addEventListener("click", function () {

        popup.classList.remove("show");

    });

});

// PAGE TRANSITION FADE IN ON LOAD
window.addEventListener("load", () => {
  const overlay = document.getElementById("page-transition");
  overlay.classList.add("hide");
});

// FADE OUT BEFORE LEAVING PAGE
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // ignore external links or anchors
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    e.preventDefault();

    const overlay = document.getElementById("page-transition");
    overlay.classList.remove("hide");

    setTimeout(() => {
      window.location.href = href;
    }, 500); // match CSS transition time
  });
});