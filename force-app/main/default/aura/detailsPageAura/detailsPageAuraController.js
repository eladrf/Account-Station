({
    doInit : function(component, event, helper) {
        var recordId = component.get('v.recordId');
    },
    
     handleCloseTab: function(component) {
        console.log('detailPageAura');
        var workspaceAPI = component.find("workspace");
        if(workspaceAPI){
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({tabId: focusedTabId});
            })
            .catch(function(error) {
                console.log(error);
            });
        }else{
            eval("$A.get('e.force:refreshView').fire();");
        }
    },
    closeQuickActionWindow : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
        eval("$A.get('e.force:refreshView').fire();");
    }
})
