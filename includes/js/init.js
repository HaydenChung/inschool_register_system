

//A global config variable,please use window.config to access it
window.config = {
    httpRoot: window.location.protocol+'//'+window.location.hostname,
    notCheckException: ['teacherLogin.php'],
    exceptionPopUp: null
};

window.GLOBAL = {
    exceptionPopUp: null,
}



function ajaxCall(action,urlParams,formData,doneCall,failCall,path){

    var fetchPath = '/ajaxFetch.php';
    if(typeof urlParams == 'undefined') urlParams = null;
    if(typeof formData == 'undefined') formData = null;
    if(typeof doneCall == 'undefined') doneCall = null;
    if(typeof failCall == 'undefined') failCall = null;
    if(typeof path != 'undefined') fetchPath = path;

    var url = window.config.httpRoot+fetchPath+"?action="+action;

    if(urlParams != null){
        Object.keys(urlParams).forEach(function(key){
            url += '&'+key+'='+urlParams[key];
        });
    }

    var option = {
        url: url,
        processData: false,
        contentType: false,
        dataType: 'json',
        type: 'GET',
        data: null,
        success: function(response){
            if(doneCall!=null) return doneCall(response);
            return response;
        },
        error: function(response,message,error){
            if(failCall!=null) return failCall(response,message,error);
            return response;
        }
    };

    if(formData != null){
        option.data = formData;
        option.type = 'POST';
    }

    return $.ajax(option);
}

function logoutTimer(inputTime){
	setTimeout(function(){
        drupalLogout();
	},inputTime);
}

function drupalLogout(){
	window.location.href = window.config.httpRoot+'/logout.php';
}

function getUrlParam(){
    var result = [];
    location.search.substr(1).split('&').forEach(function(param) {
        if(param == '') return;
        var temp = param.split('=');
        result[temp[0]] = temp[1];
    });

    return result;
}

function setUrlParam(inputObj){
    var result = '';
    var conj = '?';
    Object.keys(inputObj).forEach(function(key){
        result += conj+key+'='+inputObj[key];
        conj = '&';
    });
    return result;
}



function getCookie(name){
    name = name+'=';
    var cookie = decodeURIComponent(document.cookie)+';';
    var startPoint = cookie.indexOf(name);
    if(startPoint == -1) return false;
    startPoint = startPoint + name.length;
    var value = cookie.substring(startPoint);
    return value.substring(0, value.indexOf(';'));
}

function setCookie(name, value, expiryTime, path) {
    var d = new Date();
    d.setTime(d.getTime() + expiryTime);
    var expires = "expires="+ d.toUTCString();
    path = typeof path == 'undefined' ? '/' : path;
    document.cookie = name + "=" + value + ";" + expires + ";path="+path;

}

function reminder(input){

    var container = document.querySelector('#site_reminder_container');

    if(container == null){
        container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = 0;
        container.style.top = 0;
        container.id = 'site_reminder_container';
        document.querySelector('body').appendChild(container);
    }

    var block = document.createElement('div');
    block.style.borderRadius = '5px 0 0 5px';
    block.style.padding = "5px 5px";
    block.style.marginBottom = '2px';
    block.style.backgroundColor = "#d9edf7";
    block.className = 'site_reminder';
    var inner = document.createElement('div');

    if(typeof input == 'string'){
        inner.innerHTML = input;
    }else{
        inner.appendChild(input);
    }

    block.appendChild(inner);
    return container.appendChild(block);

}

function closeReminder(index){
    var allReminders = document.querySelectorAll('.site_reminder');
    return allReminders[index].parentNode.removeChild(allReminders[index]);
}

function notCurrYear(){

    var schoolYear = getCookie('school_year');

    if(!!schoolYear){

        var message = document.createElement('span');
        message.innerText = 'System is current using data from '+schoolYear+' school year.';

        var link = document.createElement('a');
        var params = getUrlParam();
        params.school_year = 'reset';
        link.href = setUrlParam(params);
        link.innerText = 'Click here to return to current year.';

        var container = document.createElement('div');
        container.appendChild(message);
        container.appendChild(link);

        reminder(container);
        return true;
    }
    return false;
}

//This function has been obsolete on 12-1-2018

// function checkException(){
//     var exceptionIds = null;

//     clearInterval(window.config.exceptionTimer);

//     var liveLocal = new LiveLocal(
//         'responseibleException',
//         function(){
//             return ajaxCall('fetch_responsible_exception_alert').done;
//         },
//         function(response){
//             if(response.length !== 0){
//                 if(window.config.exceptionPopUp == null){
//                     window.config.exceptionPopUp = new ExceptionPopUp(response);
//                 }else{
//                     window.config.exceptionPopUp.getInstance(response);
//                 }
//             }else if(response.length === 0 && window.config.exceptionPopUp !== null){
//                 window.config.exceptionPopUp.closePopUp(true);
//             }
//         },
//         60
//     )

//     window.config.exceptionTimer = liveLocal.run(10000);
// }

function displayTime(integer) {
	return ('0'+integer).slice(-2);
}

notCurrYear();

//This function has been obsolete on 12-1-2018

// if(window.config.notCheckException.indexOf(location.pathname.substring(1)) == -1){
//     checkException();
// }

//A quick fix for Date object as some browser(like safari) didn't implement parsing of iso8601 format. e.g 2017-12-20
function newDate(input) {
    return new Date(input.replace(/-/g, "/"));
}

/**
 * A sorting function to resort html elements by attribute or innerText, handly on sorting string
 * 
 * @param   input   string/HTMLNodeCollection   Elements to sort
 * @param   sortBy  string                      [Optional] Attribute to sort with, default to be elememnt's innerText
 * @param   order   boolean                     [Optional] Ascending ordering if true, vice versa if false, default to be true.
 * @return  settle  function                    Return a function to invoke the sorting again, pass-in true to toggle the ordering
 */

function ElementSort(input, sortBy, order) {
    input = typeof input == 'string' ? document.querySelectorAll(input) : input;
    order = typeof order == 'undefined' ? true : order ;

    this.sortBy = sortBy;
    //Slice try to turn NodeCollection into an array
    this.inputArr = Array.prototype.slice.call(input);
    this._operator = order === false ? -1 : 1;
    this._switch = 1;


    this._word = function(a, b) {
        return (this._operator*(this._sortBy(a, this.sortBy).localeCompare(this._sortBy(b, this.sortBy))))*this._switch;
    }.bind(this);

    this._numeric = function(a, b) {
        return (this._operator*(this._sortBy(a, this.sortBy) - this._sortBy(b, this.sortBy)))*this._switch;
    }.bind(this);

    this._getAttribute = function(item, attrName) {
        return item.getAttribute(attrName);
    }

    this._getText = function(item) {
        return item.innerText;
    }

    this.setSortBy = function(attrName) {
        this.sortBy = attrName;
        this._sortBy = typeof attrName == 'undefined' ? this._getText : this._getAttribute;
    }.bind(this);

    this.setSortBy(this.sortBy);
    this._method = isFinite(this._sortBy(this.inputArr[0], this.sortBy)) ?  this._numeric : this._word;

    this.settle = function(toggle) {
        var parent = this.inputArr[Object.keys(this.inputArr)[0]].parentNode;
        var container = parent.parentNode;
        var neighbor = parent.nextSibling;

        container.removeChild(parent);

        if(toggle == true) this._switch = this._switch == -1 ? 1 : -1;

        this.inputArr.sort(this._method).forEach(function(elm) {
            elm.parentNode.appendChild(elm);
        });

        if(neighbor == null) {
            container.appendChild(parent);
        }else{
            container.insertBefore(parent, neighbor);
        }
    }.bind(this);

    return this;
}

function ArraySort(input, sortBy, order) {

    order = typeof order == 'undefined' ? true : order ;
    sortBy = sortBy.split('/');

    this.inputArr = input;
    this._operator = order === false ? -1 : 1;
    this._switch = 1;


    this._word = function(a, b) {
        aCompare = this._sortBy(a, sortBy);
        bCompare = this._sortBy(b, sortBy);
        if(aCompare === 0) return -1;
        if(bCompare === 0) return 1;
        return (this._operator*(aCompare.localeCompare(bCompare)))*this._switch;
    }.bind(this);

    this._numeric = function(a, b) {
        return (this._operator*(this._sortBy(a, sortBy) - this._sortBy(b, sortBy)))*this._switch;
    }.bind(this);

    this._sortBy = function(item, sortBy) {
        var res = item;
        var noResult = sortBy.some(function(bit) {
            if(typeof res[bit] != 'undefined' && res[bit] != null) {
                res = res[bit];
            }else {
                return true;
            }
        });
        if(noResult === true){
            return 0;
        }
        return res;
    }
    
    this._method = isFinite(this._sortBy(this.inputArr[0], sortBy)) ?  this._numeric : this._word ;

    this.settle = function(toggle) {

        if(toggle == true) this._switch = this._switch == -1 ? 1 : -1;

        return this.inputArr.sort(this._method);

    }.bind(this);

    return this;
}


function jqueryMessageOnlyDialog(htmlString, header) {

    var outerContainer = document.querySelector('#jq-message-only-dialog');
    if(outerContainer == null) {
        outerContainer = document.createElement('div');
        outerContainer.style.display = 'none';
        outerContainer.id = 'jq-message-only-dialog';
        document.querySelector('body').appendChild(outerContainer);
        $(outerContainer).dialog({
			modal: true,
			autoOpen: false,
			resizable: false,
			width: 800
        });

    }
	var innerContainer = document.createElement('div');

	while(outerContainer.firstChild) outerContainer.removeChild(outerContainer.firstChild);
	$(outerContainer).dialog({title: null});

	innerContainer.innerHTML = htmlString;
	outerContainer.appendChild(innerContainer);

	if(typeof header != 'undefined') $(outerContainer).dialog({title: header});
	$(outerContainer).dialog('open');

	return true;

}

function firstLetterUpper(input) {
    return input.replace(new RegExp(/(^\w)|(\s\w)/, 'g'), function(found) { return found.toUpperCase(); });
}

function createUserSelection(studentRoleId ,callback, resetCall) {

    var container = document.createElement('div');

    var classOuterBlock = document.createElement('div');
    
    var roleBlock = document.createElement('div');
    var classBlock = document.createElement('div');
    var roleLabel = document.createElement('label');
    var classLabel = document.createElement('label');
    var roleIcon = document.createElement('i');
    var classIcon = document.createElement('i');
    var roleSelection = document.createElement('select');
    var classSelection = document.createElement('select');
    var defaultOption = document.createElement('option');
    
    roleBlock.className = 'form-group';
    classBlock.className = 'form-group';
    roleIcon.className = 'material-icons';
    classIcon.className = 'material-icons';
    roleLabel.className = 'user-selection-label';
    classLabel.className = 'user-selection-label';

    roleSelection.id = 'role-selection';
    classSelection.id = 'role-selection';

    defaultOption.value = 'default';

    roleLabel.innerText = 'User Role';
    classLabel.innerText = 'Class Name'
    roleIcon.innerText = 'group_add';
    classIcon.innerText = 'school';
    defaultOption.innerText = 'Default';


    roleLabel.insertBefore(roleIcon, roleLabel.firstChild);
    classLabel.insertBefore(classIcon, classLabel.firstChild);
    roleSelection.appendChild(defaultOption.cloneNode(true));
    classSelection.appendChild(defaultOption.cloneNode(true));


    roleBlock.appendChild(roleLabel);
    roleBlock.appendChild(roleSelection);
    classBlock.appendChild(classLabel);
    classBlock.appendChild(classSelection);

    classOuterBlock.appendChild(classBlock);

    container.appendChild(roleBlock);
    container.appendChild(classOuterBlock);

    ajaxCall('fetch_user_roles')
    .done(function(roleList) {
        roleList.forEach(function(role) {
            var option = document.createElement('option');
            option.value = role['rid'];
            option.innerText = firstLetterUpper(role['name']);
            roleSelection.appendChild(option);
        });
    });

    ajaxCall('fetch_school_classes')
    .done(function(classList) {
        classList.forEach(function(className) {
            var option = document.createElement('option');
            option.value = className.classes;
            option.innerText = className.classes;
            classSelection.appendChild(option);
        });
    });
    
    $(classBlock).parent().hide();

    roleSelection.addEventListener('change', function(ev) {

        roleSelection.disabled = true;

        if(ev.target.value == studentRoleId) {
            $(classBlock).parent().show("fold");
            resetCall();
            roleSelection.disabled = false;
            return;
        }

        $( classBlock ).parent().hide( "fold" );
        var cond = JSON.stringify({'field':'role_id','params':ev.target.value,'operator':'='});

        var postData = new FormData;
        postData.append('conditions', cond);

        ajaxCall('fetch_user_static', null, postData)
        .done(function(response) {
            resetCall();
            callback(response);
            roleSelection.disabled = false;
        });
    });

    classSelection.addEventListener('change', function(ev) {

        classSelection.disabled = true;

        var cond = JSON.stringify({'field':'class','params':ev.target.value,'operator':'='});

        var postData = new FormData;
        postData.append('conditions', cond);

        ajaxCall('fetch_user_static', null, postData)
        .done(function(response) {
            resetCall();
            callback(response);
            classSelection.disabled = false;
        });

    });

    return container;

}