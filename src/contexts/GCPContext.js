function invocationGCPbasic(trigger_link) {
    fetch(trigger_link)
    .then(response => response.text())
    .then(data => {
      console.log(data);
      return data;
    });
} // function without parameters

function invocationGCPparameters() {
  fetch('https://[REGION]-[PROJECT_ID].cloudfunctions.net/[FUNCTION_NAME]?name=John') // Hello World function with parameters (look at end of link)
    .then(response => response.text())
    .then(data => {
      console.log(data); // prints "Hello, John!"
    });
}
