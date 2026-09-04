(function () {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) {
        return;
    }

    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="top">
            <div class="logo">
                <i class="bx bx-lock-alt"></i>
                <span>Personal Vault</span>
            </div>
            <i class="bx bx-menu" id="btn" aria-label="Toggle sidebar" role="button" tabindex="0"></i>
            <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark mode">
                <i class="bx bx-moon"></i>
                <span class="nav-item">Dark mode</span>
            </button>
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
                    <a href="accounts.html" data-page="accounts.html">
                        <i class="bx bx-key"></i>
                        <span class="nav-item">Accounts</span>
                    </a>
                    <span class="tooltip">Accounts</span>
                </li>
                <li>
                    <a href="important-files.html" data-page="important-files.html">
                        <i class="bx bx-folder"></i>
                        <span class="nav-item">Files</span>
                    </a>
                    <span class="tooltip">Files</span>
                </li>
                <li>
                    <a href="notes.html" data-page="notes.html">
                        <i class="bx bx-note"></i>
                        <span class="nav-item">Notes</span>
                    </a>
                    <span class="tooltip">Notes</span>
                </li>
                <li>
                    <a href="savings.html" data-page="savings.html">
                        <i class="bx bx-pie-chart-alt-2"></i>
                        <span class="nav-item">Savings</span>
                    </a>
                    <span class="tooltip">Savings</span>
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

    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    function updateThemeToggle() {
        const darkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = `<i class="bx ${darkMode ? 'bx-sun' : 'bx-moon'}"></i><span class="nav-item">${darkMode ? 'Light mode' : 'Dark mode'}</span>`;
        themeToggle.setAttribute('aria-label', darkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateThemeToggle();
    });
    updateThemeToggle();

})();
