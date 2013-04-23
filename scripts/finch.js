/*
	Finch.js - Powerfully simple javascript routing
	by Rick Allen (stoodder) and Greg Smith (smrq)

	Version 0.5.8
	Full source at https://github.com/stoodder/finchjs
	Copyright (c) 2011 RokkinCat, http://www.rokkincat.com

	MIT License, https://github.com/stoodder/finchjs/blob/master/LICENSE.md
	This file is generated by `cake build`, do not edit it by hand.
*/
(function() {
  var CurrentHash, CurrentParameters, CurrentPath, CurrentTargetPath, Finch, HashInterval, HashListening, IgnoreObservables, LoadCompleted, NodeType, NullPath, Options, ParameterObservable, ParsedRouteString, PreviousParameters, RootNode, RouteNode, RoutePath, RouteSettings, SetupCalled, addRoute, arraysEqual, compact, console, contains, countSubstrings, diffObjects, endsWith, extend, findNearestCommonAncestor, findPath, getComponentName, getComponentType, getHash, hashChangeListener, isArray, isBoolean, isFunction, isNumber, isObject, isString, objectKeys, objectValues, objectsEqual, parseParameters, parseQueryString, parseRouteString, peek, resetGlobals, runObservables, setHash, splitUri, startsWith, step, stepLoad, stepSetup, stepTeardown, stepUnload, trim, trimSlashes, _ref, _ref1, _ref2,
    __slice = [].slice;

  isObject = function(object) {
    return (typeof object) === (typeof {}) && object !== null;
  };

  isFunction = function(object) {
    return Object.prototype.toString.call(object) === "[object Function]";
  };

  isBoolean = function(object) {
    return Object.prototype.toString.call(object) === "[object Boolean]";
  };

  isArray = function(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  };

  isString = function(object) {
    return Object.prototype.toString.call(object) === "[object String]";
  };

  isNumber = function(object) {
    return Object.prototype.toString.call(object) === "[object Number]";
  };

  trim = function(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  trimSlashes = function(str) {
    return str.replace(/^\//, '').replace(/\/$/, '');
  };

  startsWith = function(haystack, needle) {
    return haystack.indexOf(needle) === 0;
  };

  endsWith = function(haystack, needle) {
    return haystack.indexOf(needle, haystack.length - needle.length) !== -1;
  };

  contains = function(haystack, needle) {
    var hay, _i, _len;

    if (isFunction(haystack.indexOf)) {
      return haystack.indexOf(needle) !== -1;
    } else if (isArray(haystack)) {
      for (_i = 0, _len = haystack.length; _i < _len; _i++) {
        hay = haystack[_i];
        if (hay === needle) {
          return true;
        }
      }
    }
    return false;
  };

  peek = function(arr) {
    return arr[arr.length - 1];
  };

  countSubstrings = function(str, substr) {
    return str.split(substr).length - 1;
  };

  objectKeys = function(obj) {
    var key, _results;

    _results = [];
    for (key in obj) {
      _results.push(key);
    }
    return _results;
  };

  objectValues = function(obj) {
    var key, value, _results;

    _results = [];
    for (key in obj) {
      value = obj[key];
      _results.push(value);
    }
    return _results;
  };

  extend = function(obj, extender) {
    var key, value;

    if (!isObject(obj)) {
      obj = {};
    }
    if (!isObject(extender)) {
      extender = {};
    }
    for (key in extender) {
      value = extender[key];
      obj[key] = value;
    }
    return obj;
  };

  compact = function(obj) {
    var key, newObj, value;

    if (!isObject(obj)) {
      obj = {};
    }
    newObj = {};
    for (key in obj) {
      value = obj[key];
      if (value != null) {
        newObj[key] = value;
      }
    }
    return newObj;
  };

  objectsEqual = function(obj1, obj2) {
    var key, value;

    for (key in obj1) {
      value = obj1[key];
      if (obj2[key] !== value) {
        return false;
      }
    }
    for (key in obj2) {
      value = obj2[key];
      if (obj1[key] !== value) {
        return false;
      }
    }
    return true;
  };

  arraysEqual = function(arr1, arr2) {
    var index, value, _i, _len;

    if (arr1.length !== arr2.length) {
      return false;
    }
    for (index = _i = 0, _len = arr1.length; _i < _len; index = ++_i) {
      value = arr1[index];
      if (arr2[index] !== value) {
        return false;
      }
    }
    return true;
  };

  diffObjects = function(oldObject, newObject) {
    var key, result, value;

    if (oldObject == null) {
      oldObject = {};
    }
    if (newObject == null) {
      newObject = {};
    }
    result = {};
    for (key in oldObject) {
      value = oldObject[key];
      if (newObject[key] !== value) {
        result[key] = newObject[key];
      }
    }
    for (key in newObject) {
      value = newObject[key];
      if (oldObject[key] !== value) {
        result[key] = value;
      }
    }
    return result;
  };

  console = (_ref = window.console) != null ? _ref : {};

  if ((_ref1 = console.log) == null) {
    console.log = (function() {});
  }

  if ((_ref2 = console.warn) == null) {
    console.warn = (function() {});
  }

  ParsedRouteString = (function() {
    function ParsedRouteString(_arg) {
      var childIndex, components;

      components = _arg.components, childIndex = _arg.childIndex;
      this.components = components != null ? components : [];
      this.childIndex = childIndex != null ? childIndex : 0;
    }

    return ParsedRouteString;

  })();

  RouteNode = (function() {
    function RouteNode(_arg) {
      var name, nodeType, parent, _ref3;

      _ref3 = _arg != null ? _arg : {}, name = _ref3.name, nodeType = _ref3.nodeType, parent = _ref3.parent;
      this.name = name != null ? name : "";
      this.nodeType = nodeType != null ? nodeType : null;
      this.parent = parent != null ? parent : null;
      this.routeSettings = null;
      this.childLiterals = {};
      this.childVariable = null;
      this.bindings = [];
    }

    return RouteNode;

  })();

  RouteSettings = (function() {
    function RouteSettings(_arg) {
      var context, load, setup, teardown, unload, _ref3;

      _ref3 = _arg != null ? _arg : {}, setup = _ref3.setup, teardown = _ref3.teardown, load = _ref3.load, unload = _ref3.unload, context = _ref3.context;
      this.setup = isFunction(setup) ? setup : (function() {});
      this.load = isFunction(load) ? load : (function() {});
      this.unload = isFunction(unload) ? unload : (function() {});
      this.teardown = isFunction(teardown) ? teardown : (function() {});
      this.context = isObject(context) ? context : {};
    }

    return RouteSettings;

  })();

  RoutePath = (function() {
    function RoutePath(_arg) {
      var boundValues, node, parameterObservables, _ref3;

      _ref3 = _arg != null ? _arg : {}, node = _ref3.node, boundValues = _ref3.boundValues, parameterObservables = _ref3.parameterObservables;
      this.node = node != null ? node : null;
      this.boundValues = boundValues != null ? boundValues : [];
      this.parameterObservables = parameterObservables != null ? parameterObservables : [[]];
    }

    RoutePath.prototype.getBindings = function() {
      var binding, bindings, index, _i, _len, _ref3;

      bindings = {};
      _ref3 = this.node.bindings;
      for (index = _i = 0, _len = _ref3.length; _i < _len; index = ++_i) {
        binding = _ref3[index];
        bindings[binding] = this.boundValues[index];
      }
      return parseParameters(bindings);
    };

    RoutePath.prototype.isEqual = function(path) {
      return (path != null) && this.node === path.node && arraysEqual(this.boundValues, path.boundValues);
    };

    RoutePath.prototype.isRoot = function() {
      return this.node.parent == null;
    };

    RoutePath.prototype.getParent = function() {
      var bindingCount, boundValues, parameterObservables, _ref3, _ref4;

      if (this.node == null) {
        return null;
      }
      bindingCount = (_ref3 = (_ref4 = this.node.parent) != null ? _ref4.bindings.length : void 0) != null ? _ref3 : 0;
      boundValues = this.boundValues.slice(0, bindingCount);
      parameterObservables = this.parameterObservables.slice(0, -1);
      return new RoutePath({
        node: this.node.parent,
        boundValues: boundValues,
        parameterObservables: parameterObservables
      });
    };

    RoutePath.prototype.getChild = function(targetPath) {
      var parent;

      while ((targetPath != null) && !this.isEqual(parent = targetPath.getParent())) {
        targetPath = parent;
      }
      targetPath.parameterObservables = this.parameterObservables.slice(0);
      targetPath.parameterObservables.push([]);
      return targetPath;
    };

    return RoutePath;

  })();

  ParameterObservable = (function() {
    function ParameterObservable(callback) {
      this.callback = callback;
      if (!isFunction(this.callback)) {
        this.callback = (function() {});
      }
      this.dependencies = [];
      this.initialized = false;
    }

    ParameterObservable.prototype.notify = function(updatedKeys) {
      var shouldTrigger,
        _this = this;

      shouldTrigger = (function() {
        var key, _i, _len, _ref3;

        if (!_this.initialized) {
          return true;
        }
        _ref3 = _this.dependencies;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          key = _ref3[_i];
          if (contains(updatedKeys, key)) {
            return true;
          }
        }
        return false;
      })();
      if (shouldTrigger) {
        return this.trigger();
      }
    };

    ParameterObservable.prototype.trigger = function() {
      var parameterAccessor,
        _this = this;

      this.dependencies = [];
      parameterAccessor = function(key) {
        if (!contains(_this.dependencies, key)) {
          _this.dependencies.push(key);
        }
        return CurrentParameters[key];
      };
      this.callback(parameterAccessor);
      return this.initialized = true;
    };

    return ParameterObservable;

  })();

  NullPath = new RoutePath({
    node: null
  });

  NodeType = {
    Literal: 'Literal',
    Variable: 'Variable'
  };

  parseQueryString = function(queryString) {
    var key, piece, queryParameters, value, _i, _len, _ref3, _ref4;

    queryString = isString(queryString) ? trim(queryString) : "";
    queryParameters = {};
    if (queryString !== "") {
      _ref3 = queryString.split("&");
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        piece = _ref3[_i];
        _ref4 = piece.split("=", 2), key = _ref4[0], value = _ref4[1];
        queryParameters[key] = value;
      }
    }
    return parseParameters(queryParameters);
  };

  getHash = function() {
    var _ref3;

    return "#" + ((_ref3 = window.location.href.split("#", 2)[1]) != null ? _ref3 : "");
  };

  setHash = function(hash) {
    if (!isString(hash)) {
      hash = "";
    }
    hash = trim(hash);
    if (hash.slice(0, 1) === '#') {
      hash = hash.slice(1);
    }
    return window.location.hash = hash;
  };

  parseParameters = function(params) {
    var key, value;

    if (!isObject(params)) {
      params = {};
    }
    if (Options.CoerceParameterTypes) {
      for (key in params) {
        value = params[key];
        if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        } else if (/^[0-9]+$/.test(value)) {
          value = parseInt(value);
        } else if (/^[0-9]+\.[0-9]*$/.test(value)) {
          value = parseFloat(value);
        }
        params[key] = value;
      }
    }
    return params;
  };

  splitUri = function(uri) {
    var components;

    uri = trimSlashes(uri);
    components = uri === "" ? [] : uri.split("/");
    components.unshift("/");
    return components;
  };

  parseRouteString = function(routeString) {
    var childIndex, component, components, flatRouteString, hasParent, parentComponents, parentString, _i, _len;

    hasParent = contains(routeString, "[") || contains(routeString, "]");
    if (hasParent) {
      (function() {
        var endCount, startCount;

        startCount = countSubstrings(routeString, "[");
        if (startCount !== 1) {
          if (startCount > 1) {
            console.warn("[FINCH] Parsing failed on \"" + routeString + "\": Extra [");
          }
          if (startCount < 1) {
            console.warn("[FINCH] Parsing failed on \"" + routeString + "\": Missing [");
          }
          return null;
        }
        endCount = countSubstrings(routeString, "]");
        if (endCount !== 1) {
          if (endCount > 1) {
            console.warn("[FINCH] Parsing failed on \"" + routeString + "\": Extra ]");
          }
          if (endCount < 1) {
            console.warn("[FINCH] Parsing failed on \"" + routeString + "\": Missing ]");
          }
          return null;
        }
        if (!startsWith(routeString, "[")) {
          console.warn("[FINCH] Parsing failed on \"" + routeString + "\": [ not at beginning");
          return null;
        }
      })();
    }
    flatRouteString = routeString.replace(/[\[\]]/g, "");
    if (flatRouteString === "") {
      components = [];
    } else {
      components = splitUri(flatRouteString);
    }
    for (_i = 0, _len = components.length; _i < _len; _i++) {
      component = components[_i];
      if (component === "") {
        console.warn("[FINCH] Parsing failed on \"" + routeString + "\": Blank component");
        return null;
      }
    }
    childIndex = 0;
    if (hasParent) {
      parentString = routeString.split("]")[0];
      parentComponents = splitUri(parentString.replace("[", ""));
      if (parentComponents[parentComponents.length - 1] !== components[parentComponents.length - 1]) {
        console.warn("[FINCH] Parsing failed on \"" + routeString + "\": ] in the middle of a component");
        return null;
      }
      if (parentComponents.length === components.length) {
        console.warn("[FINCH] Parsing failed on \"" + routeString + "\": No child components");
        return null;
      }
      childIndex = parentComponents.length;
    }
    return new ParsedRouteString({
      components: components,
      childIndex: childIndex
    });
  };

  getComponentType = function(routeStringComponent) {
    if (startsWith(routeStringComponent, ":")) {
      return NodeType.Variable;
    }
    return NodeType.Literal;
  };

  getComponentName = function(routeStringComponent) {
    switch (getComponentType(routeStringComponent)) {
      case NodeType.Literal:
        return routeStringComponent;
      case NodeType.Variable:
        return routeStringComponent.slice(1);
    }
  };

  addRoute = function(rootNode, parsedRouteString, settings) {
    var bindings, childIndex, components, parentNode, recur;

    components = parsedRouteString.components, childIndex = parsedRouteString.childIndex;
    parentNode = rootNode;
    bindings = [];
    return (recur = function(currentNode, currentIndex) {
      var component, componentName, componentType, nextNode, _base, _ref3, _ref4;

      if (currentIndex === childIndex) {
        parentNode = currentNode;
      }
      if (parsedRouteString.components.length <= 0) {
        currentNode.parent = parentNode;
        currentNode.bindings = bindings;
        return currentNode.routeSettings = new RouteSettings(settings);
      }
      component = components.shift();
      componentType = getComponentType(component);
      componentName = getComponentName(component);
      switch (componentType) {
        case NodeType.Literal:
          nextNode = (_ref3 = (_base = currentNode.childLiterals)[componentName]) != null ? _ref3 : _base[componentName] = new RouteNode({
            name: "" + currentNode.name + component + "/",
            nodeType: componentType,
            parent: rootNode
          });
          break;
        case NodeType.Variable:
          nextNode = (_ref4 = currentNode.childVariable) != null ? _ref4 : currentNode.childVariable = new RouteNode({
            name: "" + currentNode.name + component + "/",
            nodeType: componentType,
            parent: rootNode
          });
          bindings.push(componentName);
      }
      return recur(nextNode, currentIndex + 1);
    })(rootNode, 0);
  };

  findPath = function(rootNode, uri) {
    var boundValues, recur, uriComponents;

    uriComponents = splitUri(uri);
    boundValues = [];
    return (recur = function(currentNode, uriComponents) {
      var component, result;

      if (uriComponents.length <= 0 && (currentNode.routeSettings != null)) {
        return new RoutePath({
          node: currentNode,
          boundValues: boundValues
        });
      }
      component = uriComponents[0];
      if (currentNode.childLiterals[component] != null) {
        result = recur(currentNode.childLiterals[component], uriComponents.slice(1));
        if (result != null) {
          return result;
        }
      }
      if (currentNode.childVariable != null) {
        boundValues.push(component);
        result = recur(currentNode.childVariable, uriComponents.slice(1));
        if (result != null) {
          return result;
        }
        boundValues.pop();
      }
      return null;
    })(rootNode, uriComponents);
  };

  findNearestCommonAncestor = function(path1, path2) {
    var ancestor, ancestors, currentRoute, _i, _len;

    ancestors = [];
    currentRoute = path2;
    while (currentRoute != null) {
      ancestors.push(currentRoute);
      currentRoute = currentRoute.getParent();
    }
    currentRoute = path1;
    while (currentRoute != null) {
      for (_i = 0, _len = ancestors.length; _i < _len; _i++) {
        ancestor = ancestors[_i];
        if (currentRoute.isEqual(ancestor)) {
          return currentRoute;
        }
      }
      currentRoute = currentRoute.getParent();
    }
    return null;
  };

  RootNode = CurrentPath = CurrentTargetPath = null;

  PreviousParameters = CurrentParameters = null;

  HashInterval = CurrentHash = null;

  HashListening = false;

  IgnoreObservables = SetupCalled = false;

  LoadCompleted = false;

  Options = {
    CoerceParameterTypes: false
  };

  (resetGlobals = function() {
    RootNode = new RouteNode({
      name: "*"
    });
    CurrentPath = NullPath;
    PreviousParameters = {};
    CurrentParameters = {};
    CurrentTargetPath = null;
    HashInterval = null;
    CurrentHash = null;
    HashListening = false;
    IgnoreObservables = false;
    SetupCalled = false;
    return LoadCompleted = false;
  })();

  step = function() {
    var ancestorPath;

    if (CurrentTargetPath === null) {
      return runObservables();
    } else if (LoadCompleted) {
      return stepUnload();
    } else if (CurrentTargetPath.isEqual(CurrentPath)) {
      return stepLoad();
    } else {
      ancestorPath = findNearestCommonAncestor(CurrentPath, CurrentTargetPath);
      if (CurrentPath.isEqual(ancestorPath)) {
        return stepSetup();
      } else {
        return stepTeardown();
      }
    }
  };

  stepSetup = function() {
    var bindings, context, load, parentContext, recur, setup, _ref3, _ref4, _ref5, _ref6;

    SetupCalled = true;
    parentContext = ((_ref3 = (_ref4 = CurrentPath.node) != null ? _ref4.routeSettings : void 0) != null ? _ref3 : {
      context: null
    }).context;
    CurrentPath = CurrentPath.getChild(CurrentTargetPath);
    _ref6 = (_ref5 = CurrentPath.node.routeSettings) != null ? _ref5 : {}, context = _ref6.context, setup = _ref6.setup, load = _ref6.load;
    if (context == null) {
      context = {};
    }
    context.parent = parentContext;
    if (setup == null) {
      setup = (function() {});
    }
    if (load == null) {
      load = (function() {});
    }
    bindings = CurrentPath.getBindings();
    recur = function() {
      return step();
    };
    if (setup.length === 2) {
      return setup.call(context, bindings, recur);
    } else {
      setup.call(context, bindings);
      return recur();
    }
  };

  stepLoad = function() {
    var bindings, context, load, recur, setup, _ref3, _ref4;

    recur = function() {
      LoadCompleted = true;
      CurrentTargetPath = null;
      return step();
    };
    if (CurrentPath.node == null) {
      return recur();
    }
    _ref4 = (_ref3 = CurrentPath.node.routeSettings) != null ? _ref3 : {}, context = _ref4.context, setup = _ref4.setup, load = _ref4.load;
    if (context == null) {
      context = {};
    }
    if (setup == null) {
      setup = (function() {});
    }
    if (load == null) {
      load = (function() {});
    }
    bindings = CurrentPath.getBindings();
    if (load.length === 2) {
      return load.call(context, bindings, recur);
    } else {
      load.call(context, bindings);
      return recur();
    }
  };

  stepUnload = function() {
    var bindings, context, recur, unload, _ref3, _ref4;

    LoadCompleted = false;
    recur = function() {
      return step();
    };
    _ref4 = (_ref3 = CurrentPath.node.routeSettings) != null ? _ref3 : {}, context = _ref4.context, unload = _ref4.unload;
    if (context == null) {
      context = {};
    }
    if (unload == null) {
      unload = (function() {});
    }
    bindings = CurrentPath.getBindings();
    if (unload.length === 2) {
      return unload.call(context, bindings, recur);
    } else {
      unload.call(context, bindings);
      return recur();
    }
  };

  stepTeardown = function() {
    var bindings, context, recur, teardown, _ref3, _ref4;

    SetupCalled = false;
    _ref4 = (_ref3 = CurrentPath.node.routeSettings) != null ? _ref3 : {}, context = _ref4.context, teardown = _ref4.teardown;
    if (context == null) {
      context = {};
    }
    if (teardown == null) {
      teardown = (function() {});
    }
    bindings = CurrentPath.getBindings();
    recur = function() {
      CurrentPath = CurrentPath.getParent();
      return step();
    };
    if (teardown.length === 2) {
      return teardown.call(context, bindings, recur);
    } else {
      teardown.call(context, bindings);
      return recur();
    }
  };

  runObservables = function() {
    var keys, observable, observableList, _i, _len, _ref3, _results;

    keys = objectKeys(diffObjects(PreviousParameters, CurrentParameters));
    PreviousParameters = CurrentParameters;
    _ref3 = CurrentPath.parameterObservables;
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      observableList = _ref3[_i];
      _results.push((function() {
        var _j, _len1, _results1;

        _results1 = [];
        for (_j = 0, _len1 = observableList.length; _j < _len1; _j++) {
          observable = observableList[_j];
          _results1.push(observable.notify(keys));
        }
        return _results1;
      })());
    }
    return _results;
  };

  hashChangeListener = function(event) {
    var hash;

    hash = getHash();
    if (startsWith(hash, "#")) {
      hash = hash.slice(1);
    }
    hash = unescape(hash);
    if (hash !== CurrentHash) {
      if (Finch.call(hash)) {
        return CurrentHash = hash;
      } else {
        return setHash(CurrentHash != null ? CurrentHash : "");
      }
    }
  };

  Finch = {
    route: function(pattern, settings) {
      var cb, parsedRouteString;

      if (isFunction(settings)) {
        cb = settings;
        settings = {
          setup: cb
        };
        if (cb.length === 2) {
          settings.load = function(bindings, next) {
            if (!SetupCalled) {
              IgnoreObservables = true;
              return cb(bindings, next);
            } else {
              return next();
            }
          };
        } else {
          settings.load = function(bindings) {
            if (!SetupCalled) {
              IgnoreObservables = true;
              return cb(bindings);
            }
          };
        }
      }
      if (!isObject(settings)) {
        settings = {};
      }
      if (!isString(pattern)) {
        pattern = "";
      }
      pattern = trim(pattern);
      if (!(pattern.length > 0)) {
        pattern = "/";
      }
      parsedRouteString = parseRouteString(pattern);
      if (parsedRouteString == null) {
        return false;
      }
      addRoute(RootNode, parsedRouteString, settings);
      return true;
    },
    call: function(uri) {
      var bindings, newPath, previousTargetPath, queryParameters, queryString, _ref3;

      if (!isString(uri)) {
        uri = "/";
      }
      if (uri === "") {
        uri = "/";
      }
      _ref3 = uri.split("?", 2), uri = _ref3[0], queryString = _ref3[1];
      newPath = findPath(RootNode, uri);
      if (newPath == null) {
        console.warn("[FINCH] Could not find route for: " + uri);
        return false;
      }
      queryParameters = parseQueryString(queryString);
      bindings = newPath.getBindings();
      CurrentParameters = extend(queryParameters, bindings);
      if (CurrentTargetPath === null && CurrentPath.isEqual(newPath)) {
        step();
      } else {
        previousTargetPath = CurrentTargetPath;
        CurrentTargetPath = newPath;
        if (previousTargetPath == null) {
          step();
        }
      }
      return true;
    },
    reload: function() {
      if (!LoadCompleted) {
        return this;
      }
      if (!((CurrentPath != null) && (CurrentPath.node != null))) {
        return this;
      }
      CurrentTargetPath = CurrentPath;
      step();
      return this;
    },
    observe: function() {
      var args, callback, keys, observable;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (IgnoreObservables) {
        return IgnoreObservables = false;
      }
      callback = args.pop();
      if (!isFunction(callback)) {
        callback = (function() {});
      }
      if (args.length > 0) {
        if (args.length === 1 && isArray(args[0])) {
          keys = args[0];
        } else {
          keys = args;
        }
        return Finch.observe(function(paramAccessor) {
          var key, values;

          values = (function() {
            var _i, _len, _results;

            _results = [];
            for (_i = 0, _len = keys.length; _i < _len; _i++) {
              key = keys[_i];
              _results.push(paramAccessor(key));
            }
            return _results;
          })();
          return callback.apply(null, values);
        });
      } else {
        observable = new ParameterObservable(callback);
        return peek(CurrentPath.parameterObservables).push(observable);
      }
    },
    abort: function() {
      return CurrentTargetPath = null;
    },
    listen: function() {
      if (!HashListening) {
        if ("onhashchange" in window) {
          if (isFunction(window.addEventListener)) {
            window.addEventListener("hashchange", hashChangeListener, true);
            HashListening = true;
          } else if (isFunction(window.attachEvent)) {
            window.attachEvent("hashchange", hashChangeListener);
            HashListening = true;
          }
        }
        if (!HashListening) {
          HashInterval = setInterval(hashChangeListener, 33);
          HashListening = true;
        }
        hashChangeListener();
      }
      return HashListening;
    },
    ignore: function() {
      if (HashListening) {
        if (HashInterval !== null) {
          clearInterval(HashInterval);
          HashInterval = null;
          HashListening = false;
        } else if ("onhashchange" in window) {
          if (isFunction(window.removeEventListener)) {
            window.removeEventListener("hashchange", hashChangeListener, true);
            HashListening = false;
          } else if (isFunction(window.detachEvent)) {
            window.detachEvent("hashchange", hashChangeListener);
            HashListening = false;
          }
        }
      }
      return !HashListening;
    },
    navigate: function(uri, queryParams, doUpdate) {
      var builtUri, currentQueryParams, currentQueryString, currentUri, key, piece, queryString, slashIndex, uriParamString, uriQueryParams, value, _ref3, _ref4;

      _ref3 = getHash().split("?", 2), currentUri = _ref3[0], currentQueryString = _ref3[1];
      if (currentUri == null) {
        currentUri = "";
      }
      if (currentQueryString == null) {
        currentQueryString = "";
      }
      if (currentUri.slice(0, 1) === "#") {
        currentUri = currentUri.slice(1);
      }
      currentUri = unescape(currentUri);
      currentQueryParams = parseQueryString(currentQueryString);
      if (isBoolean(queryParams)) {
        doUpdate = queryParams;
      }
      if (isObject(uri)) {
        queryParams = uri;
      }
      if (!isString(uri)) {
        uri = "";
      }
      if (!isObject(queryParams)) {
        queryParams = {};
      }
      if (!isBoolean(doUpdate)) {
        doUpdate = false;
      }
      uri = trim(uri);
      if (uri.length === 0) {
        uri = null;
      }
      if (doUpdate) {
        (function() {
          var key, newQueryParams, value;

          newQueryParams = {};
          for (key in currentQueryParams) {
            value = currentQueryParams[key];
            newQueryParams[unescape(key)] = unescape(value);
          }
          return currentQueryParams = newQueryParams;
        })();
        queryParams = extend(currentQueryParams, queryParams);
      }
      if (uri === null) {
        uri = currentUri;
      }
      _ref4 = uri.split("?", 2), uri = _ref4[0], uriParamString = _ref4[1];
      if (uri.slice(0, 1) === "#") {
        uri = uri.slice(1);
      }
      if (startsWith(uri, "./") || startsWith(uri, "../")) {
        builtUri = currentUri;
        while (startsWith(uri, "./") || startsWith(uri, "../")) {
          slashIndex = uri.indexOf("/");
          piece = uri.slice(0, slashIndex);
          uri = uri.slice(slashIndex + 1);
          if (piece === "..") {
            builtUri = builtUri.slice(0, builtUri.lastIndexOf("/"));
          }
        }
        uri = uri.length > 0 ? "" + builtUri + "/" + uri : builtUri;
      }
      uriQueryParams = isString(uriParamString) ? parseQueryString(uriParamString) : {};
      queryParams = extend(uriQueryParams, queryParams);
      queryParams = compact(queryParams);
      uri = escape(uri);
      queryString = ((function() {
        var _results;

        _results = [];
        for (key in queryParams) {
          value = queryParams[key];
          _results.push(escape(key) + "=" + escape(value));
        }
        return _results;
      })()).join("&");
      if (queryString.length > 0) {
        uri += "?" + queryString;
      }
      return setHash(uri);
    },
    reset: function() {
      Finch.options({
        CoerceParameterTypes: false
      });
      CurrentTargetPath = NullPath;
      step();
      Finch.ignore();
      resetGlobals();
    },
    options: function(newOptions) {
      return extend(Options, newOptions);
    }
  };

  this.Finch = Finch;

}).call(this);
