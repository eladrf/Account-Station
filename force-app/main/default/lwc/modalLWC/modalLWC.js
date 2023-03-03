import { LightningElement } from 'lwc';

import desktop from './desktop.html';
import mobile from './mobile.html';

import { isMobile} from 'c/portalUtils';

export default class ModalLWC extends LightningElement {


    handleClose(){
        console.log('modaleLWC');
        this.dispatchEvent(new CustomEvent('closewindow'));    
    }

    render() {
        //return isMobile() ? mobile : desktop;
        return isMobile() ? true : true;
    }

    renderedCallback(){
        //this.onChangeHandler();
    }    

    timeoutId;
    onChangeHandler() {
        clearTimeout(this.timeoutId); // no-op if invalid id
        this.timeoutId = setTimeout(this.doExpensiveThing.bind(this), 500); // Adjust as necessary
    }
    doExpensiveThing() {
        window.location.reload();
    }
}