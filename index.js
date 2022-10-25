const memeURL = "https://api.imgflip.com/get_memes"

const memeContainer = document.querySelector('#meme-container');

const generateButton = document.querySelector('#generate');

const favoriteMemeButton = document.querySelector('#favorite-meme')

const list= document.querySelector('#meme-list');

let memeArr = [];

let currentMeme = {};

function getMeme() {
    fetch(memeURL)
        .then(response => response.json())
        .then((memes) => {
           console.log(memes)
            memeArr = memes.data.memes
            return getRandom(memeArr)
        })
        .then(res => renderMeme(res))
}

function renderMeme(meme) {
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
    renderMeme(currentMeme) 
})
favoriteMemeButton.addEventListener('click', () => {
    if (list.contains(document.getElementById(currentMeme.id))) {
       return alert('Meme already included in list');
    } else {
        displayMeme();
    }
})
function displayMeme(){
    //console.log(currentMeme)
    let newFavoriteMem= document.createElement('button')
    let newDeleteMem = document.createElement('button')
    newDeleteMem.setAttribute('class', 'delete')
    newDeleteMem.textContent = 'X'
    const memeId = currentMeme.id;
    newFavoriteMem.setAttribute('id', memeId)
    newFavoriteMem.setAttribute('class', 'new-favorite')
    newFavoriteMem.textContent= currentMeme.name
    const index = memeArr.findIndex(function(meme) {
        return meme.id === memeId
    });
    newFavoriteMem.addEventListener('click', ()=> {
        document.querySelector('#meme-display').remove();
        document.querySelector('#name-display').remove();
        document.querySelector('#id-display').remove();
        renderMeme(memeArr[index])
    })
    newDeleteMem.addEventListener('click', () => {
        newFavoriteMem.remove();
        newDeleteMem.remove();
    })
    list.append(newFavoriteMem);
    list.append(newDeleteMem);
}




function getRandom(arr) {
    return arr[Math.floor((Math.random()*arr.length))];
}

getMeme();