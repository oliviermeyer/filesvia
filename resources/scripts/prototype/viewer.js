﻿// ******* SITEMAP TOOLBAR VIEWER ACTIONS ******** //
$axure.internal(function ($ax) {
    var userTriggeredEventNames = ['onClick','onDoubleClick','onMouseOver','onMouseMove','onMouseOut','onMouseDown','onMouseUp','onKeyDown','onKeyUp','onFocus','onLostFocus','onTextChange','onSelectionChange','onCheckedChange','onSwipeLeft','onSwipeRight','onSwipeUp','onSwipeDown','onDragStart','onDrag','onDragDrop','onScroll','onContextMenu','onMouseHover','onLongClick'];

    $ax.messageCenter.addMessageListener(function (message, data) {
        //If annotation toggle message received from sitemap, toggle footnotes
        if (message == 'annotationToggle') {
            if ($('div.annotation').length > 0) {
                if (data == true) {
                    $('div.annotation').show();
                } else {
                    $('div.annotation').hide();
                }
            }
        }
    });

    $ax.messageCenter.addMessageListener(function (message, data) {
        if (message == 'highlightInteractive') {
            //Do condition to check if legacy browser (all IE, except 10) and select appropriate pulsate css class name
            var userAgentString = navigator.userAgent.toLowerCase();

            var isIEpre10 = userAgentString.indexOf('msie 9.') != -1 ||
                userAgentString.indexOf('msie 8.') != -1 ||
                userAgentString.indexOf('msie 7.') != -1 ||
                userAgentString.indexOf('msie 6.') != -1;

            var pulsateClassName = isIEpre10 ? 'legacyPulsateBorder' : 'pulsateBorder';

            //Find all widgets with a defined userTriggeredEventName specified in the array above
            var $matchingElements = $ax(function (obj) {
                if (obj.interactionMap) {
                    for (var index in userTriggeredEventNames) {
                        if (obj.interactionMap[userTriggeredEventNames[index]]) return true;
                    }
                }
                return false;
            }).$();

            var isHighlighted = $matchingElements.is('.' + pulsateClassName);
            var enableHighlight = data == true;

            //Toggle the pulsate class on the matched elements
            if (enableHighlight && !isHighlighted) {
                $matchingElements.addClass(pulsateClassName);
            } else if (!enableHighlight && isHighlighted) {
                $matchingElements.removeClass(pulsateClassName);
            }
        }
    });
});