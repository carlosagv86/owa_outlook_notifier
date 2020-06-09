var xpath_messages_list = '//div[contains(@tempid,"emailslistviewpanel")]';
function get_unread_messages() {
    var clist = document.evaluate(xpath_messages_list, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (clist) {
        var messages_read = localStorage.getItem('messages_read');
        if(!messages_read) messages_read = []

        for (var i=0; i<clist.childNodes.length; i++) {
            if(clist.childNodes.length>0) {
                if(clist.childNodes[i].getAttribute('id') != null && clist.childNodes[i].getAttribute('id').startsWith('_')) {
                    var isnew = document.evaluate('div[1]/div[4]', clist.childNodes[i], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.classList.contains('ms-font-weight-semibold');
                    if(isnew) {
                        var from = document.evaluate('div[1]/div[3]/div[1]/span[2]', clist.childNodes[i], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
                        var subject = document.evaluate('div[1]/div[4]/div[2]/span[3]', clist.childNodes[i], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
                        var preview = document.evaluate('div[1]/div[5]/div[1]/span[1]', clist.childNodes[i], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
                        if(messages_read.includes(subject)) {
                            console.log('skipping ' + subject)
                            continue;
                        }

                        console.log(isnew, from, subject, preview);

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
                        localStorage.setItem('messages_read', messages_read)
                    }
                }
            }
        }
    }
}
var check_mails = setInterval(get_unread_messages, 2500);
