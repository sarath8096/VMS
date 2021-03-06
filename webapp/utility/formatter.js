jQuery.sap.declare("com.incture.VMS.utility.formatter");
com.incture.VMS.utility.formatter = {
	//Function to display change color of button based on status of task
	changeColor: function (sValue) {
		this.removeStyleClass("textGreen textRed textlightBlue");
		if (sValue === "checked-in") {
			this.addStyleClass("textGreen");
		} else if (sValue === "checked-out") {
			this.addStyleClass("textRed");
		} else {
			this.addStyleClass("textlightBlue");
		}
		return sValue;
	},
	changeColorDelivery: function (sValue) {
		this.removeStyleClass("textGreen textRed textlightBlue");
		if (sValue === "Delivered") {
			this.addStyleClass("textGreen");
		} else if (sValue === "Not Delivered") {
			this.addStyleClass("textRed");
		} else {
			this.addStyleClass("textlightBlue");
		}
		return sValue;
	},
	changeColorParking: function (sValue) {
		this.removeStyleClass("textGreen textRed textlightBlue");
		if (sValue === "Available") {
			this.addStyleClass("textGreen");
		} else {
			this.addStyleClass("textRed");
		}
		return sValue;
	},
	changeColorRoomsavailable: function (sValue) {
		this.removeStyleClass("textGreen textRed textlightBlue");
		if (sValue === "Available") {
			this.addStyleClass("textGreen");
		} else if (sValue === "In Use") {
			this.addStyleClass("textRed");
		} else {
			this.addStyleClass("textlightBlue");
		}
		return sValue;
	},
	changeColorUpcomingMeetings: function (sValue) {
		this.removeStyleClass("textGreen textRed textlightBlue");
		if (sValue === "accepted") {
			this.addStyleClass("textGreen");
		} else if (sValue === "Rejected") {
			this.addStyleClass("textRed");
		} else {
			this.addStyleClass("textlightBlue");
		}
		return sValue;
	},
	displayDateFormat: function (sValue) {
		sValue = sValue - 19800000;
		var date = new Date(sValue);
		// var date2= date.toUTCString();
		var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "MMM dd, yyyy HH:mm"
		});
		date = oDateFormat.format(date);
		sValue = date.toString();
		return sValue;
	},
	buttonVisibility: function (sValue) {
			if (sValue === "checked-out") {
				return true;
			}
			if (sValue === "BlackListed") {
				return false;
			}
		}
		//Function to display colour based on the status of delivery

};