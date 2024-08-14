var ablationID = new URLSearchParams(window.location.search).get('ablation');

table = document.getElementById('map-table');

quesTitle = document.getElementById('ques-title')
legendDiv = document.getElementById('legend-div')

if(ablationID === '1'){
    quesTitle.style.display = 'none';
    table.style.display = 'none';
    legendDiv.style.display = 'none';
} else if(ablationID === '2'){
    quesTitle.style.display = 'none';
}