// Image display on client browserS

function openDiv(evt, id) {
    var i;
    var x = document.getElementsByClassName("lista");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("w3-theme-d3", "w3-theme-d4");
    }
    document.getElementById(id).style.display = "block"; 
    evt.currentTarget.className = evt.currentTarget.className.replace("w3-theme-d4", "w3-theme-d3");
}


function openUsers(evt, id) {
  var i;
  var x = document.getElementsByClassName("users");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  tablinks = document.getElementsByClassName("2tab");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("w3-theme-d2", "w3-theme-d3");
  }
  document.getElementById(id).style.display = "block"; 
  evt.currentTarget.className = evt.currentTarget.className.replace("w3-theme-d3", "w3-theme-d2");
}