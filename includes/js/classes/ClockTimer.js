function updateDateAndClock(){
    
    var curDateTime = new Date();
    var dayOfWeek = "";
    
    switch (curDateTime.getDay()){
        case 0:dayOfWeek="Sun";
            break;
            
        case 1:
            dayOfWeek="Mon";
            break;
        
        case 2: ;
            dayOfWeek="Tue";
            break;
            
        case 3: ;
            dayOfWeek="Wed";
            break;
        
        case 4: ;
            dayOfWeek="Thu";
            break;
            
        case 5: ;
            dayOfWeek="Fri";
            break;
            
        case 6: ;
            dayOfWeek="Sat";
            break;	
            
        default:
            dayOfWeek="Null";	
        
        
    }
    var curDate = timeAddZero(curDateTime.getFullYear()) + "-" + timeAddZero((curDateTime.getMonth()+ 1)) + "-" + timeAddZero(curDateTime.getDate()) + " (" + dayOfWeek + ")" ;
    
    var curTime = timeAddZero(curDateTime.getHours()) + ":" + timeAddZero(curDateTime.getMinutes()) + ":" + timeAddZero(curDateTime.getSeconds()) ;
    document.querySelector('#menu_date').innerHTML = curDate;
    document.querySelector('#menu_time').innerHTML = curTime;
    // $('#menu_date').html(curDate);
    // $('#menu_time').html(curTime);
    

}

function timeAddZero(num){
        return (num >= 0 && num < 10) ? "0" + num : num + "";
}
