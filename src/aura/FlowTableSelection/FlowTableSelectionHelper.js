({
	doInit : function (component, event, helper) {
	 let action = component.get('c.getRecordsToDisplayInTable');
        action.setParams({
            sobject_name: component.get('v.ObjectAPIName'),
            field_set_name: component.get('v.FieldSetName'),
            where_clause: component.get('v.WhereClause')
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){
                let apex_method_result = response.getReturnValue();
                if(apex_method_result.Success){
					if(apex_method_result.TableRows.length != 0){
						component.set("v.NoRecords", false);
						component.set("v.FieldLabels", apex_method_result.FieldLabels);
						component.set("v.TableRows", apex_method_result.TableRows);
					}
                } else {
                    helper.handleError(component, apex_method_result.ErrorMessage);
                }
            } else if(state === 'ERROR'){
                helper.handleError(component, response.getError());
            }
        });
        $A.enqueueAction(action);
    },

	handleError : function (component,error) {
		component.set("v.NoRecordsMessage", error);
	}
})