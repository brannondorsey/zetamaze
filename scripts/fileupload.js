/* This script requires the following variables to be pre-defined:
	fileInputVals
	allowedExtensions
	errors
	fileUploadSelector
	FileUploadNotificationsSelector
	fileUploadSuccess
	maxFileSize

	The following variables are optional:
	errorsFromGet
 */

$(document).ready(function(){

	$(fileUploadSelector).each(function(){
		$(this).change(function(){
			fileInputVals[$(this).attr('name')] = $(this).val();
		});
	});

	notifyIfUploadFailed();
});

function validateFiles(){


	var i = 1;
	$(fileUploadSelector).each(function(){
		var filePath = $(this).val();
		
		if(filePath != ''){

			//if there are more than one file input tags in this form
			if($(fileUploadSelector).length > 1){

				if(!allowedFileType(filePath)){
					errors.push('Item ' + i + ' is not an allowed file type');
				}else if($(this).get(0).files[0].size > maxFileSize){
					errors.push('Item ' + i + ' is too large');
				}

			}else{ //if there is only one file input tag in this form

				if(!allowedFileType(filePath)){
					errors.push('File type not allowed');
				}else if($(this).get(0).files[0].size > maxFileSize){
					errors.push('File is too large');
				}
			}
		}
		i++;
	});
	
	if(errors.length > 0){
		var errorString = (errors.length == 1) ? errors[0] : errors.join("<br/>");
		$(fileUploadNotificationSelector).html(errorString);
		$(fileUploadNotificationSelector).addClass('error-text');
		errors = [];
		return false;
	}else return true;
}

//bool
function allowedFileType(filePath){
	var periodIndex = filePath.lastIndexOf('.');
	var ext = filePath.substring(periodIndex + 1);
	var inArray = false;
	for(var i = 0; i < allowedExtensions.length; i++){
		if(ext == allowedExtensions[i]){
			inArray = true;
			break;
		}
	}
	return inArray;
}

function notifyIfUploadFailed(){

	if(typeof errorsFromGet !== 'undefined'){
		console.log(errorsFromGet);
		var errorMessage = (errorsFromGet[0] == 'No files selected') ? errorsFromGet[0] : errorsFromGet.join("<br/>") + "<br/>" + "If you uploaded other files they were uploaded successfully";
		$(fileUploadNotificationSelector).html(errorMessage);
		$(fileUploadNotificationSelector).addClass('error-text');
	}
}

function onFilesSubmit(){

	$(fileUploadNotificationSelector).removeClass();
	$(fileUploadNotificationSelector).addClass('file-upload-notification');	
	return validateFiles();
}