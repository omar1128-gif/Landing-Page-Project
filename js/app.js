// returns sections in the page in the form of an array
const getSections = () => {
    let sections = document.querySelectorAll("section");
    sections = Array.from(sections);
    return sections;
};

// create nav list element
const createNavItem = (text, id, className) => {
    const navItem = document.createElement("li");
    navItem.textContent = text;
    navItem.id = id;
    navItem.classList.add(className);
    return navItem;
};

// scrolls to the corresponding section when nav item is clicked
const respondToNavClick = (event) => {
    if (event.target.nodeName === "LI") {
        const navSection = document.querySelector(
            `[data-nav='${event.target.textContent}']`
        );
        navSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
};

// create nav bar elements corresponding to the number of sections in the page
// returns an array of nav bar elements
const populateNavBar = (sections) => {
    const fragment = document.createDocumentFragment();
    const navList = document.querySelector("#navbar__list");
    const navItems = {};
    for (const section of sections) {
        const navItem = createNavItem(
            section.getAttribute("data-nav"),
            `${section.id}NavItem`,
            "menu__link"
        );
        fragment.appendChild(navItem);
        navItems[section.id] = navItem;
    }
    navList.appendChild(fragment);
    navList.addEventListener("click", respondToNavClick);
    return navItems;
};

const main = () => {
    // get sections
    const sections = getSections();
    // Build menu and get nav bar elements
    const navItems = populateNavBar(sections);

    // configure IntersectionObserver for setting and removing active class when scrolling
    const observerOptions = {
        root: null, // document viewport
        rootMargin: "0px",
        threshold: 0.6,
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // a section is intersecting with the viewport now
                const navItem = navItems[entry.target.id];

                // add 'active' class on the navItem, section corresponding to the section that is active
                navItem.classList.add("active");
                entry.target.classList.add("active");

                Object.values(navItems).forEach((item) => {
                    if (item !== navItem) {
                        //remove active class from navItems that is not active
                        item.classList.remove("active");
                        //remove active class from their corresponding section
                        document
                            .querySelector(`[data-nav='${item.textContent}']`)
                            .classList.remove("active");
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(
        observerCallback,
        observerOptions
    );
    sections.forEach((section) => observer.observe(section));
};

main();
