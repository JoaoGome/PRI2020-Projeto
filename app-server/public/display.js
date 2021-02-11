function show (type){

	var img = $('<img src="/fileStore/tmp.' + type + '" width="80%"/>')

	$("#preview").empty()
	$("#preview").append(img)
	$("#preview").modal()
}