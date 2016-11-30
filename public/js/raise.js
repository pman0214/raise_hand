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
    const fcm_token = "YOUR_FCM_TOKEN";
    const raise_topic = "raise_signal";
    const com_timeout = 5000;

    resizeButton();
    function resizeButton() {
        $("#raise_button").height($(window).height() * 0.5);
    }
    $(window).resize(resizeButton);
    $("div.button_text").flowtype({fontRatio: 5});

    time_check = checkTimeSchedule("../time_schedule.json");
    if (! time_check ) {
        $("#raise_button").addClass("pure-button-disabled");
        $("#msg_title").html("<h1>使用不可</h1>");
        $("#msg_body").html("<p>ただいまの時間帯は使用できません</p>")
        return;
    }
    function checkTimeSchedule(json_file) {
        var ret = false;
        $.ajaxSetup({ async: false });
        $.getJSON(json_file, function(data) {
            // 現在日時を取得
            var now = new Date();
            console.log("Time check");
            for (var i=0; i < data.length; i++) {
                var start = new Date(data[i]["start"]);
                var end = new Date(data[i]["end"]);
                if ( (now >= start) &&
                     (now <= end ) ) {
                    console.log("Time is ok");
                    ret = true;
                }
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus + ": " + jqXHR.responseText);
        });
        $.ajaxSetup({ async: true });
        return ret;
    }

    $("#raise_button").click(function() {
        $("#raise_button").addClass("pure-button-pressed");
        $("#raise_button").addClass("pure-button-disabled");
        $("#msg_title").html("<h1>質問要求送信中</h1>");
        $("#msg_body").html("<p>しばらくお待ちください</p>")

        const action = window.location.href + "raised.html";
        // data to be sent
        //   use data messaging to notify in both foreground and background cases
        const json_data = {to: "/topics/" + raise_topic,
                           data: {
                               title: "質問！",
                               body: "質問あり",
                               click_action: action,
                           }
                          };
        $.ajax({url: "https://fcm.googleapis.com/fcm/send",
                type: 'POST',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(json_data),
                timeout: com_timeout - 100,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'key=' + fcm_token);
                },
                success: function(ret) {
                    enableRaise();
                    $("#msg_title").html("");
                    $("#msg_body").html("");
                },
                error: function(XMLHttpRequest, textStatus, errorThrow) {
                    console.log('communication error on topic publication');
                    enableRaise();
                    $("#msg_title").html("<h1>通信エラー</h1>");
                    $("#msg_body").html("<p>質問要求を送信できませんでした</p>");
                }
               });
    });

    function enableRaise() {
        $("#raise_button").removeClass("pure-button-pressed");
        $("#raise_button").removeClass("pure-button-disabled");
    }
});
