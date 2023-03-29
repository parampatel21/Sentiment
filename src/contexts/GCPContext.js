function invocationGCPbasic(trigger_link) {
    fetch(trigger_link)
    .then(response => response.text())
    .then(data => {
      console.log(data);
      return data;
    });
} // function without parameters

function invocationGCPparameterstest() {
  fetch('https://us-central1-sentiment-379415.cloudfunctions.net/test_function' + '?name=John' + "&name2=Patel") // Hello World function with parameters (look at end of link)
    .then(response => response.text())
    .then(data => {
      console.log(data); // prints "Hello, John!"
    });
} // function with multiple parameters

// TODO:complete GCP guide here
