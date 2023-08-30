define(['react'], (function (React) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

	var classnames$1 = {exports: {}};

	/*!
	  Copyright (c) 2018 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/

	(function (module) {
	/* global define */
	(function () {

	  var hasOwn = {}.hasOwnProperty;

	  function classNames() {
	    var classes = [];

	    for (var i = 0; i < arguments.length; i++) {
	      var arg = arguments[i];
	      if (!arg) continue;
	      var argType = typeof arg;

	      if (argType === 'string' || argType === 'number') {
	        classes.push(arg);
	      } else if (Array.isArray(arg)) {
	        if (arg.length) {
	          var inner = classNames.apply(null, arg);

	          if (inner) {
	            classes.push(inner);
	          }
	        }
	      } else if (argType === 'object') {
	        if (arg.toString === Object.prototype.toString) {
	          for (var key in arg) {
	            if (hasOwn.call(arg, key) && arg[key]) {
	              classes.push(key);
	            }
	          }
	        } else {
	          classes.push(arg.toString());
	        }
	      }
	    }

	    return classes.join(' ');
	  }

	  if (module.exports) {
	    classNames.default = classNames;
	    module.exports = classNames;
	  } else {
	    window.classNames = classNames;
	  }
	})();
	}(classnames$1));

	var classnames = classnames$1.exports;

	/* eslint-disable no-unused-vars */
	const MF_CUSTOM_AUTHENTICATION = "AppSwitcherModule.DS_CustomAuthentication";
	var LoadingState;
	(function (LoadingState) {
	    LoadingState["Idle"] = "idle";
	    LoadingState["Fetching"] = "fetching";
	    LoadingState["Complete"] = "complete";
	    LoadingState["Failed"] = "failed";
	})(LoadingState || (LoadingState = {}));

	var HorizontalPosition;
	(function (HorizontalPosition) {
	    HorizontalPosition[HorizontalPosition["left"] = 0] = "left";
	    HorizontalPosition[HorizontalPosition["right"] = 1] = "right";
	})(HorizontalPosition || (HorizontalPosition = {}));
	var VerticalPosition;
	(function (VerticalPosition) {
	    VerticalPosition[VerticalPosition["up"] = 0] = "up";
	    VerticalPosition[VerticalPosition["down"] = 1] = "down";
	})(VerticalPosition || (VerticalPosition = {}));

	const useDeterminePosition = ({ elementRef, width, height, isOpen, isReady }) => {
	    const [positionX, setPositionX] = React.useState(HorizontalPosition.right);
	    const [positionY, setPositionY] = React.useState(VerticalPosition.down);
	    React.useEffect(() => {
	        if (elementRef && width && height && isOpen) {
	            const position = elementRef.getBoundingClientRect();
	            const offsetLeft = position.x;
	            const offsetTop = position.y;
	            // determine horizontal axis position
	            if (offsetLeft + width > window.innerWidth) {
	                setPositionX(HorizontalPosition.left);
	            }
	            else {
	                setPositionX(HorizontalPosition.right);
	            }
	            // determine vertical axis position
	            if (offsetTop + height > window.innerHeight) {
	                setPositionY(VerticalPosition.up);
	            }
	            else {
	                setPositionY(VerticalPosition.down);
	            }
	        }
	    }, [isReady, isOpen, width, height, elementRef]);
	    return [positionX, positionY];
	};

	const getCustomAuthToken = async () => {
	    const result = new Promise((resolve, reject) => {
	        window.mx.data.action({
	            params: {
	                actionname: MF_CUSTOM_AUTHENTICATION
	            },
	            callback: (response) => {
	                const customAuthentication = JSON.parse(response);
	                resolve(customAuthentication);
	            },
	            error: e => {
	                reject(e);
	            }
	        });
	    });
	    return result;
	};

	const useFetchAppList = (isOpen, forceRefresh, baseURL) => {
	    const [loadingState, setLoadingState] = React.useState(LoadingState.Idle);
	    const [appList, setAppList] = React.useState([]);
	    const [tokenIsValid, setTokenIsValid] = React.useState(false);
	    const [authorizationError, setAuthorizationError] = React.useState(false);
	    const [fetchCount, setFetchCount] = React.useState(0);
	    const [timeStamp, setTimeStamp] = React.useState();
	    const [authenticationData, setAuthenticationData] = React.useState();
	    const shouldRefreshAuthToken = () => {
	        if (!timeStamp || !authenticationData) {
	            return true;
	        }
	        const now = new Date();
	        const diffInSeconds = Math.round((now.getTime() - timeStamp.getTime()) / 1000);
	        return diffInSeconds >= authenticationData.timeToLive || fetchCount >= authenticationData.timesToUse;
	    };
	    React.useEffect(() => {
	        if (shouldRefreshAuthToken()) {
	            setTokenIsValid(false);
	            return;
	        }
	        if (isOpen) {
	            fetchAppList();
	        }
	        // eslint-disable-next-line react-hooks/exhaustive-deps
	    }, [authenticationData, forceRefresh, isOpen]); // Warning: fetchAppList can't be added as dependency because it will create a loop.
	    React.useEffect(() => {
	        if (!tokenIsValid) {
	            getCustomAuthToken().then(customAuthentication => {
	                if (!customAuthentication.authorization) {
	                    setAuthorizationError(true);
	                    return;
	                }
	                setAuthenticationData(customAuthentication);
	                setFetchCount(0);
	                setTokenIsValid(true);
	                setTimeStamp(new Date());
	            });
	        }
	    }, [tokenIsValid]);
	    const fetchAppList = React.useCallback(async () => {
	        if (!authenticationData || !authenticationData.authorization || loadingState === LoadingState.Fetching) {
	            return;
	        }
	        setLoadingState(LoadingState.Fetching);
	        setFetchCount(fetchCount => fetchCount + 1);
	        const url = `${baseURL}/users/${authenticationData.userId}/apps?refresh=${forceRefresh}`;
	        const options = {
	            method: "GET",
	            headers: {
	                Authorization: authenticationData.authorization,
	                Accept: "application/json",
	                "Content-Type": "application/json"
	            }
	        };
	        fetch(url, options)
	            .then(response => {
	            if (!response.ok || response.status >= 400) {
	                setTokenIsValid(false);
	                return;
	            }
	            const json = response.json();
	            setLoadingState(LoadingState.Complete);
	            return json;
	        })
	            .then(json => {
	            if (json) {
	                setAppList(json);
	            }
	        })
	            .catch(() => {
	            setTokenIsValid(false);
	            setLoadingState(LoadingState.Failed);
	            console.error("AppSwitcher >> Invalid token. Please refresh it.");
	        });
	    }, [authenticationData, baseURL, forceRefresh, loadingState]);
	    return { authorizationError, appListLoadingState: loadingState, appList };
	};

	const ArrowLeftIcon = ({ className = "" }) => (
	// TODO: This icon is super complex for what it needs to do. Maybe we can simplify it.
	React.createElement("svg", { className: className, viewBox: "0 0 16 17", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
	    React.createElement("g", { clipPath: "url(#clip0_1814_7216)" },
	        React.createElement("path", { d: "M15.5 8.5H0.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
	        React.createElement("path", { d: "M7.5 15.5L0.5 8.5L7.5 1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })),
	    React.createElement("defs", null,
	        React.createElement("clipPath", { id: "clip0_1814_7216" },
	            React.createElement("rect", { width: "16", height: "16", fill: "currentColor", transform: "translate(0 0.5)" })))));
	var ArrowLeftIcon$1 = React__default["default"].memo(ArrowLeftIcon);

	const SearchIcon = ({ className = "" }) => (React.createElement("svg", { className: className, viewBox: "0 0 24 24" },
	    React.createElement("path", { stroke: "currentColor", fill: "transparent", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M14.406 18.573A7.874 7.874 0 108.246 4.08a7.874 7.874 0 006.16 14.493zM16.893 16.893L23 23.001" })));
	var SearchIcon$1 = React__default["default"].memo(SearchIcon);

	const ExternalLinkIcon = ({ className = "" }) => (React.createElement("svg", { className: className, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
	    React.createElement("path", { d: "M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
	    React.createElement("path", { d: "M12.5 2.5H17.5V7.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
	    React.createElement("path", { d: "M8.33337 11.6667L17.5 2.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })));
	var ExternalLinkIcon$1 = React__default["default"].memo(ExternalLinkIcon);

	const AppListItem = ({ data }) => {
	    return (React.createElement("a", { href: data.appURL, className: "mxappswitcher-list-item", title: data.appName },
	        React.createElement("div", { className: "mxappswitcher-list-item__container", key: data.appId },
	            React.createElement("img", { className: "mxappswitcher-list-item__image", src: Object.prototype.hasOwnProperty.call(data, "appLogo")
	                    ? data.appLogo
	                    : "./img/AppSwitcherModule$Images$Mendix_logo.svg" }),
	            React.createElement("p", { className: "mxappswitcher-list-item__name" }, data.appName),
	            React.createElement("a", { href: data.appURL, className: "mxappswitcher-list-item__link", target: "_blank", rel: "noreferrer" },
	                React.createElement(ExternalLinkIcon$1, { className: "mxappswitcher-list-item__external-link" })))));
	};

	const ForceRefreshIcon = ({ className = "" }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", className: className, viewBox: "0 0 20 20" },
	    React.createElement("path", { d: "M19.167 3.333v5h-5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
	    React.createElement("path", { d: "M17.075 12.5a7.5 7.5 0 11-1.767-7.8l3.859 3.633", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })));
	var ForceRefreshIcon$1 = React__default["default"].memo(ForceRefreshIcon);

	const AppList = ({ appList, setForceRefresh, forceRefresh, setSearchValue }) => {
	    const onSetForceRefresh = () => {
	        setForceRefresh(true);
	        setSearchValue("");
	    };
	    return (React.createElement("div", { className: "mxappswitcher-list mxappswitcher-panel__list" },
	        (appList === null || appList === void 0 ? void 0 : appList.length) === 0 && React.createElement("span", { className: "mxappswitcher-list__empty-message" }, "No apps found"),
	        appList && appList.length > 0 && (React.createElement(React.Fragment, null,
	            React.createElement("div", { className: "mxappswitcher-list__title-wrapper" },
	                React.createElement("span", { className: "mxappswitcher-list__title" }, "Your apps"),
	                React.createElement("button", { className: classnames("mxappswitcher-list__refresh-button", {
	                        "mxappswitcher-list__refresh-button--disabled": forceRefresh
	                    }), onClick: onSetForceRefresh },
	                    React.createElement(ForceRefreshIcon$1, { className: "mxappswitcher-list__refresh-button-icon" }))),
	            appList.map((appData) => {
	                return React.createElement(AppListItem, { data: appData, key: appData.appId });
	            })))));
	};

	const Footer = () => {
	    return (React.createElement("div", { className: "mxappswitcher-footer mxappswitcher-panel__footer" },
	        React.createElement("img", { className: "mxappswitcher-footer__logo", src: "./img/AppSwitcherModule$Images$Mendix_logo.svg" }),
	        React.createElement("div", { className: "mxappswitcher-footer__text" },
	            React.createElement("p", { className: "mxappswitcher-footer__details" }, "Have an idea for an app?"),
	            React.createElement("p", { className: "mxappswitcher-footer__details" },
	                React.createElement("a", { className: "mxappswitcher-footer__link", href: "https://new.mendix.com/link/overview/", target: "_blank", rel: "noreferrer" }, "Create an app"),
	                " ",
	                "or visit the",
	                " ",
	                React.createElement("a", { className: "mxappswitcher-footer__link", href: "https://marketplace.mendix.com/", target: "_blank", rel: "noreferrer" }, "Marketplace")))));
	};
	var Footer$1 = React__default["default"].memo(Footer);

	const SkeletonLoader = () => {
	    const skeletonItemCount = 7;
	    return (React.createElement("div", { className: "mxappswitcher-skeleton-loader mxappswitcher-panel__skeleton-loader" },
	        React.createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__title" }),
	        Array.from({ length: skeletonItemCount }, (_, i) => (React.createElement("div", { key: i, className: "mxappswitcher-skeleton-loader__item" },
	            React.createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__item-icon" }),
	            React.createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__item-name" }),
	            React.createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__item-link" }))))));
	};
	var SkeletonLoader$1 = React__default["default"].memo(SkeletonLoader);

	const AppSwitcherPanel = ({ appListResponse, appListLoadingState, setForceRefresh, authorizationError, forceRefresh, positioning, positionX, positionY, setAppSwitcherPanelWidth, setAppSwitcherPanelHeight, onClose }) => {
	    const ref = React.useRef(null);
	    const [filteredAppList, setFilteredAppList] = React.useState();
	    const [searchValue, setSearchValue] = React.useState("");
	    React.useEffect(() => {
	        setFilteredAppList(appListResponse);
	    }, [appListResponse]);
	    const onSearchChange = (event) => {
	        const searchQuery = event.target.value;
	        setSearchValue(event.target.value);
	        if (searchQuery !== "") {
	            const result = filterAppList(searchQuery);
	            setFilteredAppList(result);
	        }
	        else {
	            setFilteredAppList(appListResponse);
	        }
	    };
	    const filterAppList = (searchQuery) => {
	        return appListResponse !== undefined
	            ? appListResponse.filter((result) => {
	                return result.appName.toLowerCase().includes(searchQuery.toLowerCase());
	            })
	            : [];
	    };
	    React.useLayoutEffect(() => {
	        if (ref.current) {
	            setAppSwitcherPanelWidth(ref.current.offsetWidth);
	            setAppSwitcherPanelHeight(ref.current.offsetHeight);
	        }
	    }, [setAppSwitcherPanelHeight, setAppSwitcherPanelWidth]);
	    return (React.createElement("div", { className: classnames("mxappswitcher-panel", { "mxappswitcher-panel--sidebar-left": positioning === "sidebarLeft" }, {
	            "mxappswitcher-panel--right-up": positioning === "contextMenu" &&
	                positionX === HorizontalPosition.right &&
	                positionY === VerticalPosition.up
	        }, {
	            "mxappswitcher-panel--left-up": positioning === "contextMenu" &&
	                positionY === VerticalPosition.up &&
	                positionX === HorizontalPosition.left
	        }, {
	            "mxappswitcher-panel--left-down": positioning === "contextMenu" &&
	                positionY === VerticalPosition.down &&
	                positionX === HorizontalPosition.left
	        }), ref: ref },
	        React.createElement("button", { onClick: onClose, className: "mxappswitcher-close-button mxappswitcher-panel__close-button" },
	            React.createElement(ArrowLeftIcon$1, { className: "mxappswitcher-close-button__icon" }),
	            " Close"),
	        React.createElement("div", { className: "mxappswitcher-search mxappswitcher-panel__search" },
	            React.createElement("input", { className: "mxappswitcher-search__input", type: "text", value: searchValue, onChange: onSearchChange, placeholder: "Search Apps", maxLength: 40 }),
	            React.createElement(SearchIcon$1, { className: "mxappswitcher-search__icon" })),
	        appListLoadingState === LoadingState.Complete ? (React.createElement(AppList, { appList: filteredAppList, setForceRefresh: setForceRefresh, forceRefresh: forceRefresh, setSearchValue: setSearchValue })) : appListLoadingState === LoadingState.Failed || authorizationError ? (React.createElement("p", { className: "mxappswitcher-error mxappswitcher-panel__error" }, "No app here? No worries! Try to refresh the page or contact your admin.")) : (React.createElement(SkeletonLoader$1, null)),
	        React.createElement(Footer$1, null)));
	};
	var AppSwitcherPanel$1 = React__default["default"].memo(AppSwitcherPanel);

	const SwitcherIcon = ({ className = "" }) => {
	    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 32 32" },
	        React.createElement("path", { id: "switcherIconDots", fillRule: "evenodd", clipRule: "evenodd", fill: "currentColor", d: "M8 10a2 2 0 100-4 2 2 0 000 4zM8 18a2 2 0 100-4 2 2 0 000 4zM16 18a2 2 0 100-4 2 2 0 000 4zM24 18a2 2 0 100-4 2 2 0 000 4zM8 26a2 2 0 100-4 2 2 0 000 4zM16 26a2 2 0 100-4 2 2 0 000 4zM24 26a2 2 0 100-4 2 2 0 000 4zM16 10a2 2 0 100-4 2 2 0 000 4zM24 10a2 2 0 100-4 2 2 0 000 4z" })));
	};
	var SwitcherIcon$1 = React__default["default"].memo(SwitcherIcon);

	const ToggleButton = ({ onClick, setAppSwitcherButtonHeight }) => {
	    const ref = React.useRef(null);
	    React.useLayoutEffect(() => {
	        if (ref.current) {
	            setAppSwitcherButtonHeight(ref.current.offsetHeight);
	        }
	    }, [setAppSwitcherButtonHeight]);
	    return (
	    // TODO: Add ARIA to the entire implementation.
	    React.createElement("button", { className: "mxappswitcher-toggle", onClick: onClick, ref: ref },
	        React.createElement(SwitcherIcon$1, { className: "mxappswitcher-toggle__icon" })));
	};
	var ToggleButton$1 = React__default["default"].memo(ToggleButton);

	const AppSwitcherContainer = (props) => {
	    const [isOpen, setIsOpen] = React.useState(false);
	    const ref = React.useRef(null);
	    const [forceRefresh, setForceRefresh] = React.useState(false);
	    const { appListLoadingState, appList, authorizationError } = useFetchAppList(isOpen, forceRefresh, props.baseUrl);
	    const [appSwitcherPanelWidth, setAppSwitcherPanelWidth] = React.useState(0);
	    const [appSwitcherPanelHeight, setAppSwitcherPanelHeight] = React.useState(0);
	    const [appSwitcherButtonHeight, setAppSwitcherButtonHeight] = React.useState(0);
	    const [positionX, positionY] = useDeterminePosition({
	        elementRef: ref.current,
	        width: appSwitcherPanelWidth,
	        height: appSwitcherPanelHeight + appSwitcherButtonHeight,
	        isOpen,
	        isReady: isOpen && appListLoadingState === LoadingState.Complete
	    });
	    React.useEffect(() => {
	        const onOutsideClick = (event) => {
	            if (isOpen && ref.current && !ref.current.contains(event.target)) {
	                setIsOpen(false);
	                setForceRefresh(false);
	            }
	        };
	        document.addEventListener("mousedown", onOutsideClick);
	        return () => {
	            document.removeEventListener("mousedown", onOutsideClick);
	        };
	    }, [isOpen]);
	    return (React.createElement("div", { className: classnames(props.class, "mxappswitcher"), style: props.style, ref: ref },
	        React.createElement(ToggleButton$1, { onClick: () => setIsOpen(!isOpen), setAppSwitcherButtonHeight: setAppSwitcherButtonHeight }),
	        isOpen && (React.createElement(AppSwitcherPanel$1, { appListResponse: appList, appListLoadingState: appListLoadingState, setForceRefresh: setForceRefresh, authorizationError: authorizationError, forceRefresh: forceRefresh, positioning: props.positioning, positionX: positionX, positionY: positionY, setAppSwitcherPanelWidth: setAppSwitcherPanelWidth, setAppSwitcherPanelHeight: setAppSwitcherPanelHeight, onClose: () => setIsOpen(false) }))));
	};

	class AppSwitcher extends React.Component {
	    render() {
	        return (React.createElement(AppSwitcherContainer, { baseUrl: this.props.baseUrl, positioning: this.props.positioning, name: "", class: "" }));
	    }
	}

	return AppSwitcher;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwU3dpdGNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnN0YW50cy50cyIsIi4uLy4uLy4uLy4uLy4uL3R5cGluZ3MvUG9zaXRpb25pbmcudHMiLCIuLi8uLi8uLi8uLi8uLi9zcmMvaG9va3MvdXNlRGV0ZXJtaW5lUG9zaXRpb24udHMiLCIuLi8uLi8uLi8uLi8uLi9zcmMvdXRpbHMvaGVscGVyLnRzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL2hvb2tzL3VzZUZldGNoQXBwTGlzdC50cyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9yZXNvdXJjZXMvQXJyb3dMZWZ0SWNvbi50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvcmVzb3VyY2VzL1NlYXJjaEljb24udHN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL3Jlc291cmNlcy9FeHRlcm5hbExpbmtJY29uLnRzeCIsIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0FwcExpc3RJdGVtLnRzeCIsIi4uLy4uLy4uLy4uLy4uL3NyYy9yZXNvdXJjZXMvRm9yY2VSZWZyZXNoSWNvbi50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9BcHBMaXN0LnRzeCIsIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0Zvb3Rlci50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Ta2VsZXRvbkxvYWRlci50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9BcHBTd2l0Y2hlclBhbmVsLnRzeCIsIi4uLy4uLy4uLy4uLy4uL3NyYy9yZXNvdXJjZXMvU3dpdGNoZXJJY29uLnRzeCIsIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1RvZ2dsZUJ1dHRvbi50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9BcHBTd2l0Y2hlckNvbnRhaW5lci50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvQXBwU3dpdGNoZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTggSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHRcdHZhciBjbGFzc2VzID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRpZiAoYXJnLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZhciBpbm5lciA9IGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdFx0XHRpZiAoaW5uZXIpIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChpbm5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGlmIChhcmcudG9TdHJpbmcgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0Y2xhc3NOYW1lcy5kZWZhdWx0ID0gY2xhc3NOYW1lcztcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmV4cG9ydCBjb25zdCBNRl9DVVNUT01fQVVUSEVOVElDQVRJT04gPSBcIkFwcFN3aXRjaGVyTW9kdWxlLkRTX0N1c3RvbUF1dGhlbnRpY2F0aW9uXCI7XG5cbmV4cG9ydCBlbnVtIExvYWRpbmdTdGF0ZSB7XG4gICAgSWRsZSA9IFwiaWRsZVwiLFxuICAgIEZldGNoaW5nID0gXCJmZXRjaGluZ1wiLFxuICAgIENvbXBsZXRlID0gXCJjb21wbGV0ZVwiLFxuICAgIEZhaWxlZCA9IFwiZmFpbGVkXCJcbn1cbiIsImV4cG9ydCBlbnVtIEhvcml6b250YWxQb3NpdGlvbiB7XG4gICAgXCJsZWZ0XCIsXG4gICAgXCJyaWdodFwiXG59XG5cbmV4cG9ydCBlbnVtIFZlcnRpY2FsUG9zaXRpb24ge1xuICAgIFwidXBcIixcbiAgICBcImRvd25cIlxufVxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgSG9yaXpvbnRhbFBvc2l0aW9uLCBWZXJ0aWNhbFBvc2l0aW9uIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvUG9zaXRpb25pbmdcIjtcblxuY29uc3QgdXNlRGV0ZXJtaW5lUG9zaXRpb24gPSAoe1xuICAgIGVsZW1lbnRSZWYsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIGlzT3BlbixcbiAgICBpc1JlYWR5XG59OiB7XG4gICAgZWxlbWVudFJlZjogSFRNTERpdkVsZW1lbnQgfCBudWxsO1xuICAgIHdpZHRoOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgaXNPcGVuOiBib29sZWFuO1xuICAgIGlzUmVhZHk6IGJvb2xlYW47XG59KTogW0hvcml6b250YWxQb3NpdGlvbiwgVmVydGljYWxQb3NpdGlvbl0gPT4ge1xuICAgIGNvbnN0IFtwb3NpdGlvblgsIHNldFBvc2l0aW9uWF0gPSB1c2VTdGF0ZTxIb3Jpem9udGFsUG9zaXRpb24+KEhvcml6b250YWxQb3NpdGlvbi5yaWdodCk7XG4gICAgY29uc3QgW3Bvc2l0aW9uWSwgc2V0UG9zaXRpb25ZXSA9IHVzZVN0YXRlPFZlcnRpY2FsUG9zaXRpb24+KFZlcnRpY2FsUG9zaXRpb24uZG93bik7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudFJlZiAmJiB3aWR0aCAmJiBoZWlnaHQgJiYgaXNPcGVuKSB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGVsZW1lbnRSZWYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXRMZWZ0ID0gcG9zaXRpb24ueDtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFRvcCA9IHBvc2l0aW9uLnk7XG5cbiAgICAgICAgICAgIC8vIGRldGVybWluZSBob3Jpem9udGFsIGF4aXMgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChvZmZzZXRMZWZ0ICsgd2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgIHNldFBvc2l0aW9uWChIb3Jpem9udGFsUG9zaXRpb24ubGVmdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFBvc2l0aW9uWChIb3Jpem9udGFsUG9zaXRpb24ucmlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkZXRlcm1pbmUgdmVydGljYWwgYXhpcyBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKG9mZnNldFRvcCArIGhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgICAgIHNldFBvc2l0aW9uWShWZXJ0aWNhbFBvc2l0aW9uLnVwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0UG9zaXRpb25ZKFZlcnRpY2FsUG9zaXRpb24uZG93bik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBbaXNSZWFkeSwgaXNPcGVuLCB3aWR0aCwgaGVpZ2h0LCBlbGVtZW50UmVmXSk7XG5cbiAgICByZXR1cm4gW3Bvc2l0aW9uWCwgcG9zaXRpb25ZXTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVzZURldGVybWluZVBvc2l0aW9uO1xuIiwiaW1wb3J0IHsgQ3VzdG9tQXV0aGVudGljYXRpb25EYXRhIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvQ3VzdG9tQXV0aFRva2VuXCI7XG5pbXBvcnQgeyBNRl9DVVNUT01fQVVUSEVOVElDQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRDdXN0b21BdXRoVG9rZW4gPSBhc3luYyAoKTogUHJvbWlzZTxDdXN0b21BdXRoZW50aWNhdGlvbkRhdGE+ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZTxDdXN0b21BdXRoZW50aWNhdGlvbkRhdGE+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgd2luZG93Lm14LmRhdGEuYWN0aW9uKHtcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFjdGlvbm5hbWU6IE1GX0NVU1RPTV9BVVRIRU5USUNBVElPTlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAocmVzcG9uc2U6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1c3RvbUF1dGhlbnRpY2F0aW9uOiBDdXN0b21BdXRoZW50aWNhdGlvbkRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGN1c3RvbUF1dGhlbnRpY2F0aW9uKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgQXBwTGlzdFJlc3BvbnNlIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvQXBwTGlzdFJlc3BvbnNlXCI7XG5pbXBvcnQgeyBDdXN0b21BdXRoZW50aWNhdGlvbkRhdGEgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9DdXN0b21BdXRoVG9rZW5cIjtcbmltcG9ydCB7IExvYWRpbmdTdGF0ZSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldEN1c3RvbUF1dGhUb2tlbiB9IGZyb20gXCIuLi91dGlscy9oZWxwZXJcIjtcblxuY29uc3QgdXNlRmV0Y2hBcHBMaXN0ID0gKFxuICAgIGlzT3BlbjogYm9vbGVhbixcbiAgICBmb3JjZVJlZnJlc2g6IGJvb2xlYW4sXG4gICAgYmFzZVVSTDogc3RyaW5nXG4pOiB7XG4gICAgYXV0aG9yaXphdGlvbkVycm9yOiBib29sZWFuO1xuICAgIGFwcExpc3RMb2FkaW5nU3RhdGU6IExvYWRpbmdTdGF0ZTtcbiAgICBhcHBMaXN0OiBBcHBMaXN0UmVzcG9uc2VbXTtcbn0gPT4ge1xuICAgIGNvbnN0IFtsb2FkaW5nU3RhdGUsIHNldExvYWRpbmdTdGF0ZV0gPSB1c2VTdGF0ZTxMb2FkaW5nU3RhdGU+KExvYWRpbmdTdGF0ZS5JZGxlKTtcbiAgICBjb25zdCBbYXBwTGlzdCwgc2V0QXBwTGlzdF0gPSB1c2VTdGF0ZTxBcHBMaXN0UmVzcG9uc2VbXT4oW10pO1xuICAgIGNvbnN0IFt0b2tlbklzVmFsaWQsIHNldFRva2VuSXNWYWxpZF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gICAgY29uc3QgW2F1dGhvcml6YXRpb25FcnJvciwgc2V0QXV0aG9yaXphdGlvbkVycm9yXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgICBjb25zdCBbZmV0Y2hDb3VudCwgc2V0RmV0Y2hDb3VudF0gPSB1c2VTdGF0ZTxudW1iZXI+KDApO1xuICAgIGNvbnN0IFt0aW1lU3RhbXAsIHNldFRpbWVTdGFtcF0gPSB1c2VTdGF0ZTxEYXRlPigpO1xuICAgIGNvbnN0IFthdXRoZW50aWNhdGlvbkRhdGEsIHNldEF1dGhlbnRpY2F0aW9uRGF0YV0gPSB1c2VTdGF0ZTxDdXN0b21BdXRoZW50aWNhdGlvbkRhdGE+KCk7XG5cbiAgICBjb25zdCBzaG91bGRSZWZyZXNoQXV0aFRva2VuID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBpZiAoIXRpbWVTdGFtcCB8fCAhYXV0aGVudGljYXRpb25EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IGRpZmZJblNlY29uZHMgPSBNYXRoLnJvdW5kKChub3cuZ2V0VGltZSgpIC0gdGltZVN0YW1wLmdldFRpbWUoKSkgLyAxMDAwKTtcbiAgICAgICAgcmV0dXJuIGRpZmZJblNlY29uZHMgPj0gYXV0aGVudGljYXRpb25EYXRhLnRpbWVUb0xpdmUgfHwgZmV0Y2hDb3VudCA+PSBhdXRoZW50aWNhdGlvbkRhdGEudGltZXNUb1VzZTtcbiAgICB9O1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNob3VsZFJlZnJlc2hBdXRoVG9rZW4oKSkge1xuICAgICAgICAgICAgc2V0VG9rZW5Jc1ZhbGlkKGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgICAgIGZldGNoQXBwTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFthdXRoZW50aWNhdGlvbkRhdGEsIGZvcmNlUmVmcmVzaCwgaXNPcGVuXSk7IC8vIFdhcm5pbmc6IGZldGNoQXBwTGlzdCBjYW4ndCBiZSBhZGRlZCBhcyBkZXBlbmRlbmN5IGJlY2F1c2UgaXQgd2lsbCBjcmVhdGUgYSBsb29wLlxuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCF0b2tlbklzVmFsaWQpIHtcbiAgICAgICAgICAgIGdldEN1c3RvbUF1dGhUb2tlbigpLnRoZW4oY3VzdG9tQXV0aGVudGljYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY3VzdG9tQXV0aGVudGljYXRpb24uYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzZXRBdXRob3JpemF0aW9uRXJyb3IodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0QXV0aGVudGljYXRpb25EYXRhKGN1c3RvbUF1dGhlbnRpY2F0aW9uKTtcbiAgICAgICAgICAgICAgICBzZXRGZXRjaENvdW50KDApO1xuICAgICAgICAgICAgICAgIHNldFRva2VuSXNWYWxpZCh0cnVlKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lU3RhbXAobmV3IERhdGUoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIFt0b2tlbklzVmFsaWRdKTtcblxuICAgIGNvbnN0IGZldGNoQXBwTGlzdCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgaWYgKCFhdXRoZW50aWNhdGlvbkRhdGEgfHwgIWF1dGhlbnRpY2F0aW9uRGF0YS5hdXRob3JpemF0aW9uIHx8IGxvYWRpbmdTdGF0ZSA9PT0gTG9hZGluZ1N0YXRlLkZldGNoaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRMb2FkaW5nU3RhdGUoTG9hZGluZ1N0YXRlLkZldGNoaW5nKTtcbiAgICAgICAgc2V0RmV0Y2hDb3VudChmZXRjaENvdW50ID0+IGZldGNoQ291bnQgKyAxKTtcblxuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlVVJMfS91c2Vycy8ke2F1dGhlbnRpY2F0aW9uRGF0YS51c2VySWR9L2FwcHM/cmVmcmVzaD0ke2ZvcmNlUmVmcmVzaH1gO1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGF1dGhlbnRpY2F0aW9uRGF0YS5hdXRob3JpemF0aW9uLFxuICAgICAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmZXRjaCh1cmwsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vayB8fCByZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRva2VuSXNWYWxpZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICBzZXRMb2FkaW5nU3RhdGUoTG9hZGluZ1N0YXRlLkNvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICBzZXRBcHBMaXN0KGpzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRva2VuSXNWYWxpZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgc2V0TG9hZGluZ1N0YXRlKExvYWRpbmdTdGF0ZS5GYWlsZWQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJBcHBTd2l0Y2hlciA+PiBJbnZhbGlkIHRva2VuLiBQbGVhc2UgcmVmcmVzaCBpdC5cIik7XG4gICAgICAgICAgICB9KTtcbiAgICB9LCBbYXV0aGVudGljYXRpb25EYXRhLCBiYXNlVVJMLCBmb3JjZVJlZnJlc2gsIGxvYWRpbmdTdGF0ZV0pO1xuXG4gICAgcmV0dXJuIHsgYXV0aG9yaXphdGlvbkVycm9yLCBhcHBMaXN0TG9hZGluZ1N0YXRlOiBsb2FkaW5nU3RhdGUsIGFwcExpc3QgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUZldGNoQXBwTGlzdDtcbiIsImltcG9ydCBSZWFjdCwgeyBSZWFjdEVsZW1lbnQsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxuY29uc3QgQXJyb3dMZWZ0SWNvbiA9ICh7IGNsYXNzTmFtZSA9IFwiXCIgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSk6IFJlYWN0RWxlbWVudCA9PiAoXG4gICAgLy8gVE9ETzogVGhpcyBpY29uIGlzIHN1cGVyIGNvbXBsZXggZm9yIHdoYXQgaXQgbmVlZHMgdG8gZG8uIE1heWJlIHdlIGNhbiBzaW1wbGlmeSBpdC5cbiAgICA8c3ZnIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB2aWV3Qm94PVwiMCAwIDE2IDE3XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxnIGNsaXBQYXRoPVwidXJsKCNjbGlwMF8xODE0XzcyMTYpXCI+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgIGQ9XCJNMTUuNSA4LjVIMC41XCJcbiAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS41XCJcbiAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgZD1cIk03LjUgMTUuNUwwLjUgOC41TDcuNSAxLjVcIlxuICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjVcIlxuICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY2xpcDBfMTgxNF83MjE2XCI+XG4gICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwIDAuNSlcIiAvPlxuICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgPC9kZWZzPlxuICAgIDwvc3ZnPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhBcnJvd0xlZnRJY29uKTtcbiIsImltcG9ydCBSZWFjdCwgeyBjcmVhdGVFbGVtZW50LCBSZWFjdEVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxuY29uc3QgU2VhcmNoSWNvbiA9ICh7IGNsYXNzTmFtZSA9IFwiXCIgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSk6IFJlYWN0RWxlbWVudCA9PiAoXG4gICAgPHN2ZyBjbGFzc05hbWU9e2NsYXNzTmFtZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgIGZpbGw9XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgICAgICBkPVwiTTE0LjQwNiAxOC41NzNBNy44NzQgNy44NzQgMCAxMDguMjQ2IDQuMDhhNy44NzQgNy44NzQgMCAwMDYuMTYgMTQuNDkzek0xNi44OTMgMTYuODkzTDIzIDIzLjAwMVwiXG4gICAgICAgID48L3BhdGg+XG4gICAgPC9zdmc+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKFNlYXJjaEljb24pO1xuIiwiaW1wb3J0IFJlYWN0LCB7IFJlYWN0RWxlbWVudCwgY3JlYXRlRWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5jb25zdCBFeHRlcm5hbExpbmtJY29uID0gKHsgY2xhc3NOYW1lID0gXCJcIiB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KTogUmVhY3RFbGVtZW50ID0+IChcbiAgICA8c3ZnIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB2aWV3Qm94PVwiMCAwIDIwIDIwXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTE1IDEwLjgzMzNWMTUuODMzM0MxNSAxNi4yNzU0IDE0LjgyNDQgMTYuNjk5MyAxNC41MTE4IDE3LjAxMThDMTQuMTk5MyAxNy4zMjQ0IDEzLjc3NTQgMTcuNSAxMy4zMzMzIDE3LjVINC4xNjY2N0MzLjcyNDY0IDE3LjUgMy4zMDA3MiAxNy4zMjQ0IDIuOTg4MTYgMTcuMDExOEMyLjY3NTU5IDE2LjY5OTMgMi41IDE2LjI3NTQgMi41IDE1LjgzMzNWNi42NjY2N0MyLjUgNi4yMjQ2NCAyLjY3NTU5IDUuODAwNzIgMi45ODgxNiA1LjQ4ODE2QzMuMzAwNzIgNS4xNzU1OSAzLjcyNDY0IDUgNC4xNjY2NyA1SDkuMTY2NjdcIlxuICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS41XCJcbiAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIGQ9XCJNMTIuNSAyLjVIMTcuNVY3LjVcIlxuICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS41XCJcbiAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIGQ9XCJNOC4zMzMzNyAxMS42NjY3TDE3LjUgMi41XCJcbiAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgPC9zdmc+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEV4dGVybmFsTGlua0ljb24pO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IEFwcExpc3RSZXNwb25zZSB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0FwcExpc3RSZXNwb25zZVwiO1xuaW1wb3J0IEV4dGVybmFsTGlua0ljb24gZnJvbSBcIi4uL3Jlc291cmNlcy9FeHRlcm5hbExpbmtJY29uXCI7XG5cbmludGVyZmFjZSBBcHBMaXN0SXRlbVByb3BzIHtcbiAgICBkYXRhOiBBcHBMaXN0UmVzcG9uc2U7XG59XG5cbmNvbnN0IEFwcExpc3RJdGVtID0gKHsgZGF0YSB9OiBBcHBMaXN0SXRlbVByb3BzKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YSBocmVmPXtkYXRhLmFwcFVSTH0gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0LWl0ZW1cIiB0aXRsZT17ZGF0YS5hcHBOYW1lfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0LWl0ZW1fX2NvbnRhaW5lclwiIGtleT17ZGF0YS5hcHBJZH0+XG4gICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWxpc3QtaXRlbV9faW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICBzcmM9e1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIFwiYXBwTG9nb1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZGF0YS5hcHBMb2dvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIi4vaW1nL0FwcFN3aXRjaGVyTW9kdWxlJEltYWdlcyRNZW5kaXhfbG9nby5zdmdcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWxpc3QtaXRlbV9fbmFtZVwiPntkYXRhLmFwcE5hbWV9PC9wPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9e2RhdGEuYXBwVVJMfSBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWxpc3QtaXRlbV9fbGlua1wiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPEV4dGVybmFsTGlua0ljb24gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0LWl0ZW1fX2V4dGVybmFsLWxpbmtcIiAvPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2E+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcExpc3RJdGVtO1xuIiwiaW1wb3J0IFJlYWN0LCB7IFJlYWN0RWxlbWVudCwgY3JlYXRlRWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5jb25zdCBGb3JjZVJlZnJlc2hJY29uID0gKHsgY2xhc3NOYW1lID0gXCJcIiB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KTogUmVhY3RFbGVtZW50ID0+IChcbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsPVwibm9uZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB2aWV3Qm94PVwiMCAwIDIwIDIwXCI+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTE5LjE2NyAzLjMzM3Y1aC01XCJcbiAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTE3LjA3NSAxMi41YTcuNSA3LjUgMCAxMS0xLjc2Ny03LjhsMy44NTkgMy42MzNcIlxuICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS41XCJcbiAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgLz5cbiAgICA8L3N2Zz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oRm9yY2VSZWZyZXNoSWNvbik7XG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCBGcmFnbWVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IEFwcExpc3RQcm9wcyB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0FwcExpc3RQcm9wc1wiO1xuaW1wb3J0IHsgQXBwTGlzdFJlc3BvbnNlIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvQXBwTGlzdFJlc3BvbnNlXCI7XG5pbXBvcnQgQXBwTGlzdEl0ZW0gZnJvbSBcIi4vQXBwTGlzdEl0ZW1cIjtcbmltcG9ydCBGb3JjZVJlZnJlc2hJY29uIGZyb20gXCIuLi9yZXNvdXJjZXMvRm9yY2VSZWZyZXNoSWNvblwiO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcblxuY29uc3QgQXBwTGlzdCA9ICh7IGFwcExpc3QsIHNldEZvcmNlUmVmcmVzaCwgZm9yY2VSZWZyZXNoLCBzZXRTZWFyY2hWYWx1ZSB9OiBBcHBMaXN0UHJvcHMpOiBSZWFjdEVsZW1lbnQgfCBudWxsID0+IHtcbiAgICBjb25zdCBvblNldEZvcmNlUmVmcmVzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgc2V0Rm9yY2VSZWZyZXNoKHRydWUpO1xuICAgICAgICBzZXRTZWFyY2hWYWx1ZShcIlwiKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWxpc3QgbXhhcHBzd2l0Y2hlci1wYW5lbF9fbGlzdFwiPlxuICAgICAgICAgICAge2FwcExpc3Q/Lmxlbmd0aCA9PT0gMCAmJiA8c3BhbiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWxpc3RfX2VtcHR5LW1lc3NhZ2VcIj5ObyBhcHBzIGZvdW5kPC9zcGFuPn1cbiAgICAgICAgICAgIHthcHBMaXN0ICYmIGFwcExpc3QubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItbGlzdF9fdGl0bGUtd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0X190aXRsZVwiPllvdXIgYXBwczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJteGFwcHN3aXRjaGVyLWxpc3RfX3JlZnJlc2gtYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJteGFwcHN3aXRjaGVyLWxpc3RfX3JlZnJlc2gtYnV0dG9uLS1kaXNhYmxlZFwiOiBmb3JjZVJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvblNldEZvcmNlUmVmcmVzaH1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9yY2VSZWZyZXNoSWNvbiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWxpc3RfX3JlZnJlc2gtYnV0dG9uLWljb25cIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7YXBwTGlzdC5tYXAoKGFwcERhdGE6IEFwcExpc3RSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxBcHBMaXN0SXRlbSBkYXRhPXthcHBEYXRhfSBrZXk9e2FwcERhdGEuYXBwSWR9IC8+O1xuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcExpc3Q7XG4iLCJpbXBvcnQgUmVhY3QsIHsgUmVhY3RFbGVtZW50LCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmNvbnN0IEZvb3RlciA9ICgpOiBSZWFjdEVsZW1lbnQgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1mb290ZXIgbXhhcHBzd2l0Y2hlci1wYW5lbF9fZm9vdGVyXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItZm9vdGVyX19sb2dvXCIgc3JjPVwiLi9pbWcvQXBwU3dpdGNoZXJNb2R1bGUkSW1hZ2VzJE1lbmRpeF9sb2dvLnN2Z1wiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItZm9vdGVyX190ZXh0XCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1mb290ZXJfX2RldGFpbHNcIj5IYXZlIGFuIGlkZWEgZm9yIGFuIGFwcD88L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1mb290ZXJfX2RldGFpbHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItZm9vdGVyX19saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL25ldy5tZW5kaXguY29tL2xpbmsvb3ZlcnZpZXcvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlIGFuIGFwcFxuICAgICAgICAgICAgICAgICAgICA8L2E+e1wiIFwifVxuICAgICAgICAgICAgICAgICAgICBvciB2aXNpdCB0aGV7XCIgXCJ9XG4gICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWZvb3Rlcl9fbGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9tYXJrZXRwbGFjZS5tZW5kaXguY29tL1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcmtldHBsYWNlXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oRm9vdGVyKTtcbiIsImltcG9ydCBSZWFjdCwgeyBjcmVhdGVFbGVtZW50LCBSZWFjdEVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxuY29uc3QgU2tlbGV0b25Mb2FkZXIgPSAoKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICBjb25zdCBza2VsZXRvbkl0ZW1Db3VudCA9IDc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2tlbGV0b24tbG9hZGVyIG14YXBwc3dpdGNoZXItcGFuZWxfX3NrZWxldG9uLWxvYWRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLXNrZWxldG9uLWxvYWRlcl9fYm94IG14YXBwc3dpdGNoZXItc2tlbGV0b24tbG9hZGVyX190aXRsZVwiPjwvZGl2PlxuICAgICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IHNrZWxldG9uSXRlbUNvdW50IH0sIChfLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2tlbGV0b24tbG9hZGVyX19pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1za2VsZXRvbi1sb2FkZXJfX2JveCBteGFwcHN3aXRjaGVyLXNrZWxldG9uLWxvYWRlcl9faXRlbS1pY29uXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1za2VsZXRvbi1sb2FkZXJfX2JveCBteGFwcHN3aXRjaGVyLXNrZWxldG9uLWxvYWRlcl9faXRlbS1uYW1lXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1za2VsZXRvbi1sb2FkZXJfX2JveCBteGFwcHN3aXRjaGVyLXNrZWxldG9uLWxvYWRlcl9faXRlbS1saW5rXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oU2tlbGV0b25Mb2FkZXIpO1xuIiwiaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCwgeyBjcmVhdGVFbGVtZW50LCBSZWFjdEVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlTGF5b3V0RWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IEFwcExpc3RSZXNwb25zZSB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0FwcExpc3RSZXNwb25zZVwiO1xuaW1wb3J0IHsgQXBwU3dpdGNoZXJQYW5lbFByb3BzIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvQXBwU3dpdGNoZXJQYW5lbFByb3BzXCI7XG5pbXBvcnQgeyBIb3Jpem9udGFsUG9zaXRpb24sIFZlcnRpY2FsUG9zaXRpb24gfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9Qb3NpdGlvbmluZ1wiO1xuaW1wb3J0IHsgTG9hZGluZ1N0YXRlIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IEFycm93TGVmdEljb24gZnJvbSBcIi4uL3Jlc291cmNlcy9BcnJvd0xlZnRJY29uXCI7XG5pbXBvcnQgU2VhcmNoSWNvbiBmcm9tIFwiLi4vcmVzb3VyY2VzL1NlYXJjaEljb25cIjtcbmltcG9ydCBBcHBMaXN0IGZyb20gXCIuL0FwcExpc3RcIjtcbmltcG9ydCBGb290ZXIgZnJvbSBcIi4vRm9vdGVyXCI7XG5pbXBvcnQgU2tlbGV0b25Mb2FkZXIgZnJvbSBcIi4vU2tlbGV0b25Mb2FkZXJcIjtcblxuY29uc3QgQXBwU3dpdGNoZXJQYW5lbCA9ICh7XG4gICAgYXBwTGlzdFJlc3BvbnNlLFxuICAgIGFwcExpc3RMb2FkaW5nU3RhdGUsXG4gICAgc2V0Rm9yY2VSZWZyZXNoLFxuICAgIGF1dGhvcml6YXRpb25FcnJvcixcbiAgICBmb3JjZVJlZnJlc2gsXG4gICAgcG9zaXRpb25pbmcsXG4gICAgcG9zaXRpb25YLFxuICAgIHBvc2l0aW9uWSxcbiAgICBzZXRBcHBTd2l0Y2hlclBhbmVsV2lkdGgsXG4gICAgc2V0QXBwU3dpdGNoZXJQYW5lbEhlaWdodCxcbiAgICBvbkNsb3NlXG59OiBBcHBTd2l0Y2hlclBhbmVsUHJvcHMpOiBSZWFjdEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gICAgY29uc3QgW2ZpbHRlcmVkQXBwTGlzdCwgc2V0RmlsdGVyZWRBcHBMaXN0XSA9IHVzZVN0YXRlPEFwcExpc3RSZXNwb25zZVtdIHwgdW5kZWZpbmVkPigpO1xuICAgIGNvbnN0IFtzZWFyY2hWYWx1ZSwgc2V0U2VhcmNoVmFsdWVdID0gdXNlU3RhdGU8c3RyaW5nPihcIlwiKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHNldEZpbHRlcmVkQXBwTGlzdChhcHBMaXN0UmVzcG9uc2UpO1xuICAgIH0sIFthcHBMaXN0UmVzcG9uc2VdKTtcblxuICAgIGNvbnN0IG9uU2VhcmNoQ2hhbmdlID0gKGV2ZW50OiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50Pik6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBzZWFyY2hRdWVyeSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgc2V0U2VhcmNoVmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICBpZiAoc2VhcmNoUXVlcnkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbHRlckFwcExpc3Qoc2VhcmNoUXVlcnkpO1xuICAgICAgICAgICAgc2V0RmlsdGVyZWRBcHBMaXN0KHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRGaWx0ZXJlZEFwcExpc3QoYXBwTGlzdFJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBmaWx0ZXJBcHBMaXN0ID0gKHNlYXJjaFF1ZXJ5OiBzdHJpbmcpOiBBcHBMaXN0UmVzcG9uc2VbXSA9PiB7XG4gICAgICAgIHJldHVybiBhcHBMaXN0UmVzcG9uc2UgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBhcHBMaXN0UmVzcG9uc2UuZmlsdGVyKChyZXN1bHQ6IEFwcExpc3RSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5hcHBOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA6IFtdO1xuICAgIH07XG5cbiAgICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAocmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHNldEFwcFN3aXRjaGVyUGFuZWxXaWR0aChyZWYuY3VycmVudC5vZmZzZXRXaWR0aCk7XG4gICAgICAgICAgICBzZXRBcHBTd2l0Y2hlclBhbmVsSGVpZ2h0KHJlZi5jdXJyZW50Lm9mZnNldEhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9LCBbc2V0QXBwU3dpdGNoZXJQYW5lbEhlaWdodCwgc2V0QXBwU3dpdGNoZXJQYW5lbFdpZHRoXSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXG4gICAgICAgICAgICAgICAgXCJteGFwcHN3aXRjaGVyLXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgeyBcIm14YXBwc3dpdGNoZXItcGFuZWwtLXNpZGViYXItbGVmdFwiOiBwb3NpdGlvbmluZyA9PT0gXCJzaWRlYmFyTGVmdFwiIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIm14YXBwc3dpdGNoZXItcGFuZWwtLXJpZ2h0LXVwXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbmluZyA9PT0gXCJjb250ZXh0TWVudVwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblggPT09IEhvcml6b250YWxQb3NpdGlvbi5yaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZID09PSBWZXJ0aWNhbFBvc2l0aW9uLnVwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwibXhhcHBzd2l0Y2hlci1wYW5lbC0tbGVmdC11cFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25pbmcgPT09IFwiY29udGV4dE1lbnVcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZID09PSBWZXJ0aWNhbFBvc2l0aW9uLnVwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblggPT09IEhvcml6b250YWxQb3NpdGlvbi5sZWZ0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwibXhhcHBzd2l0Y2hlci1wYW5lbC0tbGVmdC1kb3duXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbmluZyA9PT0gXCJjb250ZXh0TWVudVwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblkgPT09IFZlcnRpY2FsUG9zaXRpb24uZG93biAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YID09PSBIb3Jpem9udGFsUG9zaXRpb24ubGVmdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICByZWY9e3JlZn1cbiAgICAgICAgPlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWNsb3NlLWJ1dHRvbiBteGFwcHN3aXRjaGVyLXBhbmVsX19jbG9zZS1idXR0b25cIj5cbiAgICAgICAgICAgICAgICA8QXJyb3dMZWZ0SWNvbiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWNsb3NlLWJ1dHRvbl9faWNvblwiIC8+IENsb3NlXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1zZWFyY2ggbXhhcHBzd2l0Y2hlci1wYW5lbF9fc2VhcmNoXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2VhcmNoX19pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2hDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIEFwcHNcIlxuICAgICAgICAgICAgICAgICAgICBtYXhMZW5ndGg9ezQwfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFNlYXJjaEljb24gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1zZWFyY2hfX2ljb25cIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7YXBwTGlzdExvYWRpbmdTdGF0ZSA9PT0gTG9hZGluZ1N0YXRlLkNvbXBsZXRlID8gKFxuICAgICAgICAgICAgICAgIDxBcHBMaXN0XG4gICAgICAgICAgICAgICAgICAgIGFwcExpc3Q9e2ZpbHRlcmVkQXBwTGlzdH1cbiAgICAgICAgICAgICAgICAgICAgc2V0Rm9yY2VSZWZyZXNoPXtzZXRGb3JjZVJlZnJlc2h9XG4gICAgICAgICAgICAgICAgICAgIGZvcmNlUmVmcmVzaD17Zm9yY2VSZWZyZXNofVxuICAgICAgICAgICAgICAgICAgICBzZXRTZWFyY2hWYWx1ZT17c2V0U2VhcmNoVmFsdWV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBhcHBMaXN0TG9hZGluZ1N0YXRlID09PSBMb2FkaW5nU3RhdGUuRmFpbGVkIHx8IGF1dGhvcml6YXRpb25FcnJvciA/IChcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWVycm9yIG14YXBwc3dpdGNoZXItcGFuZWxfX2Vycm9yXCI+XG4gICAgICAgICAgICAgICAgICAgIE5vIGFwcCBoZXJlPyBObyB3b3JyaWVzISBUcnkgdG8gcmVmcmVzaCB0aGUgcGFnZSBvciBjb250YWN0IHlvdXIgYWRtaW4uXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8U2tlbGV0b25Mb2FkZXIgLz5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIDxGb290ZXIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQXBwU3dpdGNoZXJQYW5lbCk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlRWxlbWVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmNvbnN0IFN3aXRjaGVySWNvbiA9ICh7IGNsYXNzTmFtZSA9IFwiXCIgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSk6IFJlYWN0RWxlbWVudCA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IGZpbGw9XCJub25lXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiPlxuICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICBpZD1cInN3aXRjaGVySWNvbkRvdHNcIlxuICAgICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICBkPVwiTTggMTBhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6TTggMThhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6TTE2IDE4YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0ek0yNCAxOGEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHpNOCAyNmEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHpNMTYgMjZhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6TTI0IDI2YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0ek0xNiAxMGEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHpNMjQgMTBhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKFN3aXRjaGVySWNvbik7XG4iLCJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlRWxlbWVudCwgUmVhY3RFbGVtZW50LCB1c2VMYXlvdXRFZmZlY3QsIHVzZVJlZiB9IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyBUb2dnbGVCdXR0b25Qcm9wcyB9IGZyb20gXCIuLi8uLi90eXBpbmdzL1RvZ2dsZUJ1dHRvblByb3BzXCI7XG5pbXBvcnQgU3dpdGNoZXJJY29uIGZyb20gXCIuLi9yZXNvdXJjZXMvU3dpdGNoZXJJY29uXCI7XG5cbmNvbnN0IFRvZ2dsZUJ1dHRvbiA9ICh7IG9uQ2xpY2ssIHNldEFwcFN3aXRjaGVyQnV0dG9uSGVpZ2h0IH06IFRvZ2dsZUJ1dHRvblByb3BzKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWYgPSB1c2VSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+KG51bGwpO1xuXG4gICAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBzZXRBcHBTd2l0Y2hlckJ1dHRvbkhlaWdodChyZWYuY3VycmVudC5vZmZzZXRIZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSwgW3NldEFwcFN3aXRjaGVyQnV0dG9uSGVpZ2h0XSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICAvLyBUT0RPOiBBZGQgQVJJQSB0byB0aGUgZW50aXJlIGltcGxlbWVudGF0aW9uLlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItdG9nZ2xlXCIgb25DbGljaz17b25DbGlja30gcmVmPXtyZWZ9PlxuICAgICAgICAgICAgPFN3aXRjaGVySWNvbiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLXRvZ2dsZV9faWNvblwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKFRvZ2dsZUJ1dHRvbik7XG4iLCJpbXBvcnQgY2xhc3NuYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgUmVhY3RFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgQXBwU3dpdGNoZXJDb250YWluZXJQcm9wcyB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0FwcFN3aXRjaGVyUHJvcHNcIjtcbmltcG9ydCB7IExvYWRpbmdTdGF0ZSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB1c2VEZXRlcm1pbmVQb3NpdGlvbiBmcm9tIFwiLi4vaG9va3MvdXNlRGV0ZXJtaW5lUG9zaXRpb25cIjtcbmltcG9ydCB1c2VGZXRjaEFwcExpc3QgZnJvbSBcIi4uL2hvb2tzL3VzZUZldGNoQXBwTGlzdFwiO1xuaW1wb3J0IEFwcFN3aXRjaGVyUGFuZWwgZnJvbSBcIi4vQXBwU3dpdGNoZXJQYW5lbFwiO1xuaW1wb3J0IFRvZ2dsZUJ1dHRvbiBmcm9tIFwiLi9Ub2dnbGVCdXR0b25cIjtcblxuY29uc3QgQXBwU3dpdGNoZXJDb250YWluZXIgPSAocHJvcHM6IEFwcFN3aXRjaGVyQ29udGFpbmVyUHJvcHMpOiBSZWFjdEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IFtpc09wZW4sIHNldElzT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgICBjb25zdCByZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICAgIGNvbnN0IFtmb3JjZVJlZnJlc2gsIHNldEZvcmNlUmVmcmVzaF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gICAgY29uc3QgeyBhcHBMaXN0TG9hZGluZ1N0YXRlLCBhcHBMaXN0LCBhdXRob3JpemF0aW9uRXJyb3IgfSA9IHVzZUZldGNoQXBwTGlzdChpc09wZW4sIGZvcmNlUmVmcmVzaCwgcHJvcHMuYmFzZVVybCk7XG4gICAgY29uc3QgW2FwcFN3aXRjaGVyUGFuZWxXaWR0aCwgc2V0QXBwU3dpdGNoZXJQYW5lbFdpZHRoXSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XG4gICAgY29uc3QgW2FwcFN3aXRjaGVyUGFuZWxIZWlnaHQsIHNldEFwcFN3aXRjaGVyUGFuZWxIZWlnaHRdID0gdXNlU3RhdGU8bnVtYmVyPigwKTtcbiAgICBjb25zdCBbYXBwU3dpdGNoZXJCdXR0b25IZWlnaHQsIHNldEFwcFN3aXRjaGVyQnV0dG9uSGVpZ2h0XSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XG4gICAgY29uc3QgW3Bvc2l0aW9uWCwgcG9zaXRpb25ZXSA9IHVzZURldGVybWluZVBvc2l0aW9uKHtcbiAgICAgICAgZWxlbWVudFJlZjogcmVmLmN1cnJlbnQsXG4gICAgICAgIHdpZHRoOiBhcHBTd2l0Y2hlclBhbmVsV2lkdGgsXG4gICAgICAgIGhlaWdodDogYXBwU3dpdGNoZXJQYW5lbEhlaWdodCArIGFwcFN3aXRjaGVyQnV0dG9uSGVpZ2h0LFxuICAgICAgICBpc09wZW4sXG4gICAgICAgIGlzUmVhZHk6IGlzT3BlbiAmJiBhcHBMaXN0TG9hZGluZ1N0YXRlID09PSBMb2FkaW5nU3RhdGUuQ29tcGxldGVcbiAgICB9KTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uT3V0c2lkZUNsaWNrID0gKGV2ZW50OiBFdmVudCAmIHsgdGFyZ2V0OiBFbGVtZW50IH0pOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmIChpc09wZW4gJiYgcmVmLmN1cnJlbnQgJiYgIXJlZi5jdXJyZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICBzZXRJc09wZW4oZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNldEZvcmNlUmVmcmVzaChmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbk91dHNpZGVDbGljayk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25PdXRzaWRlQ2xpY2spO1xuICAgICAgICB9O1xuICAgIH0sIFtpc09wZW5dKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHByb3BzLmNsYXNzLCBcIm14YXBwc3dpdGNoZXJcIil9IHN0eWxlPXtwcm9wcy5zdHlsZX0gcmVmPXtyZWZ9PlxuICAgICAgICAgICAgPFRvZ2dsZUJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRJc09wZW4oIWlzT3Blbil9IHNldEFwcFN3aXRjaGVyQnV0dG9uSGVpZ2h0PXtzZXRBcHBTd2l0Y2hlckJ1dHRvbkhlaWdodH0gLz5cbiAgICAgICAgICAgIHtpc09wZW4gJiYgKFxuICAgICAgICAgICAgICAgIDxBcHBTd2l0Y2hlclBhbmVsXG4gICAgICAgICAgICAgICAgICAgIGFwcExpc3RSZXNwb25zZT17YXBwTGlzdH1cbiAgICAgICAgICAgICAgICAgICAgYXBwTGlzdExvYWRpbmdTdGF0ZT17YXBwTGlzdExvYWRpbmdTdGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgc2V0Rm9yY2VSZWZyZXNoPXtzZXRGb3JjZVJlZnJlc2h9XG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25FcnJvcj17YXV0aG9yaXphdGlvbkVycm9yfVxuICAgICAgICAgICAgICAgICAgICBmb3JjZVJlZnJlc2g9e2ZvcmNlUmVmcmVzaH1cbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25pbmc9e3Byb3BzLnBvc2l0aW9uaW5nfVxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblg9e3Bvc2l0aW9uWH1cbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZPXtwb3NpdGlvbll9XG4gICAgICAgICAgICAgICAgICAgIHNldEFwcFN3aXRjaGVyUGFuZWxXaWR0aD17c2V0QXBwU3dpdGNoZXJQYW5lbFdpZHRofVxuICAgICAgICAgICAgICAgICAgICBzZXRBcHBTd2l0Y2hlclBhbmVsSGVpZ2h0PXtzZXRBcHBTd2l0Y2hlclBhbmVsSGVpZ2h0fVxuICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRJc09wZW4oZmFsc2UpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwU3dpdGNoZXJDb250YWluZXI7XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIGNyZWF0ZUVsZW1lbnQsIFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyBBcHBTd2l0Y2hlckNvbnRhaW5lclByb3BzIH0gZnJvbSBcIi4uL3R5cGluZ3MvQXBwU3dpdGNoZXJQcm9wc1wiO1xuaW1wb3J0IEFwcFN3aXRjaGVyQ29udGFpbmVyIGZyb20gXCIuL2NvbXBvbmVudHMvQXBwU3dpdGNoZXJDb250YWluZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwU3dpdGNoZXIgZXh0ZW5kcyBDb21wb25lbnQ8QXBwU3dpdGNoZXJDb250YWluZXJQcm9wcz4ge1xuICAgIHJlbmRlcigpOiBSZWFjdE5vZGUge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEFwcFN3aXRjaGVyQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgYmFzZVVybD17dGhpcy5wcm9wcy5iYXNlVXJsfVxuICAgICAgICAgICAgICAgIHBvc2l0aW9uaW5nPXt0aGlzLnByb3BzLnBvc2l0aW9uaW5nfVxuICAgICAgICAgICAgICAgIG5hbWU9e1wiXCJ9XG4gICAgICAgICAgICAgICAgY2xhc3M9e1wiXCJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsImNsYXNzTmFtZXMiLCJjbGFzc2VzIiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsImFyZyIsImFyZ1R5cGUiLCJwdXNoIiwiQXJyYXkiLCJpc0FycmF5IiwiaW5uZXIiLCJhcHBseSIsInRvU3RyaW5nIiwiT2JqZWN0IiwicHJvdG90eXBlIiwia2V5IiwiY2FsbCIsImpvaW4iLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVmYXVsdCIsIndpbmRvdyIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlQ2FsbGJhY2siLCJjcmVhdGVFbGVtZW50IiwiUmVhY3QiLCJFeHRlcm5hbExpbmtJY29uIiwiRnJhZ21lbnQiLCJGb3JjZVJlZnJlc2hJY29uIiwidXNlUmVmIiwidXNlTGF5b3V0RWZmZWN0IiwiQXJyb3dMZWZ0SWNvbiIsIlNlYXJjaEljb24iLCJTa2VsZXRvbkxvYWRlciIsIkZvb3RlciIsIlN3aXRjaGVySWNvbiIsIlRvZ2dsZUJ1dHRvbiIsIkFwcFN3aXRjaGVyUGFuZWwiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztDQUtBO0NBRUMsYUFBWTs7R0FHWixJQUFJQSxNQUFNLEdBQUcsR0FBR0MsY0FBaEI7O0dBRUEsU0FBU0MsVUFBVCxHQUFzQjtLQUNyQixJQUFJQyxPQUFPLEdBQUcsRUFBZDs7S0FFQSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBOUIsRUFBc0NGLENBQUMsRUFBdkMsRUFBMkM7T0FDMUMsSUFBSUcsR0FBRyxHQUFHRixTQUFTLENBQUNELENBQUQsQ0FBbkI7T0FDQSxJQUFJLENBQUNHLEdBQUwsRUFBVTtPQUVWLElBQUlDLE9BQU8sR0FBRyxPQUFPRCxHQUFyQjs7T0FFQSxJQUFJQyxPQUFPLEtBQUssUUFBWixJQUF3QkEsT0FBTyxLQUFLLFFBQXhDLEVBQWtEO1NBQ2pETCxPQUFPLENBQUNNLElBQVIsQ0FBYUYsR0FBYjtRQURELE1BRU8sSUFBSUcsS0FBSyxDQUFDQyxPQUFOLENBQWNKLEdBQWQsQ0FBSixFQUF3QjtTQUM5QixJQUFJQSxHQUFHLENBQUNELE1BQVIsRUFBZ0I7V0FDZixJQUFJTSxLQUFLLEdBQUdWLFVBQVUsQ0FBQ1csS0FBWCxDQUFpQixJQUFqQixFQUF1Qk4sR0FBdkIsQ0FBWjs7V0FDQSxJQUFJSyxLQUFKLEVBQVc7YUFDVlQsT0FBTyxDQUFDTSxJQUFSLENBQWFHLEtBQWI7OztRQUpJLE1BT0EsSUFBSUosT0FBTyxLQUFLLFFBQWhCLEVBQTBCO1NBQ2hDLElBQUlELEdBQUcsQ0FBQ08sUUFBSixLQUFpQkMsTUFBTSxDQUFDQyxTQUFQLENBQWlCRixRQUF0QyxFQUFnRDtXQUMvQyxLQUFLLElBQUlHLEdBQVQsSUFBZ0JWLEdBQWhCLEVBQXFCO2FBQ3BCLElB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
