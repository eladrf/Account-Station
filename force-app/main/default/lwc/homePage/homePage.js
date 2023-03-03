import { LightningElement , api , wire} from 'lwc';


//c/customBar

import { getListUi } from 'lightning/uiListApi';

//c/customBar



//For Mobile Desktop HTML Display
import desktop from './desktop.html';
import mobile from './mobile.html';
import { isMobile} from 'c/portalUtils';//portalUtils Class

import PAGE_DETAILS from '@salesforce/contentAssetUrl/DetailsPage';

//test table mobile

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
];

//test table mobile


export default class HomePage extends LightningElement {

    //chart=false;

    lastDay=0;
    day=33;
    daysLeftForMonth=0;
    detailsPageClass="slds-box slds-box_x-small slds-text-align_center slds-m-around_x-small background-color"
    detailsPageClass2="slds-box slds-box_x-small slds-text-align_center slds-m-around_x-small background-color"
    timeoutIdPlusYear;
    menuClass="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click"
    @api showDetailsPage;
    @api showHomePage ;
    dtailsPagePicture = PAGE_DETAILS;


    renderedCallback(){
        this.year= new Date().getFullYear();
        this.month= new Date().getMonth()
        const d = new Date();
        this.day=d.getDate();


        //var date = new Date();
        //var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.lastDay = new Date(this.year, this.month, 0).getDate();

        this.daysLeftForMonth=this.lastDay - this.day;

        console.log('showDetailsPage : '+this.showDetailsPage);

;

    }    
    
    handleDetailsPage(){
        
        this.detailsPageAfterClick();
    }

    handleChartPage(){
        
        //this.detailsPageAfterClick();
        //this.chart=true;

        window.postMessage('showChartPage', '*');
        this.showHomePage=false;


    }

    render() {
        return isMobile() ? mobile : desktop;
    }

    handleHomeButton(){
        this.showDetailsPage=false;
        this.showHomePage=true;


        window.postMessage('hideChartPage', '*');


        this.handleCloseMenu();
    }

    handleMenu(){
        if(this.menuClass=="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click"){
            this.menuClass="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"
        }else if(this.menuClass=="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"){
            this.menuClass="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click"
        }
        
    }

    handleCloseMenu(){
        if(this.menuClass=="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"){
            this.menuClass="slds-grid slds-dropdown-trigger slds-dropdown-trigger_click"
        }
        
    }

    //button css
    detailsPageAfterClick(){
        this.detailsPageClass="slds-box slds-box_x-small slds-text-align_center slds-m-around_x-small background-colorr"
        this.detailsPageTimer();
    }

    detailsPageTimer(){
        clearTimeout(this.timeoutIdPlusYear); // no-op if invalid id
        this.timeoutIdPlusYear = setTimeout(this.detailsPageBeforeClick.bind(this), 50); // Adjust as necessary
    }

    detailsPageBeforeClick(){
            this.detailsPageClass="slds-box slds-box_x-small slds-text-align_center slds-m-around_x-small background-color"
            this.showDetailsPage=true;
            this.showHomePage=false;
    }




    ///c/customBar



    @wire(getListUi, { objectApiName: 'Contact', listViewApiName: 'All_Contacts' })
    wiredContacts({ error, data }) {
        if (data) {
            let records = [];
            data.records.forEach((record) => {
                let formattedRecord = {};
                formattedRecord['id'] = record.Id;
                formattedRecord['Name'] = record.fields.Name.value;
                formattedRecord['Phone'] = record.fields.Phone.value;
                formattedRecord['Email'] = record.fields.Email.value;
                records.push(formattedRecord);
            });
            this.data = records;
        } else if (error) {
            console.error(error);
        }
    }

    handleRowAction(event) {
        const recordId = event.detail.row.id;
        // Handle row actions here
    }


    ///c/customBar



}