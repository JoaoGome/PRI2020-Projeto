// Image display on client browserS

function openDiv(evt, id, bt) {
  var i;

  var x = document.getElementsByClassName("lista");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("w3-theme-d3", "w3-theme-d4");
  }

  if (bt === "sim"){    // significa que estamos na main page que tem mais coisas

    if(id === "users")
      document.getElementById("filtros").style.display = "none"
    else
        document.getElementById("filtros").style.display = "block"

    var botao = document.getElementsByClassName("botao");
    botao[0].style.display="none"

    var b_id = "botao_" + id
    if(document.getElementById(b_id))
      document.getElementById(b_id).style.display = "block";
  }
  
  document.getElementById(id).style.display = "block";
  evt.currentTarget.className = evt.currentTarget.className.replace("w3-theme-d4", "w3-theme-d3");
}

function openUsers(evt, id, ref) {
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

  if(document.getElementById("refUsername")) 
    document.getElemenId("refUsername").href = `${ref}username`; 
  if(document.getElementById("refData")) 
    document.getElementById("refData").href = `${ref}dataLastAcess`; tBy
}



function addComentario(){
  var x = document.getElementById("comentar")

  if(x.style.display === "none")
     document.getElementById("comentar").style.display = "block"
  else
    document.getElementById("comentar").style.display = "none"   
}


function addConfirmacao(id, ref){ 
  document.getElementById(id).style.display='block'
  document.getElementById("ref").href = ref; 
}

/*function addConfirmacao(id, s, ref){ 
  document.getElementById(id).style.display='block'
  if(s==="recurso"){
    document.getElementById("questao_recurso").style.display = 'block'
    document.getElementById("questao_user").style.display = 'none'
  }
  else{
    document.getElementById("questao_recurso").style.display = 'none'
    document.getElementById("questao_user").style.display = 'block'
  }
  document.getElementById("ref").href = ref; 
}*/


function limparGeneros(event){

  event.currentTarget.style.display = "none"

  var x = document.getElementsByClassName("check")
  for (i = 0; i < x.length; i++){
    x[i].value = "unchecked"  
    x[i].removeAttribute("checked")
  }
}


function dropVis(ind,i){
  var x = document.getElementById(`dropVis${ind}${i}`);
  if (x.className.indexOf("w3-show") == -1) { 
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

function showSort2(val){
  var x = document.getElementsByClassName('sort2')
  if (val != "titulo"){
    for (var i = 0; i < x.length; i++)
      x[i].style.display='inline'
  }
  else{
    for (var i = 0; i < x.length; i++)
      x[i].style.display='none'
}}
