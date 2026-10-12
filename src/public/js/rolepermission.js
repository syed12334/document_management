document.addEventListener('DOMContentLoaded', function () {

  const searchInput = document.getElementById('permissionSearch');
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
      searchRole(search, currentPage);
    }, 2000); // 2000ms means the user waits 3 full seconds after typing before anything happens — that reads as broken, not just slow
  });

  if (clearSearch) {
    clearSearch.addEventListener('click', function () {
      searchInput.value = '';
      searchRole('', 1);
    });
  }

  function searchRole(search, page) {
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
// Modal popup
document.addEventListener('DOMContentLoaded', function () {
  const deleteModalEl = document.getElementById('deleteConfirmModal');
  const deleteDocName = document.getElementById('deleteDocName');
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  const deleteSpinner = document.getElementById('deleteSpinner');
  let pendingId = null;
  let backdropEl = null;

  function openModal() {
    deleteModalEl.classList.add('show');
    deleteModalEl.style.display = 'block';
    deleteModalEl.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');

    backdropEl = document.createElement('div');
    backdropEl.className = 'modal-backdrop fade show';
    document.body.appendChild(backdropEl);
  }

  function closeModal() {
    deleteModalEl.classList.remove('show');
    deleteModalEl.style.display = 'none';
    deleteModalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (backdropEl) {
      backdropEl.remove();
      backdropEl = null;
    }
  }

  document.querySelectorAll('.btn-delete-doc').forEach(function (btn) {
    btn.addEventListener('click', function () {
      pendingId = btn.getAttribute('data-id');
      deleteDocName.textContent = btn.getAttribute('data-name');
      openModal();
    });
  });

  // Cancel button / close (x) button
  deleteModalEl.querySelectorAll('[data-bs-dismiss="modal"]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  confirmBtn.addEventListener('click', function () {
    window.location.href="/role/permission/delete/"+pendingId;
  });
});

