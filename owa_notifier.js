function getElementFromXPath(xpath, doc) {
    return document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var xpath_messages_list = '//div[contains(@tempid,"emailslistviewpanel")]';

function get_unread_messages() {
    var clist = getElementFromXPath(xpath_messages_list, document);

    if (clist) {
        for (var i=0; i<clist.childNodes.length; i++) {
            if(clist.childNodes.length>0) {
                if(clist.childNodes[i].getAttribute('id') != null && clist.childNodes[i].getAttribute('id').startsWith('_')) {
                    var is_new = getElementFromXPath('div[1]/div[4]', clist.childNodes[i]).classList.contains('ms-font-weight-semibold');
                    if(is_new) {
                        var from = getElementFromXPath('div[1]/div[3]/div[1]/span[2]', clist.childNodes[i]).innerText;
                        var subject = getElementFromXPath('div[1]/div[4]/div[2]/span[3]', clist.childNodes[i]).innerText;
                        var preview = getElementFromXPath('div[1]/div[5]/div[1]/span[1]', clist.childNodes[i]).innerText;

                        console.log(from, subject, preview);
                        
                        var messages_read = localStorage.getItem('messages_read');
                        if(messages_read) {
                            messages_read = JSON.parse(messages_read.split(','));
                            if(messages_read.includes(subject)) {
                                continue;
                            }

                            if(!messages_read) {
                                messages_read = []
                            }

                            var options = {
                                body: subject + ': ' + preview,
                                icon: document.querySelector('link[rel="shortcut icon"]').href,
                                requireInteraction: true
                            };
                            var notification = new Notification(from, options);
                            notification.onclick = function() {
                                window.focus();
                            };

                            messages_read.push(subject);
                            localStorage.setItem('messages_read', JSON.stringify(messages_read));
                        }
                    }
                }
            }
        }
    }
}

localStorage.setItem('messages_read', JSON.stringify([]));

var check_mails = setInterval(get_unread_messages, 2500);
