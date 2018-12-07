var HtmlBuilder = function(){
    
    this.inputElmts = ['checkbox','button'];

    this.inputElm = function(elmName ,value, display, attr){

        if(typeof value == 'undefined') value = null;
        if(typeof display == 'undefined') display = null;
        if(typeof attr == 'undefined') attr = null;

        if(this.inputElmts.indexOf(elmName) === -1) throw new Error('Unexpected element name provided in HtmlBuilder:'+elmName);
        var elm = document.createElement('input');
        elm.setAttribute('type', elmName);
        elm.value = value;
        if(elmName != 'checkbox') elm.textContent = display;
        if(attr != null) Object.keys(attr).forEach(function(key){ elm.setAttribute(key,attr[key]); });
        return elm;
    }

    this.button = function(value, display, attr){

        if(typeof value == 'undefined') value = null;
        if(typeof display == 'undefined') display = null;
        if(typeof attr == 'undefined') attr = null;

        var elm = document.createElement('button');
        elm.setAttribute('type', 'button');
        elm.value = value;
        elm.textContent = display;
        if(attr != null) Object.keys(attr).forEach(function(key){ elm.setAttribute(key,attr[key]); });
        return elm;
    }

    this.option = function(value, display, attr){

        if(typeof value == 'undefined') value = null;
        if(typeof display == 'undefined') display = null;
        if(typeof attr == 'undefined') attr = null;

        var elm = document.createElement('option');
        elm.value = value;
        elm.textContent = display;
        if(attr != null) Object.keys(attr).forEach(function(key){ elm.setAttribute(key,attr[key]); });
        return elm;
    }

    this.block = function(innerElm,labelId){
        var elmName = typeof labelId != 'undefined' ? 'label' : 'div';
        var tempElm = document.createElement(elmName);
        if(typeof innerElm != 'string'){
            if(Array.isArray(innerElm)){
                Object.keys(innerElm).forEach(function(key){ tempElm.appendChild(innerElm[key]) });
            }else{
                tempElm.appendChild(innerElm);
            }
        }else{
            tempElm.textContent = innerElm;
        }
        if(labelId != null) tempElm.htmlFor = labelId;
        return tempElm;
    }

    this.clearElm = function(elm){
        elm = typeof elm == 'string' ? document.querySelector(elm) : elm ;
        while(elm.firstChild) elm.removeChild(elm.firstChild);
    }
}

// var OptionSelector = function() {
    
//     var builder = new HtmlBuilder();
//      this.createOption = function(value, display, attr) {
//          builder.option(value, display, attr);
//      }

//      this.createSelector = function(attr) {
//         var elm = document.createElement('select');
//         if(attr != null) Object.keys(attr).forEach(function(key){ elm.setAttribute(key,attr[key]); });
//      }

// }


var ExceptionPopUp =  function(exceptionList){

    this.uidData = new FormData();
    this.userInfo = [];
    this.exceptionList = exceptionList;
    this.infoIndex = 0;
    this.opened = true;
    this.currReminder = null;
    this.container = null;
    this.hasOverTimed = 0;

    this.builder = function(exceptionInfo, userInfo, index){

        if(typeof exceptionInfo == 'undefined') exceptionInfo = this.exceptionList;
        if(typeof userInfo == 'undefined')  userInfo = this.userInfo;
        if(typeof index == 'undefined') index = this.infoIndex;

        var currExc = exceptionInfo[index];
        var nowDateTime = new Date();

        var overtimed = newDate(currExc['valid_to']) < nowDateTime;

        console.log(currExc['valid_to'], nowDateTime.getFullYear()+'-'+nowDateTime.getMonth()+'-'+nowDateTime.getDate()+' '+nowDateTime.getHours()+':'+nowDateTime.getMinutes()+':'+nowDateTime.getSeconds());

        var container = document.createElement('div');
        container.className = 'exception_pop_up ui-dialog ui-corner-all ui-widget ui-widget-content';
        container.style.zIndex = 101;
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = window.matchMedia("(max-device-width: 767px)").match ? 'translate(-50%, -50%) scale(0.6)' : 'translate(-50%, -50%)';
        container.style.width = '40rem';
        container.style.fontSize = '1.5rem';

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn';

        var headerSection = document.createElement('div');
        headerSection.className = 'ui-dialog-titlebar ui-corner-all ui-widget-header';
        var headerText = document.createElement('span');
        headerText.innerText = overtimed === true ? 'Overtime Special approval' : 'Special Approval' ;
        var closeBtn = button.cloneNode(false);
        closeBtn.innerText = 'Close';
        closeBtn.className = 'ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close';

        var closeCross = document.createElement('span');
        closeCross.className = 'ui-button-icon ui-icon ui-icon-closethick';
        closeBtn.appendChild(closeCross);

        closeBtn.addEventListener(
            'click',
            function(ev){
                this.closePopUp();
            }.bind(this)
        );

        headerSection.appendChild(headerText);
        headerSection.appendChild(closeBtn);


        //Image section
        var imgSection = document.createElement('div');
        imgSection.className = 'image_container';
        imgSection.style.width = '40%';
        imgSection.style.display = 'inline-block';
        var image = document.createElement('img');
        image.style.width = '100%';
        image.src = userInfo[currExc.uid].uri == null ? window.config.httpRoot+'/seating_plan/img/user_default.png' : userInfo[currExc.uid].uri ;
        
        image.addEventListener('error',
            function(ev){
                ev.target.src = window.config.httpRoot+'/seating_plan/img/user_default.png';
            }
        );

        imgSection.appendChild(image);

        //Info section on the right
        var infoSection = document.createElement('div');
        infoSection.style.width = 'calc(60%)';
        infoSection.style.display = 'inline-block';
        infoSection.style.verticalAlign = 'top';
        var infoSectionElms = {
            'Name':userInfo[currExc.uid]['eng_name'] != null ? userInfo[currExc.uid]['eng_name'] : userInfo[currExc.uid]['name'],
            'Class/Class No.':userInfo[currExc.uid]['class']+', '+userInfo[currExc.uid]['class_number'],
            'Left at':currExc['record_time'].substring(currExc['record_time'].indexOf(' ')+1),
            'Expected Return at':currExc['valid_to'].substring(currExc['valid_to'].indexOf(' ')+1),
            'Exception':currExc['remark']
        };
        
        var block = document.createElement('div');
        block.style.padding = '2% 5%';
        var spanLeft = document.createElement('span');
        var spanRight = document.createElement('span');
        spanRight.style.position = 'absolute';
        spanRight.style.right = 0;


        Object.keys(infoSectionElms).forEach(function(key){
            var blockClone = block.cloneNode(true);
            var leftClone = spanLeft.cloneNode(true);
            var rightClone = spanRight.cloneNode(true);
            
            leftClone.innerText = key;
            rightClone.innerText = infoSectionElms[key];

            if(key === 'Expired at' && overtimed){
                rightClone.style.backgroundColor = 'orangered';
            }

            blockClone.appendChild(leftClone);
            blockClone.appendChild(rightClone);

            infoSection.appendChild(blockClone);
        });

        //Feature/button section on the buttom
        var featureSection = document.createElement('div');
        featureSection.style.width = '100%';

        var prevBtn = button.cloneNode(false);
        var nextBtn = button.cloneNode(false);
        var safeBtn = button.cloneNode(false);
        var officeBtn  = button.cloneNode(false);


        prevBtn.textContent = 'Prev';
        nextBtn.innerText = 'Next';
        safeBtn.innerText = 'Close Case';
        officeBtn.innerText = 'Missing';
        
        safeBtn.style.float = 'right';
        safeBtn.style.marginRight = '1rem';
        officeBtn.style.float = 'right';

        prevBtn.addEventListener(
            'click',
            function(ev){
                this.prevInfo();
            }.bind(this)
        );
        nextBtn.addEventListener(
            'click',
            function(ev){
                this.nextInfo();
            }.bind(this)
        )
        safeBtn.addEventListener(
            'click',
            function(ev){
                replaceConfirmBtn('Confirm', function(){
                    var URLParamter = {'exception_id':currExc.id};
                    if(typeof window.eventInfo != 'undefined' && typeof window.eventInfo.id != 'undefined') URLParamter['event_id'] = window.eventInfo.id ;
                    if(typeof window.eventInfo != 'undefined' && typeof window.eventInfo['location_id'] != 'undefined') URLParamter['location_id'] = window.eventInfo['location_id'];
                    ajaxCall('close_exception', URLParamter)
                    .done(function(){
                        this.exceptionList.splice(index,1);
                        if(this.exceptionList.length === 0){
                            this.closePopUp();
                            return;
                        }
    
                        if(index >= this.exceptionList.length){
                            this.prevInfo();
                            return;
                        }
    
                        this.moveTo(this.infoIndex);

                        
                        //A unsturctured build up,what is done here is to require a function which monitoring the bowser's localStorage to refresh an item
                        //This behavior has nothing to do with this class, please look for liveStorage.js for more detail.

                        localStorage.setItem('responseibleExceptionExpiry',-1);
                        
                    }.bind(this));
                }.bind(this), undefined, ev);

            }.bind(this)
        );
        officeBtn.addEventListener(
            'click',
            function(ev){
                replaceConfirmBtn('Confirm', function(){
                    ajaxCall('pass_exception',{'exception_id':currExc.id,'pass_to':'office'})
                    .done(function(){
                        this.exceptionList.splice(index,1);
                        if(this.exceptionList.length === 0){
                            this.closePopUp();
                            return;
                        }
    
                        if(index >= this.exceptionList.length){
                            this.prevInfo();
                            return;
                        }
    
                        this.moveTo(this.infoIndex);


                        //A unsturctured build up,what is done here is to require a function which monitoring the bowser's localStorage to refresh an item
                        //This behavior has nothing to do with this class, please look for liveStorage.js for more detail.

                        localStorage.setItem('responseibleExceptionExpiry',-1);
                        
                    }.bind(this));
                }.bind(this), undefined, ev);
            }.bind(this)
        )

        if(this.infoIndex === 0) prevBtn.disabled = true;
        if(this.infoIndex === exceptionInfo.length-1) nextBtn.disabled = true;

        featureSection.appendChild(prevBtn);
        featureSection.appendChild(nextBtn);
        featureSection.appendChild(officeBtn);
        featureSection.appendChild(safeBtn);


        //Append to DOM
        var middleSection = document.createElement('div');
        middleSection.style.position = 'relative';
        middleSection.appendChild(imgSection);
        middleSection.appendChild(infoSection);

        container.appendChild(headerSection);
        container.appendChild(middleSection);
        container.appendChild(featureSection);

        this.opened = true;

        return this.container = document.querySelector('body').appendChild(container);

    }.bind(this);

    this.checkOverTimed = function(){
        return Object.keys(this.exceptionList).some(function(key){
            if(this.exceptionList[key]['hasOverTimed'] === true) return true
        }.bind(this));
    }.bind(this);

    this.closeCallback = undefined;

    //Class functions
    this.closePopUp = function(forceClose){
        var currPopup = document.querySelector('.exception_pop_up');
        if(currPopup != null) currPopup.parentElement.removeChild(currPopup);
        
        this.opened = false;

        if(forceClose === true){
            //immediately remove the popup and reminder.
            if(this.currReminder != null && this.currReminder.parentNode != null) this.currReminder.parentNode.removeChild(this.currReminder);
            return window.config.exceptionPopUp = null;
        }

        var message = document.createElement('div');
        var span = document.createElement('span');
        span.innerText = this.checkOverTimed() ? 'Overtime special approval existing,' : 'Special approval existing,';
        var clickable = document.createElement('span');
        clickable.id = 'reopen_exception';
        clickable.innerText = 'click here for details.';
        clickable.style.cursor = 'pointer';
        clickable.style.textDecoration = 'underline';
        clickable.style.color = '#387894';
        message.appendChild(span);
        message.appendChild(clickable);
        // clickable.style.cursor = 'pointer';
        
        
        //Left a reminder if there are still exception existing 
        if(this.exceptionList.length !== 0){
            this.currReminder = reminder(message);

            document.querySelector('#reopen_exception').addEventListener(
                'click',
                function(ev){
                    this.builder(this.exceptionList, this.userInfo, this.infoIndex);
                    this.currReminder.parentNode.removeChild(this.currReminder);
                    // closeReminder(0);
                }.bind(this)
            )
        }

        if(typeof this.closeCallback == 'function') this.closeCallback();

    }.bind(this);

    this.reRender = function() {
        this.builder(this.exceptionList, this.userInfo, this.infoIndex);
        this.currReminder.parentNode.removeChild(this.currReminder);
    }

    this.moveTo = function(index){
        document.querySelector('body').removeChild(document.querySelector('.exception_pop_up'));
        this.builder(this.exceptionList, this.userInfo, index);
    }.bind(this);

    this.nextInfo = function(){
        this.moveTo(++this.infoIndex)
    }.bind(this);

    this.prevInfo = function(){
        this.moveTo(--this.infoIndex);
    }.bind(this);


    this.getInstance = function(exceptionList){

        this.hasOverTimed = 0;

        this.exceptionList = typeof exceptionList == 'undefined' ? this.exceptionList : exceptionList ;

        if(this.container != null && this.container.parentNode != null) this.container.parentNode.removeChild(this.container);

        var nowDateTime = new Date();

        Object.keys(this.exceptionList).forEach(
            function(key){
                this.uidData.append('uid[]', this.exceptionList[key].uid);
                if(new Date(this.exceptionList[key]['valid_to']) < nowDateTime){
                    console.log(this.hasOverTimed++);
                    this.exceptionList[key]['hasOverTimed'] = true;
                };
            }.bind(this)
        );

        //fetch user info
        ajaxCall('fetch_user', null, this.uidData).done(
            function(response){
                this.userInfo = response;
                //if the list is empty but the popup is opened
                if(this.opened == true && this.exceptionList.length == 0) this.closePopUp(true);
                //Rebuild/update the DOM whenever the popup is openning
                if(this.opened == true) return this.builder(this.exceptionList, this.userInfo, this.infoIndex);
            }.bind(this)
        );

        return this;

    }.bind(this);

    return this.getInstance(exceptionList);
}

var TableBuilder = function(source){
    this._source = source;
    this._table = document.createElement('table');
    this._caption = document.createElement('caption');
    this._tr = document.createElement('tr');
    this._td = document.createElement('td');
    this._th = document.createElement('th');
    this._thead = document.createElement('thead');
    this._tbody = document.createElement('tbody');
    this._tfoot = document.createElement('tfoot');
    this._rowAttr = null;
    this._hiddenCols = null;
    this._headerArray = null;

    this._resizeTimer = null;
    this._windowWidth = null;
    
    this._product = null;

    this.build = function(title){

        //Terminal the function if this._source is not an object(/array).
        if(typeof this._source != 'object') return;
        var sample = this._headerArray === null ? this._source[Object.keys(this._source)[0]] : this._headerArray ;
        if(typeof sample == 'undefined') throw 'Unable to defined hander row for table builder!';
        var headerRow = this.create('tr');
        Object.keys(sample).forEach(function(key){
            if(this._hiddenCols != null && this._hiddenCols.indexOf(key) != -1) return; //builder want to hide this item,return.
            //If user haven't provide a array for headers, the key of the sample row will be use as headers, otherwise use the provided array's items.
            if(this._headerArray != null) key = sample[key];
            headerRow.appendChild(this.create('th',key));
        }.bind(this));
        var thead = this.create('thead',headerRow);
      
        var tempTr = {};
        var tempTd = {};
        var tBody  = this.create('tbody');

        Object.keys(this._source).forEach(function(rowKey){
            var rowAttr = {};
            if(this._rowAttr != null){
                Object.keys(this._rowAttr).forEach(function(attrKey){
                    rowAttr[attrKey] = this._source[rowKey][this._rowAttr[attrKey]];
                }.bind(this))
            }
            tempTr = this.create('tr', null, rowAttr);
            Object.keys(this._source[rowKey]).forEach(function(fieldKey){
                if(this._hiddenCols != null && this._hiddenCols.indexOf(fieldKey) != -1) return;
                tempTd = this.create('td', this._source[rowKey][fieldKey]);
                tempTr.appendChild(tempTd);
            }.bind(this))
            tBody.appendChild(tempTr);
        }.bind(this))
        var table = this.create('table');

        if(typeof title != 'undefined'){
            var caption = this._caption.cloneNode();
            caption.innerText = title;
            table.appendChild(caption);
        }
        table.appendChild(thead);
        table.appendChild(tBody);
        this._product = table;
        return table;
    }.bind(this)

    this.setAttr  = function(elmName, attr){
        Object.keys(attr).forEach(function(key){
            this['_'+elmName].setAttribute(key, attr[key]);
        }.bind(this));
        return this;
    }.bind(this);

    this.setHeader = function($array){
        this._headerArray = $array;
        return this;
    }

    /*
     * Set attributes base on source's data to every table-row individually.
     * 
     * @param   object  indexName   An object with object key as attribute's name, value as source's field's name.
     *                              The function will set data row's field value as attribute value. eg. {'key/attrNameA':'value/fieldNameA','key/attrNameB':'value/fieldNameB'}
     * 
     * @return  object  Return the object itself.
     */

    this.setRowAttr = function(indexName){
        this._rowAttr = indexName;
        return this;
    }.bind(this);

    /*
     * Add a column fill with the given value.
     * 
     * @param   object          header  Text of the th element.
     * @param   object/string   value   Inner of the td elements, accept string or html node.
     * 
     * @return  object  Return the object itself.
     */

    this.addCol = function(header, value){
        if(typeof value == 'object' && value != null){
            Object.keys(this._source).forEach(function(key){
                this._source[key][header] = value.cloneNode(true);
            }.bind(this))
        }else{        
            Object.keys(this._source).forEach(function(key){
                this._source[key][header] = value;
            }.bind(this));
        }

        return this;
    }

    /*
     * Hide a column of fields from the source.(the given column will exclude from the table)
     * 
     * @param   string  columnName  index/key of the field.
     * 
     * @return  object  Return the object itself.
     */

    this.hideCol = function(columnName){
        if(this._hiddenCols == null) this._hiddenCols = [];
        this._hiddenCols.push(columnName);
        return this;
    }

    this.setFixHeader = function() {
        
    }.bind(this);

    this.fixTableWidth = function(table) {
        var allTh = table.querySelectorAll('tr th');
        var sampleTds = table.querySelectorAll('tbody tr:first-child td');
    
        var tbody = table.querySelector('tbody');
        var tWidth = tbody.getBoundingClientRect().width;
        var thead = table.querySelector('thead');
        var caption = table.querySelector('caption');

        var extraHeight = thead.getBoundingClientRect().height+ caption.getBoundingClientRect().height; 
        var tHeight = table.parentNode.getBoundingClientRect().height - extraHeight;
        var currTotalWidth = 0;
        var currWidthArr = [];
    
        tbody.style.height = tHeight+'px';
    
        Object.keys(sampleTds).forEach(function(key) {
            currWidthArr[key] = sampleTds[key].getBoundingClientRect().width;
            currTotalWidth += sampleTds[key].getBoundingClientRect().width;
        });
        var addionWidth = (tWidth - currTotalWidth)/sampleTds.length;
        var tdWdithArr = [];
        Object.keys(sampleTds).forEach(function(key) {
            currWidthArr[key] += addionWidth;
            //shorten the last td to avoid collion with the scrollbar 
            if(key == sampleTds.length-1) {
                sampleTds[key].style.width = (currWidthArr[key] - (tbody.offsetWidth - tbody.clientWidth)) + 'px';
                return;
            }
            sampleTds[key].style.width = currWidthArr[key]+'px';
        });
        Object.keys(allTh).forEach(function(key) {
            allTh[key].style.width = currWidthArr[key]+'px';
        })
    }.bind(this);

    this.fixTableOnResizeHandler = function(ev){
        clearTimeout(this._resizeTimer);
        var that = this;
        this._resizeTimer = setTimeout(function(){
            if(that._windowWidth === window.innerWidth) return;
            that._windowWidth = window.innerWidth;
            that.fixTableWidth(that._product);
        },100);
    }.bind(this);

    this.createToTopBtn = function() {
        var button = document.createElement('div');
        var icon = document.createElement('i');
    
        button.className = 'back-to-top-btn';
    
        icon.className = 'material-icons';
        icon.innerText = 'vertical_align_top';
    
        button.appendChild(icon);
    
        button.addEventListener('click',function(ev){
            ev.preventDefault();
    
            var tableNode = ev.target;
            while(tableNode.tagName != 'TABLE') tableNode = tableNode.parentNode;
    
            $(tableNode.querySelector('tbody')).animate({
                scrollTop: 0
            }, 700);
        });

        var styles = {'position':'absolute','bottom':'1rem','right':'2rem','cursor':'pointer','color':'grey','display':'none'};
        Object.keys(styles).forEach(function(key){
            button.style[key] = styles[key];
        })

        return button;
    }
    
    /**
     * Could only invoke after the build() function, which fix the table header's position on scrolling.
     * The table's parent element need to have a height attribute to make this position correctly.
     * 
     */
    this.initFixTable = function() {
        if(this._product === null) throw 'Error: initFixTable() could only invoke after the table creation!';
        var table = this._product;
        var parent = table.parentNode;
        
        // parent.style.height = '100%';
        parent.style.overflowY = 'hidden';

        table.querySelector('thead').style.display = 'block';
        var tbody = table.querySelector('tbody');
        tbody.style.display = 'block';
        tbody.style.overflow = 'auto';
        
        this.fixTableWidth(table);
        window.addEventListener('resize', this.fixTableOnResizeHandler);
        var toTopBtn = table.appendChild(this.createToTopBtn());

        tbody.addEventListener('scroll', function(ev){
            var target = ev.target;

            if(target.scrollTop > target.clientHeight && toTopBtn.style.display != 'block'){

                toTopBtn.style.display = 'block';
                return;
            }
            if(target.scrollTop < target.clientHeight && toTopBtn.style.display != 'none'){
                toTopBtn.style.display = 'none';
                return;
            }
        });
        
    }.bind(this);

    /*
     * Create and return a html element.
     * 
     * @param   string           elmName   Tag name of the new element.
     * @param   string/htmlNode  inner     [Option] textContent or child of the new element.
     * @param   object           altAttr   [Option] Alternative to this.setAttr(),the given object will translate to attributes which only apply to this individual element.
     *
     */

    this.create = function(elmName, inner, altAttr){
        var elm = this['_'+elmName].cloneNode();
        if(typeof altAttr != 'undefined') Object.keys(altAttr).forEach(function(key){ elm.setAttribute(key, altAttr[key]); });
        if(typeof inner == 'undefined') return elm;
        typeof inner === 'object' && inner != null ? elm.appendChild(inner) : elm.textContent = inner ;
        return elm;
    }.bind(this);

}
