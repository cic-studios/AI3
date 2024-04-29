function ColStringToHtmlCols(colDataString, outputDivContainer=null, wipButtons=false)
{
    if(!colDataString)
        return null;

    const colDataStringSplit = colDataString.split(',');
    const colData = [];
    for(let colIndex=0; colIndex<colDataStringSplit.length; colIndex++)
    {
        if(colIndex==0 || colIndex==colDataStringSplit.length-1)
        {
            colData.push({colName:colDataStringSplit[colIndex].split(':')[0].trim(), colWip:0});
        }
        else
        {
            const colNameWipSplit = colDataStringSplit[colIndex].split(':');
            colData.push({colName:colNameWipSplit[0].trim(), colWip:(colNameWipSplit.length>1)?parseInt(colNameWipSplit[1].trim()):0});
        }
    }
    const htmlCols = [];
    for(let colIndex=0; colIndex<colData.length; colIndex++)
    {
        const htmlCol = document.createElement('div');
        htmlCol.id = `htmlCol${colIndex}`;
        htmlCol.className = "mbaBox mbaTitle flexCol flexStart crossCenter selfFlexGrow";
        htmlCol.textContent = colData[colIndex].colName;
        htmlCol.style.textAlign = 'center';
        htmlCol.dataset.colIndex = colIndex;
        htmlCol.dataset.colName = colData[colIndex].colName;
        htmlCol.dataset.colWip = colData[colIndex].colWip;

        if(colIndex!=0 && colIndex!=colData.length-1)
        {
            const wipDiv = document.createElement('div');
            wipDiv.id = `wipDiv${colIndex}`;
            wipDiv.className = "wipDiv flexRow flexCenter crossCenter gap10";
            htmlCol.append(wipDiv);
            if(wipButtons)
            {
                const wipMinusButton = document.createElement('button');
                wipMinusButton.id = `wipMinusButton${colIndex}`;
                wipMinusButton.className = "mbaButton";
                wipMinusButton.textContent = "-";
                wipMinusButton.style.textAlign = 'center';
                wipMinusButton.style.verticalAlign = 'middle';
                wipMinusButton.style.lineHeight = '1px';
                wipMinusButton.style.float = 'left';
                wipMinusButton.style.height = '5px';
                wipMinusButton.style.width = '20px';
                wipMinusButton.addEventListener('click',()=>{ColWipButtonClick(colIndex,-1);});
                wipDiv.append(wipMinusButton);
            }
            const wipLabel = document.createElement('div');
            wipLabel.id = `wipLabel${colIndex}`;
            wipLabel.textContent = `wip:${(colData[colIndex].colWip>0)?colData[colIndex].colWip:'∞'}`;
            wipDiv.append(wipLabel);
            if(wipButtons)
            {
                const wipPlusButton = document.createElement('button');
                wipPlusButton.id = `wipPlusButton${colIndex}`;
                wipPlusButton.className = "mbaButton";
                wipPlusButton.textContent = "+";
                wipPlusButton.style.textAlign = 'center';
                wipPlusButton.style.verticalAlign = 'middle';
                wipPlusButton.style.lineHeight = '1px';
                wipPlusButton.style.float = 'left';
                wipPlusButton.style.height = '5px';
                wipPlusButton.style.width = '20px';
                wipPlusButton.addEventListener('click',()=>{ColWipButtonClick(colIndex,1);});
                wipDiv.append(wipPlusButton);
            }
        }
        htmlCols.push(htmlCol);
        if(outputDivContainer!=null)
            outputDivContainer.append(htmlCol);
    }
    return htmlCols;
}

function ColWipButtonClick(colIndex, changeBy)
{
    const colDiv = document.getElementById(`htmlCol${colIndex}`);
    const colWip = Math.max(0, parseInt(colDiv.dataset.colWip)+changeBy);
    document.getElementById(`wipLabel${colIndex}`).textContent = `wip:${(colWip>0)?colWip:'∞'}`;
    colDiv.dataset.colWip = colWip;
}

function UsersDataToHtmlUsers(usersData, outputDivContainer=null)
{
    if(!usersData)
        return null;
    const htmlUsers = [];
    for(let rowIndex=0; rowIndex<usersData.rows.length; rowIndex++)
    {
        const userMainDiv = document.createElement('div');
        userMainDiv.id = `htmlUser${rowIndex}`;
        userMainDiv.className = 'flexRow flexStart crossCenter gap10';
        userMainDiv.style.textAlign = 'center';
        userMainDiv.style.verticalAlign = 'middle';

        const cardID = usersData.rows[rowIndex][usersData.cols[1]];
        const cardNumber = (cardID==-1)?-1:(Math.floor(cardID/4)+1);
        const cardSuit = (cardID==-1)?-1:(cardID%4);
        const cardColor = (cardID%2==0)?'black':'red';
        const cardImage = document.createElement('img');
        const userName = usersData.rows[rowIndex][usersData.cols[0]];
        const userStatus = usersData.rows[rowIndex][usersData.cols[2]];
        userMainDiv.dataset.cardID = cardID;
        userMainDiv.dataset.cardNumber = cardNumber;
        userMainDiv.dataset.cardSuit = cardSuit;
        userMainDiv.dataset.cardColor = cardColor;
        userMainDiv.dataset.userName = userName;
        userMainDiv.dataset.userStatus = userStatus;

        const loginDiv = document.createElement('div');
        loginDiv.id = `htmlUserLogin${rowIndex}`;
        loginDiv.className = 'selfCrossCenter';
        loginDiv.textContent = usersData.rows[rowIndex][usersData.cols[0]];
        loginDiv.style.textAlign = 'start';
        
        const statusDiv = document.createElement('div');
        statusDiv.id = `htmlUserStatus${rowIndex}`;
        statusDiv.className = 'selfCrossCenter';
        statusDiv.textContent = usersData.rows[rowIndex][usersData.cols[2]];
        statusDiv.style.textAlign = 'end';
        statusDiv.style.color = (usersData.rows[rowIndex][usersData.cols[2]]=='Ready')?'#00F800':'red';

        const cardDiv = document.createElement('div');
        cardDiv.id = `htmlUserCard${rowIndex}`;
        cardDiv.className = 'selfCrossCenter';
        cardDiv.style.height = '25px';
        
        cardDiv.append(cardImage);
        cardImage.id = `htmlUserCardImage${rowIndex}`;
        cardImage.style.position = 'relative';
        cardImage.style.top = '0';
        cardImage.style.left = '0';
        cardImage.style.height = '25px';
        cardImage.style.zIndex = '1';
        const cardNumberDiv = document.createElement('div');
        cardDiv.append(cardNumberDiv);
        cardNumberDiv.id = `htmlUserCardNumber${rowIndex}`;
        cardNumberDiv.style.position = 'relative';
        cardNumberDiv.style.top = '-35px';
        cardNumberDiv.style.left = '1px';
        cardNumberDiv.style.height = '10px';
        cardNumberDiv.style.zIndex = '2';
        cardNumberDiv.style.fontSize = '11px';        
        switch(cardSuit)
        {
            case -1:
                cardImage.src = 'CardBack.png'; break;
            case 0:
                cardImage.src = 'CardSpades.png'; break;
            case 1:
                cardImage.src = 'CardDiamonds.png'; break;
            case 2:
                cardImage.src = 'CardClubs.png'; break;
            case 3:
                cardImage.src = 'CardHearts.png'; break;
        }

        cardNumberDiv.style.className = 'debug1';
        cardNumberDiv.style.textAlign = 'left';
        cardNumberDiv.style.color = cardColor;
        
        switch(cardNumber)
        {
            case -1:
                cardNumberDiv.textContent = ''; break;
            case 1:
                cardNumberDiv.textContent = 'A'; break;
            case 11:
                cardNumberDiv.textContent = 'J'; break;
            case 12:
                cardNumberDiv.textContent = 'Q'; break;
            case 13:
                cardNumberDiv.textContent = 'K'; break;
            default:
                cardNumberDiv.textContent = `${cardNumber}`;
        }

        userMainDiv.append(cardDiv);
        userMainDiv.append(loginDiv);
        userMainDiv.append(statusDiv);
        htmlUsers.push(userMainDiv);
        if(outputDivContainer!=null)
            outputDivContainer.append(userMainDiv);
    }
    return htmlUsers;
}



function TaskdataToHtmlCards(taskDataTable, outputDivContainerColumns=null)
{
    if(!taskDataTable)
        return null;

    const htmlTasks = [];
    for(let rowIndex=0; rowIndex<taskDataTable.rows.length; rowIndex++)
    {
        const taskMainDiv = document.createElement('div');
        taskMainDiv.id = `htmlTask${rowIndex}`;
        taskMainDiv.className = 'flexCol flexStart crossStretch mbaBox margin5';
        taskMainDiv.style.textAlign = 'center';
        taskMainDiv.style.verticalAlign = 'middle';
        taskMainDiv.style.minHeight = '125px';
        taskMainDiv.style.width = '200px';

        const ID = taskDataTable.rows[rowIndex].ID;
        const TaskNum = taskDataTable.rows[rowIndex].TaskNum;
        const Name = taskDataTable.rows[rowIndex].Name;
        const Description = taskDataTable.rows[rowIndex].Description;
        const DayStart = taskDataTable.rows[rowIndex].DayStart;
        const DayEnd = taskDataTable.rows[rowIndex].DayEnd;
        const DaysLocked = taskDataTable.rows[rowIndex].DaysLocked;
        const Locked = taskDataTable.rows[rowIndex].Locked;
        const Owner = taskDataTable.rows[rowIndex].Owner;
        const Helpers = taskDataTable.rows[rowIndex].Helpers;
        const Column = taskDataTable.rows[rowIndex].Column;
        const Priority = taskDataTable.rows[rowIndex].Priority;
        const DaysStale = (DayEnd>0)?(DayEnd-DayStart-Column):(cicConnectorDB.dataLiveSession.Day-DayStart-Column);
        const DaysLive = (DayEnd>0)?(DayEnd-DayStart):(cicConnectorDB.dataLiveSession.Day-DayStart);
        taskMainDiv.dataset.ID = ID;
        taskMainDiv.dataset.TaskNum = TaskNum;
        taskMainDiv.dataset.Name = Name;
        taskMainDiv.dataset.Description = Description;
        taskMainDiv.dataset.DayStart = DayStart;
        taskMainDiv.dataset.DayEnd = DayEnd;
        taskMainDiv.dataset.DaysLocked = DaysLocked;
        taskMainDiv.dataset.Locked = Locked;
        taskMainDiv.dataset.Owner = Owner;
        taskMainDiv.dataset.Helpers = Helpers;
        taskMainDiv.dataset.Column = Column;
        taskMainDiv.dataset.Priority = Priority;
        taskMainDiv.dataset.DaysStale = DaysStale;
        taskMainDiv.dataset.DaysLive = DaysLive;

        const taskTitleContainerDiv = document.createElement('div');
        taskTitleContainerDiv.id = `htmlTaskTitleContainer${rowIndex}`;
        taskTitleContainerDiv.className = 'flexRow flexBetween crossCenter selfCrossStretch mbaTableCell-title';
        taskMainDiv.append(taskTitleContainerDiv);
        {
            const taskRegressButton = document.createElement('button');
            taskRegressButton.id = `htmlTaskRegressButton${rowIndex}`;
            taskRegressButton.className = 'mbaIcon selfCrossCenter';
            taskRegressButton.style.backgroundImage = `url('./TriPrev.png')`;
            taskRegressButton.style.height = '16px';
            taskRegressButton.style.width = '16px';
            taskRegressButton.style.backgroundSize = '16px 16px';
            taskRegressButton.style.backgroundColor = 'transparent';
            taskRegressButton.style.border = 'none';
            taskRegressButton.style.margin = '0px 0px 0px 5px';
            taskTitleContainerDiv.append(taskRegressButton);
            const taskTitleDiv = document.createElement('div');
            taskTitleDiv.id = `htmlTaskTitle${rowIndex}`;
            taskTitleDiv.className = 'selfFlexGrow selfCrossStretch';
            taskTitleDiv.style.fontSize = '14px';
            taskTitleDiv.style.textAlign = 'center';
            taskTitleDiv.style.verticalAlign = 'middle';
            taskTitleDiv.textContent = taskDataTable.rows[rowIndex].Name;
            taskTitleContainerDiv.append(taskTitleDiv);
            const taskAdvanceButton = document.createElement('button');
            taskAdvanceButton.id = `htmlTaskAdvanceButton${rowIndex}`;
            taskAdvanceButton.className = 'mbaIcon selfCrossCenter';
            taskAdvanceButton.style.backgroundImage = `url('./TriNext.png')`;
            taskAdvanceButton.style.height = '16px';
            taskAdvanceButton.style.width = '16px';
            taskAdvanceButton.style.backgroundSize = '16px 16px';
            taskAdvanceButton.style.backgroundColor = 'transparent';
            taskAdvanceButton.style.border = 'none';
            taskAdvanceButton.style.margin = '0px 5px 0px 0px';
            taskTitleContainerDiv.append(taskAdvanceButton);
        }

        const taskInfoPanelDiv = document.createElement('div');
        taskInfoPanelDiv.id = `htmlTaskInfoPanel${rowIndex}`;
        taskInfoPanelDiv.className = 'flexRow flexStart crossStretch crossCenter selfCrossStretch';
        taskInfoPanelDiv.style.borderStyle = 'hidden hidden solid hidden';
        taskInfoPanelDiv.style.borderWidth = '0px 0px 1px 0px';
        taskMainDiv.append(taskInfoPanelDiv);
        {
            const taskNumDiv = document.createElement('div');
            taskNumDiv.id = `htmlTaskNum${rowIndex}`;
            taskNumDiv.className = 'selfCrossStretch';
            taskNumDiv.style.fontSize = '20px';
            taskNumDiv.style.textAlign = 'center';
            taskNumDiv.style.verticalAlign = 'middle';
            taskNumDiv.style.fontWeight = 'bold';
            taskNumDiv.style.minHeight = '30px';
            taskNumDiv.style.minWidth = '30px';
            taskNumDiv.style.borderStyle = 'hidden solid hidden hidden';
            taskNumDiv.style.borderWidth = '0px 1px 0px 0px';
            taskNumDiv.textContent = taskDataTable.rows[rowIndex].TaskNum;
            taskInfoPanelDiv.append(taskNumDiv);
            const taskDetailsDiv = document.createElement('div');
            taskDetailsDiv.id = `htmlTaskDetails${rowIndex}`;
            taskDetailsDiv.className = 'flexCol flexEvenly crossStretch selfFlexGrow selfCrossStretch';
            taskInfoPanelDiv.append(taskDetailsDiv);
            {
                const taskOwnerDiv = document.createElement('div');
                taskOwnerDiv.id = `htmlTaskOwner${rowIndex}`;
                taskOwnerDiv.className = 'selfCrossStretch';
                taskOwnerDiv.style.padding = '0px 3px 0px 3px';
                taskOwnerDiv.style.fontSize = '14px';
                taskOwnerDiv.style.textAlign = 'start';
                taskOwnerDiv.style.verticalAlign = 'middle';
                taskOwnerDiv.style.fontWeight = 'bold';
                taskOwnerDiv.style.overflow = 'clip';
                taskOwnerDiv.textContent = `${(taskDataTable.rows[rowIndex].Owner=='')?'Unassigned':taskDataTable.rows[rowIndex].Owner}`;
                taskDetailsDiv.append(taskOwnerDiv);
                const taskPriorityDiv = document.createElement('div');
                taskPriorityDiv.id = `htmlTaskPriority${rowIndex}`;
                taskPriorityDiv.className = 'flexRow flexStart crossCenter selfCrossStretch';
                taskPriorityDiv.style.padding = '0px 3px 0px 3px';
                taskPriorityDiv.style.fontSize = '12px';
                taskPriorityDiv.style.textAlign = 'start';
                taskPriorityDiv.style.verticalAlign = 'middle';
                taskPriorityDiv.style.fontWeight = 'normal';
                taskPriorityDiv.style.gap = '0px 2px';
                taskPriorityDiv.textContent = 'Priority: ';//`Priority: ${taskDataTable.rows[rowIndex].Priority}`;
                taskDetailsDiv.append(taskPriorityDiv);
                {
                    for(let buttonPriority=1; buttonPriority<=5; buttonPriority++)
                    {
                        const taskPriorityButton = document.createElement('button');
                        taskPriorityButton.id = `htmlTaskPriority${buttonPriority}Button${rowIndex}`;
                        taskPriorityButton.className = 'mbaIcon selfCrossCenter';
                        taskPriorityButton.style.backgroundImage = (Priority>=buttonPriority)?`url('./StarFull.png')`:`url('./StarEmpty.png')`;
                        taskPriorityButton.style.height = '10px';
                        taskPriorityButton.style.width = '10px';
                        taskPriorityButton.style.backgroundSize = '12px 10px';
                        taskPriorityButton.style.backgroundColor = 'transparent';
                        taskPriorityButton.style.border = 'none';
                        taskPriorityDiv.append(taskPriorityButton);
                    }
                    const taskLockButton = document.createElement('button');
                    taskLockButton.id = `htmlTaskLockButton${rowIndex}`;
                    taskLockButton.className = 'mbaIcon selfCrossCenter';
                    taskLockButton.style.backgroundImage = (Locked==false||Locked=='false'||Locked=='FALSE')?`url('./LockOpen.png')`:`url('./LockClosed.png')`;
                    taskLockButton.style.height = '16px';
                    taskLockButton.style.width = '16px';
                    taskLockButton.style.backgroundSize = '16px 16px';
                    taskLockButton.style.backgroundColor = 'transparent';
                    taskLockButton.style.border = 'none';
                    taskLockButton.style.margin = '0px 0px 0px 10px';
                    taskPriorityDiv.append(taskLockButton);
                }
            }
        }
        const taskDescriptionDiv = document.createElement('div');
        taskDescriptionDiv.id = `htmlTaskDescription${rowIndex}`;
        taskDescriptionDiv.className = 'selfFlexGrow selfCrossStretch';
        taskDescriptionDiv.style.padding = '0px 3px 0px 3px';
        taskDescriptionDiv.style.fontSize = '12px';
        taskDescriptionDiv.style.textAlign = 'start';
        taskDescriptionDiv.style.verticalAlign = 'middle';
        taskDescriptionDiv.style.fontWeight = 'normal';
        taskDescriptionDiv.style.fontStyle = 'italic';
        taskDescriptionDiv.textContent = taskDataTable.rows[rowIndex].Description;
        taskMainDiv.append(taskDescriptionDiv);

        const taskHelpersDiv = document.createElement('div');
        taskHelpersDiv.id = `htmlTaskHelpers${rowIndex}`;
        taskHelpersDiv.className = 'selfCrossStretch';
        taskHelpersDiv.style.padding = '0px 3px 0px 3px';
        taskHelpersDiv.style.fontSize = '12px';
        taskHelpersDiv.style.textAlign = 'start';
        taskHelpersDiv.style.verticalAlign = 'middle';
        taskHelpersDiv.style.fontWeight = 'normal';
        taskHelpersDiv.style.borderStyle = 'solid hidden hidden hidden';
        taskHelpersDiv.style.borderWidth = '1px 0px 0px 0px';
        taskHelpersDiv.textContent = (Helpers==''||Helpers=='none'||Helpers=='empty')?'':`Colab: ${taskDataTable.rows[rowIndex].Helpers}`;
        taskMainDiv.append(taskHelpersDiv);

        const taskStatusPanelDiv = document.createElement('div');
        taskStatusPanelDiv.id = `htmlTaskStatusPanel${rowIndex}`;
        taskStatusPanelDiv.className = 'flexRow flexEvenly crossStretch crossCenter selfCrossStretch';
        taskStatusPanelDiv.style.borderStyle = 'solid hidden hidden hidden';
        taskStatusPanelDiv.style.borderWidth = '1px 0px 0px 0px';
        taskMainDiv.append(taskStatusPanelDiv);
        {
            const taskDayStartDiv = document.createElement('div');
            taskDayStartDiv.id = `htmlTaskDayStart${rowIndex}`;
            taskDayStartDiv.className = 'selfFlexGrow selfCrossStretch';
            taskDayStartDiv.style.fontSize = '12px';
            taskDayStartDiv.style.textAlign = 'center';
            taskDayStartDiv.style.verticalAlign = 'middle';
            taskDayStartDiv.style.fontWeight = 'normal';
            taskDayStartDiv.style.borderStyle = 'hidden solid hidden hidden';
            taskDayStartDiv.style.borderWidth = '0px 1px 0px 0px';
            taskDayStartDiv.textContent = `Start: ${DayStart}`;
            taskStatusPanelDiv.append(taskDayStartDiv);
            const taskDaysLockedDiv = document.createElement('div');
            taskDaysLockedDiv.id = `htmlTaskDaysLocked${rowIndex}`;
            taskDaysLockedDiv.className = 'selfFlexGrow selfCrossStretch';
            taskDaysLockedDiv.style.fontSize = '12px';
            taskDaysLockedDiv.style.textAlign = 'center';
            taskDaysLockedDiv.style.verticalAlign = 'middle';
            taskDaysLockedDiv.style.fontWeight = 'normal';
            taskDaysLockedDiv.style.borderStyle = 'hidden solid hidden hidden';
            taskDaysLockedDiv.style.borderWidth = '0px 1px 0px 0px';
            taskDaysLockedDiv.textContent = `Lock: ${DaysLocked}`;
            taskStatusPanelDiv.append(taskDaysLockedDiv);
            const taskDaysStaleDiv = document.createElement('div');
            taskDaysStaleDiv.id = `htmlTaskDaysStale${rowIndex}`;
            taskDaysStaleDiv.className = 'selfFlexGrow selfCrossStretch';
            taskDaysStaleDiv.style.fontSize = '12px';
            taskDaysStaleDiv.style.textAlign = 'center';
            taskDaysStaleDiv.style.verticalAlign = 'middle';
            taskDaysStaleDiv.style.fontWeight = 'normal';
            taskDaysStaleDiv.style.borderStyle = 'hidden solid hidden hidden';
            taskDaysStaleDiv.style.borderWidth = '0px 1px 0px 0px';
            taskDaysStaleDiv.textContent = `Stale: ${DaysStale}`;
            taskStatusPanelDiv.append(taskDaysStaleDiv);
            const taskDaysLiveDiv = document.createElement('div');
            taskDaysLiveDiv.id = `htmlTaskDaysLive${rowIndex}`;
            taskDaysLiveDiv.className = 'selfFlexGrow selfCrossStretch';
            taskDaysLiveDiv.style.fontSize = '12px';
            taskDaysLiveDiv.style.textAlign = 'center';
            taskDaysLiveDiv.style.verticalAlign = 'middle';
            taskDaysLiveDiv.style.fontWeight = 'normal';
            taskDaysLiveDiv.textContent = `Live: ${DaysLive}`;
            taskStatusPanelDiv.append(taskDaysLiveDiv);
        }
        htmlTasks.push(taskMainDiv);
        if(outputDivContainerColumns!=null && outputDivContainerColumns.length>0)
            outputDivContainerColumns[Math.min(outputDivContainerColumns.length-1, taskDataTable.rows[rowIndex].Column)].append(taskMainDiv);
    }
    return htmlTasks;
}