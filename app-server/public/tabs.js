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
    document.getElementById("refUsername").href = `${ref}username`; 
  if(document.getElementById("refData")) 
    document.getElementById("refData").href = `${ref}dataLastAcess`; 
}



function addComentario(){
  var x = document.getElementById("comentar")

  if(x.style.display === "none")
     document.getElementById("comentar").style.display = "block"
  else
    document.getElementById("comentar").style.display = "none"   
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



function changeVis(vg, recs){
  for (var i = 0; i < recs.length; i++){
    //change vis
    if(vg==="put_v"){
      if(recs[i].id === "") recs[i].id = "v"
      if(recs[i].id === "g") recs[i].id = "vg"
    }
    if(vg==="take_v"){
      if(recs[i].id === "v") recs[i].id = ""
      if(recs[i].id === "vg") recs[i].id = "g"
    }
    if(vg==="put_g"){
      if(recs[i].id === "") recs[i].id = "g"
      if(recs[i].id === "v") recs[i].id = "vg"
    }
    if(vg==="take_g"){
      if(recs[i].id === "g") recs[i].id = ""
      if(recs[i].id === "vg") recs[i].id = "v"
    }
    //change display
    if(recs[i].id === "") recs[i].style.display = ""
    else recs[i].style.display = "none"
  }
}


function showGeneros(event, gen){

  var x = document.getElementsByClassName(gen)
  
  if(event.currentTarget.value === "checked"){
    event.currentTarget.value = "unchecked"
    changeVis("put_g", x)
  }
  else{
    event.currentTarget.value = "checked"
    changeVis("take_g", x)
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

  if(pre==="meu"){
    var p1 = document.getElementsByClassName("meu1")
    var p2 = document.getElementsByClassName("meu2")
  }
  else{
    var p1 = document.getElementsByClassName("1")
    var p2 = document.getElementsByClassName("2")
  }

  if(selectedValue === '1'){
    changeVis("take_v", p1)
    changeVis("put_v", p2)
  }
  else if(selectedValue === '2'){
    changeVis("put_v", p1)
    changeVis("take_v", p2)
  }
  else{
    changeVis("take_v", p1)
    changeVis("take_v", p2)
  }
}


function dropVis(){
  var x = document.getElementById("dropVis");
  if (x.className.indexOf("w3-show") == -1) { 
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}