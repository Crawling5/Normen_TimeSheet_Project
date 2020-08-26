function ImporData() {
  //Recupero los archivos de carga de horas de cada consultor desde la carpeta de CARGA HORAS
  var TS_Folder = DriveApp.getFolderById("1ZTj5Ypzfeev41ULTpaC___HSUN5V2WeZ");
  var TS_FileI = TS_Folder.getFiles();
  
  //Tabla de control Cabecera Gestion
  var cabecera = SpreadsheetApp.openById("1OzK7MoScgRZJKyJSl5i75oa72J6Q3DLSXCpLGSM_5no").getSheetByName("Cabecera").getRange("A7:S").getValues();
  
  var file;
  var fileType;
  var ssID;
  var combinedData = [];
  var data;
  var fileName;
 
  while(TS_FileI.hasNext()){
    file = TS_FileI.next();
    fileType = file.getMimeType();
    fileName = file.getName();
    if(fileType === "application/vnd.google-apps.spreadsheet" && fileName === "TimeSheet"){
      ssID = file.getId();
      data = getDataFromSpreadsheet(ssID);
      data = data.map(function(r){ return [""].concat(fileName,r)});
      data = data.map(function(r){ dateVal = new Date(r[2] * 86400000 - 2209132800000);return [Utilities.formatDate(dateVal, Session.getScriptTimeZone(), "ddd")].concat(Utilities.formatDate(dateVal, Session.getScriptTimeZone(), "MM"),Utilities.formatDate(dateVal, Session.getScriptTimeZone(), "YYYY"),Utilities.formatDate(dateVal, Session.getScriptTimeZone(), "DD"),r) }); 
      combinedData = combinedData.concat(data);
    }//if file type is spreadsheet and name exlusion
  }//End While
  
  for(var i in combinedData)
  {
    for(var j in cabecera)
    {
      //Cliente && Proyecto/Perfil && Ticket
      if( combinedData[i][8] == cabecera[j][1] && combinedData[i][9] == cabecera[j][4] && combinedData[i][10] == cabecera[j][2] )
      {
        //Paquete/Contrato
        combinedData[i][4] = cabecera[j][0];
        break;
      }
    }
  } 
  
  var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Detalle");
  ws.getRange("A8:S").clearContent();
  ws.getRange(8, 1, combinedData.length, combinedData[0].length).setValues(combinedData);

  
}


function getDataFromSpreadsheet(ssID){
  var ss = SpreadsheetApp.openById(ssID);
  var ws = ss.getSheetByName("TimeSheet");
//  var data = ws.getRange("A11:K" + ws.getLastRow()).getValues();
  var data = ws.getRange("A11:K12").getValues();
  return data;
}
