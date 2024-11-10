document.addEventListener('DOMContentLoaded', () => {
    const partnersList = document.querySelector('.partners-list');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const searchInput = document.getElementById('searchInput');
    let currentIndex = 0;
    const itemsPerPage = 4;
    let partnerCards = [];
    let filteredPartnerCards = [];
    const filterBtn = document.getElementById('filter-btn');
    const modal = document.getElementById('filter-modal');
    const closeBtn = document.querySelector('.closeicon');
    modal.classList.add("modal");
    var counter = 0;
    const addPartnerModal = document.getElementById('addPartnerModal');
    const removePartnerModal = document.getElementById('removePartnerModal');
    const closeBtns = document.querySelectorAll('.closeicon');
    const addBtn = document.getElementById('add-btn');
    const removeBtn = document.getElementById('remove-btn');

    filterBtn.addEventListener('click', () => {
        modal.style.display = "block";
        counter = 1;
        console.log("Filter button clicked");
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        counter = 0;
        console.log("Close clicked");
    });

    window.addEventListener('click', (event) => {
        if (event.target != modal && counter == 1) {
            modal.style.display = 'block';
            counter = 0;
        }
        else if (event.target == modal && counter == 0) {
            modal.style.display = "none";
            console.log("Window clicked");
        }
    });

    // TEST

    addBtn.addEventListener('click', () => {
        addPartnerModal.style.display = "block";
    });

    // Function to show remove partner modal
    removeBtn.addEventListener('click', () => {
        removePartnerModal.style.display = "block";
    });

    // Close modals when close icon is clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addPartnerModal.style.display = "none";
            removePartnerModal.style.display = "none";
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == addPartnerModal) {
            addPartnerModal.style.display = "none";
        } else if (event.target == removePartnerModal) {
            removePartnerModal.style.display = "none";
        }
    });

    const addPartnerForm = document.getElementById('addPartnerForm');
    addPartnerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('addName').value.trim();
        const type = document.getElementById('addType').value.trim();
        const expertise = document.getElementById('addExpertise').value.trim();
        const resources = document.getElementById('addResources').value.trim();
        const email = document.getElementById('addEmail').value.trim();
        const phone = document.getElementById('addPhone').value.trim();
        const location = document.getElementById('addLocation').value.trim();
        const bio = document.getElementById('addBio').value.trim();

        const newPartner = {
            name: name,
            organization_type: type,
            expertise: expertise,
            resources: resources,
            email: email,
            phone_number: phone,
            location: location,
            bio: bio
        };

        fetch('http://localhost:5000/api/partners/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPartner),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add partner');
            }
            return response.json();
        })
        .then(data => {
            console.log('Partner added successfully:', data);
            addPartnerModal.style.display = "none"; // Close modal on success
            fetchPartners(); // Refresh partner list
        })
        .catch(error => {
            console.error('Error adding partner:', error);
            // Handle error
        });
    });

    const removePartnerForm = document.getElementById('removePartnerForm');
    removePartnerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const partnerName = document.getElementById('removeName').value.trim();

        const partnerToRemove = {
            partner_name: partnerName
        };

        fetch('http://localhost:5000/api/partners/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partnerToRemove),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove partner');
            }
            return response.json();
        })
        .then(data => {
            console.log('Partner removed successfully:', data);
            removePartnerModal.style.display = "none"; // Close modal on success
            fetchPartners(); // Refresh partner list
        })
        .catch(error => {
            console.error('Error removing partner:', error);
            // Handle error
        });
    });


    // TEST //

    const filterForm = document.getElementById('filter-form');
    filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const typeInput = document.getElementById('typeInput').value.trim();
    const location = document.getElementById('location').value.trim();
    const resources = document.getElementById('resources').value.trim();

    fetchFilteredPartners(typeInput, location, resources);

    modal.style.display = 'none';
});
    
    function createPartnerCard(partner) {
        const card = document.createElement('div');
        card.classList.add('partner-card');
        card.innerHTML = `
            <h3>${partner.Name}</h3>
            <p><strong>Type:</strong> ${partner.OrganizationType}</p>
            <p><strong>Expertise:</strong> ${partner.Expertise}</p>
            <p><strong>Resources:</strong> ${partner.Resources}</p>
            <p><strong>Email:</strong> ${partner.Email}</p>
            <p><strong>Phone Number:</strong> ${partner.PhoneNumber}</p>
            <p><strong>Location:</strong> ${partner.Location}</p>
            <p><strong>Description:</strong> ${partner.Bio}</p>
        `;
        return card;
    }

    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function updateCardContent(card, partner, query) {
        card.innerHTML = `
            <h3>${highlightText(partner.Name, query)}</h3>
            <p><strong>Type:</strong> ${highlightText(partner.OrganizationType, query)}</p>
            <p><strong>Expertise:</strong> ${highlightText(partner.Expertise, query)}</p>
            <p><strong>Resources:</strong> ${highlightText(partner.Resources, query)}</p>
            <p><strong>Email:</strong> ${highlightText(partner.Email, query)}</p>
            <p><strong>Phone Number:</strong> ${highlightText(partner.PhoneNumber, query)}</p>
            <p><strong>Location:</strong> ${highlightText(partner.Location, query)}</p>
            <p><strong>Description:</strong> ${highlightText(partner.Bio, query)}</p>
        `;
    }

    function filterPartners(query) {
        if (!query) {
            filteredPartnerCards = partnerCards;
        } else {
            filteredPartnerCards = partnerCards.filter(card => {
                const partner = card.partner;
                return partner.Name.toLowerCase().includes(query) ||
                    partner.OrganizationType.toLowerCase().includes(query) ||
                    partner.Expertise.toLowerCase().includes(query) ||
                    partner.Resources.toLowerCase().includes(query) ||
                    partner.Email.toLowerCase().includes(query) ||
                    partner.PhoneNumber.toLowerCase().includes(query) ||
                    partner.Location.toLowerCase().includes(query) ||
                    partner.Bio.toLowerCase().includes(query);
            }).map(card => {
                const partner = card.partner;
                updateCardContent(card, partner, query);
                return card;
            });
        }
        currentIndex = 0;
        showCards(currentIndex);
        updateButtons();
    }

    function showCards(startIndex, direction = 'next') {
        partnersList.innerHTML = '';
        filteredPartnerCards.slice(startIndex, startIndex + itemsPerPage).forEach(card => {
            card.classList.remove('slide-in-next', 'slide-in-prev', 'slide-out-next', 'slide-out-prev');
            partnersList.appendChild(card);
            card.style.display = 'block';
            card.classList.add(direction === 'next' ? 'slide-in-next' : 'slide-in-prev');
        });
        updatePageIndicator();
    }

    // Updating counter buttons
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex + itemsPerPage >= filteredPartnerCards.length;
    }

    // Updating counter
    function updatePageIndicator() {
        const totalPages = Math.ceil(filteredPartnerCards.length / itemsPerPage);
        const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Page buttons 
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            filteredPartnerCards.slice(currentIndex, currentIndex + itemsPerPage).forEach(card => card.classList.add('slide-out-prev'));
            currentIndex -= itemsPerPage;
            setTimeout(() => {
                showCards(currentIndex, 'prev');
                updateButtons();
            }, 500);
        }
    });

    // Page buttons
    nextBtn.addEventListener('click', () => {
        if (currentIndex + itemsPerPage < filteredPartnerCards.length) {
            filteredPartnerCards.slice(currentIndex, currentIndex + itemsPerPage).forEach(card => card.classList.add('slide-out-next'));
            currentIndex += itemsPerPage;
            setTimeout(() => {
                showCards(currentIndex, 'next');
                updateButtons();
            }, 500);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterPartners(query);
    });

    function fetchPartners() {
        fetch('http://localhost:5000/api/partners')
            .then(response => response.json())
            .then(data => {
                partnerCards = data.map(partner => {
                    const card = createPartnerCard(partner);
                    card.partner = partner; // Store partner data in the card for easy access
                    return card;
                });
                filteredPartnerCards = partnerCards;
                showCards(currentIndex);
                updateButtons();
            })
            .catch(error => console.error('Error fetching partner data:', error));
    }

    function fetchFilteredPartners(category, location, resources) {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('OrganizationType', category);
        if (location) params.append('Location', location);
        if (resources) params.append('Resources', resources);
        
        const url = params.toString() ? `http://localhost:5000/api/partners?${params.toString()}` : 'http://localhost:5000/api/partners';
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                partnerCards = data.map(partner => {
                    const card = createPartnerCard(partner);
                    card.partner = partner; // Store partner data in the card for easy access
                    return card;
                });
                filteredPartnerCards = partnerCards;
                showCards(currentIndex);
                updateButtons();
            })
            .catch(error => console.error('Error fetching filtered partner data:', error));
    }

    fetchPartners();

    // Sidebar and dark mode toggle
    const body = document.querySelector('body'),
          sidebar = body.querySelector('nav.sidebar'),
          toggle = body.querySelector(".toggle"),
          modeSwitch = body.querySelector(".toggle-switch"),
          modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        console.log("Sidebar classes:", sidebar.classList);
    });

    modeSwitch.addEventListener("click", () => {
        body.classList.toggle('dark');
        if (body.classList.contains('dark')) {
            localStorage.setItem('dark-mode', 'enabled');
            modeText.innerText = "Light mode";
        } else {
            localStorage.setItem('dark-mode', 'disabled');
            modeText.innerText = "Dark mode";
        }
    });

    if (localStorage.getItem('dark-mode') === 'enabled') {
        body.classList.add('dark');
        modeText.innerText = "Light mode";
    } else {
        body.classList.remove('dark');
        modeText.innerText = "Dark mode";
    }

    const logoutButton = document.getElementById('logout');

    logoutButton.addEventListener('click', () => {
        window.location.href = 'pplogin.html';
    });

});