const memeURL = "https://api.imgflip.com/get_memes"

const memeContainer = document.querySelector('#meme-container');

const generateButton = document.querySelector('#generate');

let memeArr = [];

let currentMeme = {};

function getMeme() {
    fetch(memeURL)
        .then(response => response.json())
        .then((memes) => {
            memeArr = memes.data.memes
            return getRandom(memeArr)
        })
        .then(res => renderMeme(res))
}

function renderMeme(meme) {
    currentMeme = meme;
    // console.log(randomMeme);
    let newImage = document.createElement('img')
    newImage.setAttribute('id', 'meme-display')
    newImage.src = meme.url
    memeContainer.appendChild(newImage)
}
generateButton.addEventListener('click', () => {
    currentMeme = getRandom(memeArr);
    document.querySelector('#meme-display').remove();
    
    console.log(renderMeme(currentMeme)) 
})




function getRandom(arr) {
    return arr[Math.floor((Math.random()*arr.length))];
}

getMeme();