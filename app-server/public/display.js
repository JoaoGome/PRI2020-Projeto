function show (type){

	var img = $(`<img src="./public/fileStore/tmp.${type}" />`)

	$("#preview").empty()
	$("#preview").append(img)
	$("#preview").modal()

}