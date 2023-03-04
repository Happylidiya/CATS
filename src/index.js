const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');
const formCatAdd = document.querySelector('#popup-form-add')
const formLogin = document.querySelector('#popup-form-login')
const isAuth = Cookies.get("email");

const popupAdd = new Popup('popup-add');
const popupImage = new PopupWithImage('popup-cat-image');
const popupLogin = new Popup('popup-login');

function serializeForm(elements) {
    const formData = {};

    elements.forEach( input => {
        if (input.type === 'submit' || input.type === 'button') return;
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        }
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;

        }
    });

    return formData;
}

function handleFormAddCat(e) {
    e.preventDefault();
    const elementsFormCat = [...formCatAdd.elements];
    const formData = serializeForm(elementsFormCat);
    api.addNewCat(formData)
      .then(function() {
        const newElement = new Card(formData, '#card-template', handleClickCatImage);
        cardsContainer.prepend(newElement.getElement());
        popupAdd.close();
      })
      .catch(function(err){
        console.log(err);
      })
}

function handleClickCatImage(dataSrc) {
    popupImage.open(dataSrc)
}

function handleFormLogin(e) {
  e.preventDefault();
  const elementsFormLogin = [...formLogin.elements];
  const formData = serializeForm(elementsFormLogin);
  Cookies.set("email", formData.email, {expires: 15});
  btnOpenPopup.classList.remove('visually-hidden');
  btnOpenPopupLogin.classList.add('visually-hidden');
  popupLogin.close();
}

formCatAdd.addEventListener('submit', handleFormAddCat);
formLogin.addEventListener('submit', handleFormLogin);

btnOpenPopup.addEventListener('click', (e) => {
    e.preventDefault();
    popupAdd.open();
});

btnOpenPopupLogin.addEventListener('click', (e) => {
  e.preventDefault();
  popupLogin.open();
});


api.getAllCats()
   .then(data => {
      data.forEach( catData => {
        const newElement = new Card(catData, '#card-template', handleClickCatImage);
        cardsContainer.prepend(newElement.getElement());
      });
   })
   .catch(function(err){
    console.log(err);
  })


if (!isAuth) {
  popupLogin.open();
  btnOpenPopup.classList.add('visually-hidden');
} else {
  btnOpenPopupLogin.classList.add('visually-hidden');
}


popupAdd.setEventListener();
popupImage.setEventListener();
popupLogin.setEventListener();

