(function () {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) {
        return;
    }

    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="top">
            <div class="logo">
                <i class="bx bxl-codepen"></i>
                <span>Shoppex</span>
            </div>
            <i class="bx bx-menu" id="btn" aria-label="Toggle sidebar" role="button" tabindex="0"></i>
            <div class="user">
                <img src="user-img.jpg" alt="Cadungog C." class="user-img">
                <div>
                    <p class="bold">Cadungog C.</p>
                    <p>Admin</p>
                </div>
            </div>
            <ul>
                <li>
                    <a href="home.html" data-page="home.html">
                        <i class="bx bx-home"></i>
                        <span class="nav-item">Home</span>
                    </a>
                    <span class="tooltip">Home</span>
                </li>
                <li>
                    <a href="dashboard.html" data-page="dashboard.html">
                        <i class="bx bxs-grid-alt"></i>
                        <span class="nav-item">Dashboard</span>
                    </a>
                    <span class="tooltip">Dashboard</span>
                </li>
                <li>
                    <a href="products.html" data-page="products.html">
                        <i class="bx bxs-shopping-bag"></i>
                        <span class="nav-item">Products</span>
                    </a>
                    <span class="tooltip">Products</span>
                </li>
                <li>
                    <a href="categories.html" data-page="categories.html">
                        <i class="bx bx-list-check"></i>
                        <span class="nav-item">Categories</span>
                    </a>
                    <span class="tooltip">Categories</span>
                </li>
                <li>
                    <a href="settings.html" data-page="settings.html">
                        <i class="bx bx-cog"></i>
                        <span class="nav-item">Settings</span>
                    </a>
                    <span class="tooltip">Settings</span>
                </li>
                <li>
                    <a href="#" id="logoutBtn">
                        <i class="bx bx-log-out"></i>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </div>
    `;

    const toggleButton = document.getElementById('btn');
    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });
    toggleButton.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            sidebar.classList.toggle('active');
        }
    });

    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const activeLink = sidebar.querySelector(`[data-page="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

})();
