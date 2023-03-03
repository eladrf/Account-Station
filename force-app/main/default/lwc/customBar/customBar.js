import { LightningElement , api } from 'lwc';

export default class CustomBar extends LightningElement {


    @api sum;
    @api totalBudget;
    @api percents;
    @api category;
    newPpercents;


    renderedCallback() {
        console.log('Sum : '+this.sum);
        console.log('totalBudget : '+this.totalBudget);
        console.log('Percents : '+this.percents);


        this.template.querySelector(".fuel-sum-class").style.setProperty("--percents-fuel",this.percents.toString()+'%');
        this.template.querySelector(".fuel-sum-class").style.setProperty("--percents-color",'rgb('+(this.percents/100)*255+','+((100-this.percents)/100)*255+','+((100-this.percents)/100)*255+')');

        this.newPpercents =  Number(String(this.percents).substring(0, 5));
    }
}