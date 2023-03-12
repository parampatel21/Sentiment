function invocationGCP(trigger_link) {
    fetch(trigger_link)
    .then(response => response.text())
    .then(data => {
      console.log(data);
      return data;
    });
}