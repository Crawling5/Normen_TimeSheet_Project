function ImportData(){
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //importo planilla cabecera Ticket
  
  //0-Borrado🗑	1-Paquete/Contrato✏️	2-🔑Cliente	3-🔑Ticket	4-Descripción	5-🔑Proyecto/Perfil	6-🔑Consultor	7-Usuario Final	8-Horas Estimadas Consultor	9-Estimación Cliente✏️	10-Fecha Inicio	11-Fecha Fin	12-HH Reales➕	13-% Avance	14-HH Avance	15-% Avance Cliente✏️	16-HH Avance Cliente➕	17-Estado	18-Responsable	19-Comentario
  var cabS = SpreadsheetApp.openById("1OzK7MoScgRZJKyJSl5i75oa72J6Q3DLSXCpLGSM_5no").getSheetByName("Cabecera");
  var cabCont = cabS.getRange("A7:Q"+cabS.getLastRow()).getValues();
  Logger.log(cabCont);
  //Armo array clave de cabecera
  var cabKey = [];
  var cabTMP = []; 
  for(y in cabCont){
    var rowTMP = new Array(8); 
    //Solo CMPC y que no esté borrado
    if( cabCont[y][0] == false && cabCont[y][2] == 'CMPC' && cabCont[y][1].length > 1 && cabCont[y][3].length > 1 && cabCont[y][5].length > 1){
      var _idx = cabKey.indexOf(cabCont[y][1]+cabCont[y][3]+cabCont[y][5]);//1-Paquete/Contrato✏️	3-🔑Ticket  5-🔑Proyecto/Perfil
      //Si existe se sumarizan las cantidades
      if(_idx >= 0){
        //🔑🔑🔑Key 1-Paquete/Contrato✏️	2-🔑Ticket	3-🔑Proyecto/Perfil	4-Descripción	5-Usuario Final	6-sum HH Avance Cliente➕	7-sum Estimación Cliente✏️
        cabTMP[_idx][6]+=cabCont[y][16];
        cabTMP[_idx][7]+=cabCont[y][9];
      } else {
        //Sino se agrega a la clave
        cabKey.push(cabCont[y][1]+cabCont[y][3]+cabCont[y][5]);
        rowTMP[0] = cabCont[y][1]+cabCont[y][3]+cabCont[y][5];//🔑🔑🔑Key 
        rowTMP[1] = cabCont[y][1];//1-Paquete/Contrato✏️	
        rowTMP[2] = cabCont[y][3];//2-🔑Ticket	
        rowTMP[3] = cabCont[y][5];//3-🔑Proyecto/Perfil	
        rowTMP[4] = cabCont[y][4];//4-Descripción	
        rowTMP[5] = cabCont[y][7];//5-Usuario Final	
        rowTMP[6] = cabCont[y][16];//6-sum HH Avance Cliente➕	
        rowTMP[7] = cabCont[y][9];//7-sum Estimación Cliente✏️
        cabTMP = cabTMP.concat([rowTMP]);
      }//add or update if
    }//if valid record
  }//end for CabCont

  Logger.log("ultimo registro "+cabS.getLastRow()); 
  Logger.log(cabTMP);
  cabCont = cabTMP;
  cabTMP = [];

  Logger.log(cabCont);
  Logger.log(cabKey);
  
  ArrayLib.sort(cabCont, 0, true);
  cabKey.sort();
  
/*
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //importo tickets archivados
  //0-Paquete/Contrato	1-Ticket	2-Perfil	3-Descripcion	4-Usuario Final	5-HH Reales (% de Avance sobre Estimacion)	6-Estimacion Cliente (HH)	7-Facturar/NoFacturar	8-Comentarios	9-Observaciones	10-HH a Facturar	11-Directo / Distribuido 12-Fue Borrado 13-ARCHIVAR
  var archKey = [];
  var archS = SpreadsheetApp.openById("1FvkpU_EWOlRqDfpBPdcrMD0G6vlFqOQzmBRDOXLbUKI").getSheetByName("Cerrados");
  if( archS.getLastRow() > 2){
    var archCont = archS.getRange("A2:C"+archS.getLastRow()).getValues();
    //Agrego clave compuesta y ordeno
    //🔑🔑🔑Key 1-Paquete/Contrato	2-Ticket	3-Perfil
    archCont = archCont.map(function(r) { return [r[0]+r[1]+r[2]].concat(r) });
    ArrayLib.sort(archCont, 0, true);
    //Armo array clave de cabecera
    for (i in archCont){
      archKey.push(archCont[i][0]);
    }  
  } else { var archCont = [[]]; }
  
  
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
  //importo planilla gestion
  //0-Paquete/Contrato	1-Ticket	2-Perfil	3-Descripcion	4-Usuario Final	5-HH Reales (% de Avance sobre Estimacion)	6-Estimacion Cliente (HH)	7-Facturar/NoFacturar	8-Comentarios	9-Observaciones	10-HH a Facturar	11-Directo / Distribuido 12-Fue Borrado 13-ARCHIVAR
  var aprobS = SpreadsheetApp.openById("1FvkpU_EWOlRqDfpBPdcrMD0G6vlFqOQzmBRDOXLbUKI").getSheetByName("Abiertos");
  var aprobCont = aprobS.getRange("A8:N"+aprobS.getLastRow()).getValues();
  

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
 //Comparo con data cargada
  var aprobTMP = [];
  //for ( var i = 0; i < 10; i++ ){
  for ( var i in aprobCont ){
    var _index, _indexArch = -1;
    var aprobKey = aprobCont[i][0]+aprobCont[i][1]+aprobCont[i][2];//0-Paquete/Contrato	1-Ticket	2-Perfil
    _index = cabKey.indexOf(aprobKey);
    
    if ( aprobCont[i][0].length > 0 || aprobCont[i][1].length > 0 || aprobCont[i][2].length > 0 ){
       
      if ( _index >= 0){
        // si existe el registro se actualiza la informacion
        aprobCont[i][0] = cabCont[_index][1];//0-Paquete/Contrato	
        aprobCont[i][1] = cabCont[_index][2]//1-Ticket	
        aprobCont[i][2] = cabCont[_index][3]//2-Perfil	
        aprobCont[i][3] = cabCont[_index][4]//3-Descripcion	
        aprobCont[i][4] = cabCont[_index][5]//4-Usuario Final	
        aprobCont[i][5] = cabCont[_index][6]//5-HH Reales (% de Avance sobre Estimacion)	
        aprobCont[i][6] = cabCont[_index][7]//6-Estimacion Cliente (HH)	
        aprobCont[i][12] = false;//12-Fue Borrado
        
        //Quitar registro ya leido
        for( j in cabCont[_index]){
          cabCont[_index][j] = "";
        }
        
        // si un registro en la tabla no existe en la cabecera se marca como borrado
      }else{
        aprobCont[i][12] = true;//Borrado
      }//Cierre de IF si existe indice
    
      aprobTMP = aprobTMP.concat([aprobCont[i]]);
      
    }
  }//Fin de reorrido de CabCont
  
  aprobCont = aprobTMP;
  aprobTMP = [];
  
    // si no existe se agrega
  for( z in cabCont){
    if ((cabCont[z][1] != "") && (cabCont[z][2] != "") && (cabCont[z][3] != "")){
      var _indexArch = -1;
      
      //Se agrega solo si ya no está en la planilla de archivados
      _indexArch = archKey.indexOf(cabCont[z][0]);
      if ( _indexArch < 0){
        var combinedRow = new Array(13);
        combinedRow[0] = cabCont[z][1];//0-Paquete/Contrato	
        combinedRow[1] = cabCont[z][2]//1-Ticket	
        combinedRow[2] = cabCont[z][3]//2-Perfil	
        combinedRow[3] = cabCont[z][4]//3-Descripcion	
        combinedRow[4] = cabCont[z][5]//4-Usuario Final	
        combinedRow[5] = cabCont[z][6]//5-HH Reales (% de Avance sobre Estimacion)	
        combinedRow[6] = cabCont[z][7]//6-Estimacion Cliente (HH)	
        combinedRow[12] = false;//12-Fue Borrado
        aprobCont = aprobCont.concat([combinedRow]);
      }
    }
  }*/
/*
  aprobS.getRange("A8:N"+aprobS.getLastRow()).clearContent();
  ////cabS.getRange("A7:T"+cabCont.length).setValues(cabCont);
  aprobS.getRange(8, 1, aprobCont.length, aprobCont[0].length).setValues(aprobCont);
  */
}


function Archivar(){
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
  //importo planilla gestion
  //0-Paquete/Contrato	1-Ticket	2-Perfil	3-Descripcion	4-Usuario Final	5-HH Reales (% de Avance sobre Estimacion)	6-Estimacion Cliente (HH)	7-Facturar/NoFacturar	8-Comentarios	9-Observaciones	10-HH a Facturar	11-Directo / Distribuido 12-Fue Borrado 13-ARCHIVAR
  var aprobS = SpreadsheetApp.openById("1FvkpU_EWOlRqDfpBPdcrMD0G6vlFqOQzmBRDOXLbUKI").getSheetByName("Abiertos");
  var aprobCont = aprobS.getRange("A8:N"+aprobS.getLastRow()).getValues();
  
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //importo tickets archivados
  //0-Paquete/Contrato	1-Ticket	2-Perfil	3-Descripcion	4-Usuario Final	5-HH Reales (% de Avance sobre Estimacion)	6-Estimacion Cliente (HH)	7-Facturar/NoFacturar	8-Comentarios	9-Observaciones	10-HH a Facturar	11-Directo / Distribuido 12-Fue Borrado 13-ARCHIVAR
  var archKey = [];
  var archS = SpreadsheetApp.openById("1FvkpU_EWOlRqDfpBPdcrMD0G6vlFqOQzmBRDOXLbUKI").getSheetByName("Cerrados");
  
  var archTMP = aprobCont.filter(function(r){ return r[13] == true;  });
  if(archTMP.length > 0){
    archS.getRange(archS.getLastRow(),1, archTMP.length, archTMP[0].length).setValues(archTMP);
  }
  
  
}