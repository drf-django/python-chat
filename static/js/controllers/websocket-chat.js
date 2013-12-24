// Generated by CoffeeScript 1.6.3
var chatApp, ws;

ws = null;

chatApp = angular.module("chatApp", []);

chatApp.factory("ChatService", function() {
  var service;
  service = {};
  service.connect = function() {
    if (service.ws) {
      return;
    }
    ws = new WebSocket("ws://" + location.host + "/api");
    ws.onmessage = function(event) {
      return service.callback(event);
    };
    return service.ws = ws;
  };
  service.subscribe = function(callback) {
    return service.callback = callback;
  };
  return service;
});

chatApp.controller("Ctrl", [
  '$scope', 'ChatService', function($scope, ChatService) {
    $scope.templateUrl = "/static/partials/chat.html";
    $scope.messages = [];
    $scope.cids = [];
    $scope.members = {};
    ChatService.connect();
    ChatService.subscribe(function(event) {
      var data, msg, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      data = JSON.parse(event.data);
      console.log('data', data);
      switch (data.type) {
        case 'online':
          _ref = data.messages;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            msg = _ref[_i];
            $scope.cids.push(msg.cid);
            $scope.members[msg.cid] = {
              'datetime': msg.datetime
            };
          }
          break;
        case 'offline':
          _ref1 = data.messages;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            msg = _ref1[_j];
            $scope.cids.splice($scope.cids.indexOf(msg.cid), 1);
            delete $scope.members[msg.cid];
          }
          break;
        case 'message':
          _ref2 = data.messages;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            msg = _ref2[_k];
            $scope.messages.push(msg);
          }
          console.log('$scope.messages:', $scope.messages, data.messages);
      }
      $scope.$apply();
      if (data.type === 'message') {
        $('#logs').stop().animate({
          scrollTop: $('#logs')[0].scrollHeight
        }, "300", "swing");
      }
      return console.log('$scope.members:', $scope.members);
    });
    return 'ok';
  }
]);

$(document).ready(function() {
  return $('form').submit(function(event) {
    var msg;
    msg = $('#message-input').val();
    if (msg.length > 0) {
      ws.send(msg);
      $('#message-input').val("");
    }
    return false;
  });
});
