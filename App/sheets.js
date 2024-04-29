const mainHeaderDiv = document.getElementById("mainHeaderDiv");
const mainContentDiv = document.getElementById("mainContentDiv");
const mainFooterDiv = document.getElementById("mainFooterDiv");


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