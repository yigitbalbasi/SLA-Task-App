import React, { useState, useEffect, useCallback, createElement, Fragment, useRef, useLayoutEffect, Component } from 'react';

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
    const [positionX, setPositionX] = useState(HorizontalPosition.right);
    const [positionY, setPositionY] = useState(VerticalPosition.down);
    useEffect(() => {
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
    const [loadingState, setLoadingState] = useState(LoadingState.Idle);
    const [appList, setAppList] = useState([]);
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [authorizationError, setAuthorizationError] = useState(false);
    const [fetchCount, setFetchCount] = useState(0);
    const [timeStamp, setTimeStamp] = useState();
    const [authenticationData, setAuthenticationData] = useState();
    const shouldRefreshAuthToken = () => {
        if (!timeStamp || !authenticationData) {
            return true;
        }
        const now = new Date();
        const diffInSeconds = Math.round((now.getTime() - timeStamp.getTime()) / 1000);
        return diffInSeconds >= authenticationData.timeToLive || fetchCount >= authenticationData.timesToUse;
    };
    useEffect(() => {
        if (shouldRefreshAuthToken()) {
            setTokenIsValid(false);
            return;
        }
        if (isOpen) {
            fetchAppList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticationData, forceRefresh, isOpen]); // Warning: fetchAppList can't be added as dependency because it will create a loop.
    useEffect(() => {
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
    const fetchAppList = useCallback(async () => {
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
createElement("svg", { className: className, viewBox: "0 0 16 17", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    createElement("g", { clipPath: "url(#clip0_1814_7216)" },
        createElement("path", { d: "M15.5 8.5H0.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
        createElement("path", { d: "M7.5 15.5L0.5 8.5L7.5 1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })),
    createElement("defs", null,
        createElement("clipPath", { id: "clip0_1814_7216" },
            createElement("rect", { width: "16", height: "16", fill: "currentColor", transform: "translate(0 0.5)" })))));
var ArrowLeftIcon$1 = React.memo(ArrowLeftIcon);

const SearchIcon = ({ className = "" }) => (createElement("svg", { className: className, viewBox: "0 0 24 24" },
    createElement("path", { stroke: "currentColor", fill: "transparent", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M14.406 18.573A7.874 7.874 0 108.246 4.08a7.874 7.874 0 006.16 14.493zM16.893 16.893L23 23.001" })));
var SearchIcon$1 = React.memo(SearchIcon);

const ExternalLinkIcon = ({ className = "" }) => (createElement("svg", { className: className, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    createElement("path", { d: "M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    createElement("path", { d: "M12.5 2.5H17.5V7.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    createElement("path", { d: "M8.33337 11.6667L17.5 2.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })));
var ExternalLinkIcon$1 = React.memo(ExternalLinkIcon);

const AppListItem = ({ data }) => {
    return (createElement("a", { href: data.appURL, className: "mxappswitcher-list-item", title: data.appName },
        createElement("div", { className: "mxappswitcher-list-item__container", key: data.appId },
            createElement("img", { className: "mxappswitcher-list-item__image", src: Object.prototype.hasOwnProperty.call(data, "appLogo")
                    ? data.appLogo
                    : "./img/AppSwitcherModule$Images$Mendix_logo.svg" }),
            createElement("p", { className: "mxappswitcher-list-item__name" }, data.appName),
            createElement("a", { href: data.appURL, className: "mxappswitcher-list-item__link", target: "_blank", rel: "noreferrer" },
                createElement(ExternalLinkIcon$1, { className: "mxappswitcher-list-item__external-link" })))));
};

const ForceRefreshIcon = ({ className = "" }) => (createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", className: className, viewBox: "0 0 20 20" },
    createElement("path", { d: "M19.167 3.333v5h-5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    createElement("path", { d: "M17.075 12.5a7.5 7.5 0 11-1.767-7.8l3.859 3.633", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })));
var ForceRefreshIcon$1 = React.memo(ForceRefreshIcon);

const AppList = ({ appList, setForceRefresh, forceRefresh, setSearchValue }) => {
    const onSetForceRefresh = () => {
        setForceRefresh(true);
        setSearchValue("");
    };
    return (createElement("div", { className: "mxappswitcher-list mxappswitcher-panel__list" },
        (appList === null || appList === void 0 ? void 0 : appList.length) === 0 && createElement("span", { className: "mxappswitcher-list__empty-message" }, "No apps found"),
        appList && appList.length > 0 && (createElement(Fragment, null,
            createElement("div", { className: "mxappswitcher-list__title-wrapper" },
                createElement("span", { className: "mxappswitcher-list__title" }, "Your apps"),
                createElement("button", { className: classnames("mxappswitcher-list__refresh-button", {
                        "mxappswitcher-list__refresh-button--disabled": forceRefresh
                    }), onClick: onSetForceRefresh },
                    createElement(ForceRefreshIcon$1, { className: "mxappswitcher-list__refresh-button-icon" }))),
            appList.map((appData) => {
                return createElement(AppListItem, { data: appData, key: appData.appId });
            })))));
};

const Footer = () => {
    return (createElement("div", { className: "mxappswitcher-footer mxappswitcher-panel__footer" },
        createElement("img", { className: "mxappswitcher-footer__logo", src: "./img/AppSwitcherModule$Images$Mendix_logo.svg" }),
        createElement("div", { className: "mxappswitcher-footer__text" },
            createElement("p", { className: "mxappswitcher-footer__details" }, "Have an idea for an app?"),
            createElement("p", { className: "mxappswitcher-footer__details" },
                createElement("a", { className: "mxappswitcher-footer__link", href: "https://new.mendix.com/link/overview/", target: "_blank", rel: "noreferrer" }, "Create an app"),
                " ",
                "or visit the",
                " ",
                createElement("a", { className: "mxappswitcher-footer__link", href: "https://marketplace.mendix.com/", target: "_blank", rel: "noreferrer" }, "Marketplace")))));
};
var Footer$1 = React.memo(Footer);

const SkeletonLoader = () => {
    const skeletonItemCount = 7;
    return (createElement("div", { className: "mxappswitcher-skeleton-loader mxappswitcher-panel__skeleton-loader" },
        createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__title" }),
        Array.from({ length: skeletonItemCount }, (_, i) => (createElement("div", { key: i, className: "mxappswitcher-skeleton-loader__item" },
            createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__item-icon" }),
            createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__item-name" }),
            createElement("div", { className: "mxappswitcher-skeleton-loader__box mxappswitcher-skeleton-loader__item-link" }))))));
};
var SkeletonLoader$1 = React.memo(SkeletonLoader);

const AppSwitcherPanel = ({ appListResponse, appListLoadingState, setForceRefresh, authorizationError, forceRefresh, positioning, positionX, positionY, setAppSwitcherPanelWidth, setAppSwitcherPanelHeight, onClose }) => {
    const ref = useRef(null);
    const [filteredAppList, setFilteredAppList] = useState();
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
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
    useLayoutEffect(() => {
        if (ref.current) {
            setAppSwitcherPanelWidth(ref.current.offsetWidth);
            setAppSwitcherPanelHeight(ref.current.offsetHeight);
        }
    }, [setAppSwitcherPanelHeight, setAppSwitcherPanelWidth]);
    return (createElement("div", { className: classnames("mxappswitcher-panel", { "mxappswitcher-panel--sidebar-left": positioning === "sidebarLeft" }, {
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
        createElement("button", { onClick: onClose, className: "mxappswitcher-close-button mxappswitcher-panel__close-button" },
            createElement(ArrowLeftIcon$1, { className: "mxappswitcher-close-button__icon" }),
            " Close"),
        createElement("div", { className: "mxappswitcher-search mxappswitcher-panel__search" },
            createElement("input", { className: "mxappswitcher-search__input", type: "text", value: searchValue, onChange: onSearchChange, placeholder: "Search Apps", maxLength: 40 }),
            createElement(SearchIcon$1, { className: "mxappswitcher-search__icon" })),
        appListLoadingState === LoadingState.Complete ? (createElement(AppList, { appList: filteredAppList, setForceRefresh: setForceRefresh, forceRefresh: forceRefresh, setSearchValue: setSearchValue })) : appListLoadingState === LoadingState.Failed || authorizationError ? (createElement("p", { className: "mxappswitcher-error mxappswitcher-panel__error" }, "No app here? No worries! Try to refresh the page or contact your admin.")) : (createElement(SkeletonLoader$1, null)),
        createElement(Footer$1, null)));
};
var AppSwitcherPanel$1 = React.memo(AppSwitcherPanel);

const SwitcherIcon = ({ className = "" }) => {
    return (createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 32 32" },
        createElement("path", { id: "switcherIconDots", fillRule: "evenodd", clipRule: "evenodd", fill: "currentColor", d: "M8 10a2 2 0 100-4 2 2 0 000 4zM8 18a2 2 0 100-4 2 2 0 000 4zM16 18a2 2 0 100-4 2 2 0 000 4zM24 18a2 2 0 100-4 2 2 0 000 4zM8 26a2 2 0 100-4 2 2 0 000 4zM16 26a2 2 0 100-4 2 2 0 000 4zM24 26a2 2 0 100-4 2 2 0 000 4zM16 10a2 2 0 100-4 2 2 0 000 4zM24 10a2 2 0 100-4 2 2 0 000 4z" })));
};
var SwitcherIcon$1 = React.memo(SwitcherIcon);

const ToggleButton = ({ onClick, setAppSwitcherButtonHeight }) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (ref.current) {
            setAppSwitcherButtonHeight(ref.current.offsetHeight);
        }
    }, [setAppSwitcherButtonHeight]);
    return (
    // TODO: Add ARIA to the entire implementation.
    createElement("button", { className: "mxappswitcher-toggle", onClick: onClick, ref: ref },
        createElement(SwitcherIcon$1, { className: "mxappswitcher-toggle__icon" })));
};
var ToggleButton$1 = React.memo(ToggleButton);

const AppSwitcherContainer = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const [forceRefresh, setForceRefresh] = useState(false);
    const { appListLoadingState, appList, authorizationError } = useFetchAppList(isOpen, forceRefresh, props.baseUrl);
    const [appSwitcherPanelWidth, setAppSwitcherPanelWidth] = useState(0);
    const [appSwitcherPanelHeight, setAppSwitcherPanelHeight] = useState(0);
    const [appSwitcherButtonHeight, setAppSwitcherButtonHeight] = useState(0);
    const [positionX, positionY] = useDeterminePosition({
        elementRef: ref.current,
        width: appSwitcherPanelWidth,
        height: appSwitcherPanelHeight + appSwitcherButtonHeight,
        isOpen,
        isReady: isOpen && appListLoadingState === LoadingState.Complete
    });
    useEffect(() => {
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
    return (createElement("div", { className: classnames(props.class, "mxappswitcher"), style: props.style, ref: ref },
        createElement(ToggleButton$1, { onClick: () => setIsOpen(!isOpen), setAppSwitcherButtonHeight: setAppSwitcherButtonHeight }),
        isOpen && (createElement(AppSwitcherPanel$1, { appListResponse: appList, appListLoadingState: appListLoadingState, setForceRefresh: setForceRefresh, authorizationError: authorizationError, forceRefresh: forceRefresh, positioning: props.positioning, positionX: positionX, positionY: positionY, setAppSwitcherPanelWidth: setAppSwitcherPanelWidth, setAppSwitcherPanelHeight: setAppSwitcherPanelHeight, onClose: () => setIsOpen(false) }))));
};

class AppSwitcher extends Component {
    render() {
        return (createElement(AppSwitcherContainer, { baseUrl: this.props.baseUrl, positioning: this.props.positioning, name: "", class: "" }));
    }
}

export { AppSwitcher as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwU3dpdGNoZXIubWpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdGFudHMudHMiLCIuLi8uLi8uLi8uLi8uLi90eXBpbmdzL1Bvc2l0aW9uaW5nLnRzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL2hvb2tzL3VzZURldGVybWluZVBvc2l0aW9uLnRzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlci50cyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9ob29rcy91c2VGZXRjaEFwcExpc3QudHMiLCIuLi8uLi8uLi8uLi8uLi9zcmMvcmVzb3VyY2VzL0Fycm93TGVmdEljb24udHN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL3Jlc291cmNlcy9TZWFyY2hJY29uLnRzeCIsIi4uLy4uLy4uLy4uLy4uL3NyYy9yZXNvdXJjZXMvRXh0ZXJuYWxMaW5rSWNvbi50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9BcHBMaXN0SXRlbS50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvcmVzb3VyY2VzL0ZvcmNlUmVmcmVzaEljb24udHN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQXBwTGlzdC50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Gb290ZXIudHN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU2tlbGV0b25Mb2FkZXIudHN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQXBwU3dpdGNoZXJQYW5lbC50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvcmVzb3VyY2VzL1N3aXRjaGVySWNvbi50c3giLCIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Ub2dnbGVCdXR0b24udHN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQXBwU3dpdGNoZXJDb250YWluZXIudHN4IiwiLi4vLi4vLi4vLi4vLi4vc3JjL0FwcFN3aXRjaGVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE4IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0aWYgKGFyZy5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YXIgaW5uZXIgPSBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHRcdFx0aWYgKGlubmVyKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goaW5uZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRpZiAoYXJnLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZy50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5leHBvcnQgY29uc3QgTUZfQ1VTVE9NX0FVVEhFTlRJQ0FUSU9OID0gXCJBcHBTd2l0Y2hlck1vZHVsZS5EU19DdXN0b21BdXRoZW50aWNhdGlvblwiO1xuXG5leHBvcnQgZW51bSBMb2FkaW5nU3RhdGUge1xuICAgIElkbGUgPSBcImlkbGVcIixcbiAgICBGZXRjaGluZyA9IFwiZmV0Y2hpbmdcIixcbiAgICBDb21wbGV0ZSA9IFwiY29tcGxldGVcIixcbiAgICBGYWlsZWQgPSBcImZhaWxlZFwiXG59XG4iLCJleHBvcnQgZW51bSBIb3Jpem9udGFsUG9zaXRpb24ge1xuICAgIFwibGVmdFwiLFxuICAgIFwicmlnaHRcIlxufVxuXG5leHBvcnQgZW51bSBWZXJ0aWNhbFBvc2l0aW9uIHtcbiAgICBcInVwXCIsXG4gICAgXCJkb3duXCJcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEhvcml6b250YWxQb3NpdGlvbiwgVmVydGljYWxQb3NpdGlvbiB9IGZyb20gXCIuLi8uLi90eXBpbmdzL1Bvc2l0aW9uaW5nXCI7XG5cbmNvbnN0IHVzZURldGVybWluZVBvc2l0aW9uID0gKHtcbiAgICBlbGVtZW50UmVmLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBpc09wZW4sXG4gICAgaXNSZWFkeVxufToge1xuICAgIGVsZW1lbnRSZWY6IEhUTUxEaXZFbGVtZW50IHwgbnVsbDtcbiAgICB3aWR0aDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGhlaWdodDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICBpc1JlYWR5OiBib29sZWFuO1xufSk6IFtIb3Jpem9udGFsUG9zaXRpb24sIFZlcnRpY2FsUG9zaXRpb25dID0+IHtcbiAgICBjb25zdCBbcG9zaXRpb25YLCBzZXRQb3NpdGlvblhdID0gdXNlU3RhdGU8SG9yaXpvbnRhbFBvc2l0aW9uPihIb3Jpem9udGFsUG9zaXRpb24ucmlnaHQpO1xuICAgIGNvbnN0IFtwb3NpdGlvblksIHNldFBvc2l0aW9uWV0gPSB1c2VTdGF0ZTxWZXJ0aWNhbFBvc2l0aW9uPihWZXJ0aWNhbFBvc2l0aW9uLmRvd24pO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnRSZWYgJiYgd2lkdGggJiYgaGVpZ2h0ICYmIGlzT3Blbikge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBlbGVtZW50UmVmLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0TGVmdCA9IHBvc2l0aW9uLng7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXRUb3AgPSBwb3NpdGlvbi55O1xuXG4gICAgICAgICAgICAvLyBkZXRlcm1pbmUgaG9yaXpvbnRhbCBheGlzIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAob2Zmc2V0TGVmdCArIHdpZHRoID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBzZXRQb3NpdGlvblgoSG9yaXpvbnRhbFBvc2l0aW9uLmxlZnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRQb3NpdGlvblgoSG9yaXpvbnRhbFBvc2l0aW9uLnJpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGV0ZXJtaW5lIHZlcnRpY2FsIGF4aXMgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChvZmZzZXRUb3AgKyBoZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBzZXRQb3NpdGlvblkoVmVydGljYWxQb3NpdGlvbi51cCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFBvc2l0aW9uWShWZXJ0aWNhbFBvc2l0aW9uLmRvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgW2lzUmVhZHksIGlzT3Blbiwgd2lkdGgsIGhlaWdodCwgZWxlbWVudFJlZl0pO1xuXG4gICAgcmV0dXJuIFtwb3NpdGlvblgsIHBvc2l0aW9uWV07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1c2VEZXRlcm1pbmVQb3NpdGlvbjtcbiIsImltcG9ydCB7IEN1c3RvbUF1dGhlbnRpY2F0aW9uRGF0YSB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0N1c3RvbUF1dGhUb2tlblwiO1xuaW1wb3J0IHsgTUZfQ1VTVE9NX0FVVEhFTlRJQ0FUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgY29uc3QgZ2V0Q3VzdG9tQXV0aFRva2VuID0gYXN5bmMgKCk6IFByb21pc2U8Q3VzdG9tQXV0aGVudGljYXRpb25EYXRhPiA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFByb21pc2U8Q3VzdG9tQXV0aGVudGljYXRpb25EYXRhPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHdpbmRvdy5teC5kYXRhLmFjdGlvbih7XG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb25uYW1lOiBNRl9DVVNUT01fQVVUSEVOVElDQVRJT05cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWxsYmFjazogKHJlc3BvbnNlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXN0b21BdXRoZW50aWNhdGlvbjogQ3VzdG9tQXV0aGVudGljYXRpb25EYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjdXN0b21BdXRoZW50aWNhdGlvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGUgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IEFwcExpc3RSZXNwb25zZSB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0FwcExpc3RSZXNwb25zZVwiO1xuaW1wb3J0IHsgQ3VzdG9tQXV0aGVudGljYXRpb25EYXRhIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvQ3VzdG9tQXV0aFRva2VuXCI7XG5pbXBvcnQgeyBMb2FkaW5nU3RhdGUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRDdXN0b21BdXRoVG9rZW4gfSBmcm9tIFwiLi4vdXRpbHMvaGVscGVyXCI7XG5cbmNvbnN0IHVzZUZldGNoQXBwTGlzdCA9IChcbiAgICBpc09wZW46IGJvb2xlYW4sXG4gICAgZm9yY2VSZWZyZXNoOiBib29sZWFuLFxuICAgIGJhc2VVUkw6IHN0cmluZ1xuKToge1xuICAgIGF1dGhvcml6YXRpb25FcnJvcjogYm9vbGVhbjtcbiAgICBhcHBMaXN0TG9hZGluZ1N0YXRlOiBMb2FkaW5nU3RhdGU7XG4gICAgYXBwTGlzdDogQXBwTGlzdFJlc3BvbnNlW107XG59ID0+IHtcbiAgICBjb25zdCBbbG9hZGluZ1N0YXRlLCBzZXRMb2FkaW5nU3RhdGVdID0gdXNlU3RhdGU8TG9hZGluZ1N0YXRlPihMb2FkaW5nU3RhdGUuSWRsZSk7XG4gICAgY29uc3QgW2FwcExpc3QsIHNldEFwcExpc3RdID0gdXNlU3RhdGU8QXBwTGlzdFJlc3BvbnNlW10+KFtdKTtcbiAgICBjb25zdCBbdG9rZW5Jc1ZhbGlkLCBzZXRUb2tlbklzVmFsaWRdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuICAgIGNvbnN0IFthdXRob3JpemF0aW9uRXJyb3IsIHNldEF1dGhvcml6YXRpb25FcnJvcl0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gICAgY29uc3QgW2ZldGNoQ291bnQsIHNldEZldGNoQ291bnRdID0gdXNlU3RhdGU8bnVtYmVyPigwKTtcbiAgICBjb25zdCBbdGltZVN0YW1wLCBzZXRUaW1lU3RhbXBdID0gdXNlU3RhdGU8RGF0ZT4oKTtcbiAgICBjb25zdCBbYXV0aGVudGljYXRpb25EYXRhLCBzZXRBdXRoZW50aWNhdGlvbkRhdGFdID0gdXNlU3RhdGU8Q3VzdG9tQXV0aGVudGljYXRpb25EYXRhPigpO1xuXG4gICAgY29uc3Qgc2hvdWxkUmVmcmVzaEF1dGhUb2tlbiA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgaWYgKCF0aW1lU3RhbXAgfHwgIWF1dGhlbnRpY2F0aW9uRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBkaWZmSW5TZWNvbmRzID0gTWF0aC5yb3VuZCgobm93LmdldFRpbWUoKSAtIHRpbWVTdGFtcC5nZXRUaW1lKCkpIC8gMTAwMCk7XG4gICAgICAgIHJldHVybiBkaWZmSW5TZWNvbmRzID49IGF1dGhlbnRpY2F0aW9uRGF0YS50aW1lVG9MaXZlIHx8IGZldGNoQ291bnQgPj0gYXV0aGVudGljYXRpb25EYXRhLnRpbWVzVG9Vc2U7XG4gICAgfTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChzaG91bGRSZWZyZXNoQXV0aFRva2VuKCkpIHtcbiAgICAgICAgICAgIHNldFRva2VuSXNWYWxpZChmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgICBmZXRjaEFwcExpc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbYXV0aGVudGljYXRpb25EYXRhLCBmb3JjZVJlZnJlc2gsIGlzT3Blbl0pOyAvLyBXYXJuaW5nOiBmZXRjaEFwcExpc3QgY2FuJ3QgYmUgYWRkZWQgYXMgZGVwZW5kZW5jeSBiZWNhdXNlIGl0IHdpbGwgY3JlYXRlIGEgbG9vcC5cblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghdG9rZW5Jc1ZhbGlkKSB7XG4gICAgICAgICAgICBnZXRDdXN0b21BdXRoVG9rZW4oKS50aGVuKGN1c3RvbUF1dGhlbnRpY2F0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWN1c3RvbUF1dGhlbnRpY2F0aW9uLmF1dGhvcml6YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0QXV0aG9yaXphdGlvbkVycm9yKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldEF1dGhlbnRpY2F0aW9uRGF0YShjdXN0b21BdXRoZW50aWNhdGlvbik7XG4gICAgICAgICAgICAgICAgc2V0RmV0Y2hDb3VudCgwKTtcbiAgICAgICAgICAgICAgICBzZXRUb2tlbklzVmFsaWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZVN0YW1wKG5ldyBEYXRlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCBbdG9rZW5Jc1ZhbGlkXSk7XG5cbiAgICBjb25zdCBmZXRjaEFwcExpc3QgPSB1c2VDYWxsYmFjayhhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgIGlmICghYXV0aGVudGljYXRpb25EYXRhIHx8ICFhdXRoZW50aWNhdGlvbkRhdGEuYXV0aG9yaXphdGlvbiB8fCBsb2FkaW5nU3RhdGUgPT09IExvYWRpbmdTdGF0ZS5GZXRjaGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0TG9hZGluZ1N0YXRlKExvYWRpbmdTdGF0ZS5GZXRjaGluZyk7XG4gICAgICAgIHNldEZldGNoQ291bnQoZmV0Y2hDb3VudCA9PiBmZXRjaENvdW50ICsgMSk7XG5cbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZVVSTH0vdXNlcnMvJHthdXRoZW50aWNhdGlvbkRhdGEudXNlcklkfS9hcHBzP3JlZnJlc2g9JHtmb3JjZVJlZnJlc2h9YDtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBhdXRoZW50aWNhdGlvbkRhdGEuYXV0aG9yaXphdGlvbixcbiAgICAgICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZmV0Y2godXJsLCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2sgfHwgcmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUb2tlbklzVmFsaWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgc2V0TG9hZGluZ1N0YXRlKExvYWRpbmdTdGF0ZS5Db21wbGV0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0QXBwTGlzdChqc29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRUb2tlbklzVmFsaWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNldExvYWRpbmdTdGF0ZShMb2FkaW5nU3RhdGUuRmFpbGVkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQXBwU3dpdGNoZXIgPj4gSW52YWxpZCB0b2tlbi4gUGxlYXNlIHJlZnJlc2ggaXQuXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSwgW2F1dGhlbnRpY2F0aW9uRGF0YSwgYmFzZVVSTCwgZm9yY2VSZWZyZXNoLCBsb2FkaW5nU3RhdGVdKTtcblxuICAgIHJldHVybiB7IGF1dGhvcml6YXRpb25FcnJvciwgYXBwTGlzdExvYWRpbmdTdGF0ZTogbG9hZGluZ1N0YXRlLCBhcHBMaXN0IH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1c2VGZXRjaEFwcExpc3Q7XG4iLCJpbXBvcnQgUmVhY3QsIHsgUmVhY3RFbGVtZW50LCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmNvbnN0IEFycm93TGVmdEljb24gPSAoeyBjbGFzc05hbWUgPSBcIlwiIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pOiBSZWFjdEVsZW1lbnQgPT4gKFxuICAgIC8vIFRPRE86IFRoaXMgaWNvbiBpcyBzdXBlciBjb21wbGV4IGZvciB3aGF0IGl0IG5lZWRzIHRvIGRvLiBNYXliZSB3ZSBjYW4gc2ltcGxpZnkgaXQuXG4gICAgPHN2ZyBjbGFzc05hbWU9e2NsYXNzTmFtZX0gdmlld0JveD1cIjAgMCAxNiAxN1wiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8ZyBjbGlwUGF0aD1cInVybCgjY2xpcDBfMTgxNF83MjE2KVwiPlxuICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICBkPVwiTTE1LjUgOC41SDAuNVwiXG4gICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgIGQ9XCJNNy41IDE1LjVMMC41IDguNUw3LjUgMS41XCJcbiAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS41XCJcbiAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXAwXzE4MTRfNzIxNlwiPlxuICAgICAgICAgICAgICAgIDxyZWN0IHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCAwLjUpXCIgLz5cbiAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgIDwvZGVmcz5cbiAgICA8L3N2Zz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQXJyb3dMZWZ0SWNvbik7XG4iLCJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlRWxlbWVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmNvbnN0IFNlYXJjaEljb24gPSAoeyBjbGFzc05hbWUgPSBcIlwiIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pOiBSZWFjdEVsZW1lbnQgPT4gKFxuICAgIDxzdmcgY2xhc3NOYW1lPXtjbGFzc05hbWV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICBmaWxsPVwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjVcIlxuICAgICAgICAgICAgZD1cIk0xNC40MDYgMTguNTczQTcuODc0IDcuODc0IDAgMTA4LjI0NiA0LjA4YTcuODc0IDcuODc0IDAgMDA2LjE2IDE0LjQ5M3pNMTYuODkzIDE2Ljg5M0wyMyAyMy4wMDFcIlxuICAgICAgICA+PC9wYXRoPlxuICAgIDwvc3ZnPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhTZWFyY2hJY29uKTtcbiIsImltcG9ydCBSZWFjdCwgeyBSZWFjdEVsZW1lbnQsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxuY29uc3QgRXh0ZXJuYWxMaW5rSWNvbiA9ICh7IGNsYXNzTmFtZSA9IFwiXCIgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSk6IFJlYWN0RWxlbWVudCA9PiAoXG4gICAgPHN2ZyBjbGFzc05hbWU9e2NsYXNzTmFtZX0gdmlld0JveD1cIjAgMCAyMCAyMFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk0xNSAxMC44MzMzVjE1LjgzMzNDMTUgMTYuMjc1NCAxNC44MjQ0IDE2LjY5OTMgMTQuNTExOCAxNy4wMTE4QzE0LjE5OTMgMTcuMzI0NCAxMy43NzU0IDE3LjUgMTMuMzMzMyAxNy41SDQuMTY2NjdDMy43MjQ2NCAxNy41IDMuMzAwNzIgMTcuMzI0NCAyLjk4ODE2IDE3LjAxMThDMi42NzU1OSAxNi42OTkzIDIuNSAxNi4yNzU0IDIuNSAxNS44MzMzVjYuNjY2NjdDMi41IDYuMjI0NjQgMi42NzU1OSA1LjgwMDcyIDIuOTg4MTYgNS40ODgxNkMzLjMwMDcyIDUuMTc1NTkgMy43MjQ2NCA1IDQuMTY2NjcgNUg5LjE2NjY3XCJcbiAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTEyLjUgMi41SDE3LjVWNy41XCJcbiAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTguMzMzMzcgMTEuNjY2N0wxNy41IDIuNVwiXG4gICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjVcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAvPlxuICAgIDwvc3ZnPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhFeHRlcm5hbExpbmtJY29uKTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyBBcHBMaXN0UmVzcG9uc2UgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9BcHBMaXN0UmVzcG9uc2VcIjtcbmltcG9ydCBFeHRlcm5hbExpbmtJY29uIGZyb20gXCIuLi9yZXNvdXJjZXMvRXh0ZXJuYWxMaW5rSWNvblwiO1xuXG5pbnRlcmZhY2UgQXBwTGlzdEl0ZW1Qcm9wcyB7XG4gICAgZGF0YTogQXBwTGlzdFJlc3BvbnNlO1xufVxuXG5jb25zdCBBcHBMaXN0SXRlbSA9ICh7IGRhdGEgfTogQXBwTGlzdEl0ZW1Qcm9wcyk6IFJlYWN0RWxlbWVudCA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGEgaHJlZj17ZGF0YS5hcHBVUkx9IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItbGlzdC1pdGVtXCIgdGl0bGU9e2RhdGEuYXBwTmFtZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItbGlzdC1pdGVtX19jb250YWluZXJcIiBrZXk9e2RhdGEuYXBwSWR9PlxuICAgICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0LWl0ZW1fX2ltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgc3JjPXtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBcImFwcExvZ29cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGRhdGEuYXBwTG9nb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCIuL2ltZy9BcHBTd2l0Y2hlck1vZHVsZSRJbWFnZXMkTWVuZGl4X2xvZ28uc3ZnXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0LWl0ZW1fX25hbWVcIj57ZGF0YS5hcHBOYW1lfTwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPXtkYXRhLmFwcFVSTH0gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0LWl0ZW1fX2xpbmtcIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxFeHRlcm5hbExpbmtJY29uIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItbGlzdC1pdGVtX19leHRlcm5hbC1saW5rXCIgLz5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9hPlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBMaXN0SXRlbTtcbiIsImltcG9ydCBSZWFjdCwgeyBSZWFjdEVsZW1lbnQsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxuY29uc3QgRm9yY2VSZWZyZXNoSWNvbiA9ICh7IGNsYXNzTmFtZSA9IFwiXCIgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSk6IFJlYWN0RWxlbWVudCA9PiAoXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cIm5vbmVcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gdmlld0JveD1cIjAgMCAyMCAyMFwiPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk0xOS4xNjcgMy4zMzN2NWgtNVwiXG4gICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjVcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk0xNy4wNzUgMTIuNWE3LjUgNy41IDAgMTEtMS43NjctNy44bDMuODU5IDMuNjMzXCJcbiAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNVwiXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgIC8+XG4gICAgPC9zdmc+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEZvcmNlUmVmcmVzaEljb24pO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgRnJhZ21lbnQsIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyBBcHBMaXN0UHJvcHMgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9BcHBMaXN0UHJvcHNcIjtcbmltcG9ydCB7IEFwcExpc3RSZXNwb25zZSB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0FwcExpc3RSZXNwb25zZVwiO1xuaW1wb3J0IEFwcExpc3RJdGVtIGZyb20gXCIuL0FwcExpc3RJdGVtXCI7XG5pbXBvcnQgRm9yY2VSZWZyZXNoSWNvbiBmcm9tIFwiLi4vcmVzb3VyY2VzL0ZvcmNlUmVmcmVzaEljb25cIjtcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5cbmNvbnN0IEFwcExpc3QgPSAoeyBhcHBMaXN0LCBzZXRGb3JjZVJlZnJlc2gsIGZvcmNlUmVmcmVzaCwgc2V0U2VhcmNoVmFsdWUgfTogQXBwTGlzdFByb3BzKTogUmVhY3RFbGVtZW50IHwgbnVsbCA9PiB7XG4gICAgY29uc3Qgb25TZXRGb3JjZVJlZnJlc2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHNldEZvcmNlUmVmcmVzaCh0cnVlKTtcbiAgICAgICAgc2V0U2VhcmNoVmFsdWUoXCJcIik7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0IG14YXBwc3dpdGNoZXItcGFuZWxfX2xpc3RcIj5cbiAgICAgICAgICAgIHthcHBMaXN0Py5sZW5ndGggPT09IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0X19lbXB0eS1tZXNzYWdlXCI+Tm8gYXBwcyBmb3VuZDwvc3Bhbj59XG4gICAgICAgICAgICB7YXBwTGlzdCAmJiBhcHBMaXN0Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWxpc3RfX3RpdGxlLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItbGlzdF9fdGl0bGVcIj5Zb3VyIGFwcHM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwibXhhcHBzd2l0Y2hlci1saXN0X19yZWZyZXNoLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibXhhcHBzd2l0Y2hlci1saXN0X19yZWZyZXNoLWJ1dHRvbi0tZGlzYWJsZWRcIjogZm9yY2VSZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25TZXRGb3JjZVJlZnJlc2h9XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcmNlUmVmcmVzaEljb24gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1saXN0X19yZWZyZXNoLWJ1dHRvbi1pY29uXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge2FwcExpc3QubWFwKChhcHBEYXRhOiBBcHBMaXN0UmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8QXBwTGlzdEl0ZW0gZGF0YT17YXBwRGF0YX0ga2V5PXthcHBEYXRhLmFwcElkfSAvPjtcbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBMaXN0O1xuIiwiaW1wb3J0IFJlYWN0LCB7IFJlYWN0RWxlbWVudCwgY3JlYXRlRWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5jb25zdCBGb290ZXIgPSAoKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItZm9vdGVyIG14YXBwc3dpdGNoZXItcGFuZWxfX2Zvb3RlclwiPlxuICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWZvb3Rlcl9fbG9nb1wiIHNyYz1cIi4vaW1nL0FwcFN3aXRjaGVyTW9kdWxlJEltYWdlcyRNZW5kaXhfbG9nby5zdmdcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWZvb3Rlcl9fdGV4dFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItZm9vdGVyX19kZXRhaWxzXCI+SGF2ZSBhbiBpZGVhIGZvciBhbiBhcHA/PC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItZm9vdGVyX19kZXRhaWxzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLWZvb3Rlcl9fbGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9uZXcubWVuZGl4LmNvbS9saW5rL292ZXJ2aWV3L1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZSBhbiBhcHBcbiAgICAgICAgICAgICAgICAgICAgPC9hPntcIiBcIn1cbiAgICAgICAgICAgICAgICAgICAgb3IgdmlzaXQgdGhle1wiIFwifVxuICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1mb290ZXJfX2xpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vbWFya2V0cGxhY2UubWVuZGl4LmNvbS9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXJrZXRwbGFjZVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEZvb3Rlcik7XG4iLCJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlRWxlbWVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmNvbnN0IFNrZWxldG9uTG9hZGVyID0gKCk6IFJlYWN0RWxlbWVudCA9PiB7XG4gICAgY29uc3Qgc2tlbGV0b25JdGVtQ291bnQgPSA3O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLXNrZWxldG9uLWxvYWRlciBteGFwcHN3aXRjaGVyLXBhbmVsX19za2VsZXRvbi1sb2FkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1za2VsZXRvbi1sb2FkZXJfX2JveCBteGFwcHN3aXRjaGVyLXNrZWxldG9uLWxvYWRlcl9fdGl0bGVcIj48L2Rpdj5cbiAgICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiBza2VsZXRvbkl0ZW1Db3VudCB9LCAoXywgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLXNrZWxldG9uLWxvYWRlcl9faXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2tlbGV0b24tbG9hZGVyX19ib3ggbXhhcHBzd2l0Y2hlci1za2VsZXRvbi1sb2FkZXJfX2l0ZW0taWNvblwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2tlbGV0b24tbG9hZGVyX19ib3ggbXhhcHBzd2l0Y2hlci1za2VsZXRvbi1sb2FkZXJfX2l0ZW0tbmFtZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2tlbGV0b24tbG9hZGVyX19ib3ggbXhhcHBzd2l0Y2hlci1za2VsZXRvbi1sb2FkZXJfX2l0ZW0tbGlua1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKFNrZWxldG9uTG9hZGVyKTtcbiIsImltcG9ydCBjbGFzc25hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QsIHsgY3JlYXRlRWxlbWVudCwgUmVhY3RFbGVtZW50LCB1c2VFZmZlY3QsIHVzZUxheW91dEVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyBBcHBMaXN0UmVzcG9uc2UgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9BcHBMaXN0UmVzcG9uc2VcIjtcbmltcG9ydCB7IEFwcFN3aXRjaGVyUGFuZWxQcm9wcyB9IGZyb20gXCIuLi8uLi90eXBpbmdzL0FwcFN3aXRjaGVyUGFuZWxQcm9wc1wiO1xuaW1wb3J0IHsgSG9yaXpvbnRhbFBvc2l0aW9uLCBWZXJ0aWNhbFBvc2l0aW9uIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvUG9zaXRpb25pbmdcIjtcbmltcG9ydCB7IExvYWRpbmdTdGF0ZSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCBBcnJvd0xlZnRJY29uIGZyb20gXCIuLi9yZXNvdXJjZXMvQXJyb3dMZWZ0SWNvblwiO1xuaW1wb3J0IFNlYXJjaEljb24gZnJvbSBcIi4uL3Jlc291cmNlcy9TZWFyY2hJY29uXCI7XG5pbXBvcnQgQXBwTGlzdCBmcm9tIFwiLi9BcHBMaXN0XCI7XG5pbXBvcnQgRm9vdGVyIGZyb20gXCIuL0Zvb3RlclwiO1xuaW1wb3J0IFNrZWxldG9uTG9hZGVyIGZyb20gXCIuL1NrZWxldG9uTG9hZGVyXCI7XG5cbmNvbnN0IEFwcFN3aXRjaGVyUGFuZWwgPSAoe1xuICAgIGFwcExpc3RSZXNwb25zZSxcbiAgICBhcHBMaXN0TG9hZGluZ1N0YXRlLFxuICAgIHNldEZvcmNlUmVmcmVzaCxcbiAgICBhdXRob3JpemF0aW9uRXJyb3IsXG4gICAgZm9yY2VSZWZyZXNoLFxuICAgIHBvc2l0aW9uaW5nLFxuICAgIHBvc2l0aW9uWCxcbiAgICBwb3NpdGlvblksXG4gICAgc2V0QXBwU3dpdGNoZXJQYW5lbFdpZHRoLFxuICAgIHNldEFwcFN3aXRjaGVyUGFuZWxIZWlnaHQsXG4gICAgb25DbG9zZVxufTogQXBwU3dpdGNoZXJQYW5lbFByb3BzKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICAgIGNvbnN0IFtmaWx0ZXJlZEFwcExpc3QsIHNldEZpbHRlcmVkQXBwTGlzdF0gPSB1c2VTdGF0ZTxBcHBMaXN0UmVzcG9uc2VbXSB8IHVuZGVmaW5lZD4oKTtcbiAgICBjb25zdCBbc2VhcmNoVmFsdWUsIHNldFNlYXJjaFZhbHVlXSA9IHVzZVN0YXRlPHN0cmluZz4oXCJcIik7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBzZXRGaWx0ZXJlZEFwcExpc3QoYXBwTGlzdFJlc3BvbnNlKTtcbiAgICB9LCBbYXBwTGlzdFJlc3BvbnNlXSk7XG5cbiAgICBjb25zdCBvblNlYXJjaENoYW5nZSA9IChldmVudDogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3Qgc2VhcmNoUXVlcnkgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIHNldFNlYXJjaFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHNlYXJjaFF1ZXJ5ICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmaWx0ZXJBcHBMaXN0KHNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICAgIHNldEZpbHRlcmVkQXBwTGlzdChyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0RmlsdGVyZWRBcHBMaXN0KGFwcExpc3RSZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgZmlsdGVyQXBwTGlzdCA9IChzZWFyY2hRdWVyeTogc3RyaW5nKTogQXBwTGlzdFJlc3BvbnNlW10gPT4ge1xuICAgICAgICByZXR1cm4gYXBwTGlzdFJlc3BvbnNlICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYXBwTGlzdFJlc3BvbnNlLmZpbHRlcigocmVzdWx0OiBBcHBMaXN0UmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuYXBwTmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgOiBbXTtcbiAgICB9O1xuXG4gICAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBzZXRBcHBTd2l0Y2hlclBhbmVsV2lkdGgocmVmLmN1cnJlbnQub2Zmc2V0V2lkdGgpO1xuICAgICAgICAgICAgc2V0QXBwU3dpdGNoZXJQYW5lbEhlaWdodChyZWYuY3VycmVudC5vZmZzZXRIZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSwgW3NldEFwcFN3aXRjaGVyUGFuZWxIZWlnaHQsIHNldEFwcFN3aXRjaGVyUGFuZWxXaWR0aF0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxuICAgICAgICAgICAgICAgIFwibXhhcHBzd2l0Y2hlci1wYW5lbFwiLFxuICAgICAgICAgICAgICAgIHsgXCJteGFwcHN3aXRjaGVyLXBhbmVsLS1zaWRlYmFyLWxlZnRcIjogcG9zaXRpb25pbmcgPT09IFwic2lkZWJhckxlZnRcIiB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJteGFwcHN3aXRjaGVyLXBhbmVsLS1yaWdodC11cFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25pbmcgPT09IFwiY29udGV4dE1lbnVcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YID09PSBIb3Jpem9udGFsUG9zaXRpb24ucmlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWSA9PT0gVmVydGljYWxQb3NpdGlvbi51cFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIm14YXBwc3dpdGNoZXItcGFuZWwtLWxlZnQtdXBcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uaW5nID09PSBcImNvbnRleHRNZW51XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWSA9PT0gVmVydGljYWxQb3NpdGlvbi51cCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YID09PSBIb3Jpem9udGFsUG9zaXRpb24ubGVmdFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIm14YXBwc3dpdGNoZXItcGFuZWwtLWxlZnQtZG93blwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25pbmcgPT09IFwiY29udGV4dE1lbnVcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZID09PSBWZXJ0aWNhbFBvc2l0aW9uLmRvd24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWCA9PT0gSG9yaXpvbnRhbFBvc2l0aW9uLmxlZnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgcmVmPXtyZWZ9XG4gICAgICAgID5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX0gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1jbG9zZS1idXR0b24gbXhhcHBzd2l0Y2hlci1wYW5lbF9fY2xvc2UtYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgPEFycm93TGVmdEljb24gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1jbG9zZS1idXR0b25fX2ljb25cIiAvPiBDbG9zZVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2VhcmNoIG14YXBwc3dpdGNoZXItcGFuZWxfX3NlYXJjaFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLXNlYXJjaF9faW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uU2VhcmNoQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBBcHBzXCJcbiAgICAgICAgICAgICAgICAgICAgbWF4TGVuZ3RoPXs0MH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxTZWFyY2hJY29uIGNsYXNzTmFtZT1cIm14YXBwc3dpdGNoZXItc2VhcmNoX19pY29uXCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2FwcExpc3RMb2FkaW5nU3RhdGUgPT09IExvYWRpbmdTdGF0ZS5Db21wbGV0ZSA/IChcbiAgICAgICAgICAgICAgICA8QXBwTGlzdFxuICAgICAgICAgICAgICAgICAgICBhcHBMaXN0PXtmaWx0ZXJlZEFwcExpc3R9XG4gICAgICAgICAgICAgICAgICAgIHNldEZvcmNlUmVmcmVzaD17c2V0Rm9yY2VSZWZyZXNofVxuICAgICAgICAgICAgICAgICAgICBmb3JjZVJlZnJlc2g9e2ZvcmNlUmVmcmVzaH1cbiAgICAgICAgICAgICAgICAgICAgc2V0U2VhcmNoVmFsdWU9e3NldFNlYXJjaFZhbHVlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogYXBwTGlzdExvYWRpbmdTdGF0ZSA9PT0gTG9hZGluZ1N0YXRlLkZhaWxlZCB8fCBhdXRob3JpemF0aW9uRXJyb3IgPyAoXG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci1lcnJvciBteGFwcHN3aXRjaGVyLXBhbmVsX19lcnJvclwiPlxuICAgICAgICAgICAgICAgICAgICBObyBhcHAgaGVyZT8gTm8gd29ycmllcyEgVHJ5IHRvIHJlZnJlc2ggdGhlIHBhZ2Ugb3IgY29udGFjdCB5b3VyIGFkbWluLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPFNrZWxldG9uTG9hZGVyIC8+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICA8Rm9vdGVyIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEFwcFN3aXRjaGVyUGFuZWwpO1xuIiwiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUVsZW1lbnQsIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5jb25zdCBTd2l0Y2hlckljb24gPSAoeyBjbGFzc05hbWUgPSBcIlwiIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pOiBSZWFjdEVsZW1lbnQgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBmaWxsPVwibm9uZVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIj5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgaWQ9XCJzd2l0Y2hlckljb25Eb3RzXCJcbiAgICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgZD1cIk04IDEwYTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0ek04IDE4YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0ek0xNiAxOGEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHpNMjQgMThhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6TTggMjZhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6TTE2IDI2YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0ek0yNCAyNmEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHpNMTYgMTBhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6TTI0IDEwYTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0elwiXG4gICAgICAgICAgICAvPlxuICAgICAgICA8L3N2Zz5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhTd2l0Y2hlckljb24pO1xuIiwiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUVsZW1lbnQsIFJlYWN0RWxlbWVudCwgdXNlTGF5b3V0RWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgVG9nZ2xlQnV0dG9uUHJvcHMgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9Ub2dnbGVCdXR0b25Qcm9wc1wiO1xuaW1wb3J0IFN3aXRjaGVySWNvbiBmcm9tIFwiLi4vcmVzb3VyY2VzL1N3aXRjaGVySWNvblwiO1xuXG5jb25zdCBUb2dnbGVCdXR0b24gPSAoeyBvbkNsaWNrLCBzZXRBcHBTd2l0Y2hlckJ1dHRvbkhlaWdodCB9OiBUb2dnbGVCdXR0b25Qcm9wcyk6IFJlYWN0RWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmID0gdXNlUmVmPEhUTUxCdXR0b25FbGVtZW50PihudWxsKTtcblxuICAgIHVzZUxheW91dEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChyZWYuY3VycmVudCkge1xuICAgICAgICAgICAgc2V0QXBwU3dpdGNoZXJCdXR0b25IZWlnaHQocmVmLmN1cnJlbnQub2Zmc2V0SGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0sIFtzZXRBcHBTd2l0Y2hlckJ1dHRvbkhlaWdodF0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgLy8gVE9ETzogQWRkIEFSSUEgdG8gdGhlIGVudGlyZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJteGFwcHN3aXRjaGVyLXRvZ2dsZVwiIG9uQ2xpY2s9e29uQ2xpY2t9IHJlZj17cmVmfT5cbiAgICAgICAgICAgIDxTd2l0Y2hlckljb24gY2xhc3NOYW1lPVwibXhhcHBzd2l0Y2hlci10b2dnbGVfX2ljb25cIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhUb2dnbGVCdXR0b24pO1xuIiwiaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIFJlYWN0RWxlbWVudCwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IEFwcFN3aXRjaGVyQ29udGFpbmVyUHJvcHMgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9BcHBTd2l0Y2hlclByb3BzXCI7XG5pbXBvcnQgeyBMb2FkaW5nU3RhdGUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgdXNlRGV0ZXJtaW5lUG9zaXRpb24gZnJvbSBcIi4uL2hvb2tzL3VzZURldGVybWluZVBvc2l0aW9uXCI7XG5pbXBvcnQgdXNlRmV0Y2hBcHBMaXN0IGZyb20gXCIuLi9ob29rcy91c2VGZXRjaEFwcExpc3RcIjtcbmltcG9ydCBBcHBTd2l0Y2hlclBhbmVsIGZyb20gXCIuL0FwcFN3aXRjaGVyUGFuZWxcIjtcbmltcG9ydCBUb2dnbGVCdXR0b24gZnJvbSBcIi4vVG9nZ2xlQnV0dG9uXCI7XG5cbmNvbnN0IEFwcFN3aXRjaGVyQ29udGFpbmVyID0gKHByb3BzOiBBcHBTd2l0Y2hlckNvbnRhaW5lclByb3BzKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgY29uc3QgcmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgICBjb25zdCBbZm9yY2VSZWZyZXNoLCBzZXRGb3JjZVJlZnJlc2hdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuICAgIGNvbnN0IHsgYXBwTGlzdExvYWRpbmdTdGF0ZSwgYXBwTGlzdCwgYXV0aG9yaXphdGlvbkVycm9yIH0gPSB1c2VGZXRjaEFwcExpc3QoaXNPcGVuLCBmb3JjZVJlZnJlc2gsIHByb3BzLmJhc2VVcmwpO1xuICAgIGNvbnN0IFthcHBTd2l0Y2hlclBhbmVsV2lkdGgsIHNldEFwcFN3aXRjaGVyUGFuZWxXaWR0aF0gPSB1c2VTdGF0ZTxudW1iZXI+KDApO1xuICAgIGNvbnN0IFthcHBTd2l0Y2hlclBhbmVsSGVpZ2h0LCBzZXRBcHBTd2l0Y2hlclBhbmVsSGVpZ2h0XSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XG4gICAgY29uc3QgW2FwcFN3aXRjaGVyQnV0dG9uSGVpZ2h0LCBzZXRBcHBTd2l0Y2hlckJ1dHRvbkhlaWdodF0gPSB1c2VTdGF0ZTxudW1iZXI+KDApO1xuICAgIGNvbnN0IFtwb3NpdGlvblgsIHBvc2l0aW9uWV0gPSB1c2VEZXRlcm1pbmVQb3NpdGlvbih7XG4gICAgICAgIGVsZW1lbnRSZWY6IHJlZi5jdXJyZW50LFxuICAgICAgICB3aWR0aDogYXBwU3dpdGNoZXJQYW5lbFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGFwcFN3aXRjaGVyUGFuZWxIZWlnaHQgKyBhcHBTd2l0Y2hlckJ1dHRvbkhlaWdodCxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBpc1JlYWR5OiBpc09wZW4gJiYgYXBwTGlzdExvYWRpbmdTdGF0ZSA9PT0gTG9hZGluZ1N0YXRlLkNvbXBsZXRlXG4gICAgfSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBvbk91dHNpZGVDbGljayA9IChldmVudDogRXZlbnQgJiB7IHRhcmdldDogRWxlbWVudCB9KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoaXNPcGVuICYmIHJlZi5jdXJyZW50ICYmICFyZWYuY3VycmVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgc2V0SXNPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBzZXRGb3JjZVJlZnJlc2goZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25PdXRzaWRlQ2xpY2spO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uT3V0c2lkZUNsaWNrKTtcbiAgICAgICAgfTtcbiAgICB9LCBbaXNPcGVuXSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhwcm9wcy5jbGFzcywgXCJteGFwcHN3aXRjaGVyXCIpfSBzdHlsZT17cHJvcHMuc3R5bGV9IHJlZj17cmVmfT5cbiAgICAgICAgICAgIDxUb2dnbGVCdXR0b24gb25DbGljaz17KCkgPT4gc2V0SXNPcGVuKCFpc09wZW4pfSBzZXRBcHBTd2l0Y2hlckJ1dHRvbkhlaWdodD17c2V0QXBwU3dpdGNoZXJCdXR0b25IZWlnaHR9IC8+XG4gICAgICAgICAgICB7aXNPcGVuICYmIChcbiAgICAgICAgICAgICAgICA8QXBwU3dpdGNoZXJQYW5lbFxuICAgICAgICAgICAgICAgICAgICBhcHBMaXN0UmVzcG9uc2U9e2FwcExpc3R9XG4gICAgICAgICAgICAgICAgICAgIGFwcExpc3RMb2FkaW5nU3RhdGU9e2FwcExpc3RMb2FkaW5nU3RhdGV9XG4gICAgICAgICAgICAgICAgICAgIHNldEZvcmNlUmVmcmVzaD17c2V0Rm9yY2VSZWZyZXNofVxuICAgICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uRXJyb3I9e2F1dGhvcml6YXRpb25FcnJvcn1cbiAgICAgICAgICAgICAgICAgICAgZm9yY2VSZWZyZXNoPXtmb3JjZVJlZnJlc2h9XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uaW5nPXtwcm9wcy5wb3NpdGlvbmluZ31cbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YPXtwb3NpdGlvblh9XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWT17cG9zaXRpb25ZfVxuICAgICAgICAgICAgICAgICAgICBzZXRBcHBTd2l0Y2hlclBhbmVsV2lkdGg9e3NldEFwcFN3aXRjaGVyUGFuZWxXaWR0aH1cbiAgICAgICAgICAgICAgICAgICAgc2V0QXBwU3dpdGNoZXJQYW5lbEhlaWdodD17c2V0QXBwU3dpdGNoZXJQYW5lbEhlaWdodH1cbiAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNPcGVuKGZhbHNlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFN3aXRjaGVyQ29udGFpbmVyO1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBjcmVhdGVFbGVtZW50LCBSZWFjdE5vZGUgfSBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgQXBwU3dpdGNoZXJDb250YWluZXJQcm9wcyB9IGZyb20gXCIuLi90eXBpbmdzL0FwcFN3aXRjaGVyUHJvcHNcIjtcbmltcG9ydCBBcHBTd2l0Y2hlckNvbnRhaW5lciBmcm9tIFwiLi9jb21wb25lbnRzL0FwcFN3aXRjaGVyQ29udGFpbmVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcFN3aXRjaGVyIGV4dGVuZHMgQ29tcG9uZW50PEFwcFN3aXRjaGVyQ29udGFpbmVyUHJvcHM+IHtcbiAgICByZW5kZXIoKTogUmVhY3ROb2RlIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxBcHBTd2l0Y2hlckNvbnRhaW5lclxuICAgICAgICAgICAgICAgIGJhc2VVcmw9e3RoaXMucHJvcHMuYmFzZVVybH1cbiAgICAgICAgICAgICAgICBwb3NpdGlvbmluZz17dGhpcy5wcm9wcy5wb3NpdGlvbmluZ31cbiAgICAgICAgICAgICAgICBuYW1lPXtcIlwifVxuICAgICAgICAgICAgICAgIGNsYXNzPXtcIlwifVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJjbGFzc05hbWVzIiwiY2xhc3NlcyIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJhcmciLCJhcmdUeXBlIiwicHVzaCIsIkFycmF5IiwiaXNBcnJheSIsImlubmVyIiwiYXBwbHkiLCJ0b1N0cmluZyIsIk9iamVjdCIsInByb3RvdHlwZSIsImtleSIsImNhbGwiLCJqb2luIiwibW9kdWxlIiwiZXhwb3J0cyIsImRlZmF1bHQiLCJ3aW5kb3ciLCJFeHRlcm5hbExpbmtJY29uIiwiRm9yY2VSZWZyZXNoSWNvbiIsIkFycm93TGVmdEljb24iLCJTZWFyY2hJY29uIiwiU2tlbGV0b25Mb2FkZXIiLCJGb290ZXIiLCJTd2l0Y2hlckljb24iLCJUb2dnbGVCdXR0b24iLCJBcHBTd2l0Y2hl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
