sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"../utility/formatter"
], function (Controller, MessageToast, UIComponent, MessageBox, Fragment, JSONModel, formatter) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Security", {
		formatter: formatter,
		onInit: function () {
			var comboData = {
				"sSelect": "",
				"CheckedInVisibility": true,
				"CheckedOutVisibility": false,
				"YetToVisitVisibility": false
			};
			var oModel1 = new JSONModel(comboData);
			this.getView().setModel(oModel1, "oViewModel");
			var oSecurityModel = this.getOwnerComponent().getModel("oSecurityModel");
			var oDeliveryData = {
				"date": "",
				"deliveryType": "",
				"mobileNo": ""

			};
			oSecurityModel.setProperty("/oDeliveryData", oDeliveryData);
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var date = new Date();
			var newdate = oDateFormat.format(date);
			oSecurityModel.setProperty("/date", newdate);
			var signature = {
				"sSelectedKey": "",
			};
			var oModel = new JSONModel(signature);
			this.getView().setModel(oModel, "oSignatureModel");
			var sUrl1 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + newdate;
			this.fndoajax(sUrl1, "/Details");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=6&Date=" + newdate;
			console.log(sUrl2);
			this.fndoajax(sUrl2, "/CheckInDetails");
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=6&Date=" + newdate;
			console.log(sUrl3);
			this.fndoajax(sUrl3, "/CheckOutDetails");
			var sUrl4 = "/VMS/rest/visitorController/getExpectedVisitors?date=" + newdate;
			this.fndoajax(sUrl4, "/ExpectedVisitorDetails");

			var sUrl5 = "/VMS/rest/blackListController/selectAllBlackList";
			this.fndoajax(sUrl5, "/BlackListed");
			var sUrl6 = "/VMS/rest/parcelController/getRecentDelivery?date=" + newdate;
			this.fndoajax(sUrl6, "/DeliveryDetails");
			var sUrl7 = "/VMS/rest/employeeController/listAllEmployee";
			this.fndoajax(sUrl7, "/EmployeesList");
			var eId = 6;
			var sUrl9 = "/VMS/rest/visitorController/notificationCounter?eId=" + eId;
			var count;
			$.ajax({
				url: sUrl9,
				data: null,
				async: true,
				headers: {
					dataType: "json",
					contentType: "application/json; charset=utf-8"

				},
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
				},
				success: function (data) {
					// sap.m.MessageToast.show("Data Successfully Loaded");
					console.log(data);
					count = data.data;
					var countupdated = count.toString();
					oSecurityModel.setProperty("/Notificationcount", countupdated);
					console.log(countupdated);
					console.log(oSecurityModel);

				},
				type: "GET"
			});
			console.log(oSecurityModel);

			var sUrl8 = "wss://vmsprojectp2002479281trial.hanatrial.ondemand.com/vmsproject/chat/" + eId;
			var that = this;
			// var sUrl1 = "/VMS_Service/chat/1";
			var webSocket = new WebSocket(sUrl8);
			webSocket.onerror = function (event) {
				// alert(event.data);

			};
			webSocket.onopen = function (event) {
				// alert(event.data);

			};
			webSocket.onmessage = function (event) {
				// alert(event.data);
				// console.log("Security");
				var jsonData = event.data;
				console.log(jsonData);
				var msg = JSON.parse(jsonData);
				if (msg.content !== "Connected!") {
					var count1 = oSecurityModel.getProperty("/Notificationcount");
					var count2 = parseInt(count1, 10);
					count2 = count2 + 1;
					var countupdated = count2.toString();
					oSecurityModel.setProperty("/Notificationcount", countupdated);
					MessageBox.information(msg.content);
					that.fndoajax(sUrl1, "/Details");
					that.fndoajax(sUrl2, "/CheckInDetails");
					that.fndoajax(sUrl6, "/DeliveryDetails");

				}

			};

		},
		onDate: function () {
			var oDialogb = new sap.m.BusyDialog();
			oDialogb.open();
			setTimeout(function () {
				oDialogb.close();
			}, 3000);
			var that = this;
			var date = that.getView().byId("date").getValue();
			console.log(date);
			var oSecurityModel = that.getOwnerComponent().getModel("oSecurityModel");
			oSecurityModel.setProperty("/date", date);
			var sUrl1 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			this.fndoajax(sUrl1, "/Details");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=6&Date=" + date;
			this.fndoajax(sUrl2, "/CheckInDetails");
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=6&Date=" + date;
			this.fndoajax(sUrl3, "/CheckOutDetails");
			var sUrl4 = "/VMS/rest/visitorController/getExpectedVisitors?date=" + date;
			this.fndoajax(sUrl4, "/ExpectedVisitorDetails");
			console.log(oSecurityModel);
		},

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},
		onPressImage: function () {

			this.getRouter().navTo("RouteHome");

		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onMenuPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		fnGetNotificationsData: function () {
			var oAdminModel = this.getOwnerComponent().getModel("oAdminModel");
			var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			// var eId = oAdminModel.getProperty("/userDetails").eId;
			var eId = 6;
			var sUrl = "/VMS/rest/visitorController/getAllNotifications?eId=" + eId;
			console.log(sUrl);
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				headers: {
					dataType: "json",
					contentType: "application/json; charset=utf-8"

				},
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
				},
				success: function (data) {
					// sap.m.MessageToast.show("Data Successfully Loaded");
					// console.log(data);
					oHostModel.setProperty("/notificationList", data);
					console.log(oHostModel);

				},
				type: "GET"
			});
		},
		onNotificationPress: function (oEvent) {
			var oSecurityModel = this.getView().getModel("oSecurityModel");
			this.fnGetNotificationsData();
			if (!this._oPopover1) {
				this._oPopover1 = sap.ui.xmlfragment("idNotifications", "com.incture.VMS.fragment.notification", this);
				this.getView().addDependent(this._oPopover1);
			}
			this._oPopover1.openBy(oEvent.getSource());
			var count = oSecurityModel.getProperty("/Notificationcount");
			count = "0";
			oSecurityModel.setProperty("/Notificationcount", count);
		},

		onItemClose: function (oEvent) {
			// var oSecurityModel = this.getView().getModel("oSecurityModel");
			var that = this;
			var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getBindingContextPath();
			var obj = oHostModel.getProperty(spath);
			var sUrl = "/VMS/rest/employeeController/close?nId=" + obj.nId;
			$.ajax({
				url: sUrl,
				type: "POST",
				data: null,

				dataType: "json",
				success: function (data, status, response) {
					that.fnGetNotificationsData();
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
		},
		// onAcceptPress: function (oEvent) {
		// 	var that = this;
		// 	var oHostModel = this.getView().getModel("oHostModel");
		// 	var oSource = oEvent.getSource();
		// 	var spath = oSource.getParent().getParent().getBindingContextPath();
		// 	var obj = oHostModel.getProperty(spath);
		// 	console.log(obj);
		// 	var dId = obj.dId;
		// 	var nId = obj.nId;
		// 	var mId = obj.mId;
		// 	// "mId": obj.mId,
		// 	// 	"action": "accept",
		// 	// 	"nId": obj.nId
		// 	if (obj.title === "Delivery Request") {
		// 		$.ajax({
		// 			url: "/VMS/rest/employeeController/acceptDelivery?dId=" + dId + "&nId=" + nId,
		// 			type: "POST",
		// 			data: null,
		// 			// data: {
		// 			// 	"dId": obj.dId,
		// 			// 	"nId": obj.nId
		// 			// },

		// 			dataType: "json",
		// 			contentType: "application/json; charset=utf-8",
		// 			success: function (data, status, response) {
		// 				if (data.status === 200) {
		// 					sap.m.MessageToast.show("Delivery Accepted");
		// 					that.fnGetNotificationsData();
		// 				} else if (data.status === 300) {
		// 					MessageBox.information("Your Delivery Needs Signature");
		// 				} else {
		// 					sap.m.MessageToast.show("Something Went Wrong");
		// 				}

		// 			},
		// 			error: function (e) {
		// 				sap.m.MessageToast.show("fail");

		// 			}
		// 		});
		// 	} else {
		// 		$.ajax({
		// 			url: "/VMS/rest/employeeController/acceptOnSpotVisitor?eId=5&mId=" + mId + "&comment=accept",
		// 			type: "POST",
		// 			data: null,
		// 			// data: {
		// 			// 	"mId": obj.mId,
		// 			// 	"action": "accept",
		// 			// 	"nId": obj.nId
		// 			// },

		// 			dataType: 'json',
		// 			contentType: "application/json; charset=utf-8",
		// 			success: function (data, status, response) {

		// 				if (data.status === 200) {
		// 					sap.m.MessageToast.show("Meeting Accepted");
		// 					that.fnGetNotificationsData();
		// 				} else {
		// 					sap.m.MessageToast.show("Something Went Wrong");
		// 				}

		// 			},
		// 			error: function (e) {
		// 				sap.m.MessageToast.show("fail");

		// 			}
		// 		});
		// 	}

		// 	that.fnGetNotificationsData();
		// },
		// onRejectPress: function (oEvent) {
		// 	var oHostModel = this.getView().getModel("oHostModel");
		// 	var oSource = oEvent.getSource();
		// 	var spath = oSource.getParent().getParent().getBindingContextPath();
		// 	var obj = oHostModel.getProperty(spath);
		// 	console.log(obj);
		// 	var dId = obj.dId;
		// 	var nId = obj.nId;
		// 	var mId = obj.mId;
		// 	if (obj.title === "Delivery Request") {
		// 		$.ajax({
		// 			url: "/VMS/rest/employeeController/acceptDelivery?dId=" + dId + "&nId=" + nId,
		// 			type: "POST",
		// 			data: null,
		// 			// data: {
		// 			// 	"dId": obj.dId,
		// 			// 	"nId": obj.nId
		// 			// },

		// 			dataType: "json",
		// 			contentType: "application/json; charset=utf-8",
		// 			success: function (data, status, response) {
		// 				sap.m.MessageToast.show("Delivery Rejected");
		// 			},
		// 			error: function (e) {
		// 				sap.m.MessageToast.show("fail");

		// 			}
		// 		});
		// 	} else {
		// 		$.ajax({
		// 			url: "/VMS/rest/employeeController/acceptOnSpotVisitor?eId=5&mId=" + mId + "&comment=reject",
		// 			type: "POST",
		// 			data: null,
		// 			// data: {
		// 			// 	"mId": obj.mId,
		// 			// 	"action": "reject",
		// 			// 	"nId": obj.nId
		// 			// },

		// 			dataType: 'json',
		// 			contentType: "application/json; charset=utf-8",
		// 			success: function (data, status, response) {
		// 				sap.m.MessageToast.show("Meeting Rejected");

		// 			},
		// 			error: function (e) {
		// 				sap.m.MessageToast.show("fail");

		// 			}
		// 		});
		// 	}

		// 	this.fnGetNotificationsData();
		// },
		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId("sideNavigationToggleButton");
			if (bLarge) {
				oToggleButton.setTooltip("Large Size Navigation");
			} else {
				oToggleButton.setTooltip("Small Size Navigation");
			}
		},
		onUserPress: function (oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("idUser", "com.incture.VMS.fragment.user", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
		},
		onCheckInPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(true);
			this.getView().byId("idCheckOutTable").setVisible(false);
			this.getView().byId("idYetToVisitTable").setVisible(false);

			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").addStyleClass("HomeStyleTile");
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var date = oSecurityModel.getProperty("/date");
			/*var sUrl1 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			this.fndoajax(sUrl1, "/Details");*/
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=6&Date=" + date;
			this.fndoajax(sUrl2, "/CheckInDetails");
		},
		onCheckOutPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(true);
			this.getView().byId("idYetToVisitTable").setVisible(false);

			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").addStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var date = oSecurityModel.getProperty("/date");
			/*var sUrl1 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			this.fndoajax(sUrl1, "/Details");*/
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=6&Date=" + date;
			this.fndoajax(sUrl3, "/CheckOutDetails");
		},
		onYetToVisitPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(false);
			this.getView().byId("idYetToVisitTable").setVisible(true);

			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").addStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
		},
		onAddToBlacklist: function (oEvent) {
			var that = this;
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var oSource = oEvent.getSource();
			oSecurityModel.setProperty("/BlackListedSource", oSource);
			var spath = oSource.getParent().getBindingContextPath();
			oSecurityModel.setProperty("/BlackListedPath", spath);
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idaddBlackListVisitorFrag", "com.incture.VMS.fragment.addBlackListVisitor", this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog);
			that._oDialog.open();
		},
		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		onConfirmBlackList: function () {
			var that = this;
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var date = oSecurityModel.getProperty("/date");
			var sUrl1 = "/VMS/rest/blackListController/selectAllBlackList";
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=6&Date=" + date;
			var sUrl3 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			var spath = oSecurityModel.getProperty("/BlackListedPath");
			console.log(spath);
			var obj = oSecurityModel.getProperty(spath);
			console.log(obj);
			var sRemarks = Fragment.byId("idaddBlackListVisitorFrag", "idTarea").getValue();
			var payload = {
				"meetingId": obj.mid,
				"visitorId": obj.visitorId,
				"employeeId": 6,
				"reason": sRemarks
			};
			$.ajax({
				url: "/VMS/rest/blackListController/addBlackList",
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully BlackListed");

					console.log(response);
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					var oDialogb = new sap.m.BusyDialog();
					oDialogb.open();
					setTimeout(function () {
						oDialogb.close();
					}, 3000);
					that.fndoajax(sUrl2, "/CheckOutDetails");
					that.fndoajax(sUrl1, "/BlackListed");
					that.fndoajax(sUrl3, "/Details");
					// oSource.setEnabled(false);
					if (data.status === 300) {
						MessageBox.warning("Already Blacklisted");
					}

				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
		},
		onPressUnblock: function (oEvent) {
			var sUrl = "/VMS/rest/blackListController/selectAllBlackList";
			var that = this;
			var oSecurityModel = that.getOwnerComponent().getModel("oSecurityModel");
			var date = oSecurityModel.getProperty("/date");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + date;
			var sUrl3 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			var oTableModel = this.getView().byId("idCheckOutTable").getModel("oSecurityModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getParent().getBindingContextPath();
			var obj = oSecurityModel.getProperty(spath);
			var bId = obj.bId;
			$.ajax({
				url: "/VMS/rest/blackListController/removeFromBlackList?id=" + bId,
				type: "POST",
				data: null,
				dataType: 'json',
				success: function (data, status, response) {
					console.log(data);
					sap.m.MessageToast.show("Successfully Unblocked");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					that.fndoajax(sUrl, "/BlackListed");
					that.fndoajax(sUrl2, "/CheckOutDetails");
					that.fndoajax(sUrl3, "/Details");
					oTableModel.refresh();
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});

		},
		onSendAlertPress: function () {
			this.bFlag = true;
			if (!this._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("idsendAlertFragAdmin", "com.incture.VMS.fragment.sendAlert", this); // Instantiating the Fragment
			}
			this.getView().addDependent(this._oDialog); // Adding the fragment to your current view
			this._oDialog.open();
		},
		onSendEvacuation: function () {
			var that = this;
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var aSelectedPaths = that.getView().byId("idSecurityEvacuationtable").getSelectedContextPaths();
			var aSelectedPathsHosts = that.getView().byId("idEmoloyeestable").getSelectedContextPaths();

			var sMessage = Fragment.byId("idsendAlertFragAdmin", "idtarea").getValue();

			var aEmailList = [];
			var aEmailListHost = [];
			var item;
			var item2;
			var item3;
			for (var i = 0; i < aSelectedPaths.length; i++) {
				item = aSelectedPaths[i];
				var obj = oSecurityModel.getProperty(item);
				aEmailList.push(obj.visitorEmail);
				console.log(obj.visitorEmail);

			}
			for (var j = 0; j < aSelectedPathsHosts.length; j++) {
				item2 = aSelectedPathsHosts[j];
				var obj2 = oSecurityModel.getProperty(item2);
				aEmailListHost.push(obj2.employeeEmail);
				console.log(obj2.employeeEmail);

			}
			console.log(aEmailListHost);
			for (var k = 0; k < aEmailListHost.length; k++) {
				item3 = aEmailListHost[k];
				aEmailList.push(item3);
			}
			// aEmailList.push(aEmailListHost);
			console.log(aEmailList);
			var payload = {
				"emailList": aEmailList,
				"message": sMessage
					// "alertType": sType
			};
			console.log(JSON.stringify(payload));
			// var oTokenModel = that.getView().getModel("oTokenModel");
			// var oToken = oTokenModel.getData();
			// var token = oToken.csrftoken;
			$.ajax({
				url: "/VMS/rest/visitorController/emergencyMessage",
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully Sent Alert");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					console.log(response);
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					// that.fnGetData();

				},
				error: function (response) {
					console.log(response);
					sap.m.MessageToast.show("fail");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});
			that._oDialog.close();
			that._oDialog.destroy();
			that._oDialog = null;
		},
		onNotifyPress: function () {
			this.bFlag = true;
			if (!this._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("idaddDeliveryFrag", "com.incture.VMS.fragment.addDelivery", this); // Instantiating the Fragment
			}
			this.getView().addDependent(this._oDialog); // Adding the fragment to your current view
			this._oDialog.open();
		},
		onSendDelivery: function () {
			var that = this;
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var date = oSecurityModel.getProperty("/date");
			var sSignature = this.getView().getModel("oSignatureModel").getProperty("/sSelectedKey");
			if (sSignature === "Signature") {
				sSignature = "required";
			} else {
				sSignature = "not required";
			}
			var sUrl = "/VMS/rest/parcelController/getRecentDelivery?date=" + date;
			var obj = oSecurityModel.getProperty("/oDeliveryData");
			// console.log(obj);
			var payload = {
				"mobileNumber": obj.mobileNo,
				"signatureType": sSignature
			};
			console.log(JSON.stringify(payload));
			$.ajax({
				url: "/VMS/rest/parcelController/addParcel",
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					if (data.status === 200) {
						sap.m.MessageToast.show("Success");
						console.log(status);
						console.log(response);
						that.fndoajax(sUrl, "/DeliveryDetails");

					} else if (data.status === 300) {
						sap.m.MessageToast.show("Enter The Correct Mobile Number");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					} else {
						sap.m.MessageToast.show("Something Went Wrong");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					}
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					oSecurityModel.setProperty("/oDeliveryData", {});
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});

		},
		onEditProfilePress: function () {
			if (!this._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("idEditProfileFrag", "com.incture.VMS.fragment.editProfile",
					this); // Instantiating the Fragment
			}
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();
		},
		onEditProfileConfirm: function () {
			var that = this;
			var oLoginModel = that.getOwnerComponent().getModel("oLoginModel");
			// var obj = oLoginModel.getProperty("/oLoginFormData");
			var obj = oLoginModel.getProperty("/loginDetails");
			// var oSecurityModel = that.getView().getModel("oSecurityModel");
			var eId = oLoginModel.getProperty("/loginDetails").eId;
			var payload = {
				"employeeId": obj.username,
				"password": obj.password,
				"employeeEmail": obj.email,
				"employeePhoneNumber": obj.contactNo
			};
			$.ajax({
				url: "/VMS/rest/employeeController/updateEmployee?id=" + eId,
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully Edited");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					console.log(response);
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});

		},
		onAccessCardPress: function (oEvent) {
			var oSecurityModel = this.getView().getModel("oSecurityModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getParent().getBindingContextPath();
			var oProperty = oSecurityModel.getProperty(spath);
			var vId = oProperty.visitorId;
			var sUrl = "/VMS/rest/employeeController/printAccessCard?vId=" + vId;
			sap.m.URLHelper.redirect(sUrl, true);
			// console.log(oSecurityModel);
			// this.bFlag = true;
			// if (!this._oDialog) {
			// 	//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
			// 	this._oDialog = sap.ui.xmlfragment("idaccessCard", "com.incture.VMS.fragment.accessCard", this); // Instantiating the Fragment
			// }
			// this.getView().addDependent(this._oDialog); // Adding the fragment to your current view
			// this._oDialog.open();
		},
		// onAssignAccessCard: function () {
		// 	var oSecurityModel = this.getView().getModel("oSecurityModel");
		// 	var vhId = oSecurityModel.getProperty("/CheckInVisitorDetails").vId;
		// 	var sUrl = "/VMS_Service/rest/employeeController/printAccessCard?mId=" + vhId;
		// 	sap.m.URLHelper.redirect(sUrl, true);
		// 	// this._oDialog.close();
		// 	// this._oDialog.destroy();
		// 	// this._oDialog = null;
		// },
		onLogOutPress: function () {
			var eId = 5;
			var sUrl = "wss://vmsprojectp2002479281trial.hanatrial.ondemand.com/vmsproject/chat/" + eId;
			var webSocket = new WebSocket(sUrl);
			webSocket.close();
			sap.m.MessageToast.show("Successfully LoggedOut");
			$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
			this.getRouter().navTo("RouteHome");
		},
		fndoajax: function (sUrl, sProperty) {
			var that = this;
			var oSecurityModel = that.getOwnerComponent().getModel("oSecurityModel");
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				headers: {
					dataType: "json",
					contentType: "application/json; charset=utf-8"

				},
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
				},
				success: function (data) {
					// sap.m.MessageToast.show("Data Successfully Loaded");
					oSecurityModel.setProperty(sProperty, data);

				},
				type: "GET"
			});
		}

	});

});