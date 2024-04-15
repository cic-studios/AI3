const mainHeaderDiv = document.getElementById("mainHeaderDiv");
const mainContentDiv = document.getElementById("mainContentDiv");
const mainFooterDiv = document.getElementById("mainFooterDiv");

const responseDiv = document.getElementById("responseDiv");
const cicConnectorDB = 
{
    //gAppScriptID: 'AKfycbwKPzf3HX7kOX9EbJk5Y97s3k3bJhsTIc0QQfFJvYs';
    gAppScriptID: 'AKfycbxcOROfMX11e6vB1TROVA_s5xUNN3yZrKcOBqIyiC49ZRmAK7y7SMepKLyXwhK_f3z4',
    gSpreadSheetID: '1yt7Qu5YWYyAb3RI7PoBXjnGdVZu3smUK_fz0KYr73nE',
    isFirstLoad: true,

    htmlTableContainerDiv: document.getElementById("htmlTableContainerDiv"),
    dataTable: null,
    htmlTable: null,
    htmlRowContainerDiv: document.getElementById("htmlRowContainerDiv"),
    dataRow: null,
    htmlRow:null,

    liveSessionLoginID: '',
    liveUpdateStamps: {SessionStamp:'', UsersStamp:'', TasksStamp:'', ActionsStamp:''},
    
    dataLiveSession: {Day:0},
    hmtlLiveSessionColumnsContainerDiv: document.getElementById("htmlLiveSessionColumnsContainerDiv"),
    dataLiveSessionColumns: null,
    htmlLiveSessionColumns: null,
    htmlLiveSessionUsersContainerDiv: document.getElementById("htmlLliveSessionUsersContainerDiv"),
    dataLiveSessionUsers: null,
    htmlLiveSessionUsers: null,
    dataLiveSessionTasks: null,
    htmlLiveSessionTasks: null,
}

//120FPS is SIMULATING at 125 FPS         (+0.008/every8ms)
//90FPS  is SIMULATING at 90.909090rp FPS (+0.011/every11ms)
//60FPS  is SIMULATING at 62.5 FPS        (+0.016/every16ms)
//30FPS  is SIMULATING at 30.303030rp FPS (+0.033/every33ms)
//24FPS  is SIMULATING at 24.39024rep FPS (+0.041/every41ms)
//10FPS  is SIMULATING at 10 FPS          (+0.1/every100ms)
const targetFPS = 30, startTime = Object.freeze(new Date());
function MillisecondsSinceStart(){ return ((new Date().getTime()) - startTime.getTime()); } //getTime() method of Date instances returns the number of milliseconds for this date since the epoch, which is defined as the midnight at the beginning of January 1, 1970, UTC.
setInterval(()=>{const currTime=MillisecondsSinceStart(); cicFPSevents.frameDuration=currTime-cicFPSevents.timerFPS; cicFPSevents.deltaTime=cicFPSevents.frameDuration/1000; cicFPSevents.timerFPS=currTime; UpdateFPSevents();}, Math.floor(1000/targetFPS));
const cicFPSeventType = Object.freeze({perTick:0, repeatInterval:1, delayOnce:2, exactTime:3});
const cicFPSevents = { timerFPS:0, frameDuration:0, deltaTime:0, updateFPSevents:[] };

function SubscribeFPSevent(func, time, type=cicFPSeventType.perTick)
{
    cicFPSevents.updateFPSevents.push({func:func, time:((type==cicFPSeventType.perTick)?(MillisecondsSinceStart()):(time*1000)), type:type, nextTime:((type==cicFPSeventType.perTick)?(MillisecondsSinceStart()):((type==cicFPSevents.timedOnce)?(time*1000):(cicFPSevents.timerFPS+time*1000)))});
}

function UnsubscribeFPSevent(func)
{
    const index = cicFPSevents.updateFPSevents.findIndex(obj => obj.fn === func);
    if (index !== -1) cicFPSevents.updateFPSevents.splice(index, 1);
}

function UpdateFPSevents()
{
    let i=0;
    while(i<cicFPSevents.updateFPSevents.length)
    {
        if(cicFPSevents.timerFPS>=cicFPSevents.updateFPSevents[i].nextTime)
        {
            cicFPSevents.updateFPSevents[i].func();
            if(cicFPSevents.updateFPSevents[i].type==cicFPSeventType.repeatInterval)
                cicFPSevents.updateFPSevents[i].nextTime += cicFPSevents.updateFPSevents[i].time;

            if(cicFPSevents.updateFPSevents[i].type==cicFPSeventType.delayOnce || cicFPSevents.updateFPSevents[i].type==cicFPSeventType.exactTime)
                cicFPSevents.updateFPSevents.splice(i, 1);
            else
                i++;
        }
        else
        {
            i++;
        }
    }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

GetHashID();
SubscribeFPSevent(GetHashID, 5, cicFPSeventType.repeatInterval);
function GetHashID() 
{
    if(window.location.hash)
    {
        const currAppScriptID = cicConnectorDB.gAppScriptID;
        cicConnectorDB.gAppScriptID = window.location.hash.substring(1);
        if(currAppScriptID != cicConnectorDB.gAppScriptID || cicConnectorDB.isFirstLoad)
        {
            console.log(`gAppScriptID: ${cicConnectorDB.gAppScriptID}`);
            console.log(`gSpreadSheetID: ${cicConnectorDB.gSpreadSheetID}`);
            cicConnectorDB.isFirstLoad = false;
            GoogleAppsScriptGet(cicConnectorDB.gAppScriptID, 'GetSpreadsheetURL', '', cicClientRPC_RecieveSheetID);
        }
    }
    else if(cicConnectorDB.isFirstLoad)
    {
        console.log(`gAppScriptID: ${cicConnectorDB.gAppScriptID}`);
        console.log(`gSpreadSheetID: ${cicConnectorDB.gSpreadSheetID}`);
        cicConnectorDB.isFirstLoad = false;
        GoogleAppsScriptGet(cicConnectorDB.gAppScriptID, 'GetSpreadsheetURL', '', cicClientRPC_RecieveSheetID);
    }
}
function cicClientRPC_RecieveSheetID(resultData)
{
    console.log(resultData);
    if(resultData.status == "Ok")
        cicConnectorDB.gSpreadSheetID = resultData.response.data;
    ShowResponse(resultData.response.msg, 5);
}

SubscribeFPSevent(UpdateResponseDiv, 0, cicFPSeventType.perTick);
let responseDivTimeout=0, isShowingResponseDiv=false;
function UpdateResponseDiv()
{
    if(isShowingResponseDiv && cicFPSevents.timerFPS>responseDivTimeout)
    {
        isShowingResponseDiv = false;
        responseDiv.innerHTML = '';
        responseDiv.style.visibility = "hidden";
    }
}
function ShowResponse(msg, duration=5, color="white")
{
    responseDiv.innerHTML = msg;
    responseDiv.style.color = color;
    responseDiv.style.visibility = "visible";
    responseDivTimeout = cicFPSevents.timerFPS+duration*1000;
    isShowingResponseDiv = true;
}

function WashAndTrim(str, arrRemove=['"', ',', ';', ':', '|'], removeNewLine=false, removeTabs=false) 
{
  for (let removeStr of arrRemove)
    str = str.split(removeStr).join(' ');
  if (removeTabs)
    str = str.replace(/\t/g, '');
  if (removeNewLine)
    str = str.replace(/[\r\n]/g, '');
  str = str.trim();
  return str;
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//automancer mathgician
//querySQL = 'Select * where A contains "at" or A contains "as"';
//querySQL = 'Select A,C,D WHERE D > 150';
//querySQL = 'Select * WHERE B ="CatinCube"';
//querySQL = 'Select * WHERE A contains "Jo"';
//querySQL = 'Select * WHERE A contains "Jo"';
//querySQL = 'Select * WHERE C > date "2021-12-31"'; //Date of Birth
//querySQL = 'Select * WHERE C = date "1983-09-27"'; //Date of Birth
//querySQL = 'Select * WHERE H > date "2024-01-15"'; //Timestamp
//querySQL = 'Select * WHERE G = "yes" And A = "CodeCat"';
//querySQL = 'Select A,B WHERE E = "male"';
//GoogleSheetQuery(sheetID, sheetName, querySQL);



function CreateNewSessionGet()
{
    const sessionPassword = document.getElementById("sessionPasswordInput").value;
    if(sessionPassword != document.getElementById("sessionConfirmationInput").value)
        return;
    const dateTimeInput = document.getElementById("sessionDateTimeInput");
    let dataString = AppendDataStringVar("", "sessionName", document.getElementById("sessionNameInput").value.trim());
    dataString = AppendDataStringVar(dataString, "sessionColumns", document.getElementById("sessionColumnsInput").value.trim());
    dataString = AppendDataStringVar(dataString, "sessionDateTime", (dateTimeInput.value==""?(new Date()).toISOString():(new Date(dateTimeInput.value)).toISOString()).trim());
    dataString = AppendDataStringVar(dataString, "sessionPassword", sessionPassword.trim());
    GoogleAppsScriptGet(cicConnectorDB.gAppScriptID, 'CreateNewSession', dataString, cicClientRPC_DefaultRecieveAppsScriptResponse);
}

function CreateNewSessionPost()
{
    const sessionPassword = document.getElementById("sessionPasswordInput").value;
    if(sessionPassword != document.getElementById("sessionConfirmationInput").value)
        return;
    const formData = new FormData();
    const dateTimeInput = document.getElementById("sessionDateTimeInput");
    formData.append('sessionName', document.getElementById("sessionNameInput").value.trim());
    formData.append('sessionPassword', sessionPassword.trim());
    formData.append("sessionDateTime", (dateTimeInput.value==""?(new Date()).toISOString():(new Date(dateTimeInput.value)).toISOString()).trim());
    formData.append('sessionColumns', document.getElementById("sessionColumnsInput").value.trim());
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'CreateNewSession', formData, cicClientRPC_DefaultRecieveAppsScriptResponse);
}

function CreateNewUserPost()
{
    const userPassword = document.getElementById('userPasswordInput').value;
    if(userPassword != document.getElementById('userConfirmationInput').value)
        return;
    const formData = new FormData();
    formData.append('userLogin', document.getElementById('userLoginInput').value);
    formData.append('userPassword', userPassword);
    formData.append('userName', document.getElementById('userNameInput').value);
    formData.append('userEmail', document.getElementById('userEmailInput').value);
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'CreateNewUser', formData, cicClientRPC_DefaultRecieveAppsScriptResponse);
}

function CreateNewTaskPost()
{
    const formData = new FormData();
    formData.append('taskName', document.getElementById('taskNameInput').value);
    formData.append('taskDescription', document.getElementById('taskDescriptionInput').value);
    formData.append('taskSessionName', document.getElementById('taskSessionNameInput').value);
    formData.append('taskSessionPassword', document.getElementById('taskSessionPasswordInput').value);
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'CreateNewTask', formData, cicClientRPC_DefaultRecieveAppsScriptResponse);
}

function CreateAutoTasksPost()
{
    const formData = new FormData();
    formData.append('autotaskTemplate', document.getElementById('autotaskTemplateInput').value);
    formData.append('autotaskQuantity', document.getElementById('autotaskQuantityInput').value);
    formData.append('autotaskSessionName', document.getElementById('autotaskSessionNameInput').value);
    formData.append('autotaskSessionPassword', document.getElementById('autotaskSessionPasswordInput').value);
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'CreateAutoTasks', formData, cicClientRPC_DefaultRecieveAppsScriptResponse);
}



function FetchTable(tabButton)
{
    GoogleSheetQueryTableSQL(cicConnectorDB.gSpreadSheetID, tabButton.dataset.tableName, 'Select *', cicClientRPC_RecieveTable);
}
function FetchTableFallback(resultData)
{
    //ToDo : REDO WITH NEW SYSTEM STANDARDS
    const formData = new FormData();
    formData.append('sheetName', resultData.request.sheetName);
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'FetchTable', formData, cicClientRPC_RecieveTable);
}
function cicClientRPC_RecieveTable(resultData)
{
    console.log(resultData);
    if(cicConnectorDB.htmlTable && cicConnectorDB.htmlTable.mainDiv)
        cicConnectorDB.htmlTableContainerDiv.removeChild(cicConnectorDB.htmlTable.mainDiv);
    cicConnectorDB.dataTable = resultData.response.data;
    cicConnectorDB.htmlTable = TableDataToHtmlTable(resultData.response.data, cicConnectorDB.htmlTableContainerDiv, true);
    ShowResponse(resultData.response.msg, 5);
}


function EditTableRow(tableButton)
{
    const rowIndex = tableButton.dataset.rowIndex;
    const colIndex = tableButton.dataset.colIndex;
    ShowResponse(`Editing Table ${cicConnectorDB.dataTable.label} - Cell(${rowIndex},${colIndex}):[${cicConnectorDB.dataTable.rows[rowIndex][cicConnectorDB.dataTable.cols[colIndex]]}]`,5);
    cicConnectorDB.rowData = DataRowFromDataTable(cicConnectorDB.dataTable, rowIndex);
    if(cicConnectorDB.htmlRow && cicConnectorDB.htmlRow.mainDiv)
        cicConnectorDB.htmlRowContainerDiv.removeChild(cicConnectorDB.htmlRow.mainDiv);
    cicConnectorDB.htmlRow = RowDataToHtmlRow(cicConnectorDB.dataTable, rowIndex, cicConnectorDB.htmlRowContainerDiv, true);
    cicConnectorDB.htmlRowContainerDiv.style.display='flex';
}
function ModifyTableRow()
{
    const formData = new FormData();
    formData.append('sheetName', cicConnectorDB.htmlRow.labelDiv.dataset.sheetLabel);
    let colPropNames = "";
    for(colIndex=0; colIndex<cicConnectorDB.htmlRow.colDivs.length; colIndex++)
    {
        const colPropName = cicConnectorDB.htmlRow.colDivs[colIndex].dataset.colPropName;
        const htmlRowPropTag = cicConnectorDB.htmlRow.colDivs[colIndex].dataset.htmlRowPropTag;
        formData.append(colPropName, cicConnectorDB.htmlRow.rowDivs[htmlRowPropTag].value);
        colPropNames += `${colPropName}${(colIndex<(cicConnectorDB.htmlRow.colDivs.length-1)?';|;':'')}`;
    }
    formData.append('colPropNames', colPropNames);
    
    ShowResponse(`Modify Table:${cicConnectorDB.htmlRow.labelDiv.dataset.sheetLabel} - RowID:${cicConnectorDB.htmlRow.rowDivs[cicConnectorDB.htmlRow.colDivs[0].dataset.htmlRowPropTag].value}`,5);
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'ModifyTableRow', formData, cicClientRPC_DefaultRecieveAppsScriptResponse);
    cicConnectorDB.htmlRowContainerDiv.style.display='none';
}


function GetLiveSessionLoginIDPost()
{
    ShowResponse('Get live session login ID', 5, 'white');
    const formData = new FormData();
    formData.append('liveSessionName', document.getElementById('liveSessionNameInput').value);
    formData.append('liveSessionPassword', document.getElementById('liveSessionPasswordInput').value);
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'GetLiveSessionLoginID', formData, cicClientRPC_RecieveLiveSessionLoginID);
}
function cicClientRPC_RecieveLiveSessionLoginID(resultData)
{
    console.log(resultData);
    ShowResponse(resultData.response.msg, 5, 'white');
    if(resultData.status != 'Ok')
        return;
    cicConnectorDB.liveSessionLoginID = resultData.response.data;
    console.log('123 Recieved LiveSessionID: ', resultData.response.data);
    /*cicConnectorDB.liveUpdateStamps.SessionStamp='';
    cicConnectorDB.liveUpdateStamps.UsersStamp='';
    cicConnectorDB.liveUpdateStamps.TasksStamp='';
    cicConnectorDB.liveUpdateStamps.ActionsStamp='';
    RefreshLiveSession();*/
}

function SessionAdvanceDayPost()
{
    const formData = new FormData();
    formData.append('sessionID', cicConnectorDB.liveSessionLoginID);
    console.log('123 Sending LiveSessionID: ', cicConnectorDB.liveSessionLoginID);
    GoogleAppsScriptPost(cicConnectorDB.gAppScriptID, 'SessionAdvanceDay', formData, cicClientRPC_DefaultRecieveAppsScriptResponse);
}

function RefreshLiveSession()
{
    if(!cicConnectorDB.liveSessionLoginID)
        return;

    const querySQL = `Select C,D,E,F WHERE A = "${cicConnectorDB.liveSessionLoginID}"`;
    GoogleSheetQueryTableSQL(cicConnectorDB.gSpreadSheetID, 'Sessions', querySQL, cicClientRPC_RecieveLiveSessionUpdates)    
}
function cicClientRPC_RecieveLiveSessionUpdates(resultData)
{
    if(resultData.status != 'ok')
        return;
    if(resultData.response.data.rows[0].SessionStamp != cicConnectorDB.liveUpdateStamps.SessionStamp)
    {
        RefreshLiveSessionSQL();
        cicConnectorDB.liveUpdateStamps.SessionStamp = resultData.response.data.rows[0].SessionStamp;
    }
    if(resultData.response.data.rows[0].UsersStamp != cicConnectorDB.liveUpdateStamps.UsersStamp)
    {
        RefreshLiveSessionUsersSQL();
        cicConnectorDB.liveUpdateStamps.UsersStamp = resultData.response.data.rows[0].UsersStamp;
    }
    if(resultData.response.data.rows[0].TasksStamp != cicConnectorDB.liveUpdateStamps.TasksStamp)
    {
        RefreshLiveTasksSQL();
        cicConnectorDB.liveUpdateStamps.TasksStamp = resultData.response.data.rows[0].TasksStamp;
    }
    if(resultData.response.data.rows[0].ActionsStamp != cicConnectorDB.liveUpdateStamps.ActionsStamp)
    {
        RefreshLiveActionsSQL();
        cicConnectorDB.liveUpdateStamps.ActionsStamp = resultData.response.data.rows[0].ActionsStamp;
    }
}

function RefreshLiveSessionSQL()
{
    const querySQL = `Select B,E,F,G WHERE A = "${cicConnectorDB.liveSessionLoginID}"`;
    GoogleSheetQueryTableSQL(cicConnectorDB.gSpreadSheetID, 'Sessions', querySQL, responseCallback)
}
function RefreshLiveUsersSQL()
{
    const whereSQL = '';
    for(i=0; i<cicConnectorDB.dataLiveSessionUsers.length; i++)
        whereSQL += `B = "${cicConnectorDB.dataLiveSessionUsers[i]}"${(i<cicConnectorDB.dataLiveSessionUsers.length-1)?' OR ':''}`;
    const querySQL = `Select D,F,G WHERE "${whereSQL}" ORDER BY F,G`;
    GoogleSheetQueryTableSQL(cicConnectorDB.gSpreadSheetID, 'Users', querySQL, responseCallback)
}
function RefreshLiveTasksSQL()
{
    const querySQL = `Select A,D,E,F,G,H,I,J,K,L,M,N WHERE B = "${cicConnectorDB.liveSessionLoginID}"`;
    GoogleSheetQueryTableSQL(cicConnectorDB.gSpreadSheetID, 'Tasks', querySQL, responseCallback)
}
function RefreshLiveActionsSQL()
{
    const querySQL = `Select C,D,E,F,G WHERE A = "${cicConnectorDB.liveSessionLoginID}"`;
    GoogleSheetQueryTableSQL(cicConnectorDB.gSpreadSheetID, 'Actions', querySQL, responseCallback)
}


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


function cicClientRPC_DefaultRecieveAppsScriptResponse(resultData)
{
    console.log(resultData);
    ShowResponse(resultData.response.msg, 5);
}



function GoogleAppsScriptGet(appsScriptID, rpcID, dataString, responseCallback)
{
    const url = `https://script.google.com/macros/s/${appsScriptID}/exec?rpcID=${rpcID}${dataString}`;
    fetch(url,{method:'Get'})
    .then(response => response.json())
    .then(responseJson => 
    {
        responseJson.url = url;
        responseCallback(responseJson);
    })
    .catch(error => 
    {
        error.status = 'Failed Get';
        error.url = url;
        error.method = 'Get';
        console.log(error);
    });
}
function AppendDataStringVar(dataString, varName, varValue)
{
    return `${dataString}&${varName}=${varValue}`;
}


function GoogleAppsScriptPost(appsScriptID, rpcID, formData, responseCallback)
{
    const url = `https://script.google.com/macros/s/${appsScriptID}/exec`;
    formData.append("rpcID",rpcID);
    fetch(url,
    {
        method:'Post',
        body:formData,
        //mode: 'no-cors'
    })
    .then(response => response.json())
    .then(responseJson => 
    {
        responseJson.url = url;
        responseCallback(responseJson);
    })
    .catch(error => 
    {
        error.status = 'Failed Post';
        error.url = url;
        error.method = 'Post';
        error.rpcID = rpcID;
        error.formData = [...formData.entries()];
        console.log(error);
    });
}

function GoogleSheetQueryTableSQL(spreadsheetID, sheetName, querySQL, responseCallback)
{
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?&sheet=${sheetName}&tq=${encodeURIComponent(querySQL)}`;
    fetch(url)
    .then(response => response.text())
    .then(responseText => 
    {
        const cutString = responseText.split('setResponse(');
        const sheetJsonObjs = JSON.parse(cutString[1].slice(0,-2));
        const jsTable = JsonSheetObjectsToJsTableObject(sheetJsonObjs, sheetName);
        responseCallback({status: 'Ok', response:{msg:'Query successful!', data:jsTable}, request:{url:url, spreadSheetID:spreadsheetID, sheetName:sheetName, querySQL:querySQL, responseCallback:responseCallback}});
    })
    .catch(error => 
    {
        error.status = 'Failed Query';
        error.url = url;
        error.sheetTableName = sheetName;
        error.querySQL = querySQL;
        console.log(error);
    });
}

function JsonSheetObjectsToJsTableObject(sheetJsonObjs, sheetName)
{
    const dataTable = {};
    const cols = [];
    const rows = [];
    let rowIndex,colIndex;

    if(sheetJsonObjs.table.parsedNumHeaders!=0)
    {
        for(colIndex=0; colIndex<sheetJsonObjs.table.cols.length; colIndex++)
        {
            if(sheetJsonObjs.table.cols[colIndex].label)
                cols.push(sheetJsonObjs.table.cols[colIndex].label);//.toLowerCase().replace(/\s/g,'');
        }
    }
    for(rowIndex=0; rowIndex<sheetJsonObjs.table.rows.length; rowIndex++)
    {
        if(sheetJsonObjs.table.parsedNumHeaders==0 && rowIndex==0)
        {
            for(colIndex=0; colIndex<sheetJsonObjs.table.rows[0].c.length; colIndex++)
            {
                if(sheetJsonObjs.table.rows[0].c[colIndex].v)
                    cols.push(sheetJsonObjs.table.rows[0].c[colIndex].v);//.toLowerCase().replace(/\s/g,'');   
            }
        }
        else
        {
            const newRow = {};
            for(colIndex=0; colIndex<cols.length; colIndex++)
            {
                newRow[cols[colIndex]] = (sheetJsonObjs.table.rows[rowIndex].c[colIndex]!=null)?sheetJsonObjs.table.rows[rowIndex].c[colIndex].v:'';
            }
            rows.push(newRow);
        }
    }
    dataTable.label = sheetName;
    dataTable.cols = cols;
    dataTable.rows = rows;
    return dataTable;
}

function DataRowFromDataTable(dataTable, rowIndex)
{
    if(!dataTable || dataTable.rows.length<=rowIndex)
        return null;
    const dataRow = {};
    const colHeaders = [];
    const rowContent = {};
    for(let colIndex=0; colIndex<dataTable.cols.length; colIndex++)
    {
        colHeaders.push(dataTable.cols[colIndex]);
        rowContent[dataTable.cols[colIndex]] = dataTable.rows[rowIndex][dataTable.cols[colIndex]];
    }
    dataRow.label = dataTable.label;
    dataRow.cols = colHeaders;
    dataRow.row = rowContent;
    return dataRow;
}

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




TestLiveSessionUpdates();
function TestLiveSessionUpdates()
{
    const colsDataString = "Kitten,Cat:0,Puppy:2,Dog";
    const htmlColumns = ColStringToHtmlCols(colsDataString, document.getElementById('liveSessionColumnsContainerDiv'), true);

    const usersDataTable = 
    {
        label:'Users', 
        cols: ['Login','Card','Status'],
        rows:
        [
            {Login:'User1',Card:0,Status:'Locking'},
            {Login:'User2',Card:51,Status:'Starting'},
            {Login:'User3',Card:2,Status:'Ready'},
            {Login:'User4',Card:10,Status:'Progressing'},
            {Login:'User5',Card:39,Status:'Ready'},
            {Login:'User6',Card:40,Status:'Ready'},
            {Login:'User7',Card:-1,Status:'Ready'},
            {Login:'User8',Card:15,Status:'Ready'},
            {Login:'User9',Card:25,Status:'Ready'},
            {Login:'User10',Card:35,Status:'Ready'},
            {Login:'User11',Card:45,Status:'Ready'},
            {Login:'User12',Card:-1,Status:'Ready'},
            {Login:'User13',Card:-1,Status:'Ready'}
        ]
    };
    const htmlUsers = UsersDataToHtmlUsers(usersDataTable, document.getElementById('liveSessionUsersContainerDiv'));

    const tasksDataTable = 
    {
        label: 'Tasks',
        cols: ['ID', 'TaskNum', 'Name', 'Description', 'DayStart', 'DayEnd', 'DaysLocked', 'Locked', 'Owner', 'Helpers', 'Column', 'Priority'],
        rows: 
        [
            {ID:'001', TaskNum:1, Name:'Title001', Description:'Task001Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:false, Owner:'', Helpers:'', Column:0, Priority:0},
            {ID:'002', TaskNum:2, Name:'Title002', Description:'Task002Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:true, Owner:'', Helpers:'User13', Column:0, Priority:1},
            {ID:'003', TaskNum:3, Name:'Title003', Description:'Task003Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:false, Owner:'', Helpers:'', Column:0, Priority:2},
            {ID:'004', TaskNum:4, Name:'Title004', Description:'Task004Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:true, Owner:'', Helpers:'User13', Column:0, Priority:3},
            {ID:'005', TaskNum:5, Name:'Title005', Description:'Task005Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:false, Owner:'', Helpers:'', Column:0, Priority:4},
            {ID:'006', TaskNum:6, Name:'Title006', Description:'Task006Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:true, Owner:'', Helpers:'User13', Column:0, Priority:5},
            {ID:'007', TaskNum:7, Name:'Title007', Description:'Task007Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:false, Owner:'', Helpers:'', Column:1, Priority:0},
            {ID:'008', TaskNum:8, Name:'Title008', Description:'Task008Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:true, Owner:'', Helpers:'User13', Column:2, Priority:1},
            {ID:'009', TaskNum:9, Name:'Title009', Description:'Task009Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:false, Owner:'', Helpers:'', Column:2, Priority:2},
            {ID:'010', TaskNum:10, Name:'Title010', Description:'Task010Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:true, Owner:'', Helpers:'User13', Column:3, Priority:3},
            {ID:'011', TaskNum:11, Name:'Title011', Description:'Task011Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:false, Owner:'', Helpers:'', Column:3, Priority:4},
            {ID:'012', TaskNum:12, Name:'Title012', Description:'Task012Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:true, Owner:'', Helpers:'User13', Column:3, Priority:5},
            {ID:'013', TaskNum:13, Name:'Title013', Description:'Task013Description', DayStart:1, DayEnd:-1, DaysLocked:0, Locked:false, Owner:'', Helpers:'', Column:4, Priority:0}
        ]
    };
    const htmlTasks = TaskdataToHtmlCards(tasksDataTable, htmlColumns);
}