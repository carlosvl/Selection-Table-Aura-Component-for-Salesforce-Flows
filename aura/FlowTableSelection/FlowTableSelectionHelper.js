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
                if (apex_method_result.Success) {
					if (apex_method_result.TableRows.length != 0) {
						component.set("v.NoRecords", false);
						component.set("v.FieldLabels", apex_method_result.FieldLabels);
						component.set("v.TableRows", apex_method_result.TableRows);
                        component.set("v.FullListRows", apex_method_result.TableRows);
                        component.set("v.TotalSize",component.get("v.TableRows").length);
                        component.set("v.SelectedColumn", apex_method_result.FieldLabels[0]);
                		component.set("v.Start",0);
                		component.set("v.End",component.get("v.PageSize"));
                        if (component.get("v.Pagination")) {
                            component.set('v.PaginationRows', apex_method_result.TableRows.slice(0,component.get("v.PageSize")));
                        }
                        if (component.get("v.Sorting")) {
            				this.sortList(component,0);
            			}
					}
                } else {
                    helper.handleError(component, apex_method_result.ErrorMessage);
                }
            } else if (state === 'ERROR'){
                helper.handleError(component, response.getError());
            }
        });
        $A.enqueueAction(action);
    }, 

	handleError : function (component,error) {
		component.set("v.NoRecordsMessage", error);
	}, 
    
    searchQuoteList : function (component, event, helper) {
        let self = this;
        let search_key = component.get("v.searchKey");
	 	let full_rowlist = component.get('v.TableRows'); 
        let filtered_list = [];
        if (search_key != "") {
            for (var i = 0; full_rowlist.length; i++) {
            	let quote_name = full_rowlist[i].Fields[0].Value;
            	if (quote_name.toLowerCase().indexOf(search_key.toLowerCase()) > -1) {
                	filtered_list.push(full_rowlist[i]);
            	}
                if (i == full_rowlist.length -1) {
                    self.setSearchResults(component,filtered_list);
                }
        	}
        } else {
            self.resetSearchList(component,full_rowlist);
        }
    }, 
    
    sortList : function (component,selected_column) {
        let self = this;
        let column_headers = component.get("v.FieldLabels");
        let full_list_rows = component.get("v.TableRows");
        let sort_order = component.get("v.IsSortAscending");
        full_list_rows.sort(function(a, b) {
            if (a.Fields[selected_column].FieldType == 'DATE') {
                let formatted_dateA = self.formatDateMethod(a.Fields[selected_column].Value);
                let date_value1 = new Date(formatted_dateA);
                let formatted_dateB = self.formatDateMethod(b.Fields[selected_column].Value);
                let date_value2 = new Date(formatted_dateB);
                return (sort_order == false) ? date_value1 - date_value2 : date_value2 - date_value1;
            } else if (a.Fields[selected_column].FieldType == 'CURRENCY') {
                let currencyA = a.Fields[selected_column].Value;
            	let currencyB = b.Fields[selected_column].Value;
                return (sort_order == false) ? parseFloat(currencyA) - parseFloat(currencyB) : parseFloat(currencyB) - parseFloat(currencyA);
            } else {
                let textA = a.Fields[selected_column].Value.toLowerCase().replace(' ', '');
            	let textB = b.Fields[selected_column].Value.toLowerCase().replace(' ', '');
                return (sort_order == false) ? (textA < textB) ? -1 : (textA > textB) ? 1 : 0 : 
                (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            }
		});
        self.setSortResults(component,sort_order,full_list_rows,column_headers,selected_column);
    }, 
    
    formatDateMethod : function (currentDate) {
        let year = currentDate.substring(6, 10);
        let month = currentDate.substring(3, 5);
        let day = currentDate.substring(0, 2);
        let formatted_date = year+'-'+month+'-'+day;
        return formatted_date;
    },
    
    isListEmpty : function (current_selected_ids) {
        if (current_selected_ids === undefined || current_selected_ids === '') {
            return true;
        } else {
            return false;
        }
    },
    
    checkIfListContainSelectedId : function (current_selected_ids,selected_record_id) {
        if (current_selected_ids.includes(selected_record_id)) {
            return true;
        } else {
            return false;
        }
        
    },
    
    handleListContainsSelectedId : function (component,current_selected_ids,selected_record_id) {
        if (current_selected_ids == selected_record_id) {
            component.set('v.SelectedRecordId', '');
        } else {
            this.handleListHasMultipleIds(component,current_selected_ids,selected_record_id);
        }
    },
    
    handleListHasMultipleIds : function (component,current_selected_ids,selected_record_id) {
        let new_selected_id = current_selected_ids.replace(selected_record_id,'');
        if (this.isStartOfListInvalid(new_selected_id)) {
                component.set('v.SelectedRecordId', new_selected_id.slice(1));
        } else {
            this.checkRemainingList(component,new_selected_id);
        } 
    },
    
    checkRemainingList : function(component,new_selected_id) {
        if (this.isEndOfListInvalid(new_selected_id)) {
            component.set('v.SelectedRecordId', new_selected_id.slice(0,-1));
        } else if (new_selected_id.includes(',,')){
            component.set('v.SelectedRecordId', new_selected_id.replace(',,',','));
        } else {
            component.set('v.SelectedRecordId', new_selected_id);
        }
    },
    
    isStartOfListInvalid : function(new_selected_id) {
        if (new_selected_id.charAt(0) == ',') {
            return true;
        } else {
            return false;
        }
    },
    
    isEndOfListInvalid : function(new_selected_id) {
        if (new_selected_id[new_selected_id.length -1] == ',') {
            return true;
        } else {
            return false;
        }
    },
    
    handleEndValueGreaterThanTotal : function(component,total_size,pagination_list,end_of_current_list) {
        component.set("v.End",total_size);
        component.set('v.PaginationRows',pagination_list.slice(end_of_current_list,total_size));
    },
    
    handleEndValueLessThanTotal : function(component,new_end_value,pagination_list,end_of_current_list) {
        component.set("v.End",new_end_value);
        component.set('v.PaginationRows',pagination_list.slice(end_of_current_list,new_end_value));
    },
    
    handleStartValueLessThanZero : function (component,pagination_list,start_of_current_list) {
        component.set("v.Start",0);
        component.set('v.PaginationRows',pagination_list.slice(0,start_of_current_list));
    }, 
    
    handleStartValueGreaterThanZero : function (component,new_start_value,pagination_list,start_of_current_list) {
        component.set("v.Start",new_start_value);
        component.set('v.PaginationRows',pagination_list.slice(new_start_value,start_of_current_list));
    },
    
    setSearchResults : function (component,filtered_list) {
        component.set("v.Start",0);
        component.set("v.End",component.get("v.PageSize")); 
        if (component.get("v.Pagination")) {
            component.set('v.PaginationRows', filtered_list);
        	component.set("v.TotalSize",component.get("v.PaginationRows").length); 
        } else {
            component.set('v.TableRows', filtered_list);
        	component.set("v.TotalSize",component.get("v.TableRows").length);
        }
    },
    
    resetSearchList : function (component,full_rowlist) {
        component.set("v.TotalSize",component.get("v.TableRows").length);
        component.set("v.Start",0);
      	component.set("v.End",component.get("v.PageSize"));
        if (component.get("v.Pagination")) {
            component.set("v.PaginationRows", full_rowlist.slice(0,component.get("v.PageSize")));
        } else {
            component.set('v.TableRows', component.get('v.FullListRows'));
        }
    },
    
    setSortResults : function (component,sort_order,full_list_rows,column_headers,selected_column) {
        if (sort_order == false) {
            component.set("v.IsSortAscending", true);
        } else {
            component.set("v.IsSortAscending", false);
        }
        component.set("v.TotalSize", full_list_rows.length);
        component.set("v.Start",0);
      	component.set("v.End",component.get("v.PageSize"));
        component.set("v.SelectedColumn", column_headers[selected_column]);
        if (component.get("v.Pagination")) {
        	component.set('v.PaginationRows', full_list_rows.slice(0,component.get("v.PageSize")));
        } else {
            component.set('v.TableRows', full_list_rows);
        }
    }
})