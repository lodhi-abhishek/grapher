import { view } from "./rendering";
import { parseFunction } from "./functionParsing";
import { roundvalue } from "./math";


function renderTable() {
    let tableElement = document.querySelector('table');

    /* Table head/labels */
    tableElement.innerHTML = '';
    let headerRow = document.createElement('tr');
    let xLabel = document.createElement('th');

    xLabel.textContent = 'x';
    headerRow.appendChild(xLabel);


    /* Values of Table */
    for (let key in view.functions) {
        let tableHeader = document.createElement('th');
        tableHeader.textContent = key;
        headerRow.appendChild(tableHeader);
    }
    tableElement.appendChild(headerRow);

    let tblMin = Math.ceil(view.xMin/view.xScale) * view.xScale;
    let tblMax = Math.floor(view.xMax/view.xScale) * view.xScale;
    let numberofValues = (tblMax - tblMin)/view.xScale;


    for (let i = 0 ; i <= numberofValues; i++) {
        let x = tblMin + (tblMax - tblMin) * i/numberofValues;
        let tableRow = document.createElement('tr');
        let xColumn = document.createElement('td');
        xColumn.textContent = roundvalue(x);
        tableRow.appendChild(xColumn);

        for ( let key in view.functions) {
            let yColumn = document.createElement('td');
            let expr = parseFunction(view.functions[key].expression);
            if(!expr) {
                continue;
            }

            yColumn.textContent = roundvalue(expr.evaluate({x}));
            tableRow.appendChild(yColumn);
        }
        tableElement.appendChild(tableRow);
    }
}

export { renderTable };