/*******************************************
 * 
 * Just an idea on using sessionStorage/localStorage.
 * These classes provide a way to fetch and watch data change and invoke an update method when needed.
 * 
 * 
 * @param   string      itemName        Item's name for sessionStorage
 * @param   function    requestCall     Callback to fetch source,it should return another function which pass response as the first parameter.(eg. jquery's done(), fetch's then()) or a value.
 * @param   function    willUpdateCall  Callback to invoke when source is updated. 
 * @param   integer     expiry          Seconds before the item is expire, where it will invoke the requestCall in next loop. Combine with run() first parameter, to refresh the data.
 * @return  Null.
 * @method  function    run             Start running this live storage, pass-in a integer as interval in milliseconds, retrun the setInterval's timer.
 * @method  function    stop            Just end the timer, pass true as the first param will delete the local/session item too.
 * 
 *******************************************/

function LiveSession(itemName, requestCall, willUpdateCall, expiry){
    
    this._setItem = function(value, now){
        if(typeof now == 'undefined') now = Math.floor(Date.now()/1000);
        sessionStorage.setItem(itemName, value);
        sessionStorage.setItem(itemName+'Expiry', now+expiry);
        this.source = value;
    }.bind(this);

    this._loop = function(){
        var currTimestamp = Math.floor(Date.now()/1000);
        //If the source is empty, or the item is expired,try fetch the data.
        if(this.source == null || (currTimestamp> sessionStorage.getItem(itemName+'Expiry'))){
            calledResult = requestCall();
            if(typeof calledResult === 'function'){
                calledResult(
                    function(response){
                        var stringResponse = JSON.stringify(response);
                        if(stringResponse !== sessionStorage.getItem(itemName)){
                            willUpdateCall(response);
                        }
                        this._setItem(stringResponse, currTimestamp);
                    }.bind(this)
                )
            }else{
                var stringResponse = JSON.stringify(calledResult);
                if(stringResponse !== sessionStorage.getItem(itemName)){
                    willUpdateCall(stringResponse);
                }
                this._setItem(stringResponse, currTimestamp);
            }

        }else if(this.source !== sessionStorage.getItem(itemName)){
            this.source = sessionStorage.getItem(itemName);
            willUpdateCall(JSON.parse(this.source));
        }
    }.bind(this);

    this.run = function(interval){
        return this._timer = setInterval(this._loop, interval);
    }.bind(this);

    this.stop = function(forceClose){
        clearInterval(this._timer);
        if(forceClose === true){
            sessionStorage.removeItem(itemName);
            sessionStorage.removeItem(itemName+'Expiry');
        }
        return; 
    }.bind(this);

    
    
    this.source = null;
    this._timer = null;

    //contructer of this class, where it will invoke the first loop without condition.
    var createdTimestamp = Math.floor(Date.now()/1000);
    var calledResult = requestCall();
    if(typeof calledResult === 'function'){
        calledResult(
            function(response){
                willUpdateCall(response);
                this._setItem(JSON.stringify(response), createdTimestamp);
            }.bind(this)
        )
    }else{
        willUpdateCall(calledResult);
        this._setItem(JSON.stringify(calledResult), createdTimestamp);
    }
}

//localStorage live amoung browser windows, it will save alot of fetch request as all windows will watching at the same item, and only require one request when the item expired.

function LiveLocal(itemName, requestCall, willUpdateCall, expiry){

    this._setItem = function(value, now){
        if(typeof now == 'undefined') now = Math.floor(Date.now()/1000);
        localStorage.setItem(itemName, value);
        localStorage.setItem(itemName+'Expiry', now+expiry);
        this.source = value;
    }.bind(this);

    this._loop = function(){
        var currTimestamp = Math.floor(Date.now()/1000);
        if(this.source == null || (currTimestamp> localStorage.getItem(itemName+'Expiry'))){
            calledResult = requestCall();
            if(typeof calledResult === 'function'){
                calledResult(
                    function(response){
                        var stringResponse = JSON.stringify(response);
                        if(stringResponse !== localStorage.getItem(itemName)){
                            willUpdateCall(response);
                        }
                        this._setItem(stringResponse, currTimestamp);
                    }.bind(this)
                )
            }else{
                var stringResponse = JSON.stringify(calledResult);
                if(stringResponse !== localStorage.getItem(itemName)){
                    willUpdateCall(stringResponse);
                }
                this._setItem(stringResponse, currTimestamp);
            }

        }else if(this.source !== localStorage.getItem(itemName)){
            this.source = localStorage.getItem(itemName);
            willUpdateCall(JSON.parse(this.source));
        }
    }.bind(this);

    this.run = function(interval){
        return this._timer = setInterval(this._loop, interval)
    }.bind(this);

    this.stop = function(forceClose){
        clearInterval(this._timer);
        if(forceClose === true){
            localStorage.removeItem(itemName);
            localStorage.removeItem(itemName+'Expiry');
        }
        return this;
    }.bind(this);


    this.source = null;
    this._timer = null;

    //contructer of this class, where it will invoke the first loop without condition.
    var createdTimestamp = Math.floor(Date.now()/1000);
    var calledResult = requestCall();
    if(typeof calledResult === 'function'){
        calledResult(
            function(response){
                willUpdateCall(response);
                this._setItem(JSON.stringify(response), createdTimestamp);
            }.bind(this)
        )
    }else{
        willUpdateCall(calledResult);
        this._setItem(JSON.stringify(calledResult), createdTimestamp);
    }
}

