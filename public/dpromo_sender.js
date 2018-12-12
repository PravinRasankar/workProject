$(document).ready(function(){
if ((window.location.ancestorOrigins[0] != undefined && window.location.ancestorOrigins[0].match('localhost')) || (window.location.ancestorOrigins[0] != undefined && window.location.ancestorOrigins[0].match('azurewebsites'))) {
    $('a').each(function(e) {
		console.log('data p2c: ',$(this).attr('data-p2c'));
        if ($(this).attr('data-p2c') != undefined) {
            $(this).attr('refhref', $(this).attr('href'));
            $(this).removeAttr("href");
        }
    });	


    $(document).on("click", function(event) {
		
		var p2cResource = $(event.target).closest('[data-p2c-resource]').attr('data-p2c-resource');
		var p2cData;
		var p2cDataHtml;
		var p2cResourceMetaData;
		
		if(p2cResource != undefined ){
			p2cResourceMetaData = window[p2cResource];
			p2cData = $(event.target).closest('[data-p2c]').attr('data-p2c');
			p2cDataHtml = $(event.target).closest('[data-p2c="'+p2cData+'"]')[0].outerHTML;
			var dataToSend = {
				source: "Iframe",
				event: "clickedElementData",
				data : {
					p2cresource: p2cResource,
					p2cdata: p2cData,
					p2cdatahtml: p2cDataHtml,
					p2cresourcemetadata: p2cResourceMetaData
				}
				
			}
			parent.postMessage(dataToSend, "*");
		}
		
        
    });

    window.addEventListener('message', receiveData);
	
    function receiveData(evt) {
		
		console.log('Recieved Data: ',evt.data)
		if(checkTypeOf(evt.data).match('object')){
			let recData = evt.data;
			if(Object.keys(recData).includes("source")){
			if(recData["source"] == "WA"){
				var fullCustAttr = '[data-p2c-resource="'+recData.data.p2cresource+'"] ' +'[data-p2c="'+recData.data.p2cdata+'"]';
				if(recData["event"] == "changeSingleDOM"){
					if(recData.data.type == "text"){
						$(fullCustAttr).each(function(index,data){
							$(fullCustAttr)[index].outerHTML = recData.data.newDOM;		
						});
					}
					else if(recData.data.type == "richtext"){
						$(fullCustAttr).each(function(index,data){
							
							$(fullCustAttr)[index].outerHTML = recData.data.newDOM;		
						});
					}
					else if(recData.data.type == "button"){
						$(fullCustAttr).each(function(index,data){
							$(fullCustAttr).find("span:first").text($($.parseHTML(recData.data.newDOM)).find("span:first").text());
							$(fullCustAttr).attr("refhref",$($.parseHTML(recData.data.newDOM)).attr("refhref"));
						});
					}
				}
				else if(recData["event"] == "changeNewDOM"){
					console.log('recData Length: ',recData["data"].length)
					if(recData["data"].length != 0){
						
						$.each(recData["data"],function(index,changesObj){
							$.each(Object.keys(changesObj["update"]),function(index,updateObj){
								var changes = changesObj["update"][updateObj]["customobject"];
								var fullCustAttr = '[data-p2c-resource="'+changes.p2cresource+'"] ' +'[data-p2c="'+changes.p2cdata+'"]';
								if(changes.type == "text"){
									$(fullCustAttr).each(function(index,data){
										$(fullCustAttr)[index].outerHTML = changes.newDOM;		
									});
								}
								else if(changes.type == "richtext"){
									$(fullCustAttr).each(function(index,data){
										
										$(fullCustAttr)[index].outerHTML = changes.newDOM;		
									});
								}
								else if(changes.type == "button"){
									$(fullCustAttr).each(function(index,data){
										$(fullCustAttr).find("span:first").text($($.parseHTML(changes.newDOM)).find("span:first").text());
										$(fullCustAttr).attr("refhref",$($.parseHTML(changes.newDOM)).attr("refhref"));
									});
								}
							})
						});
					}
				}
				else if(recData["event"] == "changeOldDOM"){
					
					if(recData["data"].length != 0){
						
						$.each(recData["data"],function(index,changesObj){
							$.each(Object.keys(changesObj["update"]),function(index,updateObj){
								var changes = changesObj["update"][updateObj]["customobject"];
								var fullCustAttr = '[data-p2c-resource="'+changes.p2cresource+'"] ' +'[data-p2c="'+changes.p2cdata+'"]';
								if(changes.type == "text"){
									$(fullCustAttr).each(function(index,data){
										$(fullCustAttr)[index].outerHTML = changes.oldDOM;		
									});
								}
								else if(changes.type == "richtext"){
									$(fullCustAttr).each(function(index,data){
										
										$(fullCustAttr)[index].outerHTML = changes.oldDOM;		
									});
								}
								else if(changes.type == "button"){
									$(fullCustAttr).each(function(index,data){
										$(fullCustAttr).find("span:first").text($($.parseHTML(changes.oldDOM)).find("span:first").text());
										$(fullCustAttr).attr("refhref",$($.parseHTML(changes.oldDOM)).attr("refhref"));
									});
								}
							})
						});
					}
				}
			}
			}
		}
		else if(checkTypeOf(evt.data).match('string')){
			
			if(evt.data.match('getNewCanvas')){
			parent.postMessage({"source":"Iframe",event: "newCanvasData","newCanvasMetadata":window["newContent"]}, "*");
			}
		}
        /* if (evt.data.match('fullcustattr')) {
            let recData = JSON.parse(evt.data);
			
			
        } */
    };
	function checkTypeOf(data){
		return JSON.stringify(typeof data);
	}
}
});