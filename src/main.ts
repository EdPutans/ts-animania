import { Anime, SortType } from "./types";

// write your code here!
const API_URL = "https://api.jikan.moe/v3/top/anime/1";

type FilterObj = { [x: string]: any };

let filterFormObj: FilterObj = {};
let sortValue: SortType = "";
let searchValue: string = "";
let originalAnimes: null | Anime[] = null;

const getAnimeList = () => {
  fetch(API_URL)
    .then((resp) => resp.json())
    .then((animes) => {
      originalAnimes = animes.top;
      renderAnimes(animes.top);
    });
};

const renderAnimes = (animesArr: Anime[] | null) => {
  if (!animesArr) return;
  const container = document.querySelector(".container");
  if (!container) return;
  container.innerHTML = "";

  const searchResults = searchAnimes(animesArr);

  filterAndSortAnimes(searchResults).forEach((anime) => {
    container.append(createAnimeCard(anime));
  });
};

const createAnimeCard = (animeObj: Anime) => {
  const card = document.createElement("a");
  card.href = animeObj.url;
  card.className = "card";
  card.target = "_blank";

  card.innerHTML = `
    <article >
      <div class="card__header">
        <h3>${animeObj.title}</h3>
      </div>
      <img
        src="${animeObj.image_url}"
        alt=""
        height="330"
      />
      <div class="card__info">
        <p>Episodes: ${animeObj.episodes}</p>
        <p>Start date: ${animeObj.start_date}</p>
        <p>End date: ${animeObj.end_date}</p>
        <p>Score: ${animeObj.score}</p>
        <p>Shortlisted by ${animeObj.members} people</p>
        <p>Made for ${animeObj.type}</p>
      </div>
    </article>
  `;

  return card;
};

const compareNumbers = (a: number, b: number): number => b - a;

const compareWords = (a: string, b: string): number => a.localeCompare(b);

const searchAnimes = (animesArr: Anime[]): Anime[] =>
  searchValue !== ""
    ? animesArr.filter((anime) =>
      anime.title.toLowerCase().includes(searchValue.toLowerCase())
    )
    : animesArr;



const sortAnimes = (animesArr: Anime[], sortType: SortType) => {
  const sortFuncs: { [K in SortType]?: (a: any, b: any) => number } = {
    score: (a, b) => compareNumbers(a.score, b.score),
    type: (a, b) => compareWords(a.type, b.type),
    members: (a, b) => compareNumbers(a.members, b.members),
    title: (a, b) => compareWords(a.title, b.title)
  };

  return sortType !== "" ? animesArr.sort(sortFuncs[sortType]) : animesArr;
};

const filterAnimes = (animesArr: Anime[], filterType: FilterObj) => {
  return animesArr.filter((obj) => {
    return Object.keys(filterType).reduce((acc: boolean, val) => {
      if (acc === false) return false;

      // People who use nested ternaries deserve burnt pineapples on their pizza.
      return val === "type"
        ? filterType[val] === ""
          ? true
          : obj[val] === filterType[val]
        // I gave up debugging this:
        // @ts-ignore
        : obj[val] > filterType[val];
    }, true);
  });
};

const filterAndSortAnimes = (animesArr: Anime[]): Anime[] =>
  sortAnimes(filterAnimes(animesArr, filterFormObj), sortValue);

const addFilterFormListener = () => {
  const filterForm = document.querySelector(".filter-form");
  if (!filterForm) return;

  filterForm.addEventListener("change", ({ target }) => {
    // ignore because form targets. :|
    // @ts-ignore
    filterFormObj = { ...filterFormObj, [target.name]: target.value };
    renderAnimes(originalAnimes);
  });
};

const addSortFormListener = () => {
  const sortForm = document.querySelector(".sort-form");
  if (!sortForm) return;
  sortForm.addEventListener("change", ({ target }) => {
    // ignore because form targets. :|
    // @ts-ignore
    sortValue = target.value;
    renderAnimes(originalAnimes);
  });
};

const addSearchFormListener = () => {
  const searchForm = document.querySelector("#search");

  if (!searchForm) return;

  searchForm.addEventListener("submit", (e) => e.preventDefault());
  // ignore because form targets. :|
  // @ts-ignore
  searchForm.search.addEventListener("input", (e) => {
    searchValue = e.target.value;
    renderAnimes(originalAnimes);
  });
};

const setupPage = () => {
  getAnimeList();
  addFilterFormListener();
  addSortFormListener();
  addSearchFormListener();
};

setupPage();
