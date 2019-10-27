class Datepicker {
    datepickerElement = document.getElementById("datepicker");
    dayContainerElement = document.getElementById("datepicker-calender-day-container");
    calenderDateElement = document.getElementById("datepicker-calender-month");
    timepickerSliderElement = document.getElementById("datepicker-timepicker-slider");
    
    totalDate = document.getElementById("datepicker-total-date");
    totalTime = document.getElementById("datepicker-total-time");
    isPm = false;
    number2Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    calenderMonth = new Date().getMonth();
    selectedDate = new Date();


    setCalender(month = new Date().getMonth()) {
        this.clearCalender();
        var date = new Date();
        date.setMonth(month);
        var thisMonth = date.getMonth();
        var thisYear = date.getFullYear();
        this.calenderMonth = month;
        this.calenderDateElement.innerText = `${this.number2Month[thisMonth]} ${thisYear}`;
        date.setFullYear(thisYear, thisMonth, 1);

        for (var thisSundayDate = 1; date.getDay() != 0;) {
            thisSundayDate--;
            date.setFullYear(thisYear, thisMonth, thisSundayDate);
        }
        for (let i = 0; i < 6; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                let td = document.createElement("td");
                let thisDate= thisSundayDate + i * 7 + j;
                date.setFullYear(thisYear, thisMonth, thisDate);
                td.innerText = date.getDate();
                td.className += ` datepicker-calender-day date`;
                
                td.addEventListener("click",()=>{
                    this.setTotalDate(thisYear, thisMonth, thisDate);
                    if (document.getElementById("selected")) {
                        document.getElementById("selected").id = "";
                    }
                    td.id="selected";
                });
                
                if (date.getMonth() != thisMonth) {
                    td.className += " late";
                }
                
                if (this.selectedDate.toDateString() == date.toDateString() ) {
                    td.id="selected";
                }
                tr.appendChild(td);
            }
            this.dayContainerElement.appendChild(tr);
        }
    }
    clearCalender() {
        var childrenLength = this.dayContainerElement.children.length;
        for (let i = 0; i < childrenLength; i++) {
            this.dayContainerElement.children[0].remove();
        }
    }
    setTotalDate(   year = this.selectedDate.getFullYear(),
                    month = this.selectedDate.getMonth(),
                    date = this.selectedDate.getDate()  ) {
        this.selectedDate.setFullYear(year,month,date);
        this.totalDate.innerText = this.selectedDate.toDateString();
    }
    setTotalTime(hours = 0, minutes = 0) {
        this.selectedDate.setHours(hours, minutes,0,0);
        minutes = minutes < 10 ? `0${minutes}`:minutes;
        hours = this.isPm ? hours+12 : hours;
        this.totalTime.innerText = `${hours}:${minutes}`;
    }
    applyTotal(){
        this.datepickerElement.parentElement.innerText=document.getElementById(`datepicker-total`).innerText;
    }
    setAmPm(isPm){
        this.isPm = isPm;
        this.setTotalTime(this.selectedDate.getHours(), this.selectedDate.getMinutes());
        let oldToken = isPm ? "am" : "pm";
        let newToken = isPm ? "pm" : "am";
        this.datepickerElement.classList.replace(oldToken,newToken);
    }
    setTimeInput(timeInputElement){
        timeInputElement.addEventListener(`click`,()=>{
            timeInputElement.append(this.datepickerElement);
            this.datepickerElement.classList.remove(`hide`);
        });
    }
}


const datepicker = new Datepicker();
datepicker.setCalender();
datepicker.setTotalDate();
datepicker.setTotalTime();
datepicker.setAmPm(new Date().getHours()>=12);
datepicker.setTimeInput(document.getElementsByClassName(`time-input`)[0]);