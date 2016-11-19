// Copyright (c) 2016, Shigemi ISHIDA
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
// 3. Neither the name of the Institute nor the names of its contributors
//    may be used to endorse or promote products derived from this software
//    without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE INSTITUTE AND CONTRIBUTORS ``AS IS'' AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED.  IN NO EVENT SHALL THE INSTITUTE OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
// OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
// OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
// SUCH DAMAGE.
// 
$( function() {
    // initialize firebase
    const api_key = "YOUR_API_KEY";
    const fcm_token = "YOUR_FCM_TOKEN";
    const config = {
        apiKey: api_key,
        authDomain: "YOUR_DOMAIN",
        databaseURL: "YOUR_DB_URL",
        storageBucket: "YOUR_STORAGE",
        messagingSenderId: "YOUR_SENDER_ID"
    };
    firebase.initializeApp(config);

    // retrieve Firebase Messaging object.
    const messaging = firebase.messaging();
    const raise_topic = "raise_signal";

    updateToken();

    // callback called when instance ID token is updated.
    messaging.onTokenRefresh(function() {
        updateToken();
    });

    // callback called on message reception
    messaging.onMessage(function(payload) {
        console.log("Message received. ", payload);
        $("#msg_title").html("<h1>"+payload.data.title+"</h1>");
        $("#msg_body").html("<p>"+payload.data.body+"</p>");
        var action = window.location.href;
        if ("click_action" in payload.data) {
            action = payload.data.click_action;
        }
        const notification = notifyRaise(payload.data.title,
                                       payload.data.body,
                                       action);
    });

    function notifyRaise(title, body, action=false) {
        var options = {
            "body": body,
            "icon": "raise-logo.png",
        };
        var notification = new Notification(title, options);
        if (action) {
            notification.onclick = function(event) {
                event.preventDefault();
                window.open(action, "_self");
                notification.close();
            };
        }
        return notification;
    }

    // clear content on window click
    function setClearCallback() {
        $("body").click(function() {
            // only when IID token is sent to server
            if (!isTokenSentToServer()) {
                return;
            }
            $("#msg_title").html("<h1>Ready</h1>");
            $("#msg_body").html("<p>Waiting for notification<p>");
        });
    }

    function updateToken() {
        messaging.getToken()
            .then(function(refreshedToken) {
                if (refreshedToken) {
                    console.log('Token refreshed.');
                    // Indicate that the new Instance ID token has not yet been sent to the
                    // app server.
                    setTokenSentToServer(false);
                    // Send Instance ID token to app server.
                    sendTokenToServer(refreshedToken);
                    $("#request_perm").addClass("hide");
                    setClearCallback();
                }
                else {          // needs permission
                    console.log("no instance ID token available.  request permission to generate one.");
                    $("#request_perm").removeClass("hide");
                }
            })
            .catch(function(err) {
                console.log('Unable to retrieve refreshed token.', err);
            });
    }

    // Send the Instance ID token your application server, so that it can:
    // - send messages back to this app
    // - subscribe/unsubscribe the token from topics
    function sendTokenToServer(currentToken) {
        if (!isTokenSentToServer()) {
            console.log('Subscribing to topic ' + raise_topic);

            // store current token in local storage
            window.localStorage.setItem('IIDtoken', currentToken);

            // subscribe to topic
            var topic_url = "https://iid.googleapis.com/iid/v1/" + currentToken
                + "/rel/topics/" + raise_topic;
            $.ajax({url: topic_url,
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    timeout: 10000,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'key=' + fcm_token);
                    },
                    success: function(ret) {
                        setTokenSentToServer(true);
                        console.log('done');
                        $("#msg_title").html("<h1>Ready</h1>");
                        $("#msg_body").html("<p>Waiting for notification</p>");
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrow) {
                        console.log('communication error on topic subscription');
                    }
                   });
        } else {
            console.log('Token already sent to server so won\'t send it again ' +
                        'unless it changes');
        }
    }

    function isTokenSentToServer() {
        if (window.localStorage.getItem('sentToServer') == 1) {
            return true;
        }
        return false;
    }

    function setTokenSentToServer(sent) {
        if (sent) {
            window.localStorage.setItem('sentToServer', 1);
        } else {
            window.localStorage.setItem('sentToServer', 0);
        }
    }

    $("#request_perm button").click(function() {
        requestPermission();
    });
    function requestPermission() {
        console.log('Requesting permission...');
        messaging.requestPermission()
            .then(function() {
                console.log('Notification permission granted.');
                updateToken();
            })
            .catch(function(err) {
                console.log('Unable to get permission to notify.', err);
            });
    }

    function deleteToken() {
        messaging.getToken()
            .then(function(currentToken) {
                messaging.deleteToken(currentToken)
                    .then(function() {
                        console.log('Token deleted.');
                        setTokenSentToServer(false);
                    })
                    .catch(function(err) {
                        console.log('Unable to delete token. ', err);
                    });
            })
            .catch(function(err) {
                console.log('Error retrieving Instance ID token. ', err);
            });
    }
});
