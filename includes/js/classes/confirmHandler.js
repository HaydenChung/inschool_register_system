var confirmBox = function(message,header,callback){
    $('<div></div>').appendTo('body')
    .html('<div><h6>'+message+'?</h6></div>')
    .dialog({
        modal: true, title: header, zIndex: 10000, autoOpen: true,
        width: 'auto', resizable: false,
        buttons: {
            Yes: function(ev){
                callback(ev);
                $(this).dialog("close");
            },
            No: function(){
                $(this).dialog("close");
            }
        },
        close: function(){
            $(this).remove();
        }
    });
}

/******************************************************
 * Hide the original button and insert a confirm btn which ask the user to click again.
 * 
 * @param       string          message     Text for the confirm button
 * @param       callback        callback    Function to invoke once the confrim was clicked
 * @param       DOMNode|string  altTarget   Element to be replace, default to be the event target's element,pass-in undefined if default
 * @param       event           ev          The event.
 * @return      function                    Return a function that reset the DOM elements to their original when invoked.
 * 
 *****************************************************/


var replaceConfirmBtn = function(message,callback,altTarget,ev){
    
    var orgElm = typeof altTarget == 'undefined' ? ev.target :typeof altTarget == 'string' ? document.querySelector(altTarget) : altTarget ;
    var orgElmDisplay = orgElm.style.display;
    var parent = orgElm.parentNode;
    var confirmBtn = document.createElement('button');
    
    confirmBtn.type = 'button btn .btn-warning';
    confirmBtn.innerText = message;
    confirmBtn.className = 'confirmBtn';
    confirmBtn.addEventListener(
        'click',
        function(ev){
            callback();
            parent.removeChild(confirmBtn);
            orgElm.style.display = orgElmDisplay;
        }
    );

    copyComputedStyle(orgElm, confirmBtn);

    confirmBtn.style.color = '#fff';
    confirmBtn.style.webkitTextFillColor = '#fff';
    confirmBtn.style.backgroundColor = '#f0ad4e';
    confirmBtn.style.webkitTransform = 'scale(1.1)';
    confirmBtn.style.msTransform = 'scale(1.1)';
    confirmBtn.style.transform = 'scale(1.1)';

    parent.insertBefore(confirmBtn, orgElm);
    confirmBtn.focus();
    orgElm.style.display = 'none';

    var reset = function(forceClose) {
        if(typeof forceClose === 'undefined') forceClose = true;

        if(parent == confirmBtn.parentNode) parent.removeChild(confirmBtn);
        orgElm.style.display = orgElmDisplay;

        if(forceClose === false) callback(); 
    }.bind(this);

    //Reset button when not focus
    // confirmBtn.addEventListener('blur', reset.bind(this, null));
    // confirmBtn.addEventListener('focusout', reset.bind(this, null));
    

    return reset;

}
    

var confirmBtn = function(message, altTarget, ev){

    if(prevent == true) ev.preventDefault();
    var elm = typeof altTarget == 'undefined' ? ev.target : typeof altTarget == 'string' ? document.querySelector(altTarget) : altTarget ;
    var orgText = elm.innerText;
    elm.setAttribute('data-confirm',true);
    elm.innerText = message;

}

var copyComputedStyle = function(from,to){
    var computed_style_object = false;
    //trying to figure out which style object we need to use depense on the browser support
    //so we try until we have one
    computed_style_object = from.currentStyle || document.defaultView.getComputedStyle(from,null);

    //if the browser dose not support both methods we will return null
    if(!computed_style_object) return null;

    var stylePropertyValid = function(name,value){
                //checking that the value is not a undefined
        return typeof value !== 'undefined' &&
                //checking that the value is not a object
                typeof value !== 'object' &&
                //checking that the value is not a function
                typeof value !== 'function' &&
                //checking that we dosent have empty string
                value.length > 0 &&
                //checking that the property is not int index ( happens on some browser
                value != parseInt(value)

    };

    //we iterating the computed style object and compy the style props and the values 
    for(property in computed_style_object)
    {
        //checking if the property and value we get are valid sinse browser have different implementations
        if(stylePropertyValid(property,computed_style_object[property]))
        {
            //applying the style property to the target element
            to.style[property] = computed_style_object[property];

        }
    }   
};