function myFunction() {
  
  var ActRange = SpreadsheetApp.getActiveRange();
  var ActRow = ActRange.getRow();
  var UserSS = SpreadsheetApp.openById("1mX9qLP0B87J4HKu5LX2ouYbK-pP1rLXqxCs4_ZOpdzo");
  var UserSheet = UserSS.getSheetByName("Principal");
  var Alias = UserSheet.getRange(ActRow, 5, 1, 1);
  var Email = UserSheet.getRange(ActRow, 6, 1, 1).getValue();
  var SplitEmail = Email.split("@");
 /* Alias.setValue(SplitEmail[0].toUpperCase());
  Alias.getSheet().getSheetName()
  Alias.getCell(1,1).setValue(value)
  Alias.getValues();
  Alias.getSheet().getRange(1, 1)*/
  var FormUrl = UserSheet.getFormUrl();
  //FormApp.openByUrl(FormUrl).getItemById(id)
  var items = FormApp.openByUrl(FormUrl).getItems();
  var itemsMails = items.filter(function (item){ return item.getTitle() === "Email"; 
                                               });
  var validEmail = FormApp.createTextValidation()
  .setHelpText("Input was not a number between 1 and 100.")
  .requireTextContainsPattern("(?:^|(?<=\s))(?!sponge\.bob@example\.com|jim\.bob@example\.com|billy\.bob@example\.com)(\w[\w\.]*@\w+\.[\w\.]+)\b")
  .build();
  var item = FormApp.openByUrl(FormUrl).getItemById("1289116847");
  item.asTextItem().setValidation(validEmail);
  items.forEach(function (item){
    
  });
  
}

/* Event handler for form submission action */
function onFormSubmit(e){            
  //Crea su aliasID
  createAlias(e.range,e.values[5],e.range.getCell(1,5));
  updateEmailValidation(e.range,e.values[5]);
}

/* Event handler for edition action */
function onSheetEdit(e){            
  if(e.range.getColumn() == 6 && e.range.getRow() > 1){
    //Crea su aliasID
    createAlias(e.range,e.value,e.range.getSheet().getRange(e.range.getRow(), 5));
    updateEmailValidation(e.range,e.value);
  }
}

/* Crea el alias correspondiente al campo de email */
function createAlias(range,email,alias){
  if (range.getSheet().getSheetName() == "Principal"){
    var SplitEmail = email.split("@");
    alias.setValue(SplitEmail[0].toUpperCase());
  }
}

/* Actualiza validación de mails en formulario de carga */
function updateEmailValidation(range,email){
  var mySheet = range.getSheet();
  //Valida que sea la hoja "Principal"
  if (mySheet.getSheetName() == "Principal"){
    
    //Construye expresion regular y objeto
    var validEmail = FormApp.createTextValidation()
    .setHelpText("Email ya existe o es incorrecto")
    .requireTextContainsPattern(createEmailValidation(mySheet,email))
    .build();
    
    //recupera los items del formulario que se llamen email    
    var itemsMails = FormApp.openByUrl(mySheet.getFormUrl()).getItems().filter(function (item){ 
      return item.getTitle().toUpperCase() === "EMAIL";
    });
    
    //Actualiza finalmente el formulario
    itemsMails.forEach(function (item){
      item.asTextItem().setValidation(validEmail);
    });
    
  }
}

/* Creación de expresion regular para validacion de emails */
function createEmailValidation(sheet,email){
  //Regla para validar que sea un correo el ingresado
  var validation = ("(?:^|(?<=\\s))(?!dummy)(\\w[\\w\\.]*@\\w+\\.[\\w\\.]+)\\b").toString();
  //Listado de mails de columna de sheet
  var Emails = sheet.getRange(2,6,sheet.getLastRow(),1).getValues();
  Emails.push(email);
  //Agrega cada mail ya cargado en la regla para no volver a cargarlo
  for( i in Emails ) {
    if (Emails[i].toString().length > 3){
      var replaceEmail = Emails[i].toString().replace(".","\\.");
      replaceEmail = replaceEmail.toString()+('|dummy').toString();
      validation = validation.replace('dummy',replaceEmail.toString()).toString();
    }
  }
  return validation;
}

function myTest(){
  var UserSS = SpreadsheetApp.openById("1mX9qLP0B87J4HKu5LX2ouYbK-pP1rLXqxCs4_ZOpdzo");
  var UserSheet = UserSS.getSheetByName("Principal");
  var rangeEmails = UserSheet.getRange(2,6,UserSheet.getLastRow(),1);
  Logger.log("Begin");
  updateEmailValidation(rangeEmails,"mono@gmail.com");
  
}