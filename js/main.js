// Сохраняем API адрес (базу данных) в переменную API
const API = "http://localhost:8000/trip";

// Сохраняем в переменные все инпуты и кнопки для ввода данных
let inpTitle = document.getElementById("inpTitle");
let inpDesc = document.getElementById("inpDesc");
let inpImg = document.getElementById("inpImg");
let inpPrice = document.getElementById("inpPrice");
let btnAdd = document.getElementById("btnAdd");
let searchValue = "";
let currentPage = 1;

// Навешиваем событие на кнопку btnAdd
btnAdd.addEventListener("click", () => {
  if (
    !inpTitle.value.trim() ||
    !inpDesc.value.trim() ||
    !inpImg.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Error, please enter all inputs");
    return;
  }
  let newTrip = {
    tripTitle: inpTitle.value,
    tripDesc: inpDesc.value,
    tripImg: inpImg.value,
    tripPrice: +inpPrice.value,
  };
  createTrip(newTrip);
  readTrips();
});

// ! =========== CREATE ============
// функция для добавления новых туров в БД
function createTrip(tripObj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(tripObj),
  });

  inpTitle.value = "";
  inpDesc.value = "";
  inpImg.value = "";
  inpPrice.value = "";
}

// ! ================== READ ==================
// Создаём функцию для отображения данных
function readTrips() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`) // получение данных из db.json
    .then((res) => res.json())
    .then((data) => {
      sectionTrips.innerHTML = ""; // очищаем наш тег section, чтобы не было дубликатов
      data.forEach((item) => {
        // перебираем наш полученный массив с объектами
        // добаляем в наш тег section верстку при каждом цикле
        sectionTrips.innerHTML += ` 
          <div class="card m-4 cardBook" style="width: 18rem">
          <img id="${item.id}" src="${item.tripImg}" class="card-img-top detailsCard" style="height: 280px" alt="${item.tripTitle}" />
        <div class="card-body">
          <h5 class="card-title">${item.tripTitle}</h5>
          <p class="card-text para">
            ${item.tripDesc}
          </p>
          <h5>${item.tripPrice} $</h5>
          <button class="btn btn-outline-danger btnDelete" id="${item.id}">
              Delete
            </button>
            <button type="button" class="btn btn-warning btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Edit
          </button>
          
        </div>
      </div>
          `;
      });
    });
}
readTrips(); // один раз вызываем функцию отображения данных для того чтобы при первом посещании сайта данные отобразились

// ! ================= DELETE ======================
// Событие на кнопку удаления
document.addEventListener("click", (e) => {
  // с помощью объекта event ищем id нашего элемента
  let del_class = [...e.target.classList]; // Сохраняем массив с классами в переменную
  if (del_class.includes("btnDelete")) {
    // проверяем, есть ли в нашем поиске наш класс btnDelete
    let del_id = e.target.id; // сохраняем id элемента, по которому кликнули
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readTrips()); // вызываем функцию отображения данных, для того чтобы всё переотобразилось сразу же после удаления одной книги
  }
});

// ! ============ EDIT START =============
let editInpTitle = document.getElementById("editInpTitle");

let editInpDesc = document.getElementById("editInpDesc");
let editInpImg = document.getElementById("editInpImg");
let editInpPrice = document.getElementById("editInpPrice");
let btnEditSave = document.getElementById("btnEditSave");

// Событие на кнопку edit
document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpTitle.value = data.tripTitle;
        editInpDesc.value = data.tripDesc;
        editInpImg.value = data.tripImg;
        editInpPrice.value = data.tripPrice;
        btnEditSave.setAttribute("id", data.id);
      });
  }
});

btnEditSave.addEventListener("click", () => {
  let editedTrip = {
    tripTitle: editInpTitle.value,
    tripDesc: editInpDesc.value,
    tripImg: editInpImg.value,
    tripPrice: editInpPrice.value,
  };
  // console.log(btnEditSave.id);
  editTrip(editedTrip, btnEditSave.id);
});

function editTrip(editObj, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(editObj),
  }).then(() => readTrips());
}
// ! ============ EDIT FINISH =============

// !========== Search ===========
let inpSearch = document.getElementById("inpSearch");
let btnSearch = document.getElementById("btnSearch");

inpSearch.addEventListener("change", (e) => {
  searchValue = e.target.value;
  readTrips();
});

// ! =========== Paginate ==========
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  currentPage--;
  readTrips();
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  readTrips();
});
