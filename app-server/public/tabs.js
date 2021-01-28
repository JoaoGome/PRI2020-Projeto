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

  document.getElementById("limpar").style.display = "none"

}

function limparGeneros(event){

  event.currentTarget.style.display = "none"

  var rec = document.getElementsByClassName("recurso")
  for (i = 0; i < rec.length; i++)
    rec[i].style.display = "none"

  var x = document.getElementsByClassName("check")
  for (i = 0; i < x.length; i++){
    x[i].value = "unchecked"  
    x[i].removeAttribute("checked")
  }
}


function showVis(pre){

  var selectBox = document.getElementById("visSelect");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;

  var d1 = ""
  var d2 = ""
  if(selectedValue === '1') d2 = "none"
  if(selectedValue === '2') d1 = "none" 

  if(pre==="meu"){
    var p1 = document.getElementsByClassName("meu1")
    var p2 = document.getElementsByClassName("meu2")
  }
  else{
    var p1 = document.getElementsByClassName("1")
    var p2 = document.getElementsByClassName("2")
  }

  for (i = 0; i < p1.length; i++)
    p1[i].style.display = d1
  
  for (i = 0; i < p2.length; i++)
    p2[i].style.display = d2
}