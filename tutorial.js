var tutorialId = new URLSearchParams(window.location.search).get('tutorial');

table = document.getElementById('map-table')



quesTitle = document.getElementById('ques-title')
legend = document.getElementById('legend-div')
containerInfo = document.getElementsByClassName('container-info')[0]

console.log(tutorialId)

if(tutorialId === '1'){
    quesTitle.style.display = 'none';
    table.style.display = 'none';
    legend.style.display = 'none';
} else if(tutorialId === '2') {
    quesTitle.style.display = 'none';
    // table.style.display 
    legend.style.display = 'none';
    containerInfo.style.display = 'none';
    temp = setInterval(() => {
        console.log("hey")
        if(table.rows.length > 0){
            rows = table.rows;
            rows[0].style.display = "none";
            rows[1].style.display = "none";
            for (let i = 2; i < rows.length; i++) {
                cells = rows[i].cells;
                for (let j = 3; j < cells.length; j++) {
                    cells[j].style.display = "none";
                }
            }
            clearInterval(temp);
        }
    }, 100);
    rows[0].style.display = "none";
} else if(tutorialId === '3') {
    quesTitle.style.display = 'none';
    containerInfo.style.display = 'none';
}

