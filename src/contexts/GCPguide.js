function invocationGCPparameterstest() {
  fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=writeNewUser' + '&uid=2siUWRsFveVTtfqSS7HL4LFUA6n1' + '&name=Param Patel') // Hello World function with parameters (look at end of link)
    .then(response => response.text())
    .then(data => {
      console.log(data); // prints "Hello, John!"
    });
} // function with multiple parameters

// add parameters to trigger link as shown above
// check DBwriter.py to see what each argument does
// in order to manipulate the output, take data variable and do whatever you desire with it
// REMINDER: UPDATE THE CODE ON GOOGLE CLOUD FUNCTIONS EVERY SINGLE TIME YOU PUSH A NEW FEATURE ONTO GITHUB
// THE GOOGLE CLOUD FUNCTION YOU ARE UPDATING IS CALLED: firebase_operational