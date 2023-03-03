({
    doInit: function(cmp) {
        window.setTimeout(
            $A.getCallback(function() {
                cmp.set("v.visible", false);
            }), 3000
        );
    },


    myAction : function(component, event, helper) {

    },

    closeFlowModal :  function(component, event, helper) {
        console.log('CPPPPP1');
        var compEvent = component.getEvent("sampleComponentEvent");
        compEvent.setParams({
            "message" : "TestttttttttttEvent" 
        });
        compEvent.fire();
    },

    handleSuccess: function(component, event) {
        // var updatedRecord = JSON.parse(JSON.stringify(event.getParams()));
        // console.log('onsuccess: ', updatedRecord.id);
        console.log('New budget');

        var a = component.get('c.closeFlowModal');
        $A.enqueueAction(a);
    },

    update : function(component,event,helper) {
        component.find("editForm").submit();
    },

    handleLoad : function(component,event,helper) {
        // let index =1;
        // component.set('v.showSpinner',false);
        // for (let i = 0; i < 9; i++) {
        //     if(index==1){
        //         component.set('v.Strength',"Strength: 1" );
        //         index++;
        //     }else if (index==2) {
        //         component.set('v.Strength',"Strength: 2");
        //         index++;
        //     }else if (index==3){
        //         component.set('v.Strength',"Strength: 3");
        //         index=1;
        //     }
        //   }


          //$A



          //$A

    },


    showSpinner: function(component, event, helper) {
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    hideSpinner: function(component, event, helper) {
        var spinner = component.find("spinner");
        $A.util.addClass(spinner, "slds-hide");
    }


})
