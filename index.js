const memeURL = "https://api.imgflip.com/get_memes"

const userURL = "http://localhost:3000/users"

const memeContainer = document.querySelector('#meme-container');

const generateButton = document.querySelector('#generate');

const favoriteMemeButton = document.querySelector('#favorite-meme')

const list= document.querySelector('#meme-list');

let memeArr = [];

let profFavs = [];

let currentMeme = {};

let currentUser;

// Get the modal
let acctModal = document.getElementById("myAcctModal");
// Get the button that opens the modal
let acctBtn = document.getElementById("createAcct");

// Get the <span> element that closes the modal
let acctSpan = document.getElementsByClassName("close")[1];

const acctButton = document.getElementById('account-submit');

const acctForm = document.querySelector('.account-input');

acctBtn.onclick = function() {
    acctModal.style.display = "block";
  }
  
  // When the user clicks on <span> (x), close the modal
acctSpan.onclick = function() {
    acctModal.style.display = "none";
}
  
  // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == acctModal) {
      acctModal.style.display = "none";
    }
}

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("loginBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

const loginButton = document.getElementById('login-submit');

const loginForm = document.querySelector('.login-input');

let loggedIn = false;

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

loginForm.addEventListener('submit', handleLogin)

acctForm.addEventListener('submit', handleNewAcct)


function handleNewAcct(e) {
    e.preventDefault();
   let newUser = {
    user: e.target.newUsername.value,
    password: e.target.newPassword.value,
    favorites: []
   }
   fetch(userURL + `?q=${e.target.newUsername.value}`)
    .then(response => response.json())
    .then((users) => {
        console.log(users)
        if (users.length === 0) {
            fetch(userURL, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(newUser)
            })
                .then(response => response.json())
                .then(() => {
                    alert("new User Added!")
                    acctModal.style.display = "none";
                }) 
        } else {
            alert('Username already in use!')
        }
    })
    acctForm.reset();
}


function handleLogin(e) {
    e.preventDefault();
    fetch(userURL)
        .then(response => response.json())
        .then((users) => {
            users.filter((element) => {
                //console.log(element.user)
                if (element.user === e.target.username.value && element.password === e.target.password.value) {
                    currentUser = element.id
                    // console.log(currentUser)
                    profFavs = element.favorites
                    loggedIn = true;
                    let logoutBtn = document.createElement('button')
                    logoutBtn.setAttribute('id', 'logout')
                    logoutBtn.textContent = "Log Out"
                    document.querySelector('#title-banner').append(logoutBtn)
                    logoutBtn.addEventListener('click', () => {
                        loggedIn = false;
                        logoutBtn.remove()
                        removeAllChildNodes(list)
                        alert(`Goodbye, ${element.user}`)
                    })
                    alert(`Welcome, ${element.user}`)
                    modal.style.display = 'none'
                    //console.log(profFavs);
                    renderProfileFavs(profFavs)
                    loginForm.reset()
                }
            })
        })
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getMeme() {
    fetch(memeURL)
        .then(response => response.json())
        .then((memes) => {
           // console.log(memes)
            memeArr = memes.data.memes
            return getRandom(memeArr)
        })
        .then(res => renderNewMeme(res))
}

function renderMeme(meme) {
    let newImage = document.createElement('img')
    newImage.setAttribute('id', 'meme-display')
    let newName = document.createElement('p')
    newName.setAttribute('id', 'name-display')
    let newId = document.createElement('p')
    newId.setAttribute('id', 'id-display')
    newImage.src = meme.url
    newName.textContent = `${meme.name}`
    newId.textContent = `Meme: #${meme.id}`
    memeContainer.append(newImage)
    memeContainer.append(newId)
    memeContainer.append(newName)
}

function renderNewMeme(meme) {
    currentMeme = meme;
    //console.log(currentMeme)
    // console.log(randomMeme);
    let newImage = document.createElement('img')
    newImage.setAttribute('id', 'meme-display')
    let newName = document.createElement('p')
    newName.setAttribute('id', 'name-display')
    let newId = document.createElement('p')
    newId.setAttribute('id', 'id-display')
    newImage.src = meme.url
    newName.textContent = `${meme.name}`
    newId.textContent = `Meme: #${meme.id}`
    memeContainer.append(newImage)
    memeContainer.append(newId)
    memeContainer.append(newName)

}
generateButton.addEventListener('click', () => {
    currentMeme = getRandom(memeArr);
    document.querySelector('#meme-display').remove();
    document.querySelector('#name-display').remove();
    document.querySelector('#id-display').remove();
    renderNewMeme(currentMeme) 
})
favoriteMemeButton.addEventListener('click', () => {
    console.log(list.contains(document.getElementById(currentMeme.id)))
    if (list.contains(document.getElementById(currentMeme.id)) === true && loggedIn === true) {
        return alert('Meme already included in list');
    } else if (list.contains(document.getElementById(currentMeme.id)) === false && loggedIn === true) {
        displayMeme();
        handlePatch();
    } else {
        return alert('Login to save memes!')
    }
})

function renderProfileFavs(array) {
    array.forEach((element) => {
        let newFavoriteMem= document.createElement('button')
        let newDeleteMem = document.createElement('button')
        newDeleteMem.setAttribute('class', 'delete')
        newDeleteMem.textContent = 'X'
        let memeId = element.id; 
        newFavoriteMem.setAttribute('id', memeId)
        newFavoriteMem.setAttribute('class', 'new-favorite')
        newFavoriteMem.textContent = element.name;
        let index = memeArr.findIndex(function(meme) {
            return meme.id = memeId
        })
        // let profFavsIndex = profFavs.findIndex(function(thisMeme) {
        //     return thisMeme.id = (memeId)
        // })
        newFavoriteMem.addEventListener('click', ()=> {
            document.querySelector('#meme-display').remove();
            document.querySelector('#name-display').remove();
            document.querySelector('#id-display').remove();
            //console.log(memeArr[index])
            renderMeme(element)
        })
        newDeleteMem.addEventListener('click', () => {
            const favIndex = profFavs.indexOf(element)
            profFavs.splice(favIndex, 1)
            console.log(profFavs);
            handlePatch();
            newFavoriteMem.remove();
            newDeleteMem.remove();
        })
        console.log(profFavs);
        list.append(newFavoriteMem);
        list.append(newDeleteMem);
    })

}

function displayMeme(){
    console.log(currentMeme)
    let newFavoriteMem= document.createElement('button')
    let newDeleteMem = document.createElement('button')
    newDeleteMem.setAttribute('class', 'delete')
    newDeleteMem.textContent = 'X'
    let memeId = currentMeme.id;
    newFavoriteMem.setAttribute('id', memeId)
    newFavoriteMem.setAttribute('class', 'new-favorite')
    newFavoriteMem.textContent= currentMeme.name
    let index = memeArr.findIndex(function(meme) {
        return meme.id === memeId
    })
    // const profFavsIndex = profFavs.findIndex(function(thisMeme) {
    //     return thisMeme.id === memeId
    // })
    if(loggedIn === true) {
        profFavs.push(memeArr[index])
    }
    newFavoriteMem.addEventListener('click', ()=> {
        document.querySelector('#meme-display').remove();
        document.querySelector('#name-display').remove();
        document.querySelector('#id-display').remove();
        renderNewMeme(memeArr[index])
    })
    newDeleteMem.addEventListener('click', () => {
        const favIndex = profFavs.indexOf(memeArr[index])
        profFavs.splice(favIndex, 1)
        console.log(profFavs);
        handlePatch();
        newFavoriteMem.remove();
        newDeleteMem.remove();
    })
    list.append(newFavoriteMem);
    list.append(newDeleteMem);
    //console.log(profFavs)
}


function handlePatch() {
    fetch(userURL + `/${currentUser}`, {
        method: "PATCH",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            favorites : profFavs,
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
}


function getRandom(arr) {
    return arr[Math.floor((Math.random()*arr.length))];
}

getMeme();