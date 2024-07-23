let targetAudio = document.getElementById('target-audio');
let counterfactualAudio = document.getElementById('counterfactual-audio');

let targetEmotion = document.getElementById('target-emotion');
// let counterfactualEmotion = document.getElementById('counterfactual-emotion');

let mapTable = document.getElementById('map-table');
let counterfactualSelect = document.getElementById('counterfactual-emotion-select');

let audioTarget = document.getElementById('play-target');
let audioCf = document.getElementById('play-counterfactual');

audioTarget.addEventListener('click', function () {
    // targetAudio.src = "example1/word_clips/cf_are_6.wav";
    targetAudio.play();
});

audioCf.addEventListener('click', function () {
    // counterfactualAudio.src = "example1/word_clips/tgt_are_6.wav";
    counterfactualAudio.play();
});

const idx2cueidx = {
    0: "loudness",
    1: "average_pitch",
    2: "pitch_range",
    3: "speed",
    4: "pauses"
}

const cueidx2cue = {
    "loudness": "Loudness",
    "average_pitch": "Average Pitch",
    "pitch_range": "Pitch Range",
    "speed": "Time",
    "pauses": "Pauses"
}

const rlt2color = {
    "Lower": "#E74B3C",
    "Shorter": "#E74B3C",
    "Higher": "#3498DB",
    "Longer": "#3498DB",
    "Similar": "#BDC3C7",
    "More": "#3498DB",
    "Less": "#E74B3C",
    "Faster": "#3498DB",
}

// counterfactualSelect.addEventListener('change', function(){
//     console.log("Counterfactual emotion changed to: ", counterfactualSelect.value);
// });

function addAudioPlayback(element, path, isCapsule) {
    let audio = new Audio(`${path}`);
    element.addEventListener('click', function () {
        audio.play();
    });

    var oldColor = element.style.borderColor;

    audio.addEventListener('play', function () {
        element.style.borderColor = "#67ed37";
    });

    audio.addEventListener('ended', function () {
        element.style.borderColor = oldColor;
    });

    element.style.cursor = "pointer"


    element.addEventListener('mouseover', function () {
        element.style.borderColor = "#d8ed82";
    });

    element.addEventListener('mouseout', function () {
        element.style.borderColor = oldColor;
    });

    // return element;
}

function createCapsule(colorLeft, colorRight, audioPathLeft, audioPathRight) {
    let container = document.createElement('div');
    container.classList.add('container-capsule');

    let leftShape = document.createElement('div');
    leftShape.classList.add('left-shape');
    leftShape.style.backgroundColor = colorLeft;
    leftShape.style.borderColor = colorLeft;

    addAudioPlayback(leftShape, audioPathLeft, true)

    let gap = document.createElement('div');
    gap.classList.add('gap');

    let rightShape = document.createElement('div');
    rightShape.classList.add('right-shape');
    rightShape.style.backgroundColor = colorRight;
    rightShape.style.borderColor = colorRight;

    addAudioPlayback(rightShape, audioPathRight, true)

    container.appendChild(leftShape);
    container.appendChild(gap);
    container.appendChild(rightShape);

    container.style.justifyContent = "center";

    return container;
}

function createTriangle(colorLeft, colorRight, audioPathLeft, audioPathRight) {

    if (colorLeft == "white") {
        return document.createElement('div')
    }

    let container = document.createElement('div');
    container.classList.add('container-capsule');

    let leftShape = document.createElement('div');
    leftShape.classList.add('triangle-left');
    leftShape.style.backgroundColor = colorLeft;
    leftShape.style.borderColor = colorLeft;

    addAudioPlayback(leftShape, audioPathLeft, false)

    let rightShape = document.createElement('div');
    rightShape.classList.add('triangle-right');
    rightShape.style.backgroundColor = colorRight;
    rightShape.style.borderColor = colorRight;

    addAudioPlayback(rightShape, audioPathRight, false)

    container.appendChild(leftShape);
    container.appendChild(rightShape);

    container.style.justifyContent = "center";
    container.style.paddingLeft = "10px";

    return container;
}

var emotions = ["angry", "surprise", "happy", "sad", "neutral"];

function insertPaddedCell(row){
    let cell = row.insertCell();
    cell.style.width = "30px";
}

function loadTable(filename) {

    mapTable.innerHTML = "";
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            targetAudio.src = data.target_audio_path;
            counterfactualAudio.src = data.counterfactual_audio_path;

            targetAudio.onplay = function () {
                audioTarget.classList.remove('fa-play-circle');
                audioTarget.classList.add('fa-pause-circle');
            }

            targetAudio.onended = function () {
                audioTarget.classList.remove('fa-pause-circle');
                audioTarget.classList.add('fa-play-circle');
            }

            counterfactualAudio.onplay = function () {
                audioCf.classList.remove('fa-play-circle');
                audioCf.classList.add('fa-pause-circle');
            }

            counterfactualAudio.onended = function () {
                audioCf.classList.remove('fa-pause-circle');
                audioCf.classList.add('fa-play-circle');
            }

            targetEmotion.innerText = data.target_emotion;
            // counterfactualEmotion.innerText = data.counterfactual_emotion;

            audio_text = data.text;

            words = audio_text.split(" ");

            let row = mapTable.insertRow();

            cell = row.insertCell();
            cell = row.insertCell();
            cell = row.insertCell();
            cell = row.insertCell();

            words.forEach(element => {
                let cell = row.insertCell();
                cell.innerText = element;
                row.insertCell();
            });

            for (let index = 0; index < 5; index++) {
                cueData = data[idx2cueidx[index]]
                let row = mapTable.insertRow();

                cell = row.insertCell();
                rltText = cueData.rlt
                cell.innerText = cueData.rlt;
                cell.style.color = rlt2color[rltText];

                insertPaddedCell(row);

                cell = row.insertCell();
                cell.innerText = cueidx2cue[idx2cueidx[index]];

                insertPaddedCell(row);

                words.forEach((element, idx) => {
                    let colorLeft = cueData["left"][idx];
                    let colorRight = cueData["right"][idx];
                    let cell = row.insertCell();

                    if (index == 4) {
                        capsule = createTriangle(colorLeft, colorRight, data.tgt_word_clips[idx], data.cf_pause_word_clips[idx]);
                    } else {
                        capsule = createCapsule(colorLeft, colorRight, data.tgt_word_clips[idx], data.cf_word_clips[idx]);
                    }

                    cell.appendChild(capsule);
                    insertPaddedCell(row);

                });

            }

        });

}

counterfactualSelect.addEventListener('change', function () {

    let emotion = counterfactualSelect.value;

    let filename = `./example1/data_${emotion}.json`;
    loadTable(filename);

});

var newEmotions = [];
var targetEmo = ""

async function checkFile(emotions) {
    let response;
    for(let i = 0; i < emotions.length; i++) {
        
        response = await fetch(`./example1/data_${emotions[i]}.json`);
        if (response.ok) {
            console.log("File exists")
            newEmotions.push(emotions[i])
        } else {
            console.log("File does not exist")
            targetEmo = emotions[i]
        }
    }
}

checkFile(emotions).then(() => {

    counterfactualSelect.innerHTML = "";
    newEmotions.forEach(emotion => {
        let option = document.createElement('option');
        option.value = emotion;
        option.innerText = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        counterfactualSelect.appendChild(option)
    });

    loadTable(`./example1/data_${newEmotions[0]}.json`);
});
// loadTable("");


