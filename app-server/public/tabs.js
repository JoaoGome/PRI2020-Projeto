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

  if (bt === "sim"){
    var botao = document.getElementsByClassName("botao");
    botao[0].style.display="none"

    var b_id = "botao_" + id
    if(document.getElementById(b_id))
      document.getElementById(b_id).style.display = "block";
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



function addComentario(){
  document.getElementById("comentar").style.display = "block"; 
}


function addConfirmacao(s, ref){ 
  document.getElementById("confirmar").style.display='block'
  if(s==="recurso"){
    document.getElementById("questao_recurso").style.display = 'block'
    document.getElementById("questao_user").style.display = 'none'
  }
  else{
    document.getElementById("questao_recurso").style.display = 'none'
    document.getElementById("questao_user").style.display = 'block'
  }
  document.getElementById("ref").href = ref; 
}

function showGeneros(event, gen){

  var x = document.getElementsByClassName(gen)
  
  if(event.currentTarget.value === "checked"){
    event.currentTarget.value = "unchecked"
    for (i = 0; i < x.length; i++)
      x[i].style.display = "none"
  }
  else{
    event.currentTarget.value = "checked"
    for (i = 0; i < x.length; i++)
      x[i].style.display = ""
  }
}

function limparGeneros(){

  var rec = document.getElementsByClassName("recurso")
  for (i = 0; i < rec.length; i++)
    rec[i].style.display = "none"

  var x = document.getElementsByClassName("check")
  for (i = 0; i < x.length; i++){
    x[i].value = "unchecked"  
    x[i].removeAttribute("checked")
  }
}