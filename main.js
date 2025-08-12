const urlForm = document.querySelector('.shorten-url-form');
const resultDisplayArea = document.querySelector('.content');
const urlInputArea = document.getElementById('textarea');
const navBar = document.querySelector('.nav-links');

// navbar responsive
document.getElementById('toggle-icon').addEventListener('click',()=>{
    if(navBar.style.display == 'none'){
        navBar.style.display = 'flex';
    }else{
        navBar.style.display = 'none';
        navBar.style.transition = "all 0.4s ease";
    }
});

urlForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let currUrl = urlInputArea.value;
    getShortUrl(currUrl);  
});

async function getShortUrl(currUrl){
    let serverData = await fetch('https://url-shortener-service.p.rapidapi.com/shorten', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'a6b9a6582amsh9ec090d9b167ff4p12202djsn065a9c008690',
            'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com'
        },
        body: new URLSearchParams({
            url: currUrl
        })
    });
    
    

    if(!serverData.ok){
        urlInputArea.style.borderStyle = "solid";
        urlInputArea.style.borderColor = 'hsl(0, 87%, 67%)';
        document.querySelector('.error-msg').innerHTML = 'Please enter a valid link';
        return;
    }

    let jsonData = await serverData.json();
    let results = jsonData?.result_url;
    const resultContent = getHTML(results,currUrl);
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('url-results');
    resultContainer.innerHTML = resultContent;
    resultDisplayArea.insertAdjacentElement('afterbegin',resultContainer);
    urlInputArea.value = '';
}

function getHTML(data,curr){
    let html = `
            <div class="left-result">
                <h3>${curr.slice(0,50)}...</h3>
            </div>
            <div class="line-break"></div>
            <div class="right-result">
                <h3 class="result-url"> ${data} </h3>
                <button class="btn cyan-btn copyBtn">Copy</button>
            </div>
        `;
    return html;
}

// copy functionality
document.body.addEventListener('click',(e)=>{
    if(e.target.classList.contains('copyBtn')){

    let copyBtn = e.target.closest('.copyBtn');
    copyBtn.innerHTML = 'Copied!';
    copyBtn.style.background = 'hsl(255, 11%, 22%)';
    copyBtn.style.pointerEvents = 'none';

    let textToBeCopied = document.querySelector('.result-url').textContent;
    navigator.clipboard.writeText(textToBeCopied);
    setTimeout(() => {
        copyBtn.style.pointerEvents = 'auto';
        copyBtn.innerHTML = 'Copy';
        copyBtn.style.background = 'hsl(180, 66%, 49%)';
    }, 3000);
    }
});



