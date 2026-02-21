document.addEventListener("DOMContentLoaded", function () {
    // Hamburger Menu Toggle for Mobile
    const hamburger = document.getElementById("hamburger-menu");
    const sidebar = document.getElementById("mw-sidebar");

    if (hamburger && sidebar) {
        hamburger.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });
    }

    // TOC Scroll Spy (Highlight active section in TOC)
    const headings = document.querySelectorAll('.mw-parser-output h2[id], .mw-parser-output h3[id]');
    const tocLinks = document.querySelectorAll('.toc a');

    // Function to handle scroll spy
    function onScroll() {
        let currentHeadingId = "";
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        // Add offset to detect slightly before the heading hits the top
        const offset = 100;

        headings.forEach(heading => {
            if (heading.offsetTop - offset <= scrollPosition) {
                currentHeadingId = heading.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            const row = link.parentElement;
            row.classList.remove('toc-active');

            // Extract id from href
            const href = link.getAttribute('href');
            if (href) {
                const targetId = decodeURIComponent(href.substring(1));
                if (targetId === currentHeadingId) {
                    row.classList.add('toc-active');
                }
            }
        });
    }

    // Attach scroll event listener with a simple throttling
    let isScrolling;
    window.addEventListener('scroll', function (event) {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function () {
            onScroll();
        }, 66);
    }, false);

    // Run once on load
    onScroll();

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href) return;
            const targetId = decodeURIComponent(href.substring(1));
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Adjust for fixed header
                    behavior: 'smooth'
                });

                // Update URL parameter without jumping
                history.pushState(null, null, href);
            }
        });
    });

    // Donation Popup Logic
    const donationPopup = document.getElementById("donation-popup");
    const closePopupBtn = document.getElementById("close-popup");
    const laterBtn = document.getElementById("maybe-later");

    // 既に閉じたか寄付ページへ行ったかをセッション中記憶
    const hasSeenPopup = sessionStorage.getItem("donationPopupDismissed");

    function checkScrollForPopup() {
        if (!donationPopup || hasSeenPopup === "true") return;

        // ページ全体の下から200px以内に到達したか判定
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            donationPopup.classList.add("show");

            // 一度発火したら以降はスクロールイベントで確認しない
            window.removeEventListener("scroll", checkScrollForPopup);
        }
    }

    function dismissPopup() {
        if (donationPopup) {
            donationPopup.classList.remove("show");
            sessionStorage.setItem("donationPopupDismissed", "true");
        }
    }

    if (donationPopup && !hasSeenPopup) {
        window.addEventListener("scroll", checkScrollForPopup);

        if (closePopupBtn) {
            closePopupBtn.addEventListener("click", dismissPopup);
        }
        if (laterBtn) {
            laterBtn.addEventListener("click", dismissPopup);
        }
    }
});
