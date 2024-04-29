function TableDataToHtmlTable(dataTable, outputDivContainer=null, editButtons=false)
{
    if(!dataTable)
        return null;

    const htmlTable = {};
    htmlTable.mainDiv = document.createElement('div');
    htmlTable.mainDiv.id = 'htmlTableMainDiv';
    htmlTable.mainDiv.style.display = 'grid';
    htmlTable.mainDiv.style.gridTemplateColumns = `repeat(${dataTable.cols.length}, 1fr)`; //`${editButtons?'1fr ':''}repeat(${dataTable.cols.length}, 1fr)`;
    htmlTable.mainDiv.style.gridTemplateRows = `repeat(${dataTable.rows.length+1}, 1fr)`;

    htmlTable.labelDiv = document.createElement('div');
    htmlTable.labelDiv.id = 'htmlTableTitleDiv';
    htmlTable.labelDiv.textContent = dataTable.label.toUpperCase();
    htmlTable.labelDiv.className = 'mbaTitle mbaTableCell-title';
    htmlTable.labelDiv.style.textAlign = 'center';
    htmlTable.labelDiv.style.verticalAlign = 'middle';
    htmlTable.labelDiv.style.gridColumn = `span ${dataTable.cols.length}`;
    htmlTable.mainDiv.append(htmlTable.labelDiv);

    htmlTable.colDivs = [];
    for(let colIndex=0; colIndex<dataTable.cols.length; colIndex++)
    {
        htmlTable.colDivs.push(document.createElement('div'));
        htmlTable.colDivs[colIndex].id = `htmlTableColDiv${colIndex}`;
        htmlTable.colDivs[colIndex].textContent = dataTable.cols[colIndex];
        htmlTable.colDivs[colIndex].className = (colIndex<dataTable.cols.length-1)?'mbaTableCell-headerNrml':'mbaTableCell-headerRight';
        htmlTable.colDivs[colIndex].style.textAlign = 'center';
        htmlTable.colDivs[colIndex].style.verticalAlign = 'middle';
        htmlTable.colDivs[colIndex].style.fontWeight = 'bold';
        htmlTable.colDivs[colIndex].style.fontStyle = 'italic';
        htmlTable.mainDiv.append(htmlTable.colDivs[colIndex]);
    }

    htmlTable.rowDivs = [];
    for(let rowIndex=0; rowIndex<dataTable.rows.length; rowIndex++)
    {
        const newRow = {};
        for(let colIndex=0; colIndex<dataTable.cols.length; colIndex++)
        {
            if(editButtons)
                newRow[dataTable.cols[colIndex]] = document.createElement('button');
            else
                newRow[dataTable.cols[colIndex]] = document.createElement('div');
            newRow[dataTable.cols[colIndex]].id = `htmlTableRow${rowIndex}:${dataTable.cols[colIndex]}`;
            newRow[dataTable.cols[colIndex]].textContent = dataTable.rows[rowIndex][dataTable.cols[colIndex]];
            if(!(rowIndex==dataTable.rows.length-1&&colIndex==dataTable.cols.length-1))
                newRow[dataTable.cols[colIndex]].className = (rowIndex==dataTable.rows.length-1)?('mbaTableCell mbaTableCell-bottom'):((colIndex==dataTable.cols.length-1)?('mbaTableCell mbaTableCell-right'):('mbaTableCell mbaTableCell-nrml'));
            else
                newRow[dataTable.cols[colIndex]].className = 'mbaTableCell mbaTableCell-botRight';
            newRow[dataTable.cols[colIndex]].style.textAlign = 'center';
            newRow[dataTable.cols[colIndex]].style.verticalAlign = 'middle';
            if(editButtons)
            {
                newRow[dataTable.cols[colIndex]].className += ' mbaTableButton';
                newRow[dataTable.cols[colIndex]].dataset.rowIndex = rowIndex;
                newRow[dataTable.cols[colIndex]].dataset.colIndex = colIndex;
                newRow[dataTable.cols[colIndex]].setAttribute("onclick", `EditTableRow(this);`);//'${newRow[dataTable.cols[colIndex]].id}'
            }
            htmlTable.mainDiv.append(newRow[dataTable.cols[colIndex]]);
        }
        htmlTable.rowDivs.push(newRow);
    }

    if(outputDivContainer!=null)
        outputDivContainer.append(htmlTable.mainDiv);
    return htmlTable;
}


function RowDataToHtmlRow(dataTable, rowIndex, outputDivContainer=null, editInputFields=false)
{
    if(!dataTable || dataTable.rows.length<=rowIndex)
        return null;

    
    const mainDiv = document.createElement('div');
    mainDiv.id = 'htmlRowMainDiv';
    mainDiv.style.display = 'grid';
    mainDiv.style.gridTemplateColumns = `repeat(${dataTable.cols.length}, 1fr)`;
    mainDiv.style.gridTemplateRows = `repeat(${4}, 1fr)`;
    

    const labelDiv = document.createElement('div');
    labelDiv.id = 'htmlRowLabelDiv';
    labelDiv.textContent = `Modify ${dataTable.label} Row`;
    labelDiv.className = 'mbaTitle mbaTableCell-title';
    labelDiv.style.textAlign = 'center';
    labelDiv.style.verticalAlign = 'middle';
    labelDiv.style.gridColumn = `span ${dataTable.cols.length}`;
    labelDiv.dataset.sheetLabel = dataTable.label;
    mainDiv.append(labelDiv);
    

    const colDivs = [];
    for(let colIndex=0; colIndex<dataTable.cols.length; colIndex++)
    {
        const colDiv=document.createElement('div');
        colDiv.id = `htmlRowCol${colIndex}Div`;
        colDiv.textContent = dataTable.cols[colIndex];
        colDiv.className = (colIndex<dataTable.cols.length-1)?'mbaTableCell-headerNrml':'mbaTableCell-headerRight';
        colDiv.style.textAlign = 'center';
        colDiv.style.verticalAlign = 'middle';
        colDiv.style.fontWeight = 'bold';
        colDiv.style.fontStyle = 'italic';
        mainDiv.append(colDiv);
        colDivs.push(colDiv);
    }

    const rowDivs = {};
    for(let colIndex=0; colIndex<dataTable.cols.length; colIndex++)
    {
        const htmlRowPropTag = `htmlRow${dataTable.cols[colIndex]}${(editInputFields?'Input':'Div')}`;
        if(editInputFields)
        {
            rowDivs[htmlRowPropTag] = document.createElement('input');
            rowDivs[htmlRowPropTag].id = htmlRowPropTag;
            rowDivs[htmlRowPropTag].value = dataTable.rows[rowIndex][dataTable.cols[colIndex]];
            rowDivs[htmlRowPropTag].placeholder = dataTable.cols[colIndex];
            rowDivs[htmlRowPropTag].className = 'mbaInput selfFlexShrink';
            rowDivs[htmlRowPropTag].style.minWidth = 0;
            rowDivs[htmlRowPropTag].style.flexShrink = 2;
        }
        else
        {
            rowDivs[htmlRowPropTag] = document.createElement('div');
            rowDivs[htmlRowPropTag].id = htmlRowPropTag;
            rowDivs[htmlRowPropTag].textContent = dataTable.rows[rowIndex][dataTable.cols[colIndex]];
            if(!(rowIndex==dataTable.rows.length-1&&colIndex==dataTable.cols.length-1))
                rowDivs[htmlRowPropTag].className = (rowIndex==dataTable.rows.length-1)?('mbaTableCell mbaTableCell-bottom'):((colIndex==dataTable.cols.length-1)?('mbaTableCell mbaTableCell-right'):('mbaTableCell mbaTableCell-nrml'));
            else
                rowDivs[htmlRowPropTag].className = 'mbaTableCell mbaTableCell-botRight';
            rowDivs[htmlRowPropTag].style.verticalAlign = 'middle';
        }
        rowDivs[htmlRowPropTag].id = htmlRowPropTag;
        rowDivs[htmlRowPropTag].style.textAlign = 'center';
        colDivs[colIndex].dataset.colPropName = `${dataTable.label.toLowerCase()}${dataTable.cols[colIndex]}`;
        colDivs[colIndex].dataset.htmlRowPropTag = htmlRowPropTag;
        mainDiv.append(rowDivs[htmlRowPropTag]);
    }

    if(editInputFields)
    {
        const rowConfirmationDiv = document.createElement('div');
        rowConfirmationDiv.className = 'flexRow flexCenter pad5 gap10';
        rowConfirmationDiv.style.gridColumn = `span ${dataTable.cols.length}`;
        const saveButton = document.createElement('button');
        saveButton.id = 'htmlRowSaveButton';
        saveButton.textContent = 'Save';
        saveButton.className = 'mbaButton';
        saveButton.style.width = '100px';
        saveButton.addEventListener('click',()=>{ModifyTableRow();});
        rowConfirmationDiv.append(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.id = 'htmlRowCancelButton';
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'mbaButton';
        cancelButton.style.width = '100px';
        cancelButton.addEventListener('click',()=>{cicConnectorDB.htmlRowContainerDiv.style.display='none';});
        rowConfirmationDiv.append(cancelButton);
        mainDiv.append(rowConfirmationDiv);
    }

    const htmlRow = {mainDiv:mainDiv, labelDiv:labelDiv, colDivs:colDivs, rowDivs:rowDivs};

    if(outputDivContainer!=null)
        outputDivContainer.append(htmlRow.mainDiv);
    return htmlRow;
}