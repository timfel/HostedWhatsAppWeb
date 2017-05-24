// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var shareOperation = null;

	function xxShare(txt) {
	    var main = document.getElementById("main");
	    if (!main) {
	        setTimeout(function () {
	            document.xxShare(txt)
	        }, 1000);
	        return;
	    }
	    var inputfield = main.getElementsByClassName("input")[0];
	    if (!inputfield) {
	        setTimeout(function () {
	            document.xxShare(txt)
	        }, 1000);
	        return;
	    }
	    inputfield.innerText = txt;
	    return;
	}

	function shareReady(args) {
	    shareOperation.reportStarted();
	    var webview = document.getElementById("webview");
	    var code = "document.xxShare = " + xxShare.toString();
	    var asyncop = webview.invokeScriptAsync("eval", [code]);
	    asyncop.oncomplete = function () {}
	    asyncop.onerror = function (e) {
	        shareOperation.reportError("An error occurred injecting the code into WhatsApp Web");
	    }
	    asyncop.start();
	    if (shareOperation.data.contains(Windows.ApplicationModel.DataTransfer.StandardDataFormats.text)) {
	        shareOperation.data.getTextAsync().done(function (text) {
	            shareOperation.reportDataRetrieved();
	            asyncop = webview.invokeScriptAsync("window.xxShare", [text + ""]);
	            asyncop.oncomplete = function () {    }
	            asyncop.onerror = function (e) {
	                shareOperation.reportError("An error sending text to WhatsApp Web");
	            }
	            asyncop.start();
	        });
	    } else if (shareOperation.data.contains(Windows.ApplicationModel.DataTransfer.StandardDataFormats.uri)) {
	        shareOperation.data.getWebLinkAsync().done(function (text) {
	            shareOperation.reportDataRetrieved();
	            setTimeout(function () {
	                asyncop = webview.invokeScriptAsync("eval", ["document.xxShare('" + text + "')"]);
	                asyncop.oncomplete = function () { }
                    asyncop.onerror = function (e) {
                        shareOperation.reportError("An error sending text to WhatsApp Web");
	                }
	                asyncop.start();
	            }, 5000);
	        });
	    }
	}

	app.onactivated = function (args) {
	    if (args.detail.kind === activation.ActivationKind.shareTarget) {
	        args.setPromise(WinJS.UI.processAll());
	        shareOperation = args.detail.shareOperation;
	        WinJS.Application.addEventListener("shareready", shareReady, false);
	        WinJS.Application.queueEvent({ type: "shareready" });
	    } else if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
			    // TODO: This application has been newly launched. Initialize your application here.
			} else {
				// TODO: This application was suspended and then terminated.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
			}
			args.setPromise(WinJS.UI.processAll());
		}
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();
})();
