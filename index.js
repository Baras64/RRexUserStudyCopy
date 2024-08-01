let audioText = document.getElementById('audio-text');

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
    "loudness": "loudness",
    "average_pitch": "average pitch",
    "pitch_range": "pitch range",
    "speed": "time",
    "pauses": "pauses"
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

function addBothAudioPlayback(leftElement, rightElement, leftPath, rightPath) {

    leftElement.style.cursor = "pointer";
    rightElement.style.cursor = "pointer";

    oldColor = leftElement.style.backgroundColor;

    let leftAudio = new Audio(`${leftPath}`);
    let rightAudio = new Audio(`${rightPath}`);

    leftElement.addEventListener('click', function () {
        leftAudio.onended = function () { return }
        rightAudio.onended = function () { return }
        leftAudio.play();
        leftAudio.onended = function () {
            rightAudio.play();
        }
    });

    rightElement.addEventListener('click', function () {
        leftAudio.onended = function () { return }
        rightAudio.onended = function () { return }
        rightAudio.play();
        rightAudio.onended = function () {
            leftAudio.play();
        }
    });

    leftAudio.addEventListener('play', function () {
        leftElement.style.borderColor = "#67ed37";
    });

    rightAudio.addEventListener('play', function () {
        rightElement.style.borderColor = "#67ed37";
    });

    leftAudio.addEventListener('ended', function () {
        leftElement.style.borderColor = "white";
    });

    rightAudio.addEventListener('ended', function () {
        rightElement.style.borderColor = "white";
    });

    leftElement.addEventListener('mouseover', function () {
        // leftElement.style.borderColor = "#d8ed82";
        // if (oldColor == "lightgray"){
        //     leftElement.style.borderColor = "lightgray";
        // } else {
        //     leftElement.style.borderColor = "rgb(69, 170, 227)";
        // }
        leftElement.style.borderColor = leftElement.style.backgroundColor;
    });

    leftElement.addEventListener('mouseout', function () {
        if (!leftAudio.paused) {
            return
        }
        leftElement.style.borderColor = "white";
    });

    rightElement.addEventListener('mouseover', function () {
        // rightElement.style.borderColor = "#d8ed82";
        // rightElement.style.borderColor = "rgb(69, 170, 227)";
        rightElement.style.borderColor = rightElement.style.backgroundColor;
    });

    rightElement.addEventListener('mouseout', function () {
        if (!rightAudio.paused) {
            return
        }
        rightElement.style.borderColor = "white";
    });

}

function createCapsule(colorLeft, colorRight, audioPathLeft, audioPathRight) {
    let container = document.createElement('div');
    container.classList.add('container-capsule');

    let leftShape = document.createElement('div');
    leftShape.classList.add('left-shape');
    leftShape.style.backgroundColor = colorLeft;
    leftShape.style.borderColor = "white";

    // addAudioPlayback(leftShape, audioPathLeft, true)

    let gap = document.createElement('div');
    gap.classList.add('gap');

    let rightShape = document.createElement('div');
    rightShape.classList.add('right-shape');
    rightShape.style.backgroundColor = colorRight;
    rightShape.style.borderColor = "white";

    // addAudioPlayback(rightShape, audioPathRight, true)

    addBothAudioPlayback(leftShape, rightShape, audioPathLeft, audioPathRight)

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
    leftShape.style.borderColor = "white";

    // addAudioPlayback(leftShape, audioPathLeft, false)

    let rightShape = document.createElement('div');
    rightShape.classList.add('triangle-right');
    rightShape.style.backgroundColor = colorRight;
    rightShape.style.borderColor = "white";

    // addAudioPlayback(rightShape, audioPathRight, false)

    addBothAudioPlayback(leftShape, rightShape, audioPathLeft, audioPathRight)

    container.appendChild(leftShape);
    container.appendChild(rightShape);

    container.style.justifyContent = "center";
    container.style.paddingLeft = "10px";

    return container;
}

var emotions = ["angry", "surprise", "happy", "sad", "neutral"];

function insertPaddedCell(row, padding = '30px') {
    let cell = row.insertCell();
    cell.style.width = padding;
}

function loadTable(filename, isPlay=false) {

    mapTable.innerHTML = "";
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            targetAudio.src = data.target_audio_path;
            counterfactualAudio.src = data.counterfactual_audio_path;

            targetAudio.onplay = function () {
                audioTarget.classList.remove('fa-play');
                audioTarget.classList.add('fa-pause');
            }

            targetAudio.onended = function () {
                audioTarget.classList.remove('fa-pause');
                audioTarget.classList.add('fa-play');
            }

            counterfactualAudio.onplay = function () {
                // audioCf.classList.remove('fa-play-circle');
                // audioCf.classList.add('fa-pause-circle');
                audioCf.classList.remove('fa-play');
                audioCf.classList.add('fa-pause');
            }

            counterfactualAudio.onended = function () {
                audioCf.classList.remove('fa-pause');
                audioCf.classList.add('fa-play');
            }

            // targetEmotion.innerText = data.target_emotion;
            // counterfactualEmotion.innerText = data.counterfactual_emotion;

            audio_text = data.text;

            audioText.innerHTML = `<i>"${audio_text}"</i>`;

            words = audio_text.split(" ");

            let row = mapTable.insertRow();

            cell = row.insertCell();
            cell.innerHTML = "The actual voice has the </br> following for these words";
            cell = row.insertCell();
            cell = row.insertCell();

            words.forEach(element => {
                let cell = row.insertCell();
                cell.innerText = element;
                row.insertCell();
            });

            row = mapTable.insertRow();

            for (let index = 0; index < 5; index++) {
                cueData = data[idx2cueidx[index]]
                let row = mapTable.insertRow();
                row.value = index;
                row.addEventListener('mouseover', function () {

                    Array.from(mapTable.rows).forEach(row => {
                        if(row.value <= 4 && row.value >= 0) {
                            if (row.value != index) {
                                row.style.opacity = 0.3;
                                row.style.transition = "opacity 0.3s";
                            }
                        }
                    });

                });
                row.addEventListener('mouseout', function () {
                    Array.from(mapTable.rows).forEach(row => {
                        if(row.value <= 4 && row.value >= 0) {
                            if (row.value != index) {
                                row.style.opacity = 1;
                            }
                        }
                    });
                });

                cell = row.insertCell();
                rltText = cueData.rlt
                cell.innerText = cueData.rlt;
                // cell.innerHTML = `<span style='color: ${rlt2color[rltText]}'>${cueData.rlt}</span> ${cueidx2cue[idx2cueidx[index]]}`;
                cell.innerHTML = `<b>${cueData.rlt}</b> ${cueidx2cue[idx2cueidx[index]]}`;

                if (cueData.rlt == "Similar") {
                    cell.title = `Actual has ${cueData.rlt} ${cueidx2cue[idx2cueidx[index]]} to ${data.counterfactual_emotion}`;
                } else {
                    cell.title = `Actual has ${cueData.rlt} ${cueidx2cue[idx2cueidx[index]]} than ${data.counterfactual_emotion}`;
                }

                insertPaddedCell(row, '5px');

                // cell = row.insertCell();
                // cell.innerText = cueidx2cue[idx2cueidx[index]];

                insertPaddedCell(row);

                words.forEach((element, idx) => {
                    let colorLeft = cueData["left"][idx];
                    let colorRight = cueData["right"][idx];
                    let cell = row.insertCell();

                    if (index == 4) {
                        capsule = createTriangle(colorLeft, colorRight, data.tgt_pause_word_clips[idx], data.cf_pause_word_clips[idx]);
                    } else {
                        capsule = createCapsule(colorLeft, colorRight, data.tgt_word_clips[idx], data.cf_word_clips[idx]);
                    }

                    cell.appendChild(capsule);
                    insertPaddedCell(row);

                });

            }

            if(isPlay){
                counterfactualAudio.play();
            }

        });

}

counterfactualSelect.addEventListener('change', function () {

    let emotion = counterfactualSelect.value;
    console.log("Counterfactual emotion changed to: ", emotion);

    let filename = `./${baseDir}/data_${emotion}.json`;
    loadTable(filename, isPlay=true);
});

var newEmotions = [];
var targetEmo = ""

async function checkFile(emotions) {
    let response;
    for (let i = 0; i < emotions.length; i++) {

        response = await fetch(`./${baseDir}/data_${emotions[i]}.json`);
        if (response.ok) {
            console.log("File exists")
            newEmotions.push(emotions[i])
        } else {
            console.log("File does not exist")
            targetEmo = emotions[i]
        }
    }
}

var baseDir = `example${new URLSearchParams(window.location.search).get("example")}`

checkFile(emotions).then(() => {

    counterfactualSelect.innerHTML = "";
    newEmotions.forEach(emotion => {
        let option = document.createElement('option');
        option.value = emotion;
        option.innerText = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        counterfactualSelect.appendChild(option)
    });

    loadTable(`./${baseDir}/data_${newEmotions[0]}.json`);
});
// loadTable("");

