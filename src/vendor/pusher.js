import uploadcare from '../namespace'

// changed:
//   Pusher.dependency_suffix = '.min'; (was '')
//   window.WEB_SOCKET_SWF_LOCATION = "https://s3.amazonaws.com/uploadcare-static/WebSocketMainInsecure.swf"

/*!
 * Pusher JavaScript Library v1.12.2
 * http://pusherapp.com/
 *
 * Copyright 2011, Pusher
 * Released under the MIT licence.
 */

;(function() {
  var Pusher, _require;

;(function() {
  if (Function.prototype.scopedTo === undefined) {
    Function.prototype.scopedTo = function(context, args) {
      var f = this;
      return function() {
        return f.apply(context, Array.prototype.slice.call(args || [])
                       .concat(Array.prototype.slice.call(arguments)));
      };
    };
  }

  Pusher = function(app_key, options) {
    this.options = options || {};
    this.key = app_key;
    this.channels = new Pusher.Channels();
    this.global_emitter = new Pusher.EventsDispatcher()

    var self = this;

    this.checkAppKey();

    this.connection = new Pusher.Connection(this.key, this.options);

    // Setup / teardown connection
    this.connection
      .bind('connected', function() {
        self.subscribeAll();
      })
      .bind('message', function(params) {
        var internal = (params.event.indexOf('pusher_internal:') === 0);
        if (params.channel) {
          var channel;
          if (channel = self.channel(params.channel)) {
            channel.emit(params.event, params.data);
          }
        }
        // Emit globaly [deprecated]
        if (!internal) self.global_emitter.emit(params.event, params.data);
      })
      .bind('disconnected', function() {
        self.channels.disconnect();
      })
      .bind('error', function(err) {
        Pusher.warn('Error', err);
      });

    Pusher.instances.push(this);

    if (Pusher.isReady) self.connect();
  };
  Pusher.instances = [];
  Pusher.prototype = {
    channel: function(name) {
      return this.channels.find(name);
    },

    connect: function() {
      this.connection.connect();
    },

    disconnect: function() {
      this.connection.disconnect();
    },

    bind: function(event_name, callback) {
      this.global_emitter.bind(event_name, callback);
      return this;
    },

    bind_all: function(callback) {
      this.global_emitter.bind_all(callback);
      return this;
    },

    subscribeAll: function() {
      var channel;
      for (channelName in this.channels.channels) {
        if (this.channels.channels.hasOwnProperty(channelName)) {
          this.subscribe(channelName);
        }
      }
    },

    subscribe: function(channel_name) {
      var self = this;
      var channel = this.channels.add(channel_name, this);

      if (this.connection.state === 'connected') {
        channel.authorize(this.connection.socket_id, this.options, function(err, data) {
          if (err) {
            channel.emit('pusher:subscription_error', data);
          } else {
            self.send_event('pusher:subscribe', {
              channel: channel_name,
              auth: data.auth,
              channel_data: data.channel_data
            });
          }
        });
      }
      return channel;
    },

    unsubscribe: function(channel_name) {
      this.channels.remove(channel_name);
      if (this.connection.state === 'connected') {
        this.send_event('pusher:unsubscribe', {
          channel: channel_name
        });
      }
    },

    send_event: function(event_name, data, channel) {
      return this.connection.send_event(event_name, data, channel);
    },

    checkAppKey: function() {
      if(this.key === null || this.key === undefined) {
        Pusher.warn('Warning', 'You must pass your app key when you instantiate Pusher.');
      }
    }
  };

  Pusher.Util = {
    extend: function extend(target, extensions) {
      for (var property in extensions) {
        if (extensions[property] && extensions[property].constructor &&
            extensions[property].constructor === Object) {
          target[property] = extend(target[property] || {}, extensions[property]);
        } else {
          target[property] = extensions[property];
        }
      }
      return target;
    },

    stringify: function stringify() {
      var m = ["Pusher"]
      for (var i = 0; i < arguments.length; i++){
        if (typeof arguments[i] === "string") {
          m.push(arguments[i])
        } else {
          if (window['JSON'] == undefined) {
            m.push(arguments[i].toString());
          } else {
            m.push(JSON.stringify(arguments[i]))
          }
        }
      };
      return m.join(" : ")
    },

    arrayIndexOf: function(array, item) { // MSIE doesn't have array.indexOf
      var nativeIndexOf = Array.prototype.indexOf;
      if (array == null) return -1;
      if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
      for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
      return -1;
    }
  };

  // To receive log output provide a Pusher.log function, for example
  // Pusher.log = function(m){console.log(m)}
  Pusher.debug = function() {
    if (!Pusher.log) return
    Pusher.log(Pusher.Util.stringify.apply(this, arguments))
  }
  Pusher.warn = function() {
    if (window.console && window.console.warn) {
      window.console.warn(Pusher.Util.stringify.apply(this, arguments));
    } else {
      if (!Pusher.log) return
      Pusher.log(Pusher.Util.stringify.apply(this, arguments));
    }
  };

  // Pusher defaults
  Pusher.VERSION = '1.12.2';

  Pusher.host = 'ws.pusherapp.com';
  Pusher.ws_port = 80;
  Pusher.wss_port = 443;
  Pusher.channel_auth_endpoint = '/pusher/auth';
  Pusher.cdn_http = 'http://js.pusher.com/'
  Pusher.cdn_https = 'https://d3dy5gmtp8yhk7.cloudfront.net/'
  Pusher.dependency_suffix = '.min';
  Pusher.channel_auth_transport = 'ajax';
  Pusher.activity_timeout = 120000;
  Pusher.pong_timeout = 30000;

  Pusher.isReady = false;
  Pusher.ready = function() {
    Pusher.isReady = true;
    for (var i = 0, l = Pusher.instances.length; i < l; i++) {
      Pusher.instances[i].connect();
    }
  };

})();

;(function() {
/* Abstract event binding
Example:

    var MyEventEmitter = function(){};
    MyEventEmitter.prototype = new Pusher.EventsDispatcher;

    var emitter = new MyEventEmitter();

    // Bind to single event
    emitter.bind('foo_event', function(data){ alert(data)} );

    // Bind to all
    emitter.bind_all(function(eventName, data){ alert(data) });

--------------------------------------------------------*/

  function CallbackRegistry() {
    this._callbacks = {};
  };

  CallbackRegistry.prototype.get = function(eventName) {
    return this._callbacks[this._prefix(eventName)];
  };

  CallbackRegistry.prototype.add = function(eventName, callback) {
    var prefixedEventName = this._prefix(eventName);
    this._callbacks[prefixedEventName] = this._callbacks[prefixedEventName] || [];
    this._callbacks[prefixedEventName].push(callback);
  };

  CallbackRegistry.prototype.remove = function(eventName, callback) {
    if(this.get(eventName)) {
      var index = Pusher.Util.arrayIndexOf(this.get(eventName), callback);
      this._callbacks[this._prefix(eventName)].splice(index, 1);
    }
  };

  CallbackRegistry.prototype._prefix = function(eventName) {
    return "_" + eventName;
  };


  function EventsDispatcher(failThrough) {
    this.callbacks = new CallbackRegistry();
    this.global_callbacks = [];
    // Run this function when dispatching an event when no callbacks defined
    this.failThrough = failThrough;
  }

  EventsDispatcher.prototype.bind = function(eventName, callback) {
    this.callbacks.add(eventName, callback);
    return this;// chainable
  };

  EventsDispatcher.prototype.unbind = function(eventName, callback) {
    this.callbacks.remove(eventName, callback);
    return this;
  };

  EventsDispatcher.prototype.emit = function(eventName, data) {
    // Global callbacks
    for (var i = 0; i < this.global_callbacks.length; i++) {
      this.global_callbacks[i](eventName, data);
    }

    // Event callbacks
    var callbacks = this.callbacks.get(eventName);
    if (callbacks) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](data);
      }
    } else if (this.failThrough) {
      this.failThrough(eventName, data)
    }

    return this;
  };

  EventsDispatcher.prototype.bind_all = function(callback) {
    this.global_callbacks.push(callback);
    return this;
  };

  Pusher.EventsDispatcher = EventsDispatcher;
})();

;(function() {
  /*-----------------------------------------------
    Helpers:
  -----------------------------------------------*/

  function capitalize(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }


  function safeCall(method, obj, data) {
    if (obj[method] !== undefined) {
      obj[method](data);
    }
  }

  /*-----------------------------------------------
    The State Machine
  -----------------------------------------------*/
  function Machine(initialState, transitions, stateActions) {
    Pusher.EventsDispatcher.call(this);

    this.state = undefined;
    this.errors = [];

    // functions for each state
    this.stateActions = stateActions;

    // set up the transitions
    this.transitions = transitions;

    this.transition(initialState);
  };

  Machine.prototype.transition = function(nextState, data) {
    var prevState = this.state;
    var stateCallbacks = this.stateActions;

    if (prevState && (Pusher.Util.arrayIndexOf(this.transitions[prevState], nextState) == -1)) {
      this.emit('invalid_transition_attempt', {
        oldState: prevState,
        newState: nextState
      });

      throw new Error('Invalid transition [' + prevState + ' to ' + nextState + ']');
    }

    // exit
    safeCall(prevState + 'Exit', stateCallbacks, data);

    // tween
    safeCall(prevState + 'To' + capitalize(nextState), stateCallbacks, data);

    // pre
    safeCall(nextState + 'Pre', stateCallbacks, data);

    // change state:
    this.state = nextState;

    // handy to bind to
    this.emit('state_change', {
      oldState: prevState,
      newState: nextState
    });

    // Post:
    safeCall(nextState + 'Post', stateCallbacks, data);
  };

  Machine.prototype.is = function(state) {
    return this.state === state;
  };

  Machine.prototype.isNot = function(state) {
    return this.state !== state;
  };

  Pusher.Util.extend(Machine.prototype, Pusher.EventsDispatcher.prototype);

  Pusher.Machine = Machine;
})();

;(function() {
  /*
    A little bauble to interface with window.navigator.onLine,
    window.ononline and window.onoffline.  Easier to mock.
  */

  var NetInfo = function() {
    var self = this;
    Pusher.EventsDispatcher.call(this);
    // This is okay, as IE doesn't support this stuff anyway.
    if (window.addEventListener !== undefined) {
      window.addEventListener("online", function() {
        self.emit('online', null);
      }, false);
      window.addEventListener("offline", function() {
        self.emit('offline', null);
      }, false);
    }
  };

  // Offline means definitely offline (no connection to router).
  // Inverse does NOT mean definitely online (only currently supported in Safari
  // and even there only means the device has a connection to the router).
  NetInfo.prototype.isOnLine = function() {
    if (window.navigator.onLine === undefined) {
      return true;
    } else {
      return window.navigator.onLine;
    }
  };

  Pusher.Util.extend(NetInfo.prototype, Pusher.EventsDispatcher.prototype);

  Pusher.NetInfo = NetInfo;
})();

;(function() {
  var machineTransitions = {
    'initialized': ['waiting', 'failed'],
    'waiting': ['connecting', 'permanentlyClosed'],
    'connecting': ['open', 'permanentlyClosing', 'impermanentlyClosing', 'waiting'],
    'open': ['connected', 'permanentlyClosing', 'impermanentlyClosing', 'waiting'],
    'connected': ['permanentlyClosing', 'waiting'],
    'impermanentlyClosing': ['waiting', 'permanentlyClosing'],
    'permanentlyClosing': ['permanentlyClosed'],
    'permanentlyClosed': ['waiting', 'failed'],
    'failed': ['permanentlyClosed']
  };


  // Amount to add to time between connection attemtpts per failed attempt.
  var UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT = 2000;
  var UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT = 2000;
  var UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT = 2000;

  var MAX_CONNECTION_ATTEMPT_WAIT = 5 * UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT;
  var MAX_OPEN_ATTEMPT_TIMEOUT = 5 * UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT;
  var MAX_CONNECTED_ATTEMPT_TIMEOUT = 5 * UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT;

  function resetConnectionParameters(connection) {
    connection.connectionWait = 0;

    if (Pusher.TransportType === 'flash') {
      // Flash needs a bit more time
      connection.openTimeout = 5000;
    } else {
      connection.openTimeout = 2000;
    }
    connection.connectedTimeout = 2000;
    connection.connectionSecure = connection.compulsorySecure;
    connection.connectionAttempts = 0;
  }

  function Connection(key, options) {
    var self = this;

    Pusher.EventsDispatcher.call(this);

    this.options = Pusher.Util.extend({encrypted: false}, options);

    this.netInfo = new Pusher.NetInfo();

    this.netInfo.bind('online', function(){
      if (self._machine.is('waiting')) {
        self._machine.transition('connecting');
        updateState('connecting');
      }
    });

    this.netInfo.bind('offline', function() {
      if (self._machine.is('connected')) {
        // These are for Chrome 15, which ends up
        // having two sockets hanging around.
        self.socket.onclose = undefined;
        self.socket.onmessage = undefined;
        self.socket.onerror = undefined;
        self.socket.onopen = undefined;

        self.socket.close();
        self.socket = undefined;
        self._machine.transition('waiting');
      }
    });

    // define the state machine that runs the connection
    this._machine = new Pusher.Machine('initialized', machineTransitions, {
      initializedPre: function() {
        self.compulsorySecure = self.options.encrypted;

        self.key = key;
        self.socket = null;
        self.socket_id = null;

        self.state = 'initialized';
      },

      waitingPre: function() {
        if (self.connectionWait > 0) {
          self.emit('connecting_in', self.connectionWait);
        }

        if (self.netInfo.isOnLine() && self.connectionAttempts <= 4) {
          updateState('connecting');
        } else {
          updateState('unavailable');
        }

        // When in the unavailable state we attempt to connect, but don't
        // broadcast that fact
        if (self.netInfo.isOnLine()) {
          self._waitingTimer = setTimeout(function() {
            self._machine.transition('connecting');
          }, connectionDelay());
        }
      },

      waitingExit: function() {
        clearTimeout(self._waitingTimer);
      },

      connectingPre: function() {
        // Case that a user manages to get to the connecting
        // state even when offline.
        if (self.netInfo.isOnLine() === false) {
          self._machine.transition('waiting');
          updateState('unavailable');

          return;
        }

        var url = formatURL(self.key, self.connectionSecure);
        Pusher.debug('Connecting', url);
        self.socket = new Pusher.Transport(url);
        // now that the socket connection attempt has been started,
        // set up the callbacks fired by the socket for different outcomes
        self.socket.onopen = ws_onopen;
        self.socket.onclose = transitionToWaiting;
        self.socket.onerror = ws_onError;

        // allow time to get ws_onOpen, otherwise close socket and try again
        self._connectingTimer = setTimeout(TransitionToImpermanentlyClosing, self.openTimeout);
      },

      connectingExit: function() {
        clearTimeout(self._connectingTimer);
        self.socket.onopen = undefined; // unbind to avoid open events that are no longer relevant
      },

      connectingToWaiting: function() {
        updateConnectionParameters();

        // FUTURE: update only ssl
      },

      connectingToImpermanentlyClosing: function() {
        updateConnectionParameters();

        // FUTURE: update only timeout
      },

      openPre: function() {
        self.socket.onmessage = ws_onMessageOpen;
        self.socket.onerror = ws_onError;
        self.socket.onclose = transitionToWaiting;

        // allow time to get connected-to-Pusher message, otherwise close socket, try again
        self._openTimer = setTimeout(TransitionToImpermanentlyClosing, self.connectedTimeout);
      },

      openExit: function() {
        clearTimeout(self._openTimer);
        self.socket.onmessage = undefined; // unbind to avoid messages that are no longer relevant
      },

      openToWaiting: function() {
        updateConnectionParameters();
      },

      openToImpermanentlyClosing: function() {
        updateConnectionParameters();
      },

      connectedPre: function(socket_id) {
        self.socket_id = socket_id;

        self.socket.onmessage = ws_onMessageConnected;
        self.socket.onerror = ws_onError;
        self.socket.onclose = transitionToWaiting;

        resetConnectionParameters(self);
        self.connectedAt = new Date().getTime();

        resetActivityCheck();
      },

      connectedPost: function() {
        updateState('connected');
      },

      connectedExit: function() {
        stopActivityCheck();
        updateState('disconnected');
      },

      impermanentlyClosingPost: function() {
        if (self.socket) {
          self.socket.onclose = transitionToWaiting;
          self.socket.close();
        }
      },

      permanentlyClosingPost: function() {
        if (self.socket) {
          self.socket.onclose = function() {
            resetConnectionParameters(self);
            self._machine.transition('permanentlyClosed');
          };

          self.socket.close();
        } else {
          resetConnectionParameters(self);
          self._machine.transition('permanentlyClosed');
        }
      },

      failedPre: function() {
        updateState('failed');
        Pusher.debug('WebSockets are not available in this browser.');
      },

      permanentlyClosedPost: function() {
        updateState('disconnected');
      }
    });

    /*-----------------------------------------------
      -----------------------------------------------*/

    function updateConnectionParameters() {
      if (self.connectionWait < MAX_CONNECTION_ATTEMPT_WAIT) {
        self.connectionWait += UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT;
      }

      if (self.openTimeout < MAX_OPEN_ATTEMPT_TIMEOUT) {
        self.openTimeout += UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT;
      }

      if (self.connectedTimeout < MAX_CONNECTED_ATTEMPT_TIMEOUT) {
        self.connectedTimeout += UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT;
      }

      if (self.compulsorySecure !== true) {
        self.connectionSecure = !self.connectionSecure;
      }

      self.connectionAttempts++;
    }

    function formatURL(key, isSecure) {
      var port = Pusher.ws_port;
      var protocol = 'ws://';

      // Always connect with SSL if the current page has
      // been loaded via HTTPS.
      //
      // FUTURE: Always connect using SSL.
      //
      if (isSecure || document.location.protocol === 'https:') {
        port = Pusher.wss_port;
        protocol = 'wss://';
      }

      var flash = (Pusher.TransportType === "flash") ? "true" : "false";

      return protocol + Pusher.host + ':' + port + '/app/' + key + '?protocol=5&client=js'
        + '&version=' + Pusher.VERSION
        + '&flash=' + flash;
    }

    // callback for close and retry.  Used on timeouts.
    function TransitionToImpermanentlyClosing() {
      self._machine.transition('impermanentlyClosing');
    }

    function resetActivityCheck() {
      if (self._activityTimer) { clearTimeout(self._activityTimer); }
      // Send ping after inactivity
      self._activityTimer = setTimeout(function() {
        self.send_event('pusher:ping', {})
        // Wait for pong response
        self._activityTimer = setTimeout(function() {
          self.socket.close();
        }, (self.options.pong_timeout || Pusher.pong_timeout))
      }, (self.options.activity_timeout || Pusher.activity_timeout))
    }

    function stopActivityCheck() {
      if (self._activityTimer) { clearTimeout(self._activityTimer); }
    }

    // Returns the delay before the next connection attempt should be made
    //
    // This function guards against attempting to connect more frequently than
    // once every second
    //
    function connectionDelay() {
      var delay = self.connectionWait;
      if (delay === 0) {
        if (self.connectedAt) {
          var t = 1000;
          var connectedFor = new Date().getTime() - self.connectedAt;
          if (connectedFor < t) {
            delay = t - connectedFor;
          }
        }
      }
      return delay;
    }

    /*-----------------------------------------------
      WebSocket Callbacks
      -----------------------------------------------*/

    // no-op, as we only care when we get pusher:connection_established
    function ws_onopen() {
      self._machine.transition('open');
    };

    function handleCloseCode(code, message) {
      // first inform the end-developer of this error
      self.emit('error', {type: 'PusherError', data: {code: code, message: message}});

      if (code === 4000) {
        // SSL only app
        self.compulsorySecure = true;
        self.connectionSecure = true;
        self.options.encrypted = true;

        TransitionToImpermanentlyClosing();
      } else if (code < 4100) {
        // Permentently close connection
        self._machine.transition('permanentlyClosing')
      } else if (code < 4200) {
        // Backoff before reconnecting
        self.connectionWait = 1000;
        self._machine.transition('waiting')
      } else if (code < 4300) {
        // Reconnect immediately
        TransitionToImpermanentlyClosing();
      } else {
        // Unknown error
        self._machine.transition('permanentlyClosing')
      }
    }

    function ws_onMessageOpen(event) {
      var params = parseWebSocketEvent(event);
      if (params !== undefined) {
        if (params.event === 'pusher:connection_established') {
          self._machine.transition('connected', params.data.socket_id);
        } else if (params.event === 'pusher:error') {
          handleCloseCode(params.data.code, params.data.message)
        }
      }
    }

    function ws_onMessageConnected(event) {
      resetActivityCheck();

      var params = parseWebSocketEvent(event);
      if (params !== undefined) {
        Pusher.debug('Event recd', params);

        switch (params.event) {
          case 'pusher:error':
            self.emit('error', {type: 'PusherError', data: params.data});
            break;
          case 'pusher:ping':
            self.send_event('pusher:pong', {})
            break;
        }

        self.emit('message', params);
      }
    }


    /**
     * Parses an event from the WebSocket to get
     * the JSON payload that we require
     *
     * @param {MessageEvent} event  The event from the WebSocket.onmessage handler.
    **/
    function parseWebSocketEvent(event) {
      try {
        var params = JSON.parse(event.data);

        if (typeof params.data === 'string') {
          try {
            params.data = JSON.parse(params.data);
          } catch (e) {
            if (!(e instanceof SyntaxError)) {
              throw e;
            }
          }
        }

        return params;
      } catch (e) {
        self.emit('error', {type: 'MessageParseError', error: e, data: event.data});
      }
    }

    function transitionToWaiting() {
      self._machine.transition('waiting');
    }

    function ws_onError(error) {
      // just emit error to user - socket will already be closed by browser
      self.emit('error', { type: 'WebSocketError', error: error });
    }

    // Updates the public state information exposed by connection
    //
    // This is distinct from the internal state information used by _machine
    // to manage the connection
    //
    function updateState(newState, data) {
      var prevState = self.state;
      self.state = newState;

      // Only emit when the state changes
      if (prevState !== newState) {
        Pusher.debug('State changed', prevState + ' -> ' + newState);
        self.emit('state_change', {previous: prevState, current: newState});
        self.emit(newState, data);
      }
    }
  };

  Connection.prototype.connect = function() {
    // no WebSockets
    if (!this._machine.is('failed') && !Pusher.Transport) {
      this._machine.transition('failed');
    }
    // initial open of connection
    else if(this._machine.is('initialized')) {
      resetConnectionParameters(this);
      this._machine.transition('waiting');
    }
    // user skipping connection wait
    else if (this._machine.is('waiting') && this.netInfo.isOnLine() === true) {
      this._machine.transition('connecting');
    }
    // user re-opening connection after closing it
    else if(this._machine.is("permanentlyClosed")) {
      resetConnectionParameters(this);
      this._machine.transition('waiting');
    }
  };

  Connection.prototype.send = function(data) {
    if (this._machine.is('connected')) {
      // Workaround for MobileSafari bug (see https://gist.github.com/2052006)
      var self = this;
      setTimeout(function() {
        self.socket.send(data);
      }, 0);
      return true;
    } else {
      return false;
    }
  };

  Connection.prototype.send_event = function(event_name, data, channel) {
    var payload = {
      event: event_name,
      data: data
    };
    if (channel) payload['channel'] = channel;

    Pusher.debug('Event sent', payload);
    return this.send(JSON.stringify(payload));
  }

  Connection.prototype.disconnect = function() {
    if (this._machine.is('permanentlyClosed')) return;

    if (this._machine.is('waiting') || this._machine.is('failed')) {
      this._machine.transition('permanentlyClosed');
    } else {
      this._machine.transition('permanentlyClosing');
    }
  };

  Pusher.Util.extend(Connection.prototype, Pusher.EventsDispatcher.prototype);
  Pusher.Connection = Connection;
})();

;(function() {
  Pusher.Channels = function() {
    this.channels = {};
  };

  Pusher.Channels.prototype = {
    add: function(channel_name, pusher) {
      var existing_channel = this.find(channel_name);
      if (!existing_channel) {
        var channel = Pusher.Channel.factory(channel_name, pusher);
        this.channels[channel_name] = channel;
        return channel;
      } else {
        return existing_channel;
      }
    },

    find: function(channel_name) {
      return this.channels[channel_name];
    },

    remove: function(channel_name) {
      delete this.channels[channel_name];
    },

    disconnect: function () {
      for(var channel_name in this.channels){
        this.channels[channel_name].disconnect()
      }
    }
  };

  Pusher.Channel = function(channel_name, pusher) {
    var self = this;
    Pusher.EventsDispatcher.call(this, function(event_name, event_data) {
      Pusher.debug('No callbacks on ' + channel_name + ' for ' + event_name);
    });

    this.pusher = pusher;
    this.name = channel_name;
    this.subscribed = false;

    this.bind('pusher_internal:subscription_succeeded', function(data) {
      self.onSubscriptionSucceeded(data);
    });
  };

  Pusher.Channel.prototype = {
    // inheritable constructor
    init: function() {},
    disconnect: function() {
      this.subscribed = false;
      this.emit("pusher_internal:disconnected");
    },

    onSubscriptionSucceeded: function(data) {
      this.subscribed = true;
      this.emit('pusher:subscription_succeeded');
    },

    authorize: function(socketId, options, callback){
      return callback(false, {}); // normal channels don't require auth
    },

    trigger: function(event, data) {
      return this.pusher.send_event(event, data, this.name);
    }
  };

  Pusher.Util.extend(Pusher.Channel.prototype, Pusher.EventsDispatcher.prototype);

  Pusher.Channel.PrivateChannel = {
    authorize: function(socketId, options, callback){
      var self = this;
      var authorizer = new Pusher.Channel.Authorizer(this, Pusher.channel_auth_transport, options);
      return authorizer.authorize(socketId, function(err, authData) {
        if(!err) {
          self.emit('pusher_internal:authorized', authData);
        }

        callback(err, authData);
      });
    }
  };

  Pusher.Channel.PresenceChannel = {
    init: function(){
      this.members = new Members(this); // leeches off channel events
    },

    onSubscriptionSucceeded: function(data) {
      this.subscribed = true;
      // We override this because we want the Members obj to be responsible for
      // emitting the pusher:subscription_succeeded.  It will do this after it has done its work.
    }
  };

  var Members = function(channel) {
    var self = this;

    var reset = function() {
      this._members_map = {};
      this.count = 0;
      this.me = null;
    };
    reset.call(this);

    channel.bind('pusher_internal:authorized', function(authorizedData) {
      var channelData = JSON.parse(authorizedData.channel_data);
      channel.bind("pusher_internal:subscription_succeeded", function(subscriptionData) {
        self._members_map = subscriptionData.presence.hash;
        self.count = subscriptionData.presence.count;
        self.me = self.get(channelData.user_id);
        channel.emit('pusher:subscription_succeeded', self);
      });
    });

    channel.bind('pusher_internal:member_added', function(data) {
      if(self.get(data.user_id) === null) { // only incr if user_id does not already exist
        self.count++;
      }

      self._members_map[data.user_id] = data.user_info;
      channel.emit('pusher:member_added', self.get(data.user_id));
    });

    channel.bind('pusher_internal:member_removed', function(data) {
      var member = self.get(data.user_id);
      if(member) {
        delete self._members_map[data.user_id];
        self.count--;
        channel.emit('pusher:member_removed', member);
      }
    });

    channel.bind('pusher_internal:disconnected', function() {
      reset.call(self);
    });
  };

  Members.prototype = {
    each: function(callback) {
      for(var i in this._members_map) {
        callback(this.get(i));
      }
    },

    get: function(user_id) {
      if (this._members_map.hasOwnProperty(user_id)) { // have heard of this user user_id
        return {
          id: user_id,
          info: this._members_map[user_id]
        }
      } else { // have never heard of this user
        return null;
      }
    }
  };

  Pusher.Channel.factory = function(channel_name, pusher){
    var channel = new Pusher.Channel(channel_name, pusher);
    if (channel_name.indexOf('private-') === 0) {
      Pusher.Util.extend(channel, Pusher.Channel.PrivateChannel);
    } else if (channel_name.indexOf('presence-') === 0) {
      Pusher.Util.extend(channel, Pusher.Channel.PrivateChannel);
      Pusher.Util.extend(channel, Pusher.Channel.PresenceChannel);
    };
    channel.init();
    return channel;
  };
})();

;(function() {
  Pusher.Channel.Authorizer = function(channel, type, options) {
    this.channel = channel;
    this.type = type;

    this.authOptions = (options || {}).auth || {};
  };

  Pusher.Channel.Authorizer.prototype = {
    composeQuery: function(socketId) {
      var query = '&socket_id=' + encodeURIComponent(socketId)
        + '&channel_name=' + encodeURIComponent(this.channel.name);

      for(var i in this.authOptions.params) {
        query += "&" + encodeURIComponent(i) + "=" + encodeURIComponent(this.authOptions.params[i]);
      }

      return query;
    },

    authorize: function(socketId, callback) {
      return Pusher.authorizers[this.type].call(this, socketId, callback);
    }
  };


  Pusher.auth_callbacks = {};
  Pusher.authorizers = {
    ajax: function(socketId, callback){
      var self = this, xhr;

      if (Pusher.XHR) {
        xhr = new Pusher.XHR();
      } else {
        xhr = (window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
      }

      xhr.open("POST", Pusher.channel_auth_endpoint, true);

      // add request headers
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      for(var headerName in this.authOptions.headers) {
        xhr.setRequestHeader(headerName, this.authOptions.headers[headerName]);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            var data, parsed = false;

            try {
              data = JSON.parse(xhr.responseText);
              parsed = true;
            } catch (e) {
              callback(true, 'JSON returned from webapp was invalid, yet status code was 200. Data was: ' + xhr.responseText);
            }

            if (parsed) { // prevents double execution.
              callback(false, data);
            }
          } else {
            Pusher.warn("Couldn't get auth info from your webapp", xhr.status);
            callback(true, xhr.status);
          }
        }
      };

      xhr.send(this.composeQuery(socketId));
      return xhr;
    },

    jsonp: function(socketId, callback){
      if(this.authOptions.headers !== undefined) {
        Pusher.warn("Warn", "To send headers with the auth request, you must use AJAX, rather than JSONP.");
      }

      var script = document.createElement("script");
      // Hacked wrapper.
      Pusher.auth_callbacks[this.channel.name] = function(data) {
        callback(false, data);
      };

      var callback_name = "Pusher.auth_callbacks['" + this.channel.name + "']";
      script.src = Pusher.channel_auth_endpoint
        + '?callback='
        + encodeURIComponent(callback_name)
        + this.composeQuery(socketId);

      var head = document.getElementsByTagName("head")[0] || document.documentElement;
      head.insertBefore( script, head.firstChild );
    }
  };
})();

// _require(dependencies, callback) takes an array of dependency urls and a
// callback to call when all the dependecies have finished loading
var _require = (function() {
  function handleScriptLoaded(elem, callback) {
    if (document.addEventListener) {
      elem.addEventListener('load', callback, false);
    } else {
      elem.attachEvent('onreadystatechange', function () {
        if (elem.readyState == 'loaded' || elem.readyState == 'complete') {
          callback();
        }
      });
    }
  }

  function addScript(src, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute("type","text/javascript");
    script.setAttribute('async', true);

    handleScriptLoaded(script, function() {
      callback();
    });

    head.appendChild(script);
  }

  return function(deps, callback) {
    var deps_loaded = 0;
    for (var i = 0; i < deps.length; i++) {
      addScript(deps[i], function() {
        if (deps.length == ++deps_loaded) {
          // This setTimeout is a workaround for an Opera issue
          setTimeout(callback, 0);
        }
      });
    }
  }
})();

;(function() {
  // Support Firefox versions which prefix WebSocket
  if (!window['WebSocket'] && window['MozWebSocket']) {
    window['WebSocket'] = window['MozWebSocket']
  }

  if (window['WebSocket']) {
    Pusher.Transport = window['WebSocket'];
    Pusher.TransportType = 'native';
  }

  var cdn = (document.location.protocol == 'http:') ? Pusher.cdn_http : Pusher.cdn_https;
  var root = cdn + Pusher.VERSION;
  var deps = [];

  if (!window['JSON']) {
    deps.push(root + '/json2' + Pusher.dependency_suffix + '.js');
  }
  if (!window['WebSocket']) {
    // We manually initialize web-socket-js to iron out cross browser issues
    window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = true;
    deps.push(root + '/flashfallback' + Pusher.dependency_suffix + '.js');
  }

  var initialize = function() {
    if (window['WebSocket']) {
      // Initialize function in the case that we have native WebSocket support
      return function() {
        Pusher.ready();
      }
    } else {
      // Initialize function for fallback case
      return function() {
        if (window['WebSocket']) {
          // window['WebSocket'] is a flash emulation of WebSocket
          Pusher.Transport = window['WebSocket'];
          Pusher.TransportType = 'flash';

          // window.WEB_SOCKET_SWF_LOCATION = root + "/WebSocketMain.swf";
          window.WEB_SOCKET_SWF_LOCATION = "https://s3.amazonaws.com/uploadcare-static/WebSocketMainInsecure.swf"
          WebSocket.__addTask(function() {
            Pusher.ready();
          })
          WebSocket.__initialize();
        } else {
          // Flash must not be installed
          Pusher.Transport = null;
          Pusher.TransportType = 'none';
          Pusher.ready();
        }
      }
    }
  }();

  // Allows calling a function when the document body is available
  var ondocumentbody = function(callback) {
    var load_body = function() {
      document.body ? callback() : setTimeout(load_body, 0);
    }
    load_body();
  };

  var initializeOnDocumentBody = function() {
    ondocumentbody(initialize);
  }

  if (deps.length > 0) {
    _require(deps, initializeOnDocumentBody);
  } else {
    initializeOnDocumentBody();
  }
})();


this.Pusher = Pusher;

}).call(uploadcare);
