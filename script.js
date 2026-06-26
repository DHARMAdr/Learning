/* ════════════════════════════════════════════════════════════════════════════
   SCRIPT.JS — All logic & interactivity for the Level Up Gaming Blog
   ════════════════════════════════════════════════════════════════════════════
   
   FILE PURPOSE:
   This file contains all JavaScript that makes the site WORK:
   • Stores the blog post data
   • Renders the page dynamically (hero, filters, blog cards)
   • Handles user interactions (search, filter clicks)
   • Opens/closes modals when buttons are clicked
   • Manages the chat widget and email sending
   
   STRUCTURE:
   [JS 1]  IMAGE LINKS CONFIG — paste your URLs here
   [JS 2]  BLOG POST DATA — add or edit posts here
   [JS 3]  CATEGORY LIST — controls filter buttons
   [JS 4]  getCategoryImage() — returns thumbnail URL for a category
   [JS 5]  applyProfilePictures() — syncs profile pic everywhere
   [JS 6]  showFeatured() — renders the hero banner
   [JS 7]  showFilters() — renders filter buttons
   [JS 8]  showPosts() — renders the blog card grid
   [JS 9]  start() — page boot function
   [JS 10] BIO MODAL — show / close functions
   [JS 11] PROFILE MODAL — show / close functions
   [JS 12] CHAT WIDGET — toggle, char count, send
   [JS 13] BACKDROP CLICK — closes any open modal on outside click
   
   HOW TO USE THIS FILE:
   1. Save it as "script.js" in the same folder as index.html
   2. index.html links to it with: <script src="script.js"></script>
   3. When the page loads, this file automatically runs start()
   4. The start() function initializes everything
   
   CAN IMPROVE:
   • Split into multiple files (one per feature) to keep code organized
   • Use ES6 modules (import/export) for better code structure
   • Add error handling try/catch blocks
   • Use async/await for cleaner email sending code
   • Load posts from a JSON file or API instead of hardcoding them
════════════════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════
   [JS 1]  IMAGE LINKS CONFIG — paste your URLs here
   ────────────────────────────────────────────────────────────────
   WHY: One single place to set every image URL so you don't have
        to hunt through the HTML and CSS. Change a value here and it
        updates everywhere on the page automatically.
   HOW:
        1. Replace the placeholder strings with real URLs
        2. Leave a category image as "" to keep the default gradient + emoji
        3. Examples:
           profilePicture: "https://i.imgur.com/abc123.jpg"
           review: "https://images.example.com/reviews-hero.png"
   CAN IMPROVE:
     • Pull these URLs from a CMS or JSON file instead of hardcoding
     • Add per-post image overrides in the posts array below
     • Use a CDN with automatic image optimization
     • Add lazy loading for images
════════════════════════════════════════════════════════════════ */
var IMAGE_LINKS = {

    /* Your profile picture — used in the header circle AND the profile modal */
    profilePicture: "YOUR_PROFILE_PICTURE_URL_HERE",  /* 🔧 paste URL here */

    /* Category card thumbnails — one image per category type.
       Shown at the top of every card in that category.
       Leave as "" to keep the default purple/blue gradient + emoji.  */
    review:   "",  /* 🔧 e.g. "https://i.imgur.com/abc.jpg"   */
    guide:    "",  /* 🔧 e.g. "https://i.imgur.com/def.jpg"   */
    tips:     "",  /* 🔧 e.g. "https://i.imgur.com/ghi.jpg"   */
    hardware: ""   /* 🔧 e.g. "https://i.imgur.com/jkl.jpg"   */
};


/* ════════════════════════════════════════════════════════════════
   [JS 2]  BLOG POST DATA — add or edit posts here
   ────────────────────────────────────────────────────────────────
   WHY: All post content lives in this array. To add a new post,
        copy one of the objects below, paste it, and change the values.
        To remove a post, delete its { … } block.
   FIELDS (what each property means):
     id          — unique number (increment for each new post)
     title       — headline shown on the card (max ~60 chars for readability)
     description — short summary shown on the card (max ~150 chars)
     category    — must match one value in the categories array (JS 3)
     emoji       — fallback icon shown if no category image is set
     date        — display date (any format you like)
     readTime    — estimated read time shown in the card footer
     featured    — true = shown as the hero banner (only one should be true)
     link        — URL the "Read →" button opens (use "#" for no link)
   EXAMPLE OF ADDING A NEW POST:
     {
         id: 7,
         title: "My New Post Title",
         description: "Short description of the post content...",
         category: "Guide",
         emoji: "📚",
         date: "June 26, 2026",
         readTime: "5 min",
         featured: false,
         link: "https://example.com"
     }
   CAN IMPROVE:
     • Add a "tags" array for finer filtering (e.g. ["AMD","CPU","Budget"])
     • Add a "thumbnail" field to override the category image per post
     • Add an "author" field if you add guest writers
     • Add a "published" field (true/false) to hide unpublished drafts
     • Add a "views" counter that increments on click
     • Load posts from an external JSON file or headless CMS API
════════════════════════════════════════════════════════════════ */
var posts = [
    {
        id: 1,
        title: "Lazy Danger",
        description: "Welcome to the streaming world! With a beginners setup and a gaming PC. Perfect for anyone starting their gaming journey!",
        category: "Guide",
        emoji: "🎬",
        date: "March 1, 2000",
        readTime: "8 min",
        featured: true,
        link: "#"
    },
    {
        id: 2,
        title: "MSI Gaming Motherboard X870 WiFi",
        description: "The ultimate gaming motherboard for high-performance builds. Features PCIe 5.0 support, DDR5 memory compatibility, and built-in WiFi. Perfect for serious gamers and content creators.",
        category: "Review",
        emoji: "⚡",
        date: "March 12, 2024",
        readTime: "12 min",
        featured: false,
        link: "https://www.msi.com"
    },
    {
        id: 3,
        title: "Coco Sports RGB Keyboard & Mouse Set",
        description: "Complete gaming peripherals with customizable RGB lighting, mechanical switches, and ergonomic design. Boost your gaming performance with professional-grade equipment.",
        category: "Tips",
        emoji: "⌨️",
        date: "March 10, 2024",
        readTime: "6 min",
        featured: false,
        link: "https://www.amazon.com"
    },
    {
        id: 4,
        title: "NVIDIA RTX 5060 Ti Graphics Card",
        description: "Next-gen graphics power for high refresh rate gaming. Experience ray tracing, DLSS technology, and smooth gameplay at 1440p and beyond. Essential for modern gaming.",
        category: "Guide",
        emoji: "🎮",
        date: "March 8, 2024",
        readTime: "7 min",
        featured: false,
        link: "https://www.nvidia.com"
    },
    {
        id: 5,
        title: "AMD Ryzen 7 9800X3D Processor",
        description: "The ultimate CPU for gaming. With 3D V-Cache technology, this processor delivers exceptional gaming performance and multitasking capabilities. Built for champions.",
        category: "Hardware",
        emoji: "🖥️",
        date: "March 5, 2024",
        readTime: "9 min",
        featured: false,
        link: "https://www.amd.com"
    },
    {
        id: 6,
        title: "Gaming PC Build Guide 2024",
        description: "Complete breakdown of the best gaming PCs at every price point. From budget builds to high-end rigs, find the perfect setup for your gaming needs.",
        category: "Hardware",
        emoji: "💻",
        date: "March 1, 2024",
        readTime: "10 min",
        featured: false,
        link: "https://pcpartpicker.com"
    }
];


/* ════════════════════════════════════════════════════════════════
   [JS 3]  CATEGORY LIST — controls the filter buttons
   ────────────────────────────────────────────────────────────────
   WHY: This array drives the filter row above the blog grid.
        "All" is always first; the rest match the category values
        used in the posts array above.
   HOW:
        • When a visitor clicks a filter button, the activeCategory
          variable is updated to match the button's data-category attribute
        • showPosts() then filters to only show posts matching that category
   CAN IMPROVE:
     • Generate this list automatically from the posts array so
       you never have to update it manually when adding categories
     • Add icons next to each label (e.g. "⚡ Review")
     • Show post counts in the buttons (e.g. "Review (3)")
     • Add a "Trending" or "Popular" category with smart sorting
════════════════════════════════════════════════════════════════ */
var categories    = ["All", "Review", "Guide", "Tips", "Hardware"];
var activeCategory = "All";   /* tracks which filter is currently selected */
var searchQuery    = "";      /* tracks the live search text entered */


/* ════════════════════════════════════════════════════════════════
   [JS 4]  getCategoryImage() — returns thumbnail URL for a category
   ────────────────────────────────────────────────────────────────
   WHY: Helper function that translates a category name (e.g. "Review")
        into the URL stored in IMAGE_LINKS. Returns "" if not set,
        which tells the card to show the gradient + emoji fallback instead.
   HOW:
        1. Function receives a category name as input
        2. Creates a map matching categories to IMAGE_LINKS values
        3. Returns the URL for that category, or "" if not found
   USAGE:
        var imageUrl = getCategoryImage("Review");
        // Returns IMAGE_LINKS.review (or "" if not set)
   CAN IMPROVE:
     • Extend with a per-post override: check post.thumbnail first,
       fall back to category image, then fall back to gradient
     • Add a default placeholder image if URL is invalid
     • Lazy-load images only when they're about to be visible (Intersection Observer)
════════════════════════════════════════════════════════════════ */
function getCategoryImage(category) {
    var map = {
        "Review":   IMAGE_LINKS.review,
        "Guide":    IMAGE_LINKS.guide,
        "Tips":     IMAGE_LINKS.tips,
        "Hardware": IMAGE_LINKS.hardware
    };
    return map[category] || "";
}


/* ════════════════════════════════════════════════════════════════
   [JS 5]  applyProfilePictures() — syncs profile pic everywhere
   ────────────────────────────────────────────────────────────────
   WHY: The same picture needs to appear in two places: the header
        circle and the profile modal. This function updates both
        from IMAGE_LINKS.profilePicture in one go.
        Called once on page load by start().
   HOW:
        1. Checks if profilePicture is set (not the placeholder)
        2. Finds the <img> elements by their IDs
        3. Sets their src to the profilePicture URL
   CAN IMPROVE:
     • Add a third location (e.g. an "About the Author" footer section)
     • Show a loading spinner while the image loads
     • Add a fallback color or pattern if the image fails to load
     • Use srcset for responsive images (mobile vs desktop sizes)
════════════════════════════════════════════════════════════════ */
function applyProfilePictures() {
    if (IMAGE_LINKS.profilePicture && IMAGE_LINKS.profilePicture !== "YOUR_PROFILE_PICTURE_URL_HERE") {
        var headerImg = document.getElementById('headerProfileImg');
        var modalImg  = document.getElementById('profileModalImg');
        if (headerImg) { headerImg.src = IMAGE_LINKS.profilePicture; headerImg.style.display = ''; }
        if (modalImg)  { modalImg.src = IMAGE_LINKS.profilePicture;  modalImg.style.display = ''; }
    }
}


/* ════════════════════════════════════════════════════════════════
   [JS 6]  showFeatured() — renders the hero banner
   ────────────────────────────────────────────────────────────────
   WHY: Finds the post with featured:true in the posts array and
        builds the large two-column hero card at the top of the page.
        Uses the category image if set, otherwise shows the emoji.
   HOW:
        1. Loop through posts array to find featured: true
        2. Build HTML string with the post's title, description, metadata
        3. Insert the HTML into #featuredSection element
   CAN IMPROVE:
     • Rotate through multiple featured posts as a slideshow
     • Add a "Watch the video" button linking to a YouTube video
     • Display a read-progress bar on re-visit using localStorage
     • Add a "Share this post" button
     • Auto-generate featured post based on date or views
════════════════════════════════════════════════════════════════ */
function showFeatured() {
    var featuredPost = null;

    /* Find the post where featured === true */
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].featured === true) {
            featuredPost = posts[i];
            break;
        }
    }

    if (featuredPost === null) return;

    var imgUrl = getCategoryImage(featuredPost.category);
    var imageInner = imgUrl
        ? '<img src="' + imgUrl + '" alt="' + featuredPost.title + '">'
        : featuredPost.emoji;

    var html = '<div class="featured-post">';
    html += '<div class="featured-content">';
    html += '<h1>' + featuredPost.title + '</h1>';
    html += '<p>' + featuredPost.description + '</p>';
    html += '<div class="featured-meta">';
    html += '<span class="category-badge">' + featuredPost.category + '</span>';
    html += '<span class="meta-item">' + featuredPost.date + '</span>';
    html += '<span class="meta-item">' + featuredPost.readTime + ' read</span>';
    html += '</div>';
    html += '<a class="read-more" onclick="showBioModal(); return false;" href="#">surprise info →</a>';
    html += '</div>';
    html += '<div class="featured-image">' + imageInner + '</div>';
    html += '</div>';

    document.getElementById('featuredSection').innerHTML = html;
}


/* ════════════════════════════════════════════════════════════════
   [JS 7]  showFilters() — renders the category filter buttons
   ────────────────────────────────────────────────────────────────
   WHY: Loops through the categories array and creates a button for
        each one. Adds the "active" class to the currently selected
        button. Attaches click listeners that update activeCategory
        then re-render the filters and posts.
   HOW:
        1. Build HTML buttons from the categories array
        2. Add "active" class to the button matching activeCategory
        3. Insert all buttons into #filtersContainer
        4. Add onclick listeners to each button
        5. When clicked, update activeCategory and re-render
   CAN IMPROVE:
     • Add smooth scroll to the grid when a filter is clicked
     • Persist the selected filter in the URL (e.g. ?cat=Review)
       so the page can be linked to directly
     • Add a "Clear filters" button
     • Add post-count badges to each button
     • Animate the button state change with CSS transitions
════════════════════════════════════════════════════════════════ */
function showFilters() {
    var html = '';

    /* Build HTML for each category button */
    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        var activeClass = (cat === activeCategory) ? ' active' : '';
        html += '<button class="filter-btn' + activeClass + '" data-category="' + cat + '">';
        html += cat;
        html += '</button>';
    }

    document.getElementById('filtersContainer').innerHTML = html;

    /* Add click listeners to all filter buttons */
    var buttons = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            activeCategory = this.getAttribute('data-category');
            showFilters();  /* Re-render to show which button is active */
            showPosts();    /* Re-render posts to show only this category */
        });
    }
}


/* ════════════════════════════════════════════════════════════════
   [JS 8]  showPosts() — renders the blog card grid
   ────────────────────────────────────────────────────────────────
   WHY: Filters the posts array by the active category AND the
        current search query, then builds and injects HTML cards.
        Skips the featured post (it's already shown in the hero).
        Shows the empty-state message if nothing matches.
   HOW:
        1. Loop through all posts
        2. Check if post matches the active category filter
        3. Check if post matches the search query
        4. If both match, add to filtered array
        5. Build HTML cards from filtered posts
        6. Insert into #blogGrid element
   CAN IMPROVE:
     • Add pagination or "Load more" instead of showing all at once
     • Add a sort option: Newest / Oldest / A–Z
     • Highlight the matching search term inside the card text
     • Add a "Saved posts" feature using localStorage
     • Show how many posts matched the filter
     • Add infinite scroll (load more when user scrolls near bottom)
════════════════════════════════════════════════════════════════ */
function showPosts() {
    var filtered = [];

    /* Filter posts by category and search query */
    for (var i = 0; i < posts.length; i++) {
        var post = posts[i];

        /* Skip the featured post — it's shown in the hero */
        if (post.featured === true) continue;

        /* Check if category matches */
        var categoryMatch = activeCategory === "All" || post.category === activeCategory;

        /* Check if search text is in the title or description */
        var searchLower = searchQuery.toLowerCase();
        var titleMatch  = post.title.toLowerCase().indexOf(searchLower) !== -1;
        var descMatch   = post.description.toLowerCase().indexOf(searchLower) !== -1;
        var searchMatch = titleMatch || descMatch;

        /* Add to filtered list if both match */
        if (categoryMatch && searchMatch) {
            filtered.push(post);
        }
    }

    var gridElement  = document.getElementById('blogGrid');
    var emptyElement = document.getElementById('emptyState');

    /* If no posts found, show empty state */
    if (filtered.length === 0) {
        emptyElement.style.display = 'block';
        gridElement.innerHTML = '';
        return;
    }

    /* Otherwise hide empty state and show posts */
    emptyElement.style.display = 'none';
    var html = '';

    /* Build HTML for each filtered post */
    for (var i = 0; i < filtered.length; i++) {
        var post      = filtered[i];
        var imgUrl    = getCategoryImage(post.category);
        var cardImage = imgUrl
            ? '<img src="' + imgUrl + '" alt="' + post.title + '">'
            : post.emoji;

        html += '<article class="blog-card">';
        html += '<div class="card-image">' + cardImage + '</div>';
        html += '<div class="card-content">';
        html += '<div class="card-category">' + post.category + '</div>';
        html += '<h2 class="card-title">' + post.title + '</h2>';
        html += '<p class="card-description">' + post.description + '</p>';
        html += '<div class="card-footer">';
        html += '<span>' + post.date + '</span>';
        html += '<a class="read-more" href="' + post.link + '" target="_blank">Read →</a>';
        html += '</div>';
        html += '</div>';
        html += '</article>';
    }

    gridElement.innerHTML = html;
}


/* ════════════════════════════════════════════════════════════════
   [JS 9]  start() — page boot function
   ────────────────────────────────────────────────────────────────
   WHY: Called automatically when the page loads. Runs all render
        functions in the correct order and wires up the search input
        so posts re-filter live as the visitor types.
   HOW:
        1. Apply profile pictures
        2. Render the featured post
        3. Render the filter buttons
        4. Render all blog posts
        5. Add keyup listener to search box to filter as user types
   CAN IMPROVE:
     • Add a loading spinner that hides once start() completes
     • Parse URL parameters here to pre-select a filter or search
     • Add error handling try/catch blocks
     • Measure page load time with performance API
     • Pre-load images for faster display
════════════════════════════════════════════════════════════════ */
function start() {
    applyProfilePictures();
    showFeatured();
    showFilters();
    showPosts();

    /* When user types in the search box, update posts */
    document.getElementById('searchInput').addEventListener('keyup', function() {
        searchQuery = this.value;
        showPosts();
    });
}

/* Call start() when the page finishes loading */
start();


/* ════════════════════════════════════════════════════════════════
   [JS 10]  BIO MODAL — show / close functions
   ────────────────────────────────────────────────────────────────
   WHY: showBioModal() adds class "show" which switches the modal
        from display:none to display:flex, making it visible.
        closeBioModal() removes "show" to hide it again.
        Triggered by "surprise info →" link on the featured card.
   HOW:
        • className = 'modal show' sets both the class name
        • className = 'modal' removes the "show" class
   CAN IMPROVE:
     • Add a CSS fade-in animation by transitioning opacity
     • Trap keyboard focus inside the modal for accessibility
     • Add keyboard shortcut to close (e.g. Escape key)
     • Add previous/next arrow buttons to browse posts
     • Pre-load the modal content before opening
════════════════════════════════════════════════════════════════ */
function showBioModal() {
    document.getElementById('bioModal').className = 'modal show';
}

function closeBioModal() {
    document.getElementById('bioModal').className = 'modal';
}


/* ════════════════════════════════════════════════════════════════
   [JS 11]  PROFILE MODAL — show / close functions
   ────────────────────────────────────────────────────────────────
   WHY: Same pattern as the bio modal — toggling the "show" class
        on the profile-modal element to show or hide it.
        Triggered by clicking the profile icon in the header.
   HOW:
        • className = 'profile-modal show' adds the show class
        • className = 'profile-modal' removes it
   CAN IMPROVE:
     • Add a slide-up animation on mobile
     • Close automatically after 30 seconds of inactivity
     • Add analytics to track how many people view the profile
     • Add a "Copy bio text" button
════════════════════════════════════════════════════════════════ */
function showProfileModal() {
    document.getElementById('profileModal').className = 'profile-modal show';
}

function closeProfileModal() {
    document.getElementById('profileModal').className = 'profile-modal';
}


/* ════════════════════════════════════════════════════════════════
   [JS 12]  CHAT WIDGET — toggle, character count, send message
   ────────────────────────────────────────────────────────────────
   WHY: Three functions work together to power the chat widget:
     toggleChat()      opens/closes the message box above the bubble
     updateCharCount() updates the "0 / 300" counter live & warns at limit
     sendMessage()     validates, then sends via EmailJS to your email
   
   NOTE: EmailJS is a free service that sends emails without backend code.
         Sign up at emailjs.com and fill in three values:
         • serviceId  — your email service ID
         • templateId — your email template ID
         • publicKey  — your public API key
         
         Your email template must include these variables:
         {{from_name}} = visitor's name
         {{message}}   = visitor's message
         {{to_email}}  = dharmaraj.p2013@gmail.com
   
   CAN IMPROVE:
     • Add spam protection (rate limit: 1 message per 60 seconds)
     • Show a countdown cooldown timer after sending
     • Add an auto-reply confirmation email to the sender
     • Add a topic/subject dropdown above the textarea
     • Add file attachment option (e.g. screenshot for bug reports)
     • Show a typing indicator when server is processing
     • Add honey-pot field to block spam bots
     • Store messages in localStorage if email fails
════════════════════════════════════════════════════════════════ */

/* Open/close the chat box */
function toggleChat() {
    var box = document.getElementById('chatBox');
    box.classList.toggle('open');

    /* Clear any leftover status message when re-opening */
    if (box.classList.contains('open')) {
        document.getElementById('chatStatus').textContent = '';
    }
}

/* Update the character counter in real-time */
function updateCharCount() {
    var messageBox = document.getElementById('chatMessage');
    var counterEl  = document.getElementById('charCount');
    var length     = messageBox.value.length;

    counterEl.textContent = length + ' / 300';
    counterEl.className   = 'chat-char-count' + (length >= 300 ? ' over' : '');
}

/* Send the message via EmailJS */
function sendMessage() {
    var senderName = document.getElementById('chatName').value.trim();
    var message    = document.getElementById('chatMessage').value.trim();
    var statusEl   = document.getElementById('chatStatus');
    var sendBtn    = document.getElementById('chatSendBtn');

    /* Validate that message is not empty */
    if (!message) {
        statusEl.style.color = '#ff4d4d';
        statusEl.textContent = 'Please type a message first.';
        return;
    }

    /* Disable button and show "sending" status */
    sendBtn.disabled = true;
    statusEl.style.color = 'var(--accent-cyan)';
    statusEl.textContent = 'Sending…';

    /* ── EmailJS credentials ──────────────────────────────────
       Sign up free at https://www.emailjs.com then fill in:
         serviceId  → Email Services tab → your service ID
         templateId → Email Templates tab → your template ID
         publicKey  → Account → Public Key
       Template must have variables: {{from_name}} {{message}} {{to_email}}
    ─────────────────────────────────────────────────────── */
    var serviceId  = "YOUR_EMAILJS_SERVICE_ID";   /* 🔧 e.g. "service_abc123"     */
    var templateId = "YOUR_EMAILJS_TEMPLATE_ID";  /* 🔧 e.g. "template_xyz789"    */
    var publicKey  = "YOUR_EMAILJS_PUBLIC_KEY";   /* 🔧 e.g. "AbCdEfGhIjKlMnOp"  */

    /* The email content template */
    var emailData = {
        from_name: senderName || "Anonymous Gamer",
        message:   message,
        to_email:  "dharmaraj.p2013@gmail.com"
    };

    /* Function to actually send the email */
    function doSend() {
        emailjs.send(serviceId, templateId, emailData, publicKey)
            .then(function() {
                /* SUCCESS — show confirmation */
                statusEl.style.color = 'var(--accent-cyan)';
                statusEl.textContent = '✅ Message sent! Thanks for reaching out.';
                
                /* Clear the form */
                document.getElementById('chatMessage').value = '';
                document.getElementById('chatName').value    = '';
                document.getElementById('charCount').textContent = '0 / 300';
                
                /* Re-enable button */
                sendBtn.disabled = false;
            })
            .catch(function(err) {
                /* ERROR — show error message */
                statusEl.style.color = '#ff4d4d';
                statusEl.textContent = '❌ Could not send. Check EmailJS setup.';
                console.error('EmailJS error:', err);
                sendBtn.disabled = false;
            });
    }

    /* Lazily load EmailJS library only on first send (keeps page load fast) */
    if (typeof emailjs === 'undefined') {
        var script    = document.createElement('script');
        script.src    = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = function() {
            doSend();
        };
        script.onerror = function() {
            statusEl.style.color = '#ff4d4d';
            statusEl.textContent = '❌ Could not load email service.';
            sendBtn.disabled = false;
        };
        document.head.appendChild(script);
    } else {
        doSend();
    }
}


/* ════════════════════════════════════════════════════════════════
   [JS 13]  BACKDROP CLICK — closes any open modal on outside click
   ────────────────────────────────────────────────────────────────
   WHY: Standard UX pattern — clicking the dark dimmed area behind
        a modal should close it without needing to find the × button.
   HOW:
        • window.addEventListener('click', …) listens for ANY click on the page
        • e.target == modal checks if the click was on the dark backdrop
        • If so, remove the .show class to hide the modal
   CAN IMPROVE:
     • Also close on Escape key press (add a keydown listener)
     • Also close the chat box if the user clicks outside it
     • Add a fade-out animation before closing
     • Prevent closing if user is typing a message
════════════════════════════════════════════════════════════════ */
window.addEventListener('click', function(e) {
    var bioModal  = document.getElementById('bioModal');
    var profModal = document.getElementById('profileModal');

    /* If user clicked on the dark backdrop (not the content), close the modal */
    if (e.target === bioModal)  bioModal.className  = 'modal';
    if (e.target === profModal) profModal.className = 'profile-modal';
});
