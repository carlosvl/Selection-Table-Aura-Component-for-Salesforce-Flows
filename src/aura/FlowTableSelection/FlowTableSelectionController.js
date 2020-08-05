({
	doInit : function (component, event, helper) {
		helper.doInit(component, event, helper);
	}, 

	handleRadioClick : function (component, event, helper) {
		let selected_record_id = event.getSource().get('v.value');
		component.set('v.SelectedRecordId', selected_record_id);
	},
 
    handleCheckBoxClick : function (component, event, helper) {
		let selected_record_id = event.getSource().get('v.value');
        let current_selected_ids = component.get('v.SelectedRecordId');
        if (helper.isListEmpty(current_selected_ids)) {
            component.set('v.SelectedRecordId', selected_record_id);
        } else if (helper.checkIfListContainSelectedId(current_selected_ids, selected_record_id)) {
            helper.handleListContainsSelectedId(component,current_selected_ids,selected_record_id);
        } else if (!current_selected_ids.includes(selected_record_id)) {
            component.set('v.SelectedRecordId', current_selected_ids + ',' + selected_record_id);
        }
	},
    
    first : function(component, event, helper) {
        let pagination_list = component.get("v.TableRows");
        let page_size = component.get("v.PageSize");
        component.set('v.PaginationRows',pagination_list.slice(0,page_size));
        component.set("v.Start",0);
        component.set("v.End",page_size);
	},
    
    last : function(component, event, helper) { 
        let pagination_list = component.get("v.TableRows");
        let page_size = component.get("v.PageSize");
        let total_size = component.get("v.TotalSize");
        component.set('v.PaginationRows',pagination_list.slice(total_size-page_size,total_size));
        component.set("v.Start",total_size-page_size);
        component.set("v.End",total_size);
	},
    
    next : function(component, event, helper) {
        let pagination_list =  component.get("v.TableRows");
        let total_size = component.get("v.TotalSize");
        let page_size = component.get("v.PageSize");
        let end_of_current_list = component.get("v.End");
        let new_end_value = end_of_current_list + page_size;
        component.set("v.Start",end_of_current_list);
        return (new_end_value > total_size) ? helper.handleEndValueGreaterThanTotal(component,total_size,pagination_list,end_of_current_list) : 
        helper.handleEndValueLessThanTotal(component,new_end_value,pagination_list,end_of_current_list);
	},
    
    previous : function(component, event, helper) {
        let pagination_list =  component.get("v.TableRows");
        let page_size = component.get("v.PageSize");
        let start_of_current_list = component.get("v.Start");
        let new_start_value = start_of_current_list - page_size;
        component.set("v.End",start_of_current_list);
        return (new_start_value < 0) ? helper.handleStartValueLessThanZero(component,pagination_list,start_of_current_list) :
        helper.handleStartValueGreaterThanZero(component,new_start_value,pagination_list,start_of_current_list);
	}, 
    
    searchkey : function(component, event, helper) {
        helper.searchQuoteList(component, event, helper);
    },
    
    sortByFunction : function(component, event, helper) {
        let selected_column = event.target.dataset.index;
        helper.sortList(component,selected_column);
    },
})