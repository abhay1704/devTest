const Pagination = (pageActive, setPageActive, nPages, setPage) => {
  const handlePaginationClick = (e) => {
    const target = e.target.closest(".pagination__button");
    if (!target || !target.classList.contains("btn--enabled")) return;

    const page = parseInt(target.dataset.page, 10);
    setPage(page);

    setPageActive(page, nPages);
    renderPaginationButtons(currentPage);
  };

  const renderPaginationButtons = (newPage) => {
    const container = document.querySelector(".pagination__button-specific");
    container.innerHTML = "";
    console.log(newPage);

    for (
      let i = Math.max(1, newPage - 10 + 1);
      i < Math.min(nPages + 1, Math.max(1, newPage - 10 + 1) + 10);
      i++
    ) {
      const button = document.createElement("button");
      button.className = `pagination__button ${
        newPage === i ? "btn--active" : "btn--enabled"
      }`;
      button.dataset.page = i;
      button.innerText = i;
      container.appendChild(button);
    }
  };

  document.querySelector(".pagination__button-last").dataset.page = nPages;
  document
    .querySelector(".pagination")
    .addEventListener("click", handlePaginationClick);

  // Initial rendering of buttons
  renderPaginationButtons(pageActive);
};

const setPageActive = (newPage, nPages) => {
  currentPage = newPage;

  document.querySelector(".pagination__button-previous").dataset.page =
    currentPage - 1;
  document.querySelector(".pagination__button-next").dataset.page =
    currentPage + 1;

  if (currentPage === 1) {
    document
      .querySelector(".pagination__button-previous")
      .classList.remove("btn--enabled");

    document
      .querySelector(".pagination__button-first")
      .classList.remove("btn--enabled");
  } else {
    document
      .querySelector(".pagination__button-previous")
      .classList.add("btn--enabled");

    document
      .querySelector(".pagination__button-first")
      .classList.add("btn--enabled");
  }

  if (currentPage === nPages - 1) {
    document
      .querySelector(".pagination__button-next")
      .classList.remove("btn--enabled");

    document
      .querySelector(".pagination__button-last")
      .classList.remove("btn--enabled");
  } else {
    document
      .querySelector(".pagination__button-next")
      .classList.add("btn--enabled");

    document
      .querySelector(".pagination__button-last")
      .classList.add("btn--enabled");
  }

  Pagination(currentPage, setPageActive, nPages);
};
