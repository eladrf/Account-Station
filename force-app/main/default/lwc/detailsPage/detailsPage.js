import { LightningElement ,api ,track ,wire} from 'lwc';

// import backgroundUrl from '@salesforce/resourceUrl/background';


//ff
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//Call an Apex - Wired
import getAllWorkTypes from '@salesforce/apex/detailsPageController.getAllWorkTypes';

//For Mobile Desktop HTML Display
import desktop from './desktop.html';
import mobile from './mobile.html';
import { isMobile} from 'c/portalUtils';//portalUtils Class

//Combobox Imports
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import EXPENSE_OBJECT from '@salesforce/schema/Expense__c';
import CATEGORY_VALUES_FIELD from '@salesforce/schema/Expense__c.Category_Values__c';

//Columns For Desktop
const allWorkTypesColumns = [
    { label: 'Expense Number' , fieldName: 'Name', hideDefaultActions: 'true', initialWidth: 250 },
    { label: 'Expense Date', fieldName: 'Expense_Date__c', sortable: 'true', hideDefaultActions: 'true'},
    { label: 'Cost', fieldName: 'Cost__c', hideDefaultActions: 'true' },
    { label: 'Category', fieldName: 'Category__c', hideDefaultActions: 'true' },
    {label: 'Account Name', fieldName: 'LinkUrl', type: "url",
    typeAttributes: { label: { fieldName: "Name" }, target: "_top" },
    cellAttributes:{ class: { fieldName: 'testCSSClass' }} 
    }
];

//Columns For Mobile
const mobileAllWorkTypesColumns = [
    {label: 'Exp', fieldName: 'LinkUrl', type: "url",
    typeAttributes: { label: { fieldName: "Name" }, target: "_top" },
    cellAttributes:{ class: { fieldName: 'testCSSClass' }} ,
    initialWidth: 80
    },
    { label: 'Date', fieldName: 'Expense_Date__c', sortable: 'true', hideDefaultActions: 'true'},
    { label: 'Cost', fieldName: 'Cost__c', hideDefaultActions: 'true'},
    { label: 'Category', fieldName: 'Category__c', hideDefaultActions: 'true' , initialWidth: 92}
];


export default class DetailsPage extends LightningElement {

    //timer
    timeoutIdPlusYear;

    //Button indicator
    plusYearClicked=false;
    minusYearClicked=false;
    plusMonthClicked=false;
    minusMonthClicked=false;

    effectIcon='effect-icon-class-before-click';
    ModalIcon='effect-icon-class-before-click';

    flag=false;

    //Class Display Sum's
    displaySum="";
    displayfuelSum="demo-only demo-only--sizing slds-grid slds-wrap display-none"

    //Class Menus Close Or Open
    openMenus='slds-dropdown-trigger slds-dropdown-trigger_click';

    totalFuelBudget=0;
    budgetForCategoryCollection=[];
    totalbudget=0;
    budgetFuel=0;
    testtt='0%';
    beneficiariesPercents=0;
    beneficiariesPercentsFuel=0;
    firstTab=false;
    secondTab=false;
    thirdTab=false;


    fuelSum=0;
    activeTabValue='tab-one';
    currentSum=0;
    value='all';
    showSpinner=false;
    TabOne=true;
    normalDTFontSize='75%';
    increasedDTFontSize='78%';
    normalZoom='black'
    increasedZoom='rgb(0, 111, 215)'
    normalPadding ='rgb(0, 0, 0)';
    increasedPadding = 'rgb(0, 110, 165)';
    normalFont = '20px';
    inceasedFont ='21px';
    @api recordId;
    showModalLWC=false;
    ParentMaintenancePlanId ='';
    @track upperDataTable = [];
    fieldsSearchKey='';
    //Columns
    allWorkTypesColumns = allWorkTypesColumns;
    mobileAllWorkTypesColumns = mobileAllWorkTypesColumns;

    //Validations
    isValid=false;
    HideFirstDataTable=false;

    //Variable
    inputFieldsSearchKey;
    year=0;
    month=0;

    get backgroundStyle() {
        return `height:50rem;background-image:url(${backgroundUrl})`;
    }


    //Check What to Type
    renderedCallback(){
        if(this.year==0){
            this.year= new Date().getFullYear();
        }
        if(this.month==0){
            this.month= new Date().getMonth()+1;
        }
        console.log('this.month Test : '+this.month);
        console.log('Date() : '+Date());

        //
        // this.template
        // .querySelector(".blue-section")
        // .style.setProperty("--beneficiariesPercents",this.testtt);




    }

    //Wired For Pick List Valus import
    @wire(getObjectInfo, { objectApiName: EXPENSE_OBJECT })
    CategoryMetadata;
    @wire(getPicklistValues,
        {
            recordTypeId: '$CategoryMetadata.data.defaultRecordTypeId', 
            fieldApiName: CATEGORY_VALUES_FIELD
        }
    )
    CategoryPicklist;

    //Getters For Pick List Valus import
    get familyOptions() {
        if(this.CategoryPicklist.data){
            let options = [];
            options.push({value: 'all', label: 'All'});
                this.CategoryPicklist.data.values.forEach(option => {
                    options.push({label: option.label, value: option.value});
                })
            return options;
        }
    }
    
    //Wired For DataTable Info
    @wire(getAllWorkTypes, { fieldsSearchKey: '$fieldsSearchKey' , year:'$year' , value:'$value' , month:'$month'})
    getAllWorkTypesWire({error , data}) {
        //if(data!=undefined){   
            console.log('this.showModalLWC :'+this.showModalLWC);
            console.log('data :'+data);
            if (data) {
                this.upperDataTable = [];
                this.ParentMaintenancePlanId = this.recordId;
                let tableData = [];
                for (var i = 0; i < data.expenseRecord.length; i++) { 
                    let row = {};//{...result.data[i]};
                    if (data.expenseRecord[i]) {
                        row.Name = data.expenseRecord[i].Name.substring(3, 7);
                        row.Expense_Date__c = data.expenseRecord[i].Expense_Date__c;
                        row.Cost__c = data.expenseRecord[i].Cost__c;
                        row.Category__c = data.expenseRecord[i].Category__r.Name;
                        //for the test()
                        row.Id= data.expenseRecord[i].Id;
                        row.testCSSClass = 'test-one';
                    } 
                    //console.log('this.upperDataTable :'+this.upperDataTable);
                    tableData.push(row);
                    
                }
                this.upperDataTable = tableData;
                this.test();
                //this.fontEffect();
                this.sumCalculation();
                console.log('this.upperDataTable :'+ this.upperDataTable);
                //this.clearData();  
                this.budgetForCategoryCollection = data.budgetForCategoryRecord;
                console.log('this.budgetForCategoryCollection :'+ this.budgetForCategoryCollection);
                console.log('this.month :'+ this.month);
                this.budgetForCategoryCalculation();
                this.PercentsCalculation();
            }else if(error){   
            this.errorMessage =error.body.message;
            console.log('this.errorMessage :'+this.errorMessage );
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: this.errorMessage,
                    variant: 'error'
                })
            );
            } 
        //}    
    }  

    //Fuctions :

    handleModalClick(){
        this.showModalLWC=true;
        console.log('this.showModalLWC :'+this.showModalLWC);
        //this.onChangeHandler();
        this.topFunction();
    }

    handleSaveFromChild(){
        this.showModalLWC=false;
        console.log('datailPage');
        this.dispatchEvent(new CustomEvent('closewindow'));    
    }

    handleSearchKeyChange(event){
        let searchInput = this.template.querySelector(`[data-id="searchInput"]`);
        this.inputFieldsSearchKey = event.detail.value;
        if(this.inputFieldsSearchKey.length < 3){
            searchInput.setCustomValidity("Search Input must be 3 characters or more");
        } else if(this.inputFieldsSearchKey.length >= 3){
            searchInput.setCustomValidity("");           
        }
        if(this.inputFieldsSearchKey.length == 0){
            searchInput.setCustomValidity("");
            if(this.fieldsSearchKey != ''){
                this.fieldsSearchKey = '';
            }        
        }
    }

    handleSearchBtn(){  
        if(this.inputFieldsSearchKey != undefined && this.inputFieldsSearchKey.length >= 3){
            this.fieldsSearchKey = this.inputFieldsSearchKey;
        }
        this.fontEffect();
    }

    render() {
        return isMobile() ? mobile : desktop;
    }

    test(){
        let tempAccts = [];
        this.upperDataTable.forEach(acct=>{
          let newAcct = JSON.parse(JSON.stringify(acct));
          newAcct.LinkUrl = `/${acct.Id}`;
          tempAccts.push(newAcct);
        });
        console.log('tempAccts :'+JSON.stringify(tempAccts));
        this.upperDataTable = tempAccts;
    }

    timeoutId;
    onChangeHandler() {
        clearTimeout(this.timeoutId); // no-op if invalid id
        this.timeoutId = setTimeout(this.doExpensiveThing.bind(this), 500); // Adjust as necessary
    }
    doExpensiveThing() {
        window.location.reload();
    }

    topFunction(){
        const scrollOptions = {
            left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }

    handlePlusYear(){
        this.plusYearButtonAfterClick();
        this.plusYearClicked=true;
        this.year=this.year+1;
        console.log('activeTabValue :'+this.activeTabValue);
        this.fontEffect();
    }

    handleMinusYear(){
        this.minusYearButtonAfterClick();
        this.minusYearClicked=true;
        this.year=this.year-1;
        this.fontEffect();
    }

    fontEffect(){

        if(  this.plusYearClicked==true || this.minusYearClicked==true ){
            this.template.querySelector(".increased-font").style.setProperty("--my-width",this.inceasedFont);
            this.template.querySelector(".increased-font").style.setProperty("--my-padding",this.increasedPadding);
        }

        //dss
        if(  this.plusMonthClicked==true || this.minusMonthClicked==true ){
            this.template.querySelector(".increased-font-month").style.setProperty("--my-width",this.inceasedFont);
            this.template.querySelector(".increased-font-month").style.setProperty("--my-padding",this.increasedPadding);
        }
        //dss

        if( this.thirdTab && ( this.plusYearClicked==true || this.minusYearClicked==true || this.plusMonthClicked==true || this.minusMonthClicked==true ) ){
            this.template.querySelector(".increased-zoom-percent").style.setProperty("--my--zoom",this.increasedZoom);
            this.fontEffectDTFontSizeIncreased();
        }
        this.timerAfterFontEffect();
    }

    timerAfterFontEffect() {
        clearTimeout(this.timeoutId); // no-op if invalid id
        this.timeoutId = setTimeout(this.fontEffectTwo.bind(this), 200); // Adjust as necessary
    }

    fontEffectTwo(){
        if(  this.plusYearClicked==true || this.minusYearClicked==true ){
            this.template.querySelector(".increased-font").style.setProperty("--my-width",this.normalFont);
            this.template.querySelector(".increased-font").style.setProperty("--my-padding",this.normalPadding);
        }
        
        //dss
        if(  this.plusMonthClicked==true || this.minusMonthClicked==true ){
            this.template.querySelector(".increased-font-month").style.setProperty("--my-width",this.normalFont);
            this.template.querySelector(".increased-font-month").style.setProperty("--my-padding",this.normalPadding);
        }
        //dss

        if( this.thirdTab && ( this.plusYearClicked==true || this.minusYearClicked==true || this.plusMonthClicked==true || this.minusMonthClicked==true ) ){
            this.template.querySelector(".increased-zoom-percent").style.setProperty("--my--zoom",this.normalZoom);
            this.fontEffectDTFontSizeNormal();
        }
        this.plusYearClicked=false;
        this.minusYearClicked=false; 
        this.plusMonthClicked=false;
        this.minusMonthClicked=false;  
    }

    handleNextClick(){
        this.showSpinner=true;
        //this.fieldsSearchKey=this.fieldsSearchKey;
        this.template.querySelector('lightning-record-form').submit();
    }

    handleSuccess(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Created',
                variant: 'success'
            })
        );
        this.showSpinner=false;

    }

    handleError(){
        this.doExpensiveThing();
        if(!this.TabOne){
            this.isValid=false;
        }
        this.showSpinner=false;
    }


    fontEffectDTFontSizeNormal(){
        this.template
        .querySelector(".increased-zoom-percent")
        .style.setProperty("--font--size",this.normalDTFontSize);
    }

    fontEffectDTFontSizeIncreased(){
        this.template
        .querySelector(".increased-zoom-percent")
        .style.setProperty("--font--size",this.increasedDTFontSize);
    }

    handleChange(event) {
        this.value = event.detail.value;
        //this.comboBoxlabel = this.familyOptions.filter(x=> x.value == this.value )[0].label;
            this.fontEffect(); 
    }

    handlePlusMonth(){
        this.plusMonthButtonAfterClick();
        this.plusMonthClicked=true;
        this.month=this.month+1==13?1:this.month+1;
        this.fontEffect(); 
    }

    handleMinusMonth(){
        this.minusMonthButtonAfterClick();
        this.minusMonthClicked=true;
        this.month=this.month-1==0?12:this.month-1;
        this.fontEffect(); 
    }

    sumCalculation(){
        /*this.currentSum=0;
        this.upperDataTable.forEach(option => {
            this.currentSum=this.currentSum+option.Cost__c;
        })*/
        this.currentSum=0;
        this.fuelSum=0;

        for(let j=0; j < this.upperDataTable.length; j++){ 
            this.currentSum = this.currentSum + this.upperDataTable[j].Cost__c ;
            //console.log('currentSum :'+this.currentSum);
        }    
        console.log('currentSum :'+this.currentSum);

        this.upperDataTableFuel = this.upperDataTable.filter(x=> x.Category__c == 'דלק' );
        for(let j=0; j < this.upperDataTableFuel.length; j++){ 
            this.fuelSum = this.fuelSum + this.upperDataTableFuel[j].Cost__c ;
            //console.log('fuelSum :'+this.fuelSum);
        }    
        console.log('fuelSum :'+this.fuelSum);

    }

    firstTabActivation(){
        this.menusClose();
        this.firstTab=true;
        this.fieldsSearchKey='';
        //this.year=new Date().getFullYear();
        this.value='all';
        //this.month=new Date().getMonth();

        [...this.template
            .querySelectorAll('lightning-input, lightning-textarea')]
            .forEach((input) => { input.value = ''; });
    }

    secondTabActivation(){
        this.menusClose();
        this.secondTab=true;
    }

    thirdTabActivation(){
        this.menusClose();
        this.thirdTab=true;
    }

    budgetForCategoryCalculation(){
        this.totalbudget=0;
        this.totalFuelBudget=0;
        for(let j=0; j < this.budgetForCategoryCollection?.length; j++){ 
            this.totalbudget = this.totalbudget + this.budgetForCategoryCollection[j].Category_Budget__c ;
        }   
        console.log('totalbudget :'+this.totalbudget);

        //budgetFuel
        this.totalFuelBudget = (this.budgetForCategoryCollection?.filter(x=> x.Category__r.Name == 'דלק' )[0]==undefined)?0:this.budgetForCategoryCollection?.filter(x=> x.Category__r.Name == 'דלק' )[0].Category_Budget__c;
        console.log('this.totalFuelBudget :'+this.totalFuelBudget);
    }

    PercentsCalculation(){
        // if(this.totalbudget==0 && this.currentSum!=0){
        //     this.beneficiariesPercents =100;
        // }else if(this.totalbudget==0 && this.currentSum==0){
        //     this.beneficiariesPercents =0;
        // }else if(this.totalbudget!=0 && this.currentSum==0){
        //     this.beneficiariesPercents =0;
        // }else if(this.totalbudget!=0 && this.currentSum!=0){
        //     this.beneficiariesPercents = ( this.currentSum / this.totalbudget)*100;
        // }
        // this.testtt = this.beneficiariesPercents + '%';
        // this.beneficiariesPercents =Number(String(this.beneficiariesPercents).substring(0, 5));  

        // this.template.querySelector(".chart-label").style = this.beneficiariesPercents>=100  ? "color: red" : "color: black" ;
        // this.template.querySelector(".beneficiaries-chart").style = this.beneficiariesPercents>=100  ? "border: solid 2px red" : "border: solid 2px #1e3870" ;
           
        //General


        if(this.totalbudget==0 && this.currentSum!=0){
            this.beneficiariesPercents =100;
        }else if(this.totalbudget==0 && this.currentSum==0){
            this.beneficiariesPercents =0;
        }else if(this.totalbudget!=0 && this.currentSum==0){
            this.beneficiariesPercents =0;
        }else if(this.totalbudget!=0 && this.currentSum!=0){
            if(this.totalbudget >= this.currentSum){
                this.beneficiariesPercents = ( this.currentSum / this.totalbudget)*100;
            }else{
                this.beneficiariesPercents =100;
            }    
        }

        //fual
        if(this.totalFuelBudget==0 && this.fuelSum!=0){
            this.beneficiariesPercentsFuel =100;
        }else if(this.totalFuelBudget==0 && this.fuelSum==0){
            this.beneficiariesPercentsFuel =0;
        }else if(this.totalFuelBudget!=0 && this.fuelSum==0){
            this.beneficiariesPercentsFuel =0;
        }else if(this.totalFuelBudget!=0 && this.fuelSum!=0){
            if(this.totalFuelBudget >= this.fuelSum){
                this.beneficiariesPercentsFuel = ( this.fuelSum / this.totalFuelBudget)*100;
            }else{
                this.beneficiariesPercentsFuel =100;
            }    
        }


        // let Stringgg='width:'+this.beneficiariesPercentsFuel.toString()+'%';
        //this.template.querySelector(".fuel-sum-class").style =(this.beneficiariesPercentsFuel==0 )? 'width:1px' : Stringgg ;

        
        // this.template.querySelector(".fuel-sum-class").style.setProperty("--percents-fuel",this.beneficiariesPercentsFuel.toString()+'%');
        // this.template.querySelector(".fuel-sum-class").style.setProperty("--percents-color",'rgb('+(this.beneficiariesPercentsFuel/100)*255+','+((100-this.beneficiariesPercentsFuel)/100)*255+','+((100-this.beneficiariesPercentsFuel)/100)*255+')');
        // console.log('testt :'+'rgb('+(this.beneficiariesPercentsFuel/100)*255+','+((100-this.beneficiariesPercentsFuel)/100)*255+','+((100-this.beneficiariesPercentsFuel)/100)*255+')');
        //this.beneficiariesPercentsFuel =  Number(String(this.beneficiariesPercentsFuel).substring(0, 5));

    }

    menusOpenOrClose(){
        this.openMenus =(this.openMenus=='slds-dropdown-trigger slds-dropdown-trigger_click')?'slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open':'slds-dropdown-trigger slds-dropdown-trigger_click';
        if(this.openMenus=='slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'){
            this.effectIcon = 'effect-icon-class-after-click';
        }else{
            this.effectIcon = 'effect-icon-class-before-click';
        }    
    }

    clickTotalInMenu(){
        //Close Fuel
        this.displaySum="";
        this.displayfuelSum="demo-only demo-only--sizing slds-grid slds-wrap display-none";
        this.menusOpenOrClose(); 
    }
    
    clickFuelMenu(){
        //Close Total
        this.displayfuelSum="demo-only demo-only--sizing slds-grid slds-wrap";
        this.displaySum="display-none";
        this.menusOpenOrClose(); 
    }

    menusClose(){
        this.openMenus =(this.openMenus=='slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open')?'slds-dropdown-trigger slds-dropdown-trigger_click':'slds-dropdown-trigger slds-dropdown-trigger_click';
        this.effectIcon = 'effect-icon-class-before-click';
    }
    

    //The Enimation Of Plus Year - Starts Here
    plusYearButtonAfterClick(){
        this.template.querySelector(".handle-plus-year").style.setProperty("--plus-year-style",'rgb(64, 64, 164,0.6)');
        this.plusYearButtonTimer();
    }

    plusYearButtonTimer(){
        clearTimeout(this.timeoutIdPlusYear); // no-op if invalid id
        this.timeoutIdPlusYear = setTimeout(this.plusYearButtonBeforeClick.bind(this), 100); // Adjust as necessary
    }

    plusYearButtonBeforeClick(){
            this.template.querySelector(".handle-plus-year").style.setProperty("--plus-year-style",'rgb(64, 64, 164)');
    }
    //The Enimation Of Plus Year - Ends Here

    //The Enimation Of Minus Year - Starts Here
    minusYearButtonAfterClick(){
        this.template.querySelector(".handle-minus-year").style.setProperty("--minus-year-style",'rgb(64, 64, 164,0.6)');
        this.minusYearButtonTimer();
    }

    minusYearButtonTimer(){
        clearTimeout(this.timeoutIdPlusYear); // no-op if invalid id
        this.timeoutIdPlusYear = setTimeout(this.minusYearButtonBeforeClick.bind(this), 100); // Adjust as necessary
    }

    minusYearButtonBeforeClick(){
            this.template.querySelector(".handle-minus-year").style.setProperty("--minus-year-style",'rgb(64, 64, 164)');
    }
    //The Enimation Of Minus Year - Ends Here

        //The Enimation Of Plus Month - Starts Here
        plusMonthButtonAfterClick(){
            this.template.querySelector(".handle-plus-month").style.setProperty("--plus-month-style",'rgb(64, 64, 164,0.6)');
            this.plusMonthButtonTimer();
        }
    
        plusMonthButtonTimer(){
            clearTimeout(this.timeoutIdPlusYear); // no-op if invalid id
            this.timeoutIdPlusYear = setTimeout(this.plusMonthButtonBeforeClick.bind(this), 100); // Adjust as necessary
        }
    
        plusMonthButtonBeforeClick(){
                this.template.querySelector(".handle-plus-month").style.setProperty("--plus-month-style",'rgb(64, 64, 164)');
        }
        //The Enimation Of Plus Month - Ends Here
    
        //The Enimation Of Minus Month - Starts Here
        minusMonthButtonAfterClick(){
            this.template.querySelector(".handle-minus-month").style.setProperty("--minus-month-style",'rgb(64, 64, 164,0.6)');
            this.minusMonthButtonTimer();
        }
    
        minusMonthButtonTimer(){
            clearTimeout(this.timeoutIdPlusYear); // no-op if invalid id
            this.timeoutIdPlusYear = setTimeout(this.minusMonthButtonBeforeClick.bind(this), 100); // Adjust as necessary
        }
    
        minusMonthButtonBeforeClick(){
                this.template.querySelector(".handle-minus-month").style.setProperty("--minus-month-style",'rgb(64, 64, 164)');
        }
        //The Enimation Of Minus Month - Ends Here
 
        TestModal(){
                          //c/collectionReportDatatable

                          

            this.topFunction();


            clearTimeout(this.timeoutId); // no-op if invalid id
            this.timeoutId = setTimeout(this.doExpensiveThing.bind(this), 500); // Adjust as necessary


                          

                          //c/collectionReportDatatable
        }

        doExpensiveThing() {
            // Do something here
            window.postMessage('showBudgetModal', '*')
        }

}