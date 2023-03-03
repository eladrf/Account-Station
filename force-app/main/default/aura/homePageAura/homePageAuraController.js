({


    doInit : function(component, event, helper) {
        console.log(' init log ');


        window.addEventListener("message", function(event) {
            console.log('123123123');
            console.log('event :',event);
            console.log('event.data :'+event.data);

            //component.get("v.showBudgetModal")
            if(event.data=='showBudgetModal'){

                component.set("v.showBudgetModal", true);

            }

            if(event.data=='showChartPage'){

                component.set("v.showChartPage", true);

            }


            
            if(event.data=='hideChartPage'){

                component.set("v.showChartPage", false);

            }


            

          });


          var url = $A.get('$Resource.background');
          component.set('v.backgroundImageURL', url);

    },

    myAction : function(component, event, helper) {
        
    },

    //invoked when the model in the child aura is closed
    handleComponentEvent : function(component, event, helper) {
        var valueFromChild = event.getParam("message");
        //alert(valueFromChild)
        console.log("v.enteredValue : "+ valueFromChild);
        component.set("v.showBudgetModal", false);

        component.set("v.showDetailsPage", true);
        
        component.set("v.showHomePage", false);

        //here
    }

    
})
