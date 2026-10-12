document.addEventListener('DOMContentLoaded', function () {

  const searchInput = document.getElementById('userSearch');
  const clearSearch = document.getElementById('clearSearch');
  const searchPreloader = document.getElementById('searchPreloader'); // ✅ matches HTML

  let searchTimer = null;
  let currentPage = 1;

  searchInput.addEventListener('keyup', function () {
    const search = this.value.trim();

    if (searchPreloader) {
      searchPreloader.classList.add('active');
    }

    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      currentPage = 1;
      searchFolders(search, currentPage);
    }, 3000); // 3000ms means the user waits 3 full seconds after typing before anything happens — that reads as broken, not just slow
  });

  if (clearSearch) {
    clearSearch.addEventListener('click', function () {
      searchInput.value = '';
      searchFolders('', 1);
    });
  }

  function searchFolders(search, page) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('search', search);
    currentUrl.searchParams.set('page', page);

    if (!currentUrl.searchParams.has('limit')) {
      currentUrl.searchParams.set('limit', '10');
    }

    window.location.href = currentUrl.toString();
  }

});

document.addEventListener('click', function (e) {
  if (e.target.matches('.btn-close')) {
    const alertEl = e.target.closest('.alert');
    if (alertEl) {
      alertEl.remove();
    }
  }
});
