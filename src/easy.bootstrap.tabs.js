/**
 * EasyBootstrapTabs
 * 
 * Version 1.2.0
 * 
 * http://easyproject.cn 
 * https://github.com/ushelp
 * 
 * Copyright 2012 Ray [ inthinkcolor@gmail.com ]
 * Released under the MIT license
 * 
 * Dependencies: [Bootstrap3, jquery.contextify.min.js] 
 *
 * [Bootstrap plugin, supports other bootstrap-based ui frameworks]
 * 
 */
(function() {
	var isLastShow = true,
	lastHref,
	urlTabs = [],
	closeTab=function(a) {
		var tabObj = EasyBootstrapTabs.tabObj;
		var contentId = a.attr('href');

		// close current tab
		if(a.attr('href') == lastHref) {
			var newa;
			// last rule
			if(EasyBootstrapTabs.tabHistory.length == 2) {
				var id = EasyBootstrapTabs.tabHistory[0];
				newa = tabObj.find('a[href="' + id + '"]');
				newa.tab('show')
			} else {
				// left-show rule
				var li = a.parent();
				if(li.next().length > 0) {
					newa = li.next().find('a');
					newa.tab('show')
				} else {
					newa = li.prev().find('a');
					newa.tab('show')
				}
			}

			// remove history
			var tempTabHistory = []
			for(var i = 0; i < EasyBootstrapTabs.tabHistory.length; i++) {
				if(EasyBootstrapTabs.tabHistory[i] != contentId) {
					tempTabHistory.push(EasyBootstrapTabs.tabHistory[i]);
				}
			}
			EasyBootstrapTabs.tabHistory = tempTabHistory;

			lastHref = newa.attr('href');
			if(EasyBootstrapTabs.tabHistory[EasyBootstrapTabs.tabHistory.length - 1] != lastHref) {
				EasyBootstrapTabs.tabHistory.push(lastHref);
			}

//			if(isLastShow) {
//				var lt = EasyBootstrapTabs.tabId + ' a[href="' + $(this).attr('href') + '"]';
//				Cookies.set('lastTab', lt);
//			}
		} else {
			// remove history
			var tempTabHistory = []
			for(var i = 0; i < EasyBootstrapTabs.tabHistory.length; i++) {
				if(EasyBootstrapTabs.tabHistory[i] != contentId) {
					tempTabHistory.push(EasyBootstrapTabs.tabHistory[i]);
				}
			}
			EasyBootstrapTabs.tabHistory = tempTabHistory;
		}

		// Remove content&tab
		$(contentId).remove();
		a.parent().remove();
	},
	tabsInit=function (tabObj) {

		tabObj.find('a').off('click');
		tabObj.find('span.glyphicon-remove').off('click');

		tabObj.find('a').click(function(e) {
			e.preventDefault()

			//		$(this).tab('show')

			lastHref = $(this).attr('href');
			if(EasyBootstrapTabs.tabHistory[EasyBootstrapTabs.tabHistory.length - 1] != lastHref) {
				EasyBootstrapTabs.tabHistory.push(lastHref);
			}

			// only keep last 2
			if(EasyBootstrapTabs.tabHistory.length > 2) {
				EasyBootstrapTabs.tabHistory = EasyBootstrapTabs.tabHistory.splice(EasyBootstrapTabs.tabHistory.length - 2)
			}

//			if(isLastShow) {
//				var lt = EasyBootstrapTabs.tabId + ' a[href="' + $(this).attr('href') + '"]';
//				Cookies.set('lastTab', lt);
//			}
		})

		tabObj.find('span.glyphicon-remove').on('click', function() {
			var a = $(this).parent();
			closeTab(a);
		})

		var contextMenuTab;

		// ContextMenu
		var options = {
			items: [{
					text: '<div id="tabClose"><span class="glyphicon glyphicon-remove red"></span> ' + EasyBootstrapTabs.msg.close + "</div>",
					onclick: function(e) {
						$(contextMenuTab).find('span.glyphicon-remove').trigger('click')
					}
				},
				{
					text: '<span style="margin-left:17px;"></span> ' + EasyBootstrapTabs.msg.closeOthers,
					onclick: function(e) {
						$(contextMenuTab).parent().parent().find('a').not(contextMenuTab).find('span.glyphicon-remove').trigger('click');
					}
				},
				{
					text: '<span style="margin-left:17px;"></span> ' + EasyBootstrapTabs.msg.closeAll,
					onclick: function(e) {
						$(contextMenuTab).parent().parent().find('a').find('span.glyphicon-remove').trigger('click');
					}
				},
				{
					divider: true
				},
				{
					text: '<span style="margin-left:17px;"></span> ' + EasyBootstrapTabs.msg.closeRight,
					onclick: function(e) {
						$(contextMenuTab).parent().nextAll().find('span.glyphicon-remove').trigger('click');

					}
				},
				{
					text: '<span style="margin-left:17px;"></span> ' + EasyBootstrapTabs.msg.closeLeft,
					onclick: function(e) {
						$(contextMenuTab).parent().prevAll().find('span.glyphicon-remove').trigger('click');
					}
				},
				{
					divider: true
				},
				{
					text: '<span class="glyphicon glyphicon-refresh green"></span> ' + EasyBootstrapTabs.msg.reload,
					onclick: function(e){
						EasyBootstrapTabs.refreshTab($(contextMenuTab).attr('href').substring(1));
					}
				}
			],
			before: function(o, options) {
				contextMenuTab = o;
				if($(o).find('span.glyphicon-remove').length == 0) {
					setTimeout(function() {
						$('#tabClose span').removeClass('red');
						var tabParent = $('#tabClose').parent();
						tabParent.parent().addClass('disabled');
						tabParent.css({
							'color': '#C6C6C6',
							'cursor': 'default'
						});
					}, 0)
				} else {
					setTimeout(function() {
						$('#tabClose sapn').addClass('red');
						var tabParent = $('#tabClose').parent();
						tabParent.parent().removeClass('disabled');
						tabParent.css({
							'color': '#333333',
							'cursor': 'pointer'
						});
					}, 0)
				}
			}
		}

		var a = tabObj.find('a');
		a.has('.glyphicon-remove').contextify(options);
		a.has(':not(.glyphicon-remove)').contextify(options);
	},
	loadContent=function(idSelector, url, data){
		$.ajax({
				type: EasyBootstrapTabs.method,
				url: url,
				async: true,
				data: data,
				beforeSend: function() {
					$(idSelector).html(EasyBootstrapTabs.msg.loading);
				},
				error: function(xhr, textStatus, err) {
					$(idSelector).html('Error：' + textStatus);
					console.err(err);
				},
				complete: function(xhr, textStatus) {},
				success: function(data, textStatus, jqXHR) {
					$(idSelector).html(data);
				}
			});
	};

	var EasyBootstrapTabs = {
		tabId: null,
		tabObj: null,
		/**
		 * Ajax html load method
		 */
		method: 'get',
		tabHistory: [],
		/**
		 * Remove tab by id
		 * @param {String} id tab id
		 * @param {Boolean} force Remove the tab include without close button tab
		 */
		removeTab: function(id, force) {
			var tabObj = EasyBootstrapTabs.tabObj;
			if(force) {
				closeTab(tabObj.find('[href="#' + id + '"]'));
			} else {
				tabObj.find('[href="#' + id + '"] span.glyphicon-remove').trigger('click')
			}
		},
		/**
		 * Remove all tabs
		 * @param {Boolean} force Remove the tab include without close button tab
		 */
		removeAllTab: function(force) {
			var tabObj = EasyBootstrapTabs.tabObj;

			tabObj.find('span.glyphicon-remove').trigger('click')

			if(force) {
				tabObj.find('a').each(function() {
					closeTab($(this));
				})
			}
		},
		/**
		 * Show tab by id
		 * @param {String} id
		 * @return {Boolean} Is checked; if does not exist return false
		 */
		selectTab: function(id) {
			if($('#' + id).length > 0) {
				lastHref = '#' + id;
				EasyBootstrapTabs.tabObj.find('[href="#' + id + '"]').tab('show');
				if(EasyBootstrapTabs.tabHistory[EasyBootstrapTabs.tabHistory.length - 1] != '#' + id) {
					EasyBootstrapTabs.tabHistory.push('#' + id);
				}
				return true;
			}
			return false;
		},
		/**
		 * Use tab url refresh tab; if there is no url is not refreshed
		 * @param {Object} id tab id
		 */
		refreshTab: function(id) {
			for(var i = 0; i < urlTabs.length; i++) {
				if(urlTabs[i].id == id) {
					loadContent('#'+id, urlTabs[i].url, urlTabs[i].data)
				}
			}
		},
		/**
		 * add Tab
		 * @param {Object} id tab id, unique
		 * @param {Object} text, tab text
		 * @param {Object} url, load content url
		 * @param {Object} params optional; url params data
		 */
		addTab: function(id, text, url, data) {
			// cache
			urlTabs.push({
				id: id,
				text: text,
				url: url,
				data: data
			});

			var tabObj = EasyBootstrapTabs.tabObj;
			// if exists, show
			if(EasyBootstrapTabs.selectTab(id)) {
				return;
			}

			tabObj.append('<li><a data-toggle="tab" href="#' + id + '">' +
				text +
				' <span class="ace-icon glyphicon glyphicon-remove" aria-hidden="true"></span>' +
				'</a>' +
				'</li>')

			tabConentObj = tabObj.next('.tab-content');
			tabConentObj.append('<div id="' + id + '" class="tab-pane"></div>')
			loadContent('#'+id, url, data);
			tabObj.find('[href="#' + id + '"]').tab('show')
			if(EasyBootstrapTabs.tabHistory[EasyBootstrapTabs.tabHistory.length - 1] != '#' + id) {
				EasyBootstrapTabs.tabHistory.push('#' + id);
			}
			// only keep last 2
			if(EasyBootstrapTabs.tabHistory.length > 2) {
				EasyBootstrapTabs.tabHistory = EasyBootstrapTabs.tabHistory.splice(EasyBootstrapTabs.tabHistory.length - 2)
			}
			lastHref = '#' + id;
			tabsInit(tabObj);
		},
		/**
		 * Init tabs
		 * @param {Object} tabId
		 */
		init: function(tabId) {
			this.tabId = tabId;
			// Tabs
			this.tabObj = $(tabId)
			var tabObj = this.tabObj;
			lastHref = tabObj.find('a:first').attr('href');

			if(isLastShow) {
				// Last Tab show Controller
				var lastTab;
//				var lt = Cookies.get('lastTab');
//				if(lt) {
//					lastTab = $(lt);
//				} else {
					// Default show tab
					lastTab = tabObj.find('a:first');
//				}

				if(lastTab.length > 0) {
					lastTab.tab('show');
					lastHref = lastTab.attr("href");
				}
			}
			EasyBootstrapTabs.tabHistory.push(lastHref);

			tabsInit(tabObj);

		}
	}

	window.EasyBootstrapTabs = EasyBootstrapTabs;

})();