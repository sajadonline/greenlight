// arianet open source conferencing system - http://www.arianet.org/.
//
// Copyright (c) 2018 arianet Inc. and by respective authors (see below).
//
// This program is free software; you can redistribute it and/or modify it under the
// terms of the GNU Lesser General Public License as published by the Free Software
// Foundation; either version 3.0 of the License, or (at your option) any later
// version.
//
// arianet is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License along
// with arianet; if not, see <http://www.gnu.org/licenses/>.

// Handle client request to join when meeting starts.
$(document).on("turbolinks:load", function(){
  var controller = $("body").data('controller');
  var action = $("body").data('action');

  if(controller == "rooms" && action == "join"){
    App.waiting = App.cable.subscriptions.create({
      channel: "WaitingChannel",
      roomuid: $(".background").attr("room"),
      useruid: $(".background").attr("user")
    }, {
      connected: function() {
        console.log("connected");
      },

      disconnected: function(data) {
        console.log("disconnected");
        console.log(data);
      },

      rejected: function() {
        console.log("rejected");
      },

      received: function(data){
        console.log(data);
        if(data.action = "started"){
          request_to_join_meeting();
        }
      }
    });
  }
});

var join_attempts = 0;

var request_to_join_meeting = function(){
  $.ajax({
    url: window.location.pathname,
    type: 'POST',
    data: {
      join_name: $(".background").attr("join-name")
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    success: function(){
      // Enqueue another trial just incase they didn't actually join.
      if(join_attempts < 4){ setTimeout(request_to_join_meeting, 10000); }
      join_attempts++;
    }
  });
}
