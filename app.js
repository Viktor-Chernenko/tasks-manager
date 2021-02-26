const tasks = [
  {
    _id: '5d2ca9e2e03d40b326596aa7',
    completed: false,
    body:
      'Описание новой задачи',
    title: 'Новая задача',
  },
];

(function (arrOfTasks) {
  // Переменные

  const tasksFragment = document.createDocumentFragment();
  const tasksListElement = document.querySelector('.tasks-list-section .list-group');
  const formAddTask = document.forms[1];
  const formTitle = formAddTask.title;
  const formBody = formAddTask.body;
  const selectThemes = document.querySelector('#themeSelect');
  let activeThemes = selectThemes.value;

  let objOfTasks = arrOfTasks.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {})

  if (localStorage.tasksUser) {
    objOfTasks = Object.values(JSON.parse(localStorage.tasksUser)).reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});
  }

  console.log(objOfTasks);

  // Темы

  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };

  // Вызов функций

  renderAllTask(objOfTasks);
  addingFragmentOnUpload(tasksFragment);
  localStorageTheame(localStorage.theame);

  // События

  formAddTask.addEventListener('submit', addNewTask);
  tasksListElement.addEventListener('click', removeTask);
  selectThemes.addEventListener('change', funcTheames);

  // Создание массива с задачами
  
  function renderAllTask(tasksList) {
    if (!tasksList) {
      console.error('Передайте список задач');
      return false;
    }
    let arrAllTasks = localStorage.tasksUser ? Object.values(JSON.parse(localStorage.tasksUser)).reverse() : Object.values(tasksList).reverse();

    arrAllTasks.forEach(element => {
      let li = addElementFragment(element);
      tasksFragment.appendChild(li);
    });
  }

  // Создание бокса с задачами

  function addElementFragment({_id,body,title} = {}) {
    let li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');
    li.setAttribute('data-taskId', _id);

    let spanTitle = document.createElement('span');
    spanTitle.textContent = title;
    spanTitle.style.fontWeight = 'bold';

    let button = document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');
    button.textContent = 'Удалить';

    let bodyText = document.createElement('p');
    bodyText.classList.add('mt-2', 'w-100');
    bodyText.textContent = body;

    li.appendChild(spanTitle);
    li.appendChild(button);
    li.appendChild(bodyText);
    
    return li;
  }

  // Добавление задач из БД при загрузке страницы

  function addingFragmentOnUpload(fragment) {
    tasksListElement.appendChild(fragment);
  }

  // Добавление в БД новоую задачу

  function addNewTask (e) {
    e.preventDefault();
    if (!formTitle.value) {
      alert("Вы не указали заголовок");
      return false;
    }
    if (!formBody.value) {
      alert("Вы не указали текст задачи");
      return false;
    }

    let randomId = Math.random();
    objOfTasks[randomId] = {
      _id: randomId,
      completed: false,
      body: formBody.value,
      title: formTitle.value
    }
    let li = addElementFragment(objOfTasks[randomId]);
    tasksListElement.insertAdjacentElement('afterbegin', li);
    localStorage.setItem('tasksUser', JSON.stringify(objOfTasks));
    console.log(objOfTasks);

    formAddTask.reset();
  }

  // Удаление задачи

  function confirmRemoveTask(title) {
    return confirm(`Вы точно хотите удалить задачу: ${title}`);
  }

  function removeTask({ target }) {
    if (!target.classList.contains(['delete-btn'])) return;
    let task = target.closest('[data-taskid]');
    let taskId = task.dataset.taskid;
    let title = task.querySelector('span').textContent;

    if (!confirmRemoveTask(title)) return;

    delete objOfTasks[taskId];
    task.remove();
    localStorage.setItem('tasksUser', JSON.stringify(objOfTasks));
  }

  // Тема приложения

  function funcTheames(e) {
    const selectThemesValue = e.target.value;
    const confThemes = confirm(`Вы точно хотите изменить тема на ${selectThemesValue}?`);
    if (!confThemes) {
      selectThemes.value = activeThemes;
      return;
    }

    activeThemes = selectThemesValue;
    localStorage.setItem('theame', activeThemes);

    changeTheames(selectThemesValue);
  }

  function changeTheames(selectThemesValue) {
    Object.entries(themes[selectThemesValue]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  function localStorageTheame(localTheame) {
    if (!localTheame) return;

    changeTheames(localTheame);
    selectThemes.value = localTheame;
  }
})(tasks);
