function myFunction() {
  
  
}

/** onFormSubmit(e)
 *  event handler for form submission action
 *  
 */
function onFormSubmit(e){            
  // process the event here
  Logger.log(e.range);
  Logger.log(e.values);
  Logger.log(e.namedValues);
  Logger.log(e.range.getRow());
  
}