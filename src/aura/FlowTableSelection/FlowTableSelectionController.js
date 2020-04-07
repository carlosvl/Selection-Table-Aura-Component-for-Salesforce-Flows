({
	doInit : function (component, event, helper) {
		helper.doInit(component, event, helper);
	},

	handleRadioClick : function (component, event, helper) {
		let selected_record_id = event.getSource().get('v.value');
		component.set('v.SelectedRecordId', selected_record_id);
	}
})